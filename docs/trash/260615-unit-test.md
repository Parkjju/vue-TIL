---
title: Snack - [Spring] Mockito 기반 서비스 계층 단위 테스트
tags: ['Java', 'Spring', 'Test']
---

## 개요

Spring Boot 서비스 계층을 테스트할 때 `@SpringBootTest`는 컨텍스트 전체를 로드해 느리다. Mockito만 사용하면 DB 연결 없이 빠르게 비즈니스 로직만 검증할 수 있다. 서비스 단위 테스트의 기본 구조와 각 요소의 의미를 정리한다.

## 기본 틀

```java
@ExtendWith(MockitoExtension.class)
class GenreServiceTest {

    @Mock
    private GenreRepository genreRepository;

    @InjectMocks
    private GenreService genreService;

    @Test
    @DisplayName("장르 목록 조회 - 정상")
    void getGenreList() {
        // given
        Genre genre = Genre.create("Pop", "팝");
        given(genreRepository.findAll()).willReturn(List.of(genre));

        // when
        GenreListResponse response = genreService.getGenreList();

        // then
        assertThat(response.genres()).hasSize(1);
    }
}
```

## 각 요소 설명

### `@ExtendWith(MockitoExtension.class)`

JUnit 5에 Mockito를 붙여주는 선언이다. 이게 있어야 `@Mock`, `@InjectMocks`가 동작한다.

`@SpringBootTest`는 Spring 컨텍스트 전체를 로드하지만, 이 방식은 Mockito만 올려서 훨씬 빠르다. 서비스 계층 로직만 테스트할 때는 Spring 컨텍스트가 필요 없다.

### `@Mock`

진짜 `GenreRepository` 대신 껍데기(Mock) 객체를 만든다. 메서드를 호출하면 기본값(`null`, `0`, 빈 리스트 등)을 반환하고, `given()`으로 원하는 반환값을 지정할 수 있다. DB 연결 없이 동작한다.

### `@InjectMocks`

`GenreService` 인스턴스를 생성하면서 `@Mock`으로 만든 객체들을 생성자 주입해준다. `new GenreService(genreRepository)`와 동일한 효과다.

:::warning @RequiredArgsConstructor 사용 시 주의
`@InjectMocks`는 `final` 필드를 기준으로 생성자 주입을 시도한다. 서비스 클래스에 `@RequiredArgsConstructor`를 썼다면 주입받을 필드를 반드시 `final`로 선언해야 한다. non-final로 선언하면 `@InjectMocks`가 주입 대상으로 인식하지 못해 NPE가 발생한다.
:::

### `@Test` / `@DisplayName`

- `@Test`: 이 메서드가 테스트 케이스임을 JUnit에 알린다.
- `@DisplayName`: 테스트 실행 결과에 표시되는 이름. 메서드명 대신 읽기 좋은 설명을 쓴다.

### given / when / then

테스트 구조를 3단계로 나누는 패턴이다.

| 단계 | 역할 | 예시 |
|---|---|---|
| **given** | Mock이 어떤 값을 반환할지 설정 | `given(repo.findAll()).willReturn(list)` |
| **when** | 실제로 테스트할 메서드 호출 | `service.getGenreList()` |
| **then** | 결과 검증 | `assertThat(response).hasSize(1)` |

`given()`은 BDDMockito의 메서드다. Mockito의 `when()`과 동일한 역할이지만 given/when/then 단계 구분이 명확해진다.

### `given()` 동작 원리

```java
given(genreRepository.findAll()).willReturn(List.of(genre));
```

`given()` 안의 `findAll()` 호출은 실제로 실행되는 게 아니다. **"이 mock에서 `findAll()`이 호출되면"** 이라는 조건을 Mockito에 등록하는 행위다. `given()`은 `BDDOngoingStubbing` 객체를 반환하고, `.willReturn()`은 그 객체의 메서드라 체이닝이 된다.

```
given(genreRepository.findAll())  // BDDOngoingStubbing<List<Genre>> 반환
    .willReturn(List.of(genre));  // BDDOngoingStubbing의 메서드
```

이후 서비스 메서드를 실행하면, 내부에서 `findAll()`이 호출될 때 Mockito가 가로채서 `List.of(genre)`를 반환한다. 서비스가 `findById(1L)`을 쓴다면 `given(genreRepository.findById(1L)).willReturn(...)` 처럼 호출 형태에 맞게 등록해야 한다.

```
실제 코드:  genreRepository.findAll() → DB 조회
테스트:     genreRepository.findAll() → willReturn(List.of(genre)) 로 가로챔
```

### static import

`given`과 `assertThat`은 각각 다른 라이브러리의 정적 메서드라 static import가 필요하다.

```java
import static org.mockito.BDDMockito.given;
import static org.assertj.core.api.Assertions.assertThat;
```

`given()`을 static import하면 `willReturn`은 `given()`이 반환하는 객체의 메서드라 별도 import가 필요 없다.

IntelliJ에서 자동 추천이 안 될 때는 Settings → Editor → General → Auto Import → `Include auto-import of static members in completion` 목록에 아래 두 개를 추가하면 된다.

- `org.assertj.core.api.Assertions`
- `org.mockito.BDDMockito`

### `assertThat`

AssertJ 라이브러리의 검증 메서드로, `spring-boot-starter-test`에 기본 포함된다. 체이닝으로 검증 조건을 붙일 수 있다.

```java
assertThat(response.genres()).hasSize(1);
assertThat(response.genres().get(0).genreName()).isEqualTo("Pop");
assertThat(user).isNotNull();
```

## 엔티티 인스턴스 생성 문제

JPA 엔티티는 보통 `@NoArgsConstructor(access = AccessLevel.PROTECTED)`를 쓴다. 외부에서 `new Genre()`로 직접 생성이 불가능하기 때문에, 테스트에서 엔티티 인스턴스를 만드는 방법을 선택해야 한다.

**방법 1 — 정적 팩토리 메서드 추가 (권장)**

```java
// 엔티티에 추가
public static Genre create(String genreNameEn, String genreNameKo) {
    Genre genre = new Genre(); // 클래스 내부이므로 protected 접근 가능
    genre.genreNameEn = genreNameEn;
    genre.genreNameKo = genreNameKo;
    return genre;
}
```

```java
// 테스트에서 사용
Genre genre = Genre.create("Pop", "팝");
```

다른 엔티티와 컨벤션을 통일할 수 있고 테스트 코드도 읽기 좋다.

**방법 2 — ReflectionTestUtils (프로덕션 코드를 건드리기 싫을 때)**

```java
Genre genre = (Genre) ReflectionTestUtils.invokeConstructor(Genre.class);
ReflectionTestUtils.setField(genre, "genreNameEn", "Pop");
ReflectionTestUtils.setField(genre, "genreNameKo", "팝");
```

## Argument Matcher — `any()`

`given()` 안에서 특정 인자값을 지정하면 그 값이 정확히 넘어올 때만 매칭된다.

```java
given(jwtProvider.generateAccessToken("abc")).willReturn("token");
// "abc"가 넘어올 때만 매칭
```

테스트에서 실제로 어떤 값이 넘어올지 모르거나 신경 쓰지 않을 때는 `any()`를 쓴다.

```java
given(jwtProvider.generateAccessToken(any())).willReturn("access-token");
// userId가 null이든 1L이든 뭐든 → "access-token" 반환
```

서비스 내부에서 생성된 객체(`User`)의 필드값(`id`)이 `null`이어도 Mock이 가로채서 지정한 값을 반환하므로, 인자에 의존하지 않는 케이스에서 유용하다.

```java
import static org.mockito.ArgumentMatchers.any;
```

## 예외 테스트

예외가 던져지는 케이스는 `assertThatThrownBy`를 사용한다.

```java
import static org.assertj.core.api.Assertions.assertThatThrownBy;
```

```java
@Test
@DisplayName("장르 없을 때 예외 발생")
void getGenreList_throwsWhenEmpty() {
    given(genreRepository.findAll()).willReturn(List.of());

    assertThatThrownBy(() -> genreService.getGenreList())
        .isInstanceOf(BusinessException.class)
        .hasMessageContaining("장르");
}
```

람다로 실행할 코드를 넘기면, 그 안에서 던져진 예외를 잡아서 타입/메시지 등을 체이닝으로 검증한다.

| 메서드 | 역할 |
|---|---|
| `isInstanceOf(BusinessException.class)` | 예외 타입 검증 |
| `hasMessageContaining("장르")` | 예외 메시지에 특정 문자열 포함 여부 검증 |
| `hasMessage("정확한 메시지")` | 예외 메시지 완전 일치 검증 |

## `@Mock` vs `@MockitoBean`

| | `@Mock` | `@MockitoBean` |
|---|---|---|
| 환경 | Mockito 단위 테스트 | Spring 컨텍스트 (`@SpringBootTest`) |
| 동작 | Mockito가 껍데기 객체 생성 | Spring 컨텍스트 안의 빈을 Mock으로 교체 |
| Spring | Spring 모름 | Spring이 인식하고 주입 |

`@SpringBootTest`에서 `@Mock`을 써봤자 Spring은 그 존재를 모른다. Spring은 이미 자기가 만든 진짜 빈을 서비스에 주입한 상태라 `@Mock`으로 만든 껍데기는 아무 효과가 없다.

```java
@SpringBootTest
class AuthServiceIntegrationTest {
    @Autowired
    private AuthService authService; // Spring이 진짜 AppleAuthClient 주입한 상태

    @Mock
    private AppleAuthClient appleAuthClient; // Mockito가 만든 껍데기, 아무도 안 씀 (무효)
}
```

`@MockitoBean`을 쓰면 Spring에게 "이 빈은 Mock으로 교체해서 컨텍스트에 등록해라"고 지시한다.

:::tip @MockBean deprecated
Spring Boot 3.4부터 `@MockBean` → `@MockitoBean`으로 교체됐다.

```java
import org.springframework.test.context.bean.override.mockito.MockitoBean;
```
:::

## 단위 테스트 vs 통합 테스트

기준은 **Spring 컨텍스트가 필요한가**다.

| | 단위 테스트 | 통합 테스트 |
|---|---|---|
| 애노테이션 | `@ExtendWith(MockitoExtension.class)` | `@SpringBootTest` |
| DB | Mock으로 대체 | H2 인메모리 실제 동작 |
| 속도 | 빠름 | 느림 |
| 검증 대상 | 서비스 로직 분기, 예외 | DB 적재 후 재조회, 트랜잭션 |

테스트 클래스는 목적별로 분리한다.

```
AuthServiceTest.java            ← 단위 테스트, 비즈니스 로직 분기/예외
AuthServiceIntegrationTest.java ← 통합 테스트, DB 적재 시나리오
```

하나로 통일하면 전부 `@SpringBootTest`가 되어 컨텍스트 로드 시간 때문에 전체 테스트가 느려진다.

### 통합 테스트 기본 틀

```java
@SpringBootTest
@Transactional
class AuthServiceIntegrationTest {

    @Autowired
    private AuthService authService;

    @MockitoBean  // @PostConstruct에서 외부 네트워크 요청 → Mock으로 대체
    private AppleAuthClient appleAuthClient;

    @MockitoBean  // 환경변수(JWT_SECRET) 없으면 빈 생성 실패 → Mock으로 대체
    private JwtProvider jwtProvider;

    @Test
    @DisplayName("동일 Apple 계정 두 번 로그인 - 두 번째는 기존 유저 반환")
    void signInWithApple_기존유저() {
        given(appleAuthClient.verifyIdentityToken(any()))
            .willReturn(new AppleIdentity("test@gmail.com", "test-apple-id"));
        given(jwtProvider.generateAccessToken(any())).willReturn("access-token");
        given(jwtProvider.generateRefreshToken(any())).willReturn("refresh-token");
        given(jwtProvider.getAccessTokenExpiration()).willReturn(3600000L);
        given(jwtProvider.getRefreshTokenExpiration()).willReturn(2592000000L);

        authService.signInWithApple("test token"); // 신규가입 → DB 저장
        authService.signInWithApple("test token"); // 기존유저 조회 → 로그인
    }
}
```

`@Transactional`은 테스트 종료 후 자동 롤백해서 테스트 간 DB 상태가 격리된다.

`@MockitoBean`을 쓰는 이유는 두 가지다.
- `AppleAuthClient`: `@PostConstruct`에서 Apple JWKS 엔드포인트에 네트워크 요청 발생 → 테스트 환경에서 불필요
- `JwtProvider`: `@PostConstruct`에서 `JWT_SECRET` 환경변수로 `SecretKey` 초기화 → 테스트 환경에 환경변수 없으면 빈 생성 자체가 실패

나머지 Repository는 실제 H2 DB로 동작시켜야 DB 적재 시나리오가 검증되므로 Mock으로 대체하지 않는다.

`src/test/resources/application.properties`에 H2 설정을 추가한다.

```properties
spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
```

## 테스트 계층별 선택 기준

| 계층 | 애노테이션 | 사용 시점 |
|---|---|---|
| Service 단위 | `@ExtendWith(MockitoExtension.class)` | 비즈니스 로직 분기, 예외 케이스 |
| Service 통합 | `@SpringBootTest` | DB 적재 후 재조회, 트랜잭션 동작 |
| Repository | `@DataJpaTest` | 커스텀 JPQL/`@Query` 메서드 생길 때 |
| Controller | `@WebMvcTest` + `MockMvc` | Security 필터체인 붙인 후 |

`@DataJpaTest`는 DB를 쓰지만 통합 테스트라고 부르지 않는다. H2를 띄워 JPA 쿼리만 검증하는 용도로, `findAll()`처럼 Spring Data JPA가 이미 검증한 메서드는 테스트할 필요 없고 직접 작성한 쿼리가 생길 때 작성한다.
