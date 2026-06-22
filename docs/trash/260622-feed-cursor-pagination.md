---
title: Snack - [Spring] 커서 기반 Feed 페이지네이션 — FeedCursor 구현과 @DataJpaTest 준비
tags: ['Java', 'Spring', 'Test', 'Database']
---

## 개요

Feed API의 커서 기반 페이지네이션을 위한 `FeedCursor` 값 객체를 TDD로 구현하면서 만난 함정들과 디자인 리뷰 과정, 그리고 다음 단계(Repository 쿼리 메서드)를 준비하며 정리한 `@DataJpaTest` 개념을 묶어 정리한다.

## 1. 커서 구조 설계

피드는 "장르 우선(Phase 1) → 부족하면 전체 데이터(Phase 2)"로 채워지는 구조라, 커서에 4개 값이 필요하다.

```
cursor: {
  phase: GENRE | GENERAL,
  genreOffset: int,    // 장르 데이터 소비량
  generalOffset: int,  // 전체 데이터 소비량
  seed: int            // 최초 요청 시 생성, 이후 고정 (RAND(seed) 정렬용)
}
```

이 4개 필드를 클라이언트에 노출할 토큰으로 만들기 위해 `.`로 join한 뒤 Base64로 인코딩하는 단순한 방식을 택했다.

```java
public record FeedCursor(Phase phase, Integer genreOffset, Integer generalOffset, Integer seed) {
    public String encode() {
        String properties = String.join(DELIMITER, List.of(phase.name(), genreOffset.toString(), generalOffset.toString(), seed.toString()));
        return new String(Base64.getEncoder().encode(properties.getBytes(StandardCharsets.UTF_8)));
    }
}
```

## 2. 트러블슈팅: `split(".")`가 빈 배열을 반환했다

decode 단계에서 인코딩된 문자열을 다시 4개로 쪼개려고 `split(DELIMITER)`(`DELIMITER = "."`)를 그대로 썼는데, 실제로 돌려보니 항상 빈 배열이 나왔다.

```java
"1.5.0.123".split(".")  // → []
```

`split`의 인자는 **정규식**으로 해석되고, `.`은 정규식에서 "모든 문자"를 의미한다. 문자열의 모든 글자가 구분자로 매치돼버려서 전부 빈 문자열만 남고, trailing 빈 문자열 제거 규칙까지 더해져 배열 자체가 통째로 비어버린 것이다. jshell로 직접 찍어보고서야 확신할 수 있었다.

:::warning split의 인자는 리터럴이 아니라 정규식
구분자로 정규식 특수문자(`.`, `|`, `*` 등)를 쓸 거면 반드시 escape해야 한다. `split("\\" + DELIMITER)` 또는 `Pattern.quote(DELIMITER)`.
:::

## 3. 배열은 왜 `.stream()`이 없는가

decode한 문자열 배열을 `Integer`로 변환하려고 `.stream().map(Integer::parseInt)`를 쓰려 했는데, IDE가 자동으로 `Arrays.stream(array)`로 감싸줬다. 이건 타입캐스팅이 아니라, **배열이 `Collection`을 구현하지 않아서** 인스턴스 메서드로 `.stream()`이 없기 때문이다. `List`/`Set`은 `Collection` 인터페이스에 `stream()`이 정의돼 있어 바로 호출되지만, 배열은 static 유틸리티 `Arrays.stream(T[])`를 거쳐야만 `Stream`을 얻을 수 있다.

그 다음 선택할 게 하나 더 있다.

| 메서드 | 반환 타입 |
|---|---|
| `.map(Integer::parseInt)` | `Stream<Integer>` (boxed) |
| `.mapToInt(Integer::parseInt)` | `IntStream` (primitive) |

레코드 필드가 전부 `Integer`(boxed)였기 때문에 `.map(Integer::parseInt)`로 가는 게 자연스러웠다 — `mapToInt`로 가면 나중에 `.boxed()`를 한 번 더 거쳐야 한다.

마지막으로, `Stream`은 한 번 소비하면 재사용이 안 되고 `get(0)` 같은 인덱스 접근도 안 된다. record 생성자에 4개 필드를 위치별로 넣어야 했으므로, `.toList()`(Java 16+)로 인덱싱 가능한 `List<Integer>`로 한 번 변환하는 과정이 필요했다.

## 4. 디자인 리뷰 — 작은 디테일이 쌓여서 버그가 된다

코드 리뷰를 반복하면서 한 번에 다 안 보이던 문제들이 하나씩 드러났다.

- **`@NotBlank Integer phase`** → `@NotBlank`는 `CharSequence`(String) 대상 검증 어노테이션이라 `Integer`에는 의미가 없다. `@NotNull`로 교체.
- **`decode(...) throws BusinessException`** → `BusinessException`은 `RuntimeException`을 상속한 unchecked 예외라 `throws` 선언이 불필요했다. checked exception처럼 보이게 해서 오히려 오해를 부르는 선언이었다.
- **에러코드 재사용 문제** → 처음엔 cursor 파싱 실패를 기존 `AUTH_TOKEN_INVALID`("유효하지 않은 토큰입니다")로 던졌는데, 메시지가 인증 토큰 얘기라 의미가 안 맞았다. `CURSOR_INVALID`("유효하지 않은 커서값입니다")를 FEED 도메인 섹션에 새로 추가해서 분리했다.
- **`catch (Exception e)`가 너무 넓음** → 잘못된 cursor 문자열을 처리하려고 `decode` 내부 파싱을 `try/catch`로 감쌌는데, 처음엔 `Exception`을 통째로 잡았다. 실제로 발생 가능한 예외는 `Phase.valueOf`의 `IllegalArgumentException`과 `Integer.parseInt`의 `NumberFormatException`뿐이고, 후자는 전자의 서브클래스라 **`IllegalArgumentException` 하나로 둘 다 잡힌다.** `Exception`을 그대로 잡으면 의도하지 않은 진짜 버그(예: NPE)까지 "잘못된 cursor"로 둔갑해서 400으로 응답해버리는 셈이라, 예외 타입을 좁혀서 의도한 케이스만 정확히 잡도록 고쳤다.

```java
try {
    Phase phase = Phase.valueOf(properties.get(0));
    // ...
    return new FeedCursor(phase, genreOffset, generalOffset, seed);
} catch (IllegalArgumentException e) {
    throw new BusinessException(ErrorCode.CURSOR_INVALID);
}
```

## 5. phase를 `Integer`에서 enum으로 — 접근제어자가 핵심이었다

`phase`를 처음엔 `Integer`(매직 넘버)로 뒀다가, "1이 GENRE인지 GENERAL인지 코드만 보고 알 수 없다"는 문제로 enum 전환을 결정했다. 그런데 enum을 어디에 둘지가 생각보다 중요한 선택이었다.

같은 코드베이스에 `AuthService` 안에 `private enum PROVIDER`가 이미 있어서 그걸 따라가려 했는데, 두 상황은 본질적으로 달랐다.

- `PROVIDER`는 항상 `PROVIDER.APPLE.name()`으로 **문자열만** 빼내 쓰고, enum 타입 자체가 `AuthService` 밖으로 나갈 일이 없다 → `private`으로 충분하다.
- `Phase`는 `FeedService`가 타입 그대로 받아서 `if (cursor.phase() == Phase.GENRE)` 식으로 **분기**해야 한다 → `private`이면 외부 클래스가 그 타입 자체를 참조할 수 없어 컴파일이 안 된다.

결론적으로 `FeedCursor` 안에 nested로 두되 `public enum Phase`로 선언해서, "Phase는 커서가 소유한 상태값"이라는 관계는 유지하면서 외부에서도 `FeedCursor.Phase.GENRE`로 타입 안전하게 참조할 수 있게 했다. 사용처가 더 늘어나면 그때 독립 파일로 빼도 늦지 않다고 판단했다.

## 6. Repository 설계 전에 미리 검증한 것 — 네이티브 쿼리 vs JPQL+Pageable

다음 단계인 Feed 조회 쿼리(장르 우선 + 부족분 전체 데이터 채우기, `ORDER BY RAND(seed)`)를 설계하면서 막힐 수 있는 지점을 먼저 점검했다.

- **임의 offset** — `genreOffset`/`generalOffset`은 페이지 경계(10의 배수)에 항상 맞지 않는다. Spring의 `PageRequest.of(page, size)`는 offset이 `page*size`로 고정되기 때문에, JPQL + `Pageable`로 가려면 커스텀 `Pageable` 구현체가 필요해진다.
- **`RAND(seed)`** — MySQL 전용 함수라 JPQL 표준 문법엔 없다.

네이티브 쿼리(`@Query(nativeQuery = true)`)로 가면 `LIMIT :limit OFFSET :offset`, `RAND(:seed)`를 그냥 파라미터 바인딩으로 처리할 수 있어 더 단순했다. 다만 이 프로젝트 테스트 DB는 H2를 `MODE=PostgreSQL`로 띄우고 있어서(운영 DB는 MySQL), "테스트에서 MySQL 전용 문법이 깨지지 않을까"가 마지막 의문이었다. 추측만으로 넘기지 않고 직접 JDBC로 찍어봤다.

```java
Connection conn = DriverManager.getConnection("jdbc:h2:mem:testdb;MODE=PostgreSQL", "sa", "");
// SELECT RAND(123)        → 정상 동작
// SELECT 1 LIMIT 1 OFFSET 0  → 정상 동작
```

둘 다 H2 자체의 내장 함수/문법이라 `MODE` 설정과 무관하게 동작한다는 걸 확인했다. 호환 모드는 식별자 인용·타입 강제 같은 방언 차이에 영향을 주는 거고, H2 고유 함수까지 막는 건 아니었다. 추측으로 막연한 우려를 전달하기 전에 짧은 스크립트로 직접 확인하는 게 훨씬 빠르고 확실했다.

:::tip 불확실하면 추측 대신 검증
"이거 안 될 것 같은데"라는 감만으로 설계를 바꾸기 전에, 5분짜리 JDBC 스크립트로 직접 찍어보는 쪽이 훨씬 빠르고 정확하다.
:::

## 7. `@DataJpaTest` — Repository 테스트를 위한 다음 준비물

지금까지의 테스트는 단위 테스트(Service를 Mockito로) 또는 `@SpringBootTest`/`@WebMvcTest` 정도였고, Repository 단독 테스트는 이번이 처음이라 개념을 정리했다.

- **테스트 슬라이스(test slice)** — 앱 전체가 아니라 특정 계층에 필요한 빈만 골라 띄우는 Spring Boot의 테스트 어노테이션 군. `@WebMvcTest`(컨트롤러), `@SpringBootTest`(전체)에 이어 `@DataJpaTest`(JPA 관련 빈만 — EntityManager, Repository, DataSource)가 추가됐다.
- **자동 롤백** — `@DataJpaTest`의 각 테스트는 트랜잭션으로 감싸져서 끝나면 자동 롤백된다. 테스트 간 데이터가 새지 않아 수동 cleanup이 필요 없다.
- **`TestEntityManager`** — 직접 `new`하는 게 아니라 `@DataJpaTest`가 컨텍스트에 등록해주는 빈이라 `@Autowired`로 주입받으면 된다. `repository.save()`와의 차이는, `save()`는 JPA의 쓰기 지연(write-behind) 때문에 실제 INSERT가 언제 나갈지 보장이 약한 반면 `persistAndFlush()`는 호출 즉시 SQL을 반영해서, 저장 직후 바로 조회를 검증해야 하는 Repository 테스트에 적합하다.

```java
@DataJpaTest
class TrackRepositoryTest {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TrackRepository trackRepository;
}
```

- **픽스처(fixture)** — 테스트 실행 전에 미리 만들어두는 고정된 데이터/상태를 가리키는 일반 테스팅 용어. Repository 테스트에서는 `Genre`, `Track`, `UserHypeTrack` 같은 엔티티를 미리 저장해두는 게 픽스처가 된다.
- **Given-When-Then** — 지금까지 작성한 모든 테스트(`FeedCursorTest`, `AuthServiceIntegrationTest`)와 본질적으로 같은 흐름이다. Given(픽스처 저장) → When(쿼리 메서드 호출) → Then(`assertThat`으로 검증). 다른 점은 "준비" 단계가 메모리 변수가 아니라 실제 DB row라는 것뿐이다.

## 정리

| 항목 | 처음 | 최종 |
|---|---|---|
| 구분자 분리 | `split(".")` (정규식 함정, 항상 빈 배열) | `split("\\.")` |
| `phase` 필드 타입 | `Integer` (매직 넘버) | `public enum Phase` (nested) |
| 잘못된 cursor 처리 | 없음 → 런타임 예외 그대로 노출 | `catch (IllegalArgumentException)` → `CURSOR_INVALID` |
| 검증 어노테이션 | `@NotBlank Integer` | `@NotNull Integer` |
| 에러코드 | `AUTH_TOKEN_INVALID` 재사용 | 전용 `CURSOR_INVALID` 신설 |
| 다음 단계 Repository 쿼리 | — | 네이티브 쿼리로 결정 (RAND/임의 offset 둘 다 H2에서 검증 완료) |

작은 단위(`FeedCursor`)를 TDD로 끝까지 밀어붙이면서 리뷰를 반복한 게, 다음 단계인 Repository 쿼리 설계에서 막힐 만한 지점(임의 offset, DB 방언 함수)을 미리 점검하는 흐름으로 자연스럽게 이어졌다.
