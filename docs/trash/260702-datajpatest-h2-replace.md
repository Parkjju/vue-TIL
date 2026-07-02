---
title: Snack - [Spring] @DataJpaTest가 H2로 바꿔치기하는 문제와 낡은 테스트 픽스처
tags: ['Spring', 'Test']
---

## 개요

Postgres를 쓰는 프로젝트에서 `./gradlew test`를 돌렸더니 특정 테스트들만 무더기로 실패했다. 원인을 좁혀보니 서로 다른 두 문제가 겹쳐 있었다.

1. `@DataJpaTest`가 설정을 무시하고 임베디드 H2를 띄우는 문제
2. 프로덕션 예외 핸들러가 바뀌었는데 테스트 픽스처가 그대로 남아 있던 문제

## 증상

실패한 테스트는 두 부류였다.

-   `@DataJpaTest` 계열 (`FeedServiceTest`, `TrackRepositoryTest`, `UserHypeRepositoryTest`) → `org.h2.jdbc.JdbcSQLSyntaxErrorException`
-   `@WebMvcTest` 계열 (`GlobalExceptionHandlerTest`) → 단순 `AssertionError`

반면 `@SpringBootTest` 계열(`UserServiceTest`, `AuthServiceIntegrationTest` 등)은 전부 통과했다. 같은 DB 설정을 공유하는데 왜 일부만 H2로 터질까?

## 문제 1: @DataJpaTest는 데이터소스를 H2로 바꿔치기한다

`test/resources/application.properties`에는 분명히 Postgres를 쓰라고 적어놨다.

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/dignify
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=create-drop
```

그런데 에러는 Postgres가 아니라 H2에서 났다. 범인은 `@DataJpaTest`의 기본 동작이다.

:::warning @DataJpaTest의 숨은 기본값
`@DataJpaTest`는 내부적으로 `@AutoConfigureTestDatabase`를 포함하는데, 이 기본값이 `Replace.ANY`다. 즉 **설정에 뭐라고 적혀 있든 클래스패스에 임베디드 DB(H2)가 있으면 데이터소스를 통째로 H2로 갈아끼운다.** `testImplementation 'com.h2database:h2'`가 들어 있으면 그걸 자동으로 물어온다.
:::

`@SpringBootTest`는 이 자동 교체를 하지 않고 실제 설정된 데이터소스를 쓴다. 그래서 `@SpringBootTest` 테스트들은 Postgres로 붙어 통과했고, `@DataJpaTest` 3개만 H2로 떨어진 것이다.

### H2가 실제로 터진 지점

H2로 붙자마자 `data.sql`을 실행하다가 문법 에러가 났다. `data.sql`이 Postgres 전용 문법을 쓰기 때문이다.

```sql
INSERT INTO cron_state (job_name, last_processed_id, created_at, updated_at)
VALUES ('track_collect', NULL, NOW(), NOW())
    ON CONFLICT (job_name) DO NOTHING;   -- ← H2가 파싱 못 함
```

`ON CONFLICT`는 Postgres의 upsert 문법이다. H2는 이걸 모르니 `JdbcSQLSyntaxErrorException`을 던지고, 그 여파로 스프링 컨텍스트 로딩 자체가 실패해 해당 클래스의 모든 테스트가 무더기로 죽는다.

### 해결: 데이터소스 교체를 끈다

`@AutoConfigureTestDatabase(replace = NONE)`를 붙여 "임베디드로 바꾸지 말고 설정된 DB 그대로 써라"라고 명시한다.

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class TrackRepositoryTest {
    // ...
}
```

이제 세 클래스 모두 실제 Postgres에 붙어 `ON CONFLICT`가 정상 동작한다.

:::tip 왜 굳이 테스트도 Postgres로?
H2는 cascade 동작, flush 순서, 제약 위반 시점 등이 실제 Postgres와 미묘하게 다르다. 테스트가 초록불인데 운영에서 터지는 함정을 만들 수 있다. 방언 차이(`ON CONFLICT` 등)까지 실제로 검증하려면 로컬 docker-compose Postgres에 붙이는 편이 안전하다.
:::

## 문제 2: 프로덕션 코드가 바뀌었는데 픽스처가 낡음

`GlobalExceptionHandlerTest`는 DB와 무관한 `@WebMvcTest`라 원인이 달랐다. 어느 시점부터 예외 핸들러 로직이 바뀌어 있었다.

```java
@ExceptionHandler
public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
    Throwable cause = e.getCause();
    while (cause != null) {
        // SQLState 23505(unique 위반)일 때만 409로 매핑
        if (cause instanceof java.sql.SQLException sqlEx && "23505".equals(sqlEx.getSQLState())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ErrorResponse.from(ErrorCode.DATA_INTEGRITY_VIOLATION));
        }
        cause = cause.getCause();
    }
    // 그 외의 무결성 위반은 500
    return ResponseEntity.internalServerError()
            .body(ErrorResponse.from(ErrorCode.INTERNAL_SERVER_ERROR));
}
```

핸들러는 이제 **cause 체인을 타고 내려가 SQLState `23505`를 찾았을 때만** 409를 준다. 유니크 위반이 아닌 무결성 예외는 500으로 떨어뜨리기 위한 방어 로직이다.

그런데 테스트용 컨트롤러는 예전 그대로, cause 없는 맨 예외를 던지고 있었다.

```java
// TestController — 낡은 픽스처
@GetMapping("/test/data-integrity")
void throwDataIntegrity() {
    throw new DataIntegrityViolationException("test");   // cause 없음 → 500으로 떨어짐
}
```

cause가 없으니 while 루프를 그냥 통과해 500을 반환했고, 409를 기대하던 테스트가 깨졌다. **프로덕션 코드는 진화했는데 테스트 픽스처가 그 변화를 따라가지 못한 전형적인 케이스**다.

### 해결: 픽스처를 핸들러의 새 계약에 맞춘다

핸들러가 요구하는 대로 SQLState `23505`를 담은 cause를 붙여 던진다.

```java
@GetMapping("/test/data-integrity")
void throwDataIntegrity() {
    // 핸들러는 SQLState 23505(unique 위반) cause가 있을 때만 409로 매핑한다
    throw new DataIntegrityViolationException("test",
            new java.sql.SQLException("duplicate key", "23505"));
}
```

`SQLException(String reason, String SQLState)` 생성자로 두 번째 인자에 SQLState를 넣을 수 있다. 이제 핸들러가 cause를 찾아 409를 돌려주고 테스트가 통과한다.

## 정리

-   `@DataJpaTest`는 기본적으로 데이터소스를 임베디드 H2로 **바꿔치기**한다. 실제 DB로 테스트하려면 `@AutoConfigureTestDatabase(replace = NONE)`을 붙인다. `@SpringBootTest`는 이 교체를 하지 않는다.
-   H2와 Postgres는 방언이 달라, `ON CONFLICT` 같은 DB 전용 문법이 `data.sql`에 있으면 H2에서 컨텍스트 로딩째로 실패한다.
-   예외 핸들러가 "SQLState 23505일 때만 409" 처럼 정교해지면, 테스트 픽스처도 그 계약(cause에 SQLState를 담는 것)을 똑같이 맞춰줘야 한다. 프로덕션 로직 변경과 테스트 픽스처는 함께 움직여야 한다.
