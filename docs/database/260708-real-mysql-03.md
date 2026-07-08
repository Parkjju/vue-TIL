---
title: 'Real MySQL 8.0 - 3장. 사용자 및 권한'
tags: ['Database']
---

MySQL의 계정 시스템은 다른 DBMS와 결이 다르다. 크게 세 가지가 낯선데, ① 계정을 **아이디만이 아니라 접속 지점(호스트)까지 묶어서** 식별하고, ② 8.0부터 **역할(Role)**·**이중 비밀번호**·**동적 권한** 같은 개념이 새로 들어왔으며, ③ 계정·권한 정보가 전부 `mysql` DB 안 테이블에 모여 있다. 이 장은 이 세 가지를 훑는다.

## 3.1 사용자 식별 — 계정은 "아이디 @ 호스트"다

MySQL 계정은 아이디 하나로 끝나지 않는다. **아이디 + 접속한 곳(호스트)**을 항상 한 쌍으로 본다. 표기는 `'아이디'@'호스트'` 형태다.

```sql
'svc_id'@'127.0.0.1'    -- 이 아이디로 로컬(127.0.0.1)에서 접속할 때만 유효
'svc_id'@'%'            -- 모든 호스트에서 접속 가능 (%는 와일드카드)
```

즉 같은 `svc_id`라도 어디서 접속하느냐에 따라 **다른 계정으로 취급**된다. 아파트 출입증이 "이름 + 사용 가능한 출입구"까지 적혀 있어서, 같은 이름이라도 정문용/후문용이 따로인 셈이다.

**여기서 주의할 함정** — 한 계정이 여러 규칙에 걸리면 MySQL은 **범위가 좁은(더 구체적인) 것을 먼저** 고른다. 예를 들어 이런 두 계정이 있고,

```sql
'svc_id'@'192.168.0.10'  -- 비밀번호 123
'svc_id'@'%'             -- 비밀번호 abc
```

`192.168.0.10`에서 접속하면 MySQL은 범위가 더 좁은 첫 번째 계정을 골라 비밀번호 `123`을 요구한다. `abc`로 접속하면 "너는 `%`가 아니라 `192.168.0.10` 계정이야"라며 거절한다. **의도치 않게 자주 겪는 상황**이니 계정 만들 때 호스트 범위가 겹치지 않는지 챙겨야 한다.

> 🐘 **PostgreSQL 비교** — PostgreSQL의 롤(role)에는 호스트 개념이 아예 없다. 계정은 이름만으로 식별하고, "어디서 어떤 방식으로 붙을 수 있는가"는 계정 정의가 아니라 별도 파일인 **`pg_hba.conf`**(host-based authentication)에서 규칙으로 관리한다. MySQL은 이 둘을 `user@host` 하나로 합쳐 놓은 셈이다.

## 3.2 사용자 계정 관리

### 시스템 계정 vs 일반 계정 (8.0 신규)

8.0부터 계정이 `SYSTEM_USER` 권한 보유 여부로 **시스템 계정**과 **일반 계정**으로 나뉜다. 이건 백그라운드 스레드와는 무관하고, 순수하게 **"관리자냐 아니냐"**의 구분이다.

-   시스템 계정은 **다른 계정을 관리**(생성·삭제·변경)할 수 있고, 다른 세션을 강제 종료하거나, 스토어드 프로그램의 `DEFINER`로 자기를 걸 수 있다.
-   일반 계정은 자기 일만 한다. 다른 계정은 못 건드린다.

이 구분이 도입된 이유는 **DBA 계정에는 `SYSTEM_USER`를 주고, 응용 프로그램용 계정에는 주지 않아서** 실수로라도 응용 계정이 관리 작업을 못 하게 막기 위해서다.

**실무에서 알아둘 것 — 함부로 지우면 안 되는 내장 계정.** `root@localhost` 말고도 8.0이 기본 내장하는 계정이 3개 있는데, 전부 `account_locked=Y`(잠금) 상태라 로그인 용도가 아니다. 내부 기능이 쓰는 것이므로 **삭제하면 안 된다.**

-   `mysql.sys@localhost`: `sys` 스키마 객체(뷰·함수·프로시저)의 `DEFINER`
-   `mysql.session@localhost`: 플러그인이 서버에 접근할 때
-   `mysql.infoschema@localhost`: `information_schema`의 뷰 `DEFINER`

```sql
SELECT user, host, account_locked FROM mysql.user WHERE user LIKE 'mysql.%';
-- 세 계정 모두 account_locked = Y
```

#### 잠깐, `DEFINER`가 뭐길래?

위에서 두 계정이 "객체의 `DEFINER`"라고 했다. **`DEFINER`는 뷰·스토어드 프로시저·함수·트리거·이벤트 같은 객체가 실행될 때 "누구의 권한으로 실행되는가"를 지정하는 계정**이다. 객체를 만든 소유자라고 보면 된다.

핵심은 이거다 — 스토어드 프로그램은 **호출한 사람의 권한이 아니라, 만든 사람(DEFINER)의 권한으로 실행**되는 게 기본값이다.

```sql
CREATE DEFINER='admin'@'localhost' PROCEDURE get_salary()
    SQL SECURITY DEFINER          -- 기본값
BEGIN
    SELECT * FROM hr.salaries;    -- salaries 테이블 접근
END;
```

`hr.salaries`에 직접 권한이 없는 `app_user`도 `CALL get_salary()`는 **된다.** 프로시저가 DEFINER인 `admin` 권한으로 돌기 때문이다. 즉 **"테이블은 직접 못 보게 하되 정해진 프로시저를 통해서만 보게"** 하는 캡슐화·보안 장치다. 은행 창구에 비유하면, 고객이 금고에 직접 못 들어가도 창구 직원(DEFINER 권한)을 통해서는 정해진 절차로 돈을 꺼낼 수 있는 것과 같다.

이 동작은 `SQL SECURITY` 옵션으로 바꾼다:

| 옵션 | 실행 권한 주체 |
| --- | --- |
| `SQL SECURITY DEFINER` (기본) | 객체를 만든 **DEFINER** 계정 |
| `SQL SECURITY INVOKER` | 지금 **호출한 사람**의 권한 |

그래서 `mysql.sys@localhost`는 `sys` 스키마의 뷰·프로시저가 `performance_schema` 같은 민감한 데이터를 건드릴 때 빌려 쓰는 DEFINER 계정이다. **로그인은 잠겨 있지만 객체 실행 권한만 제공**하는 것. 이 계정을 지우면 `sys` 객체들이 참조할 DEFINER를 잃고 깨진다.

> **지웠다면?** 이름·호스트를 똑같이 맞춰 다시 만들면 DEFINER 문자열이 다시 연결되긴 한다. 하지만 계정 껍데기뿐 아니라 **원래 걸려 있던 권한 세트까지 정확히** 복원해야 객체가 제대로 돈다. 권한을 손으로 재현하다 실수 나기 쉬우니, 실무에서는 계정만 다시 만들지 말고 `sys` **스키마를 통째로 재설치**하는 게 정석이다. 애초에 건드릴 이유가 없는 계정이다.

> 🐘 **PostgreSQL 비교** — PostgreSQL도 함수에 `SECURITY DEFINER` / `SECURITY INVOKER`가 있고 개념이 똑같다. 다만 기본값이 반대로 **`INVOKER`(호출자 권한)**다. 뷰는 기본이 뷰 소유자 권한으로 동작하고, `security_invoker=true` 옵션으로 호출자 권한 실행을 켠다.

### 3.2.2 계정 생성 — `CREATE USER`와 `GRANT`가 분리됐다

5.7까지는 `GRANT`가 권한 부여와 계정 생성을 동시에 했지만, **8.0부터는 계정 생성은 `CREATE USER`, 권한 부여는 `GRANT`로 분리**됐다. 계정을 만들 때 붙일 수 있는 옵션이 많다.

```sql
CREATE USER 'user'@'%'
    IDENTIFIED WITH 'mysql_native_password' BY 'password'  -- 인증 방식 + 비밀번호
    REQUIRE NONE                        -- SSL/TLS 요구 여부
    PASSWORD EXPIRE INTERVAL 30 DAY     -- 비밀번호 유효기간
    ACCOUNT UNLOCK                      -- 계정 잠금 여부
    PASSWORD HISTORY DEFAULT            -- 이전 비밀번호 재사용 금지 개수
    PASSWORD REUSE INTERVAL DEFAULT     -- 이전 비밀번호 재사용 금지 기간
    PASSWORD REQUIRE CURRENT DEFAULT;   -- 비밀번호 변경 시 현재 비번 확인 여부
```

각 옵션을 하나씩 보면:

-   **`IDENTIFIED WITH`** — 인증 플러그인을 지정한다. 핵심은 아래 인증 방식 이야기.
-   **`REQUIRE`** — 접속 시 암호화(SSL/TLS) 채널을 강제할지. `REQUIRE NONE`이면 데이터 채널은 **암호화되지 않는다.** 여기서 헷갈리기 쉬운 게, Caching SHA-2를 쓰면 TLS 없이도 **인증 과정의 비밀번호만은** (서버 RSA 공개키로) 암호화되는데, 이건 "비밀번호 전송"만 보호하는 것이지 **연결 전체가 암호화되는 게 아니다.** 인증이 끝나면 쿼리·결과는 평문으로 흐른다. 데이터까지 암호화하려면 `REQUIRE SSL`(또는 실제 TLS 연결)이 필요하다. → **"인증이 암호화된다 ≠ 통신이 암호화된다"**
-   **`PASSWORD EXPIRE`** — 유효기간. `INTERVAL n DAY`(n일), `NEVER`(무제한), `DEFAULT`(시스템 변수 `default_password_lifetime` 따름). 응용 프로그램 접속 계정에 유효기간을 걸면 어느 날 갑자기 접속이 끊기니 **위험하다.**
-   **`PASSWORD HISTORY n`** — 최근 n개의 비밀번호를 재사용 못 하게. 기록은 `mysql.password_history` 테이블에 남는다.
-   **`PASSWORD REUSE INTERVAL n DAY`** — n일 이내에 썼던 비밀번호 재사용 금지.
-   **`PASSWORD REQUIRE CURRENT`** — 비밀번호를 바꿀 때 현재 비밀번호를 먼저 입력하게 강제.
-   **`ACCOUNT LOCK / UNLOCK`** — 계정을 잠글지/풀지.

#### 인증 방식: 왜 8.0에서 로그인이 안 됐었나

-   **Native Authentication** (`mysql_native_password`) — 5.7까지의 기본. 단순히 비밀번호의 SHA-1 해시를 저장해두고 클라이언트가 보낸 값과 비교하는 방식.
-   **Caching SHA-2 Authentication** (`caching_sha2_password`) — **8.0의 새 기본값.** SHA-256 해시 + Salt를 써서 brute-force에 훨씬 강하다. 다만 이 방식은 **SSL/TLS 또는 RSA 키페어를 반드시 써야** 하므로, 클라이언트가 SSL을 못 켜면 접속이 안 된다.

> **잠깐, Salt가 뭐길래?** Salt는 비밀번호를 해시로 저장할 때 원본에 덧붙이는 **계정마다 다른 무작위 값**이다("소금 뿌린다"의 그 salt). Salt 없이 그냥 해시만 하면 두 가지가 뚫린다. ① **같은 비밀번호는 같은 해시**가 나와서, DB가 털리면 "이 계정들 같은 비번 쓰네"가 드러나고 하나만 깨면 다 뚫린다. ② 공격자가 "흔한 비번 → 해시" 대응표를 **미리 다 계산해둔**(레인보우 테이블) 걸로 훔친 해시를 즉시 역추적한다. Salt를 계정마다 다르게 붙이면 같은 비번도 해시가 달라지고(①), 미리 만든 표가 무용지물이 된다(②) — salt마다 표를 새로 만들어야 하니 "미리 계산해두기"의 이점이 사라지기 때문. salt는 비밀이 아니라 해시 옆에 같이 저장한다. 숨기는 게 목적이 아니라 **미리 계산을 불가능하게** 만드는 게 목적이라서다. Caching SHA-2는 여기에 더해 해시를 여러 번 반복(기본 5000회, `caching_sha2_password_digest_rounds`)해서 시도 한 번마다 연산을 강제, brute-force 속도를 일부러 느리게 만든다.

> ✅ **실무에서 자주 겪는 문제** — "5.7에서 되던 접속이 8.0에서 갑자기 안 된다"의 상당수가 이것이다. 기본 인증이 Caching SHA-2로 바뀌었는데 클라이언트/드라이버가 대응을 못 해서다. 급하면 아래처럼 기본 인증을 Native로 되돌리고(`my.cnf`에 추가) 계정을 다시 만들면 된다.
>
> ```ini
> default_authentication_plugin=mysql_native_password
> ```

#### 5000번 해싱, 쿼리마다 하는 거 아니다 — 인증은 커넥션당 1회

Caching SHA-2가 인증 한 번에 해시를 5000번씩 돌린다니 "쿼리 날릴 때마다 CPU가 갈리는 거 아닌가" 싶지만, 그렇지 않다. **인증(해싱)은 커넥션을 새로 열 때 딱 한 번** 일어난다.

MySQL 프로토콜에서 인증은 **물리 커넥션을 처음 맺는 순간(핸드셰이크)**에만 한다. 인증이 끝나면 그 커넥션은 수명이 끝날 때까지 "인증된 상태"로 유지되고, 그 위로 흐르는 쿼리들은 **다시 인증하지 않고** 그냥 실행된다. 5000번 해싱은 이 최초 인증에서 비밀번호를 검증하는 비용이라, 쿼리 실행 경로에는 아예 없다.

**커넥션 풀이 있으면 이 비용은 사실상 안 보인다.** 풀은 물리 커넥션을 미리 만들어두고 재사용하기 때문이다.

-   **풀이 처음 뜰 때** — 커넥션 N개를 만들면서 N번 인증 → 여기서만 5000번 해싱이 N번
-   **그 뒤 평소 트래픽** — 풀에서 커넥션을 빌리고 반납만 반복 → **인증이 일어나지 않음**

즉 풀에서 커넥션을 꺼내 쓰는 것(checkout)은 인증이 아니라 **이미 인증돼 있는 커넥션을 빌려주는 것**뿐이다. 그래서 초당 쿼리가 아무리 많아도 5000번 해싱은 다시 타지 않는다. 이 비용을 다시 무는 건 **새 물리 커넥션이 생길 때뿐**이다 — 풀이 커지거나(부하 증가), `maxLifetime`(HikariCP 기본 30분)이 지나 커넥션을 폐기하고 새로 열거나, 죽은 커넥션을 교체할 때.

> **Cloud Run / Cloud SQL 맥락** — 이때 커넥션 생성 시점에 두 가지가 같이 일어난다. ① Cloud SQL 커넥터의 **mTLS 핸드셰이크**(TLS 채널 수립, 이것도 무겁다) ② 그 채널 위에서의 **MySQL 인증**(Caching SHA-2 해싱). 둘 다 커넥션당 1회고, 풀이 살아 있는 동안 그 위로 쿼리를 날릴 때는 **둘 다 타지 않는다.** 그래서 Cloud Run처럼 인스턴스가 자주 뜨고 지는(cold start) 환경은 풀이 매번 새로 떠서 이 비용이 체감되지만, 인스턴스가 살아서 풀을 유지하는 동안은 무관하다.
>
> 한 가지 예외 — 일부 커넥션 풀은 커넥션 반납 시 세션 초기화를 위해 `COM_CHANGE_USER`를 호출하는데, 이게 **재인증을 트리거**한다. **HikariCP는 기본적으로 안 쓴다**(rollback + 설정 리셋 방식)니 걱정할 필요 없지만, 다른 풀에서 이 옵션을 켜면 반납마다 인증이 돌 수 있다.

### 3.3 비밀번호 관리

#### 3.3.1 고수준 비밀번호 (`validate_password` 컴포넌트)

비밀번호 자릿수·글자 조합·사전 단어 금지 같은 **정책을 강제**하는 기능. 컴포넌트를 설치해야 켜진다.

```sql
INSTALL COMPONENT 'file://component_validate_password';
```

정책 강도는 `validate_password.policy` 시스템 변수로 세 단계 중 고른다. 기본값은 `MEDIUM`.

-   **`LOW`** — 길이만 검증
-   **`MEDIUM`**(기본) — 길이 + 숫자·대소문자·특수문자 조합
-   **`STRONG`** — MEDIUM + **금칙어(사전 단어) 포함 여부**까지

`STRONG`을 쓰려면 `validate_password.dictionary_file`에 금칙어가 담긴 텍스트 파일을 등록해야 한다(`qwerty`, `1234` 같은 흔한 비번을 막는 용도). SecLists 같은 공개 목록을 가져다 쓰면 된다.

> 🐘 **PostgreSQL 비교** — PostgreSQL은 이런 비밀번호 정책 강제가 코어에 내장돼 있지 않고, `passwordcheck` 같은 확장 모듈(contrib)을 붙여서 구현한다. MySQL은 8.0에서 컴포넌트로, 5.7에서는 플러그인으로 제공하는데 **컴포넌트 방식이 단점을 보완**한 최신 형태라 8.0에선 컴포넌트를 쓰는 게 낫다.

#### 3.3.2 이중 비밀번호 (Dual Password, 8.0 신규)

**"비밀번호를 무중단으로 교체하기 위한" 기능.** 응용 서버 여러 대가 공용 계정으로 DB에 붙어 있으면, 비밀번호를 바꾸는 순간 아직 안 바뀐 서버들이 죄다 접속 실패한다. 이 문제를 풀려고 8.0은 **한 계정에 비밀번호를 2개(Primary + Secondary) 동시에** 둘 수 있게 했다.

```sql
-- 1) 현재 비번을 'yreww'로 세팅
ALTER USER 'root'@'localhost' IDENTIFIED BY 'old_password';
-- 2) 새 비번으로 바꾸면서 기존 비번을 세컨더리로 보존
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password' RETAIN CURRENT PASSWORD;
```

두 번째 문장 실행 후: 프라이머리는 `new_password`, 세컨더리는 `old_password`가 된다. **둘 다로 로그인이 된다.** 그동안 응용 서버들의 설정 파일을 새 비번으로 천천히 교체하고, 전부 교체가 끝나면 세컨더리를 삭제한다.

```sql
ALTER USER 'root'@'localhost' DISCARD OLD PASSWORD;  -- 세컨더리(옛 비번) 폐기
```

## 3.4 권한(Privilege) — 정적 vs 동적

권한은 크게 **글로벌 권한**(서버 전체 대상, 특정 객체 명시 못 함)과 **객체 권한**(특정 DB·테이블 대상, 반드시 객체 명시)으로 나뉜다. `ALL`(= `ALL PRIVILEGES`)은 두 곳 모두에서 쓸 수 있는데, 부여 대상에 따라 "그 수준에서 가능한 모든 권한"을 뜻한다.

그리고 8.0에서 권한이 성격상 둘로 갈린다:

-   **정적 권한(Static)** — `SELECT`, `INSERT`, `CREATE`, `DROP`, `FILE`, `SUPER`처럼 **MySQL 소스코드에 고정된** 전통적 권한.
-   **동적 권한(Dynamic, 8.0 신규)** — 서버가 시작되면서, 또는 컴포넌트/플러그인이 설치되면서 **그때 등록되는** 권한. `BACKUP_ADMIN`, `SYSTEM_USER`, `REPLICATION_SLAVE_ADMIN`, `BINLOG_ADMIN` 등.

**동적 권한이 왜 생겼나** — 5.7까지는 관리 작업 대부분이 `SUPER` 하나로 뭉뚱그려져 있었다. `SUPER`를 주면 백업이든 복제든 뭐든 다 되니 권한을 잘게 줄 수 없었다. 8.0은 `SUPER`를 잘게 쪼개 표 3.2의 동적 권한들로 **분산**시켰다. 이제 "백업 관리자에겐 `BACKUP_ADMIN`만, 복제 관리자에겐 복제 관련 권한만" 하는 식으로 최소 권한 원칙을 지킬 수 있다. (`SUPER`는 8.0에서 deprecated.)

### GRANT 문법 — 부여 대상 범위가 `ON` 뒤에서 결정된다

```sql
GRANT 권한목록 ON 대상 TO '아이디'@'호스트';
```

핵심은 `ON` 뒤 대상 표기다. `*.*` / `db.*` / `db.table` 세 단계로 범위가 달라진다.

```sql
-- 글로벌: 서버 전체. 대상은 반드시 *.* 여야 함
GRANT SUPER ON *.* TO 'user'@'localhost';

-- DB 단위: 해당 DB의 모든 객체(테이블·스토어드 프로그램 포함)
GRANT EVENT ON employees.* TO 'user'@'localhost';

-- 테이블 단위
GRANT SELECT,INSERT,UPDATE,DELETE ON employees.department TO 'user'@'localhost';

-- 컬럼 단위: 권한 뒤에 컬럼명을 괄호로. INSERT/UPDATE/SELECT만 가능
GRANT SELECT,INSERT,UPDATE(dept_name) ON employees.department TO 'user'@'localhost';
```

> ⚠️ **주의** — 존재하지 않는 사용자에게 `GRANT`하면 8.0에선 **에러**다(5.7까진 계정이 자동 생성됐다). 반드시 `CREATE USER`로 먼저 만들고 `GRANT`해야 한다. 또 컬럼 단위 권한은 문법상 가능하지만 **거의 안 쓴다** — 컬럼마다 권한 체크가 붙어 전체적으로 성능에 악영향이라, 이럴 땐 필요한 컬럼만 담은 **뷰(VIEW)**를 만들어 뷰에 권한을 주는 편이 낫다.

부여된 권한 확인은 `SHOW GRANTS;` 또는 `mysql` DB의 권한 테이블(`mysql.user`, `mysql.db`, `mysql.tables_priv`, `mysql.columns_priv`, `mysql.procs_priv`, `mysql.global_grants`)을 직접 조회한다.

## 3.5 역할(Role, 8.0 신규)

**여러 권한을 하나로 묶어 이름 붙인 것.** 권한을 계정마다 일일이 부여하면 관리가 지옥이라, 권한 꾸러미(역할)를 만들어 계정에 통째로 부여한다.

```sql
-- 1) 역할 정의 (빈 껍데기)
CREATE ROLE role_emp_read, role_emp_write;

-- 2) 역할에 권한 부여
GRANT SELECT ON employees.* TO role_emp_read;
GRANT INSERT, UPDATE, DELETE ON employees.* TO role_emp_write;

-- 3) 계정 만들고 역할을 계정에 부여
CREATE USER reader@'127.0.0.1' IDENTIFIED BY 'qwerty';
GRANT role_emp_read TO reader@'127.0.0.1';
```

**여기서 초보가 걸리는 함정 — 역할을 부여받아도 바로 안 먹는다.** 로그인한 세션에서 그 역할을 **활성화(`SET ROLE`)**해야 실제로 권한이 생긴다. 안 하면 `SELECT` 하나에도 권한 없음 에러가 난다.

```sql
SET ROLE 'role_emp_read';        -- 이번 세션에서 역할 켜기
SELECT current_role();           -- 활성화된 역할 확인
```

매번 로그인할 때마다 켜기 싫으면 서버 전역으로 자동 활성화한다.

```sql
SET GLOBAL activate_all_roles_on_login=ON;  -- 로그인 시 부여된 역할 자동 활성화
```

**역할과 계정은 사실 같은 것이다.** MySQL 내부적으로 역할과 계정은 똑같이 `mysql.user` 테이블에 저장되고, 구분은 `account_locked` 컬럼값뿐이다(역할은 로그인 못 하게 `Y`). 그래서 `CREATE ROLE role_x` 대신 `CREATE USER role_x` + 잠금으로도 만들 수 있다. 계정이 다른 계정의 권한을 통째로 물려받는 구조라 보면 된다.

역할도 `CREATE ROLE role_x@호스트`처럼 **호스트를 붙일 수 있는데**, 안 붙이면 자동으로 `role_x@'%'`(모든 호스트)가 된다. 역할 관련 저장 테이블:

-   **`mysql.default_roles`** — 계정별 기본 역할
-   **`mysql.role_edges`** — 역할에 부여된 역할의 관계 그래프

#### 실무 컨벤션 — 내부적으로 같으니 사람이 구분한다

MySQL이 역할과 계정을 구분해주지 않으니(둘 다 `mysql.user`, `account_locked`만 다름), 구분은 **컨벤션으로 사람이 만들어 지킨다.**

**1. 이름 접두사** — 역할에 `role_`(또는 `r_`)을 붙여 "이건 사람이 아니라 권한 꾸러미"임을 드러낸다. 책 예제 `role_emp_read`가 그 컨벤션이다. 보통 `role_<도메인>_<수준>`(`_ro`/`_rw`/`_admin`) 꼴로 잡는다.

```
role_emp_read, role_billing_rw, role_app_ro   ← 역할 (권한 묶음)
svc_billing, app_order, dba_kim               ← 계정 (실제 접속 주체)
```

**2. 호스트 파트** — 역할은 호스트를 안 붙여 `role_x@'%'`로 두고(접속할 게 아니니), 계정은 접속 출처를 특정 호스트로 좁힌다(`svc_billing@'10.0.%'`).

**3. 잠금 상태** — "열린 것(`account_locked=N`)=계정, 잠긴 것(`Y`)=역할"을 규칙으로 못박으면 `mysql.user`만 봐도 구분된다. `CREATE ROLE`은 자동으로 잠기고 `CREATE USER`는 열려 있으니 이 규칙과 맞아떨어진다.

**4. (가장 중요) 권한은 계정에 직접 주지 않는다** — 이름 규칙보다 실무적으로 더 핵심이다. 권한(`GRANT SELECT ...`)은 **무조건 역할에만** 부여하고, 계정에는 **역할만** 부여한다.

```sql
-- 권한은 역할에만
GRANT SELECT, INSERT ON billing.* TO role_billing_rw;
-- 계정에는 역할만
GRANT role_billing_rw TO svc_billing@'10.0.%';
```

이렇게 하면 "계정에 `GRANT`가 직접 붙어 있으면 뭔가 잘못된 것"이라는 감사 기준이 명확해지고, 권한 변경은 역할 한 곳만 고치면 그 역할을 쓰는 계정 전부에 반영돼 관리가 편하다. `SHOW GRANTS`도 깔끔해진다(계정엔 `GRANT role_x TO ...` 몇 줄, 실제 권한은 역할에).

정리하면 **"역할 = 권한을 담는 그릇 / 계정 = 그릇을 배정받는 신원"**으로 역할을 갈라두는 게 컨벤션의 뼈대고, 접두사·호스트·잠금은 그걸 눈으로 확인하기 쉽게 하는 보조 장치다.

> 🐘 **PostgreSQL 비교** — 역할은 원래 PostgreSQL이 먼저 확립한 개념이다. PostgreSQL은 **유저와 역할(그룹)의 구분 자체를 없애서** 둘 다 `ROLE`로 통합했는데(`LOGIN` 속성 유무로만 구분), MySQL 8.0이 "역할=잠긴 계정"으로 구현한 것과 발상이 똑같다. 다만 PostgreSQL은 `SET ROLE` 없이도 `INHERIT` 속성이 있으면 부여받은 역할의 권한을 자동으로 쓴다는 점이 다르다.
