---
title: 'Real MySQL 8.0 - 2장. 설치와 설정'
tags: ['Database']
---

## MySQL 서버의 시작과 종료

### 최초 시작 전, 데이터 파일 초기화

MySQL을 설치하고 나서 서버를 처음 켜기 전에 한 가지 준비 작업이 필요하다. 데이터가 실제로 저장될 디렉터리와 로그 파일을 **초기화**하는 것이다. RPM으로 설치하면 `/etc/my.cnf` 설정 파일은 자동으로 만들어진다.

```bash
mysqld --defaults-file=/etc/my.cnf --initialize-insecure
```

초기화 옵션은 두 가지다.

-   `--initialize`: root 계정의 임시 비밀번호를 만들어서 **에러 로그에 기록**해준다.
-   `--initialize-insecure`: 비밀번호 없이 초기화한다.

이때 데이터 디렉터리는 **반드시 비어 있어야** 한다. 안에 파일이 남아 있으면 초기화가 거부된다. 새 사무실에 입주하기 전에 책상과 서류함을 비우고 배치도를 그리는 단계라고 생각하면 된다.

> 🐘 **PostgreSQL 비교** — PostgreSQL은 `mysqld --initialize` 대신 `initdb` 명령으로 초기화한다. 이때 만들어지는 데이터 디렉터리를 PostgreSQL에서는 **데이터 클러스터(data cluster)**라고 부른다. 개념은 같지만 명령과 용어가 다르다.

### 시작과 종료, 그리고 클린 셧다운

systemd 환경에서는 아래 명령으로 시작/상태확인/종료를 한다.

```bash
systemctl start mysqld
systemctl status mysqld
systemctl stop mysqld
```

여기서 중요한 개념이 **클린 셧다운(Clean Shutdown)**이다. MySQL은 데이터를 곧바로 디스크에 쓰지 않고 **버퍼 풀이라는 메모리 공간에 캐싱**한다. 트랜잭션을 커밋해도 그 내용이 디스크에 즉시 전부 반영되는 게 아니라는 뜻이다.

> **잠깐, InnoDB란?** 방금 나온 "버퍼 풀"은 사실 **InnoDB**의 것이다. MySQL은 데이터를 실제로 디스크에 저장하고 읽어오는 부분을 **스토리지 엔진**이라는 교체 가능한 층으로 분리해 두는데, InnoDB가 8.0의 기본이자 표준 엔진이다. MySQL 서버(SQL 파싱·실행 계획)가 "무엇을 할지"를 정한다면, InnoDB는 "어떻게 저장할지"를 담당한다. 매니저(서버)와 창고 시스템(엔진)의 관계라고 보면 된다. InnoDB가 표준이 된 건 **트랜잭션(ACID), 행 단위 잠금, 크래시 복구(버퍼 풀 + 리두 로그), 외래키, MVCC**를 지원하기 때문이다. 즉 아래 나오는 버퍼 풀·클린 셧다운 이야기가 전부 InnoDB의 동작이다. (자세한 내용은 뒤 장에서 다룬다.)

그래서 서버를 안전하게 끄려면 메모리에 있던 내용을 디스크에 모두 내려놓고 종료해야 한다.

```sql
SET GLOBAL innodb_fast_shutdown=0;  -- 버퍼풀 내용을 디스크에 모두 반영
SHUTDOWN;                            -- SHUTDOWN 권한 필요
```

이렇게 끄면 종료 자체는 느리지만, 다음에 다시 켤 때 복구할 게 없어서 빠르고 안전하다. 컴퓨터를 전원 버튼으로 강제로 끄지 않고 "시스템 종료"로 끄는 것과 같은 이치다.

> 🐘 **PostgreSQL 비교** — PostgreSQL도 `shared_buffers`에 캐싱하고 WAL로 안전성을 확보한다. 종료는 `pg_ctl stop -m [smart|fast|immediate]`로 하는데, 기본값 `fast`가 진행 중인 트랜잭션을 정리하고 체크포인트 후 안전하게 끄는 방식(= MySQL의 클린 셧다운에 해당)이고, `immediate`는 크래시처럼 강제 종료해서 다음 시작 시 복구가 필요하다. 이름이 헷갈리는데, MySQL은 `innodb_fast_shutdown=0`이 "느린 안전 종료"인 반면 PostgreSQL은 `fast` 모드가 표준 안전 종료라 방향이 반대다.

### 접속 테스트: localhost와 127.0.0.1은 다르다

서버에 붙는 방법을 보면 얼핏 같아 보이지만 실제로는 **완전히 다른 두 가지 통신 방식**이 숨어 있다.

```bash
mysql -uroot -p -h127.0.0.1 --port=3306                     # TCP/IP
mysql -uroot -p --host=localhost --socket=/tmp/mysql.sock    # 유닉스 소켓
```

-   **`-h127.0.0.1`** → loopback IP를 통한 **TCP/IP** 네트워크 통신
-   **`--host=localhost`** → `.sock` 파일을 경유하는 **유닉스 도메인 소켓(IPC)** 통신. 같은 서버 안에서 프로세스끼리 직접 주고받는 방식이다.

즉 `localhost`라고 쓰는 것과 `127.0.0.1`이라고 쓰는 것은 접속 경로 자체가 다르다. 접속이 안 될 때 제일 먼저 의심해봐야 할 지점이다.

> 🐘 **PostgreSQL 비교** — PostgreSQL은 이 규칙이 **정반대**라 특히 주의해야 한다. `-h localhost`는 유닉스 소켓이 아니라 **TCP/IP**로 붙는다. 유닉스 소켓을 쓰려면 `-h`를 아예 생략하거나 소켓 디렉터리 경로(`-h /var/run/postgresql`)를 직접 지정해야 한다. MySQL만 생각하고 `localhost=소켓`이라고 넘겨짚으면 헷갈린다.

접속에 성공하면 `SHOW DATABASES;`에 기본 4개 DB(`information_schema`, `mysql`, `performance_schema`, `sys`)가 보인다.

> 🐘 **PostgreSQL 비교** — PostgreSQL의 기본 DB는 `postgres`, `template0`, `template1`이다. 메타데이터는 각 DB 안의 `pg_catalog` 스키마(그리고 표준 `information_schema`)로 조회한다. 또한 MySQL은 계정·권한이 `mysql` DB 한 곳에 모여 있지만, PostgreSQL의 롤(role)은 특정 DB가 아니라 **클러스터 전역**에서 관리된다.

## MySQL 서버 업그레이드

업그레이드에는 두 가지 방법이 있다.

1.  **인플레이스(In-Place) 업그레이드**: 데이터 파일은 그대로 두고 프로그램 바이너리만 새 버전으로 교체한다. 빠르다.
2.  **논리적(Logical) 업그레이드**: `mysqldump`로 전체 데이터를 덤프한 뒤 새 버전에 다시 적재한다. 느리지만 확실하다.

### 한 단계씩만 건너뛸 수 있다

인플레이스 업그레이드에는 제약이 있다. 마이너 버전끼리는(같은 메이저 버전 안에서는) 대부분 문제없이 올릴 수 있지만, **메이저 버전 업그레이드는 반드시 직전 메이저 버전에서만** 가능하다.

즉 `5.6 → 8.0`으로 한 번에 못 간다. `5.6 → 5.7 → 8.0` 순서를 밟아야 하고, 5.7도 최신 마이너 버전까지 올린 뒤에 8.0으로 넘어가야 한다.

> 🐘 **PostgreSQL 비교** — PostgreSQL은 `pg_upgrade`로 **여러 메이저 버전을 건너뛰어 한 번에** 올릴 수 있다(예: 12 → 16 직행). MySQL처럼 한 단계씩 밟을 필요가 없다. 논리적 업그레이드는 `pg_dump`/`pg_dumpall`을 사용한다.

### 8.0으로 올릴 때 걸리는 것들

8.0으로 업그레이드할 때 특히 주의할 변경점이 있다.

-   **인증 방식 변경**: 기본 인증이 `caching_sha2_password`로 바뀐다. 5.7의 `mysql_native_password`를 쓰던 구버전 드라이버는 호환 문제가 생길 수 있다.
-   **데이터 딕셔너리 도입**: 시스템 테이블이 MyISAM에서 **InnoDB(트랜잭션 지원)**로 바뀐다.
-   외래키 이름은 64자로 제한되고, `GROUP BY ... ASC/DESC` 문법이 제거되며, 예약어가 추가됐다.

업그레이드 전에 아래 명령으로 호환성을 미리 점검할 수 있다.

```bash
mysqlcheck --all-databases --check-upgrade
```

> 🐘 **PostgreSQL 비교** — 인증도 방식이 다르다. MySQL은 유저별로 인증 플러그인(`caching_sha2_password` 등)을 지정하지만, PostgreSQL은 `pg_hba.conf`라는 **별도 설정 파일**에서 "어느 호스트에서, 어느 DB에, 어느 유저가, 어떤 방식으로" 접속할지를 통제한다(기본 인증은 PG14부터 `scram-sha-256`). 유저 테이블이 아니라 접속 규칙 파일로 제어한다는 점이 큰 차이다.

### 업그레이드 실행

업그레이드는 데이터 딕셔너리와 서버, 두 단계로 이뤄진다.

-   **8.0.15 이하**: `mysql_upgrade` 프로그램을 따로 실행해야 한다.
-   **8.0.16 이상**: 서버가 시작하면서 **자동으로** 업그레이드를 수행한다. (`--upgrade` 옵션으로 `AUTO`/`NONE`/`MINIMAL`/`FORCE` 제어)

## 서버 설정

MySQL은 **단 하나의 설정 파일 `my.cnf`**(윈도우는 `my.ini`)를 사용한다. 서버는 `/etc/my.cnf` 같은 여러 경로를 정해진 순서대로 탐색하는데, 어떤 순서로 찾는지는 `mysqld --verbose --help`로 확인할 수 있다.

여기서 한 가지 주의할 점이 있다. `mysqld`는 단순한 조회 유틸리티가 아니라 **MySQL 서버를 실제로 실행하는 프로그램(데몬 바이너리) 그 자체**다. `mysql`(클라이언트)이나 `mysqladmin` 같은 도구와는 다르다. 그래서 **이미 MySQL 서버가 서비스로 돌고 있는 운영 서버에서 `mysqld`를 또 실행하면**, 자칫 같은 데이터 디렉터리를 바라보는 두 번째 서버 인스턴스가 뜨려고 하면서 데이터가 손상될 위험이 있다.

`--verbose --help`는 도움말만 출력하고 끝나긴 하지만, 애초에 서버 바이너리를 직접 건드리는 행위이므로 운영 장비에서는 조심하는 게 좋다. 설정 탐색 순서 같은 걸 확인하고 싶다면 **테스트/로컬 장비에서** 돌려보고, 운영 중인 서버의 현재 설정값을 알고 싶다면 서버를 다시 건드리지 말고 접속해 있는 클라이언트에서 `SHOW VARIABLES` 같은 SQL로 확인하는 것이 안전하다.

### 설정 파일의 구성

하나의 `my.cnf` 안에는 프로그램별 **설정 그룹**이 나뉘어 들어간다.

```ini
[mysqld]        # 서버
default-storage-engine=innodb

[mysql]         # 클라이언트
default-character-set=utf8mb4
```

`[mysqld]`는 서버가, `[mysql]`은 클라이언트가 읽는 식으로 각 프로그램은 자기 그룹만 참조한다.

> 🐘 **PostgreSQL 비교** — PostgreSQL은 설정 파일이 `postgresql.conf`이고, MySQL처럼 `[mysqld]` 같은 그룹 구분이 없다. 그냥 `key = value`가 쭉 나열된 평평한 구조다.

### 시스템 변수의 두 가지 축

`my.cnf`에 적은 값들은 서버가 켜질 때 **시스템 변수(System Variables)**가 된다. `SHOW GLOBAL VARIABLES;`로 확인할 수 있다. 이 변수들은 두 축으로 나눠서 이해하면 편하다.

**범위 (Scope)**

-   **글로벌 변수**: 서버 전체가 공유한다. 예를 들어 버퍼 풀 크기. 건물 전체 냉방 온도라고 보면 된다.
-   **세션 변수**: 커넥션마다 개별적으로 갖는다. 예를 들어 autocommit. 각 방의 개인 선풍기다.

**변경 시점 (Dynamic)**

-   **동적 변수**: 서버 실행 중에 `SET GLOBAL`로 바로 바꿀 수 있다. 지금 돌릴 수 있는 다이얼.
-   **정적 변수**: `my.cnf`를 수정하고 **서버를 재시작해야** 반영된다. 배선 공사가 필요한 것.

튜닝할 때 "이거 바꾸려면 재시작해야 하나?"를 판단하는 기준이 된다.

> 🐘 **PostgreSQL 비교** — PostgreSQL의 설정값은 GUC 파라미터라 부르고 역시 `SHOW`/`SET`으로 다룬다. 다만 정적 변수 중 상당수는 MySQL처럼 완전 재시작이 아니라, **설정 리로드**(`SELECT pg_reload_conf()` 또는 `pg_ctl reload`)만으로 반영된다. 진짜 재시작이 필요한 건 `postmaster` 컨텍스트 파라미터(예: `shared_buffers`)뿐이다.

### SET PERSIST — 재시작해도 살아남는 설정

`SET GLOBAL`에는 함정이 있다. 실행 중에는 값이 바뀌지만 **재시작하면 초기화**된다. 설정 파일에 기록되는 게 아니기 때문이다.

이 문제를 해결하려고 8.0이 `SET PERSIST`를 도입했다.

```sql
SET GLOBAL max_connections=5000;   -- 지금만 반영, 재시작하면 사라짐
SET PERSIST max_connections=5000;  -- 지금 반영 + 파일에 기록되어 유지됨
SET PERSIST_ONLY ...;              -- 파일에만 기록(현재는 미반영). 정적 변수용
RESET PERSIST ...;                 -- 기록 삭제
```

여기서 `SET PERSIST_ONLY`가 왜 따로 있는지가 중요하다. **정적 변수는 서버 실행 중에 값을 바꿀 수 없기 때문에**, `SET GLOBAL`이나 `SET PERSIST`로 바꾸려 하면 "읽기 전용 변수"라는 에러(ERROR 1238)가 난다.

```sql
mysql> SET GLOBAL innodb_doublewrite=ON;
ERROR 1238 (HY000): Variable 'innodb_doublewrite' is a read-only variable

mysql> SET PERSIST innodb_doublewrite=ON;   -- 실행 중 반영을 시도하므로 똑같이 에러
ERROR 1238 (HY000): Variable 'innodb_doublewrite' is a read-only variable

mysql> SET PERSIST_ONLY innodb_doublewrite=ON;   -- 파일에만 기록 → 성공
Query OK, 0 rows affected (0.00 sec)
```

정리하면 정적 변수에 각 명령을 쓰면 다음과 같다.

| 명령 | 정적 변수에 쓰면 |
| --- | --- |
| `SET GLOBAL` | ❌ ERROR 1238 (read-only) |
| `SET PERSIST` | ❌ ERROR 1238 (실행 중 반영을 시도하므로) |
| `SET PERSIST_ONLY` | ✅ 파일에 기록, 재시작 시 반영 |

즉 정적 변수를 영구히 바꾸는 방법은 **① `my.cnf`에 직접 쓰고 재시작**하거나 **② `SET PERSIST_ONLY`로 기록 후 재시작**하는 두 가지이고, 어느 쪽이든 **재시작이 필수**다.

`SET PERSIST`가 값을 적어두는 곳은 `my.cnf`가 아니라 `mysqld-auto.cnf`라는 별도 파일이다. 그래서 결국 설정을 영구히 남기는 방법은 `my.cnf`에 직접 쓰거나, `SET PERSIST`를 쓰거나 둘 중 하나다.

이 `mysqld-auto.cnf`도 **서버가 시작할 때 함께 읽어들인다.** 그래서 재시작 후에도 값이 유지되는 것이다. 읽는 순서가 중요한데, 서버는 일반 설정 파일(`/etc/my.cnf` 등)을 먼저 읽고 **`mysqld-auto.cnf`를 맨 마지막에 읽어 적용**한다. 즉 같은 변수가 양쪽에 있으면 **`mysqld-auto.cnf`(= `SET PERSIST`로 바꾼 값)가 이긴다.** 이 파일은 데이터 디렉터리(`datadir`) 안에 JSON 형태로 생성되며 사람이 직접 편집하는 게 아니라 서버가 관리한다. 되돌리려면 `RESET PERSIST`를 쓴다.

> 🐘 **PostgreSQL 비교** — PostgreSQL도 원리가 똑같다. `postgresql.conf`를 먼저 읽고 `ALTER SYSTEM`이 기록한 `postgresql.auto.conf`를 맨 마지막에 읽어 덮어쓴다. "기본 설정 파일 → auto 파일 순으로 읽어서 auto 파일이 우선한다"는 구조가 두 DB 모두 동일하다.

> 🐘 **PostgreSQL 비교** — PostgreSQL에는 `SET PERSIST`에 딱 대응하는 기능이 있다. `ALTER SYSTEM SET x = y`를 실행하면 값이 `postgresql.auto.conf` 파일에 기록되어 재시작 후에도 유지된다. `mysqld-auto.cnf`와 `postgresql.auto.conf`는 사실상 같은 역할을 한다.

### my.cnf 예시는 그대로 쓰지 말 것

책에는 innodb 버퍼 풀·로그, performance_schema, TDE, 비밀번호 검증, binlog, 복제 등 항목이 담긴 긴 예시 설정 파일이 나온다. 다만 이 예시는 어디까지나 참고용이고, **실제 서버 사양에 맞게 조정해서 써야 한다**는 점을 책도 분명히 강조한다.
