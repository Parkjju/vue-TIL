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

이 WARN의 정체를 파고들다 보니, 정작 더 위험한 문제는 따로 있었다. **트랜잭션 안에서 외부 API를 호출하고 있었다는 것**이다. 이 글은 (1) HikariCP 커넥션 검증 WARN의 정체, (2) 커넥션 풀의 세 가지 타이머, (3) 트랜잭션 안에서 외부 API를 호출하면 안 되는 근본 이유를 정리한다.

## 1. WARN의 정체 — 자가회복되는 로그

### 커넥션 풀은 "전화선"이다

DB에 연결하는 커넥션을 미리 여러 개(기본 10개) 만들어두고 재사용하는 것이 커넥션 풀이다. 앱은 DB 작업마다:

1. 풀에서 커넥션 하나를 **빌린다(borrow)**
2. 그 커넥션으로 쿼리를 날린다
3. 다 쓰면 풀에 **반납한다**

HikariCP가 이 커넥션들을 관리하는 라이브러리다.

### WARN이 찍히는 시나리오

커넥션을 안 쓰고 오래 놀리면 **DB 서버(또는 앞단의 Cloud SQL Auth Proxy)** 가 "이 커넥션 안 쓰네?" 하고 먼저 끊어버린다. 나중에 HikariCP의 `housekeeper` 스레드가 풀 안의 유휴 커넥션을 검사하다가 이미 닫힌 커넥션을 발견하면 위 WARN을 남긴다.

중요한 건, HikariCP가 그 죽은 커넥션을 **폐기하고 새 커넥션으로 갈아끼운다**는 점이다. 그래서 쿼리가 실제로 실패하지는 않는다. **ERROR가 아니라 WARN인 이유**가 여기 있다 — 자가회복되는 로그다.

:::tip
로그의 `Accepted connection from 127.0.0.1:...` 은 Cloud SQL Auth Proxy가 새 커넥션을 받아들이는 로그다. 즉 "끊긴 커넥션 대신 새로 연결하는 중"이라는 정황 증거다.
:::

## 2. 커넥션 풀의 세 가지 타이머 (서로 독립적이다)

이 WARN을 "keepalive가 maxLifetime보다 짧아서 생겼다"는 식으로 오해하기 쉬운데, 세 타이머는 **서로 독립적**이고 아무도 서로를 갱신해주지 않는다.

| 타이머 | 주체 | 역할 |
| --- | --- | --- |
| `max-lifetime` | HikariCP | 커넥션 최대 수명. 이 나이를 넘으면 **유휴일 때 폐기 + 재생성**. 핑을 보내지 않고 그냥 버린다 |
| `keepalive-time` | HikariCP | **유휴(풀에 반납된)** 커넥션에 주기적으로 핑을 보내 서버가 끊기 전에 살려둔다 |
| idle timeout | DB 서버 / 프록시 | 너무 오래 논 커넥션을 **서버가 먼저 끊는다** ← WARN의 실제 원인 |

올바른 부등식은 이렇다.

```
keepalive-time  <  서버 idle timeout  <  max-lifetime
```

`keepalive-time`을 서버 idle timeout보다 짧게 두어 **끊기기 전에 살려두는** 것이 핵심이다. `max-lifetime`은 핑을 보내는 게 아니라 그냥 오래된 커넥션을 버리고 새로 만들 뿐이다. 핑은 오직 `keepalive-time`의 몫이다.

크론잡처럼 트래픽이 뜸한 워크로드에서는 `application.properties`에 다음을 넣어 유휴 커넥션 WARN을 줄일 수 있다.

```properties
# 유휴 커넥션이 Cloud SQL idle timeout에 끊기기 전에 keepalive로 살려둔다
spring.datasource.hikari.keepalive-time=300000
spring.datasource.hikari.max-lifetime=600000
```

## 3. 진짜 문제 — 트랜잭션 안의 외부 API 호출

여기까지는 무시해도 되는 WARN이었다. 하지만 코드를 보니 배치 로직이 이렇게 생겨 있었다.

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

**트랜잭션을 연다 = DB 커넥션 하나를 빌려서 트랜잭션이 끝날 때까지 안 놓는다.** 그 안에서 외부 API를 호출하면:

- iTunes 응답을 기다리는 몇 초 동안 **DB 커넥션을 빌려놓고 아무것도 안 한다.** 그 커넥션은 서버 쪽에서 놀고 있는 상태다.
- iTunes가 느리게 응답하면, 그 사이 Cloud SQL이 그 **빌려 쓰던 커넥션을 끊어버릴 수 있다.** 곧이어 DB 저장을 시도하면 `DataAccessException`이 터진다.
- 요청이 많아지면 API 응답 대기 중인 커넥션들이 풀(10개)을 금방 바닥내, 다른 요청들이 커넥션을 못 빌리고 멈춘다.

:::warning
`keepalive-time`은 이 문제를 못 막는다. keepalive는 **풀에 반납되어 노는 유휴 커넥션**만 핑한다. **borrow해서 쥐고 있는(트랜잭션이 점유 중인)** 커넥션은 건드리지 않는다. 그래서 트랜잭션 안에서 외부 호출을 하는 한, keepalive를 아무리 짧게 잡아도 소용없다.
:::

게다가 이 크론잡의 루프는 `DataAccessException`이 나면 **잡 전체를 `break`** 하도록 되어 있어, 긴 크론잡이 중간에 뚝 끊긴다. 매우 큰 track id를 끝점으로 잡고 오래 돌려야 하는 상황에서는 치명적이다.

## 4. 규칙과 해결

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

- HikariCP `housekeeper`의 `connection has been closed` WARN은 **서버가 유휴 커넥션을 먼저 끊어서** 생기며, HikariCP가 재연결하므로 **자가회복되는 WARN**이다.
- `max-lifetime` / `keepalive-time` / 서버 idle timeout은 **독립적인 세 타이머**다. 유휴 커넥션 WARN은 `keepalive-time`으로 완화한다.
- 진짜 위험은 **트랜잭션 안에서 외부 API를 호출하는 것**이다. borrow한 커넥션을 API 대기 동안 점유해 커넥션이 끊기고, 풀이 고갈되고, 긴 잡이 중간에 죽는다.
- 해결은 **외부 호출을 트랜잭션 밖으로 빼는 것.** keepalive는 이 문제를 못 막는다 (유휴 커넥션만 핑하기 때문).
