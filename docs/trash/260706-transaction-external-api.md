---
title: Snack - [Spring] 트랜잭션 안에서 외부 API를 호출하면 안 되는 이유 — HikariCP 커넥션이 끊기는 순간
tags: ['Java', 'Spring', 'JPA', 'Transaction']
---

## 개요

크론잡이 iTunes Search API를 호출해 받은 결과를 파싱한 뒤 Cloud SQL에 적재하는 구조에서, 로그에 다음 WARN이 반복적으로 찍혔다.

```
WARN --- [l-1:housekeeper] com.zaxxer.hikari.pool.PoolBase :
HikariPool-1 - Failed to validate connection org.postgresql.jdbc.PgConnection@...
(This connection has been closed.). Possibly consider using a shorter maxLifetime value.
```

이 WARN의 정체를 파고들다 보니, 정작 더 위험한 문제는 따로 있었다. **트랜잭션 안에서 외부 API를 호출하고 있었다는 것**이다. 이 글은 (1) 커넥션 풀의 기본 개념, (2) HikariCP 커넥션 검증 WARN의 정체와 세 가지 타이머, (3) keepalive의 동작 원리, (4) 실제 로그 판독, (5) 트랜잭션 안에서 외부 API를 호출하면 안 되는 근본 이유, 그리고 (6) 노트북 절전모드라는 함정까지 정리한다.

## 1. 커넥션 풀이란 — "미리 데워둔 전화선"

DB 커넥션은 **새로 맺는 비용이 비싸다.** TCP 핸드셰이크 + 인증 + (Cloud SQL이면 프록시 경유)까지 매 요청마다 하면 느리다. 그래서 커넥션을 미리 여러 개 열어두고 재사용하는 것이 **커넥션 풀**이고, Spring Boot에서는 HikariCP가 그 역할을 한다.

:::warning 커넥션 풀 ≠ 스레드 풀
헷갈리기 쉬운데 둘은 완전히 다르다. **커넥션 풀**은 DB 커넥션을 담아 DB 접근을 재사용하고, **스레드 풀**은 워커 스레드를 담아 작업 실행을 병렬화한다. 이 글은 전부 커넥션 풀 이야기다.
:::

앱이 뜰 때(또는 필요 시 지연 생성) HikariCP가 물리 커넥션을 미리 열어 풀에 채워둔다. 이후 DB 작업의 사이클은:

1. 풀에서 커넥션 하나를 **빌린다(borrow)** → 이 순간 그 커넥션은 **active**
2. 그 커넥션으로 쿼리를 날린다
3. 다 쓰면 풀에 **반납한다** → 다시 **idle(유휴)**

커넥션은 매 순간 둘 중 하나다.

| 상태 | 뜻 |
| --- | --- |
| **active (busy)** | 지금 누가 빌려가서 쿼리 중 |
| **idle (유휴)** | 풀에 반납되어 아무도 안 쓰고 대기 중 |

:::tip 반납된 유휴 커넥션은 "노는" 게 아니다
싱글스레드 크론잡이 커넥션 1개를 빌려 쓰는 순간, 풀 10개 중 나머지 9개는 idle이다. 이건 낭비가 아니라 **다음 요청에 즉시 재사용하려고 데워둔 예비 커넥션**이다. 커넥션 풀의 존재 이유 그 자체다. 작업 단위(스레드) 하나당 커넥션 1개를 빌리며, 풀 크기는 `minimum-idle`~`maximum-pool-size`(기본 둘 다 10) 범위에서 관리된다.
:::

## 2. WARN의 정체 — 자가회복되는 로그

### 시나리오

문제는 유휴 커넥션이 **너무 오래 조용할 때** 생긴다. 커넥션을 안 쓰고 오래 놀리면 **DB 서버(또는 앞단의 Cloud SQL Auth Proxy)** 가 "이 커넥션 안 쓰네?" 하고 먼저 끊어버린다(idle timeout). 그런데 앱은 그 순간엔 모른다. 나중에 HikariCP의 `housekeeper` 스레드가 풀 안의 유휴 커넥션을 **점검(pull)** 하다가 이미 닫힌 커넥션을 발견하면 위 WARN을 남긴다.

중요한 건, HikariCP가 그 죽은 커넥션을 **폐기하고 새 커넥션으로 갈아끼운다**는 점이다. 그래서 쿼리가 실제로 실패하지는 않는다. **ERROR가 아니라 WARN인 이유**가 여기 있다 — 자가회복되는 로그다.

:::tip 실시간 알림(push)이 아니라 점검(pull)이다
DB가 "너 연결 끊겼어"라고 앱에 능동적으로 알려주지 않는다. DB는 **말없이** 커넥션을 끊고(TCP FIN), 앱은 나중에 그 커넥션을 직접 건드려 보고 나서야 죽은 걸 안다. 그래서 풀에는 잠깐 "죽었지만 살아있는 줄 아는 좀비 커넥션"이 남는다.
:::

### "끊는다"가 실제로 해제하는 자원

커넥션을 끊는 걸 단순히 "자바 객체를 메모리에서 제거"로 이해하면 초점이 어긋난다. 끊을 때 풀리는 자원 중 앱 메모리는 제일 가벼운 축이다.

| 해제되는 자원 | 어디 | 무게 |
| --- | --- | --- |
| DB 백엔드 프로세스 + 세션 | **DB 서버** | **가장 무거움** |
| 커넥션 슬롯 (`max_connections` 한 칸) | DB 서버 | 무거움 |
| TCP 소켓 / 파일 디스크립터 | OS (앱 서버) | 중간 |
| 자바 커넥션 객체 | 앱 힙 → GC 대상 | 가벼움 |

PostgreSQL은 커넥션 1개당 **백엔드 프로세스 1개**를 띄우고 `max_connections` 상한이 있다. 유휴 커넥션이 이 슬롯과 서버 메모리를 계속 차지하니, DB 서버가 idle timeout으로 끊어 슬롯을 회수하려는 것이다. **DB가 유휴 커넥션을 끊는 근본 동기가 여기에 있다.**

## 3. 커넥션 풀의 세 가지 타이머 (서로 독립적이다)

이 WARN을 "keepalive가 maxLifetime보다 짧아서 생겼다"는 식으로 오해하기 쉬운데, 세 타이머는 **서로 독립적**이고 아무도 서로를 갱신해주지 않는다.

| 타이머 | 주체 | 기본값 | 역할 |
| --- | --- | --- | --- |
| `max-lifetime` | HikariCP | 30분 | 커넥션 최대 수명. 이 나이를 넘으면 **유휴일 때 폐기 + 재생성**. 핑을 보내지 않고 그냥 버린다 |
| `keepalive-time` | HikariCP | **0 (비활성)** | **유휴 커넥션**에 주기적으로 핑을 보내 서버가 끊기 전에 살려둔다 |
| idle timeout | DB 서버 / 프록시 | (서버 정책) | 너무 오래 논 커넥션을 **서버가 먼저 끊는다** ← WARN의 실제 원인 |

:::warning 이번 WARN의 진짜 원인
수정 전 설정에는 `keepalive-time`이 없었다 = **기본값 0 = keepalive가 아예 꺼져 있었다.** 즉 "keepalive가 maxLifetime보다 컸다"가 아니라 **핑을 하나도 안 보내서 유휴 커넥션을 안 살려뒀다**가 정답이다. 그 결과 유휴 커넥션이 DB의 idle timeout에 걸려 조용히 끊겼다.
:::

올바른 부등식은 이렇다.

```
keepalive-time  <  서버 idle timeout  <  max-lifetime
```

HikariCP는 `keepalive-time`을 설정하면 내부적으로 `max-lifetime`보다 작아야 한다고 강제한다. `keepalive >= max-lifetime`으로 잡으면 부팅 시 경고와 함께 keepalive를 무시(0)한다. 크론잡처럼 트래픽이 뜸한 워크로드에서는 `application.properties`에 다음을 넣는다.

```properties
# 유휴 커넥션이 Cloud SQL idle timeout에 끊기기 전에 keepalive로 살려둔다
spring.datasource.hikari.keepalive-time=300000
spring.datasource.hikari.max-lifetime=600000
```

## 4. keepalive는 어떻게 동작하나

keepalive의 방향과 단위를 정확히 짚어두면 위 설정이 무슨 일을 하는지 선명해진다.

- **방향: 앱 → DB.** DB가 앱한테 보내는 게 아니라, HikariCP가 DB로 **먼저** 핑을 날리는 능동적 동작이다.
- **대상: 유휴 커넥션만.** active 커넥션은 어차피 트래픽이 흐르니 핑을 보내지 않는다.
- **단위: 커넥션마다 독립적.** 하나의 공용 핑이 아니라, 각 커넥션이 **마지막 사용 시점 기준**으로 `keepalive-time`이 지나면 자기 핑을 따로 받는다. 커넥션 A의 idle 타이머는 A로 핑을 보내야만 리셋되기 때문에 필연적으로 커넥션별 독립 핑이다.

```
커넥션 A: 12:00 반납 → 12:05 핑 → 12:10 핑 ...
커넥션 B: 12:02 반납 → 12:07 핑 → 12:12 핑 ...
```

핑의 정체는 **가벼운 검증 쿼리**다. JDBC 드라이버가 `Connection.isValid()`를 지원하면 그걸 쓰고, 아니면 `SELECT 1` 같은 `connection-test-query`를 날린다. 여기서 핵심은 **응답 값이 아니라 왕복 그 자체**다.

```
HikariCP ──"SELECT 1"──▶ DB   (DB: "트래픽 왔네 → idle 타이머 리셋")
HikariCP ◀───"1"─────── DB   (HikariCP: "응답 왔네 → 살아있음, 유지")
```

이 사소한 왕복 한 번이 두 가지를 동시에 한다.

- **앱에겐 생존 증명** — 응답이 정상적으로 오면 살아있는 커넥션이니 풀에 유지. 예외/타임아웃이면 폐기 후 새로 생성.
- **DB에겐 "나 아직 쓰는 커넥션" 신호** — 쿼리가 오가는 것 자체가 트래픽이라 DB가 idle timeout 카운터를 리셋 → 안 끊는다.

## 5. 실제 로그 판독

이론을 실제 로그와 맞춰보면 앞의 설명이 그대로 찍혀 있다.

```
12:38:11  Batch 114 done — processed: 85, lastId: 295000
   ⋯ (약 8분간 배치 로그 없음) ⋯
12:46:30  connection aborted - error reading from instance:
          read tcp 192.168.0.166:61496->35.223.50.240:3307: read: connection reset by peer
12:46:30  WARN [l-1:housekeeper] HikariPool-1 - Failed to validate connection ... (This connection has been closed.)
12:46:35  connection aborted ... 61504->...:3307: read: connection reset by peer
12:46:35  connection aborted ... 61481->...:3307: read: connection reset by peer
   ⋯ (여러 소켓이 연달아 리셋) ⋯
12:46:58  Accepted connection from 127.0.0.1:64528   ← 새 커넥션 재연결
```

읽는 법:

- `35.223.50.240:3307` = **Cloud SQL 인스턴스**(프록시가 실제 DB로 나가는 포트).
- `read: connection reset by peer` = **상대편(Cloud SQL 서버)이 커넥션을 리셋**했다는 뜻. 앱이나 프록시가 아니라 **DB 쪽이 먼저 끊었다**는 직접 증거다. 3장에서 말한 "DB가 말없이 끊는다"가 로그에 그대로 보인다.
- 소켓 번호가 여러 개(`61496, 61504, 61481...`) 동시에 뜨는 건 = **유휴 커넥션 여러 개가 한꺼번에 리셋**됐다는 뜻.
- `Accepted connection from 127.0.0.1:64528` = Cloud SQL Proxy가 HikariCP의 새 커넥션 요청을 받아들임 = **재연결 성공**. 그래서 실제 작업은 안 깨진다.

## 6. 함정 — 노트북 절전모드

위 로그에서 눈여겨볼 건 **8분간의 공백**이다. 배치가 40~70초 간격으로 규칙적으로 돌다가 114번 이후 8분간 멈췄고, 그 뒤 커넥션 리셋이 몰렸다. 원인은 **로컬 맥이 절전모드로 들어간 것**이었다(디스플레이 꺼짐 → 시스템 슬립).

맥이 잠들면:

- **JVM 프로세스 자체가 얼어붙는다** → 배치 스레드 정지 → 8분간 로그 공백
- 그 커넥션들의 TCP 트래픽도 완전 정지
- **Cloud SQL 서버**는 앱이 자는 줄 모르고 "왜 조용하지" → idle timeout으로 커넥션 무더기 리셋
- 맥이 깨어나면 `housekeeper` 재가동 → 죽은 커넥션 발견 → WARN → 재연결

:::warning 절전으로 인한 끊김은 keepalive로 못 막는다
keepalive는 **JVM이 깨어 있어야** 핑을 보낸다. 절전 중엔 핑을 보내는 스레드까지 같이 얼어붙어서 아무것도 못 보낸다. 다행히 이 케이스는 **깨어난 뒤 자동 재연결로 회복**되므로 데이터 유실은 없다. 다만 자는 동안 크론잡 진행이 멈춘다.
:::

로컬에서 오래 도는 배치라면 절전을 막아야 한다.

```bash
# 크론잡 도는 동안만 시스템이 잠들지 않게 (뒤 명령이 끝날 때까지 유지)
caffeinate -i ./run-cron.sh
```

근본적으로는 이런 오래 도는 배치를 노트북에 의존시키는 것 자체가 취약하다(뚜껑 닫으면 멈춤). 장기적으로는 Cloud Run Job이나 항상 켜진 VM으로 옮기면 절전·네트워크 걱정 없이 돌릴 수 있다.

## 7. 진짜 문제 — 트랜잭션 안의 외부 API 호출

여기까지는 무시하거나 회복되는 WARN이었다. 하지만 코드를 보니 배치 로직이 이렇게 생겨 있었다.

```java
@Transactional
public ProcessResult processBatch(String jobName) {
    CronState cronState = cronStateRepository.findByJobName(jobName)...;
    long start = cronState.getLastProcessedId() + 1;

    // 트랜잭션 = DB 커넥션을 쥐고 있는 상태인데,
    // 그 안에서 외부 HTTP 호출로 몇 초를 기다린다
    List<ItunesItem> items = iTunesAPIClient.lookup(range(start, start + 200));

    // ... 파싱 후 DB 저장 ...
}
```

### 왜 위험한가

**트랜잭션을 연다 = DB 커넥션 하나를 빌려서(borrow) 트랜잭션이 끝날 때까지 안 놓는다.** 그 안에서 외부 API를 호출하면:

- iTunes 응답을 기다리는 몇 초 동안 **DB 커넥션을 빌려놓고 아무것도 안 한다.** 그 커넥션은 서버 쪽에서 놀고 있는 상태다.
- iTunes가 느리게 응답하거나 (앞서 본) 절전으로 멈추면, 그 사이 Cloud SQL이 그 **빌려 쓰던 커넥션을 끊어버릴 수 있다.** 곧이어 DB 저장을 시도하면 `DataAccessException`이 터진다.
- 요청이 많아지면 API 응답 대기 중인 커넥션들이 풀(10개)을 금방 바닥내, 다른 요청들이 커넥션을 못 빌리고 멈춘다.

:::warning keepalive는 이 문제를 못 막는다
keepalive는 **풀에 반납된 유휴 커넥션**만 핑한다. **borrow해서 쥐고 있는(트랜잭션이 점유 중인)** 커넥션은 건드리지 않는다. 그래서 트랜잭션 안에서 외부 호출을 하는 한, keepalive를 아무리 짧게 잡아도 소용없다.
:::

게다가 이 크론잡의 루프는 `DataAccessException`이 나면 **잡 전체를 `break`** 하도록 되어 있어, 긴 크론잡이 중간에 뚝 끊긴다. 매우 큰 track id를 끝점으로 잡고 오래 돌려야 하는 상황에서는 치명적이다.

## 8. 규칙과 해결

> **트랜잭션 안에서 외부 API를 호출하지 마라.**

트랜잭션은 짧아야 하고 DB 작업만 담아야 한다. 트랜잭션 안에 넣으면 안 되는 것들:

- 외부 API 호출 (이번 케이스)
- 파일 업로드/다운로드
- `Thread.sleep`, 오래 걸리는 연산
- 그 밖의 무거운 I/O

이들은 전부 트랜잭션 **밖**으로 빼는 것이 정석이다. 올바른 패턴은:

```
① 외부 API 호출        ← 트랜잭션 없음 (DB 커넥션 안 씀)
② 결과 받기 / 파싱
③ [트랜잭션 시작] DB 저장 [트랜잭션 끝]  ← 짧게
```

### 실제 리팩터링

iTunes 호출을 트랜잭션이 없는 상위 서비스로 올리고, `@Transactional` 메서드는 이미 조회된 결과만 받아 DB에 적재하도록 쪼갰다.

```java
// 트랜잭션 없는 오케스트레이터
while (true) {
    long startId = cronBatchService.peekNextStartId(jobName);       // 시작 id만 짧게 조회
    List<ItunesItem> items = iTunesAPIClient.lookup(                // HTTP, DB 커넥션 안 씀
            LongStream.range(startId, startId + 200).boxed().toList());
    ProcessResult result = cronBatchService.processBatch(jobName, items); // @Transactional, DB만
    // ...
}
```

```java
// DB 저장만 담당 — 트랜잭션 안에 외부 HTTP 호출이 없다
@Transactional
public ProcessResult processBatch(String jobName, List<ItunesItem> itunesItemList) {
    // dedup / genre 조회 / save / cronState 갱신
}
```

이제 iTunes 응답을 기다리는 동안 DB 커넥션을 쥐고 있지 않으므로, borrow한 커넥션이 서버에 끊길 일 자체가 없어졌다.

:::tip
개별 트랙 저장은 `@Transactional(propagation = REQUIRES_NEW)`로 두어, 트랙 하나가 유니크 제약에 걸려도 배치 전체가 롤백되지 않게 격리했다. 이 격리는 리팩터링 후에도 그대로 유지했다.
:::

## 정리

- 커넥션 풀은 재사용을 위해 커넥션을 미리 데워두는 구조다. 반납된 유휴 커넥션은 "노는" 게 아니라 **재사용 대기** 상태다.
- HikariCP `housekeeper`의 `connection has been closed` WARN은 **서버가 유휴 커넥션을 먼저 끊어서** 생기며, HikariCP가 점검하다 발견해 재연결하므로 **자가회복되는 WARN**이다.
- `max-lifetime` / `keepalive-time` / 서버 idle timeout은 **독립적인 세 타이머**다. 이번 WARN의 원인은 `keepalive-time`이 **기본값 0(꺼짐)** 이라 유휴 커넥션을 안 살려둔 것.
- keepalive는 **앱 → DB** 방향으로, **커넥션마다 독립적으로** `SELECT 1` 같은 왕복을 보내 (앱엔 생존 확인, DB엔 idle timeout 리셋)을 동시에 한다.
- 로그의 `reset by peer @3307`은 **Cloud SQL 서버가 먼저 끊었다**는 증거고, 8분 공백은 **노트북 절전**으로 JVM이 얼어붙은 것이었다. 절전 끊김은 keepalive로 못 막고 재연결로만 회복된다.
- 진짜 위험은 **트랜잭션 안에서 외부 API를 호출하는 것**이다. borrow한 커넥션을 API 대기 동안 점유해 커넥션이 끊기고, 풀이 고갈되고, 긴 잡이 중간에 죽는다. 해결은 **외부 호출을 트랜잭션 밖으로 빼는 것.**
