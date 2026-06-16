---
title: Snack - [Spring] SpringBootTest 통합 테스트와 흔한 실수
tags: ['Java', 'Spring', 'Test']
---

## 개요

서비스 계층 테스트를 작성하다 보면 순수 Mockito 단위 테스트로는 검증할 수 없는 시나리오가 생긴다. 대표적인 예가 "DB에 저장한 뒤 다시 조회"하는 흐름이다. 이때 `@SpringBootTest` + H2 통합 테스트가 필요하다. 단위 테스트와 혼용하면서 생기는 흔한 구조적 실수와 올바른 작성법을 정리한다.

## 단위 테스트로는 안 되는 시나리오

```java
authService.signInWithApple("test token"); // 신규가입 → DB 저장
authService.signInWithApple("test token"); // 재로그인 → 기존 유저 조회
```

Mockito `@Mock`은 상태를 저장하지 않는다. 첫 번째 호출에서 `userRepository.save()`를 Mock에 호출해도 실제로 저장되지 않아, 두 번째 호출의 `findUser` 조회에서 여전히 기본값(`Optional.empty()`)을 반환한다. 실제 DB가 있어야 이 시나리오가 성립한다.

## 흔한 실수 — @SpringBootTest와 @Mock 혼용

```java
// 잘못된 구조
@ExtendWith(MockitoExtension.class)
@SpringBootTest
class AuthServiceIntegrationTest {
    @InjectMocks          // ❌
    private AuthService authService;

    @Mock                 // ❌
    private UserRepository userRepository;

    @MockitoBean
    private AppleAuthClient appleAuthClient;
}
```

`@SpringBootTest`는 Spring 컨텍스트를 전체 로드한다. 이때 `AuthService`는 Spring이 직접 빈을 만들어 의존성을 주입한다. `@Mock`으로 만든 껍데기 객체는 Spring이 모르기 때문에 `AuthService`에 주입되지 않는다. `@InjectMocks`도 `@SpringBootTest` 환경에서는 무효다.

또한 `@ExtendWith(MockitoExtension.class)`는 `@SpringBootTest`에 이미 포함되어 있어 중복 선언이다.

:::warning Repository를 @Mock으로 두면 안 되는 이유
Repository를 `@Mock`으로 선언하면 `save()`가 실제로 저장하지 않는다. H2 실제 빈을 써야 DB 적재 시나리오가 검증된다.
:::

## 올바른 통합 테스트 구조

```java
@SpringBootTest
@Transactional
class AuthServiceIntegrationTest {

    @Autowired                // Spring이 H2 기반 실제 빈 주입
    private AuthService authService;

    @MockitoBean              // @PostConstruct에서 외부 네트워크 요청 → Mock 대체
    private AppleAuthClient appleAuthClient;

    @MockitoBean              // JWT_SECRET 환경변수 없으면 빈 생성 실패 → Mock 대체
    private JwtProvider jwtProvider;

    @Test
    @DisplayName("동일 Apple 계정 재로그인 - 기존 유저 조회")
    void signInWithApple_재로그인() {
        given(appleAuthClient.verifyIdentityToken(any()))
            .willReturn(new AppleIdentity("test@gmail.com", "test-apple-id"));
        given(jwtProvider.generateAccessToken(any())).willReturn("test-access-token");
        given(jwtProvider.generateRefreshToken(any())).willReturn("test-refresh-token");
        given(jwtProvider.getAccessTokenExpiration()).willReturn(3600000L);
        given(jwtProvider.getRefreshTokenExpiration()).willReturn(2592000000L);

        authService.signInWithApple("test token"); // 신규가입 → H2 DB 저장
        AuthTokenResponse response = authService.signInWithApple("test token"); // 재로그인

        assertThat(response.accessToken()).isEqualTo("test-access-token");
    }
}
```

Repository는 선언하지 않으면 Spring이 H2를 바라보는 실제 빈을 주입한다. `@Transactional`은 테스트 종료 후 자동 롤백해서 테스트 간 DB 상태를 격리한다.

### @MockitoBean을 쓰는 이유

- `AppleAuthClient`: `@PostConstruct`에서 Apple JWKS 엔드포인트 네트워크 요청 발생 → 테스트 환경에서 불필요
- `JwtProvider`: `@PostConstruct`에서 `JWT_SECRET` 환경변수로 `SecretKey` 초기화 → 환경변수 없으면 빈 생성 자체가 실패

### @MockitoBean도 given()으로 동작한다

`@MockitoBean`은 Mockito Mock 객체를 Spring 컨텍스트에 등록하는 것이다. 내부적으로 Mockito Mock이므로 `given()`이 동일하게 동작한다.

```java
@MockitoBean
private AppleAuthClient appleAuthClient;

given(appleAuthClient.verifyIdentityToken(any()))
    .willReturn(new AppleIdentity(...)); // 정상 동작
```

## H2 설정

`src/test/resources/application.properties`에 추가한다.

```properties
spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
```

`build.gradle`에 H2 의존성도 추가한다.

```groovy
runtimeOnly 'com.h2database:h2'
```

## 두 테스트 클래스의 의존성 중복

같은 서비스에 대해 단위 테스트와 통합 테스트를 분리하면 의존성 선언이 중복된다.

```
AuthServiceTest.java
    @Mock AppleAuthClient
    @Mock JwtProvider
    @Mock Repository 3개

AuthServiceIntegrationTest.java
    @MockitoBean AppleAuthClient
    @MockitoBean JwtProvider
    (Repository는 선언 안 함)
```

중복처럼 보이지만 **목적이 다른 테스트**라 분리를 유지하는 게 맞다. 단위 테스트에서 로직 분기 대부분을 커버하고, 통합 테스트는 DB 적재 시나리오만 다룬다.
