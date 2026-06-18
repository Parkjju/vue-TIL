---
title: Snack - [Spring Security] 커스텀 JWT 인증 구현 (Filter + EntryPoint + Config)
tags: ['Java', 'Spring', 'Security']
---

## 개요

[지난 글](./260617-spring-security-filter-chain.md)에서 정리한 Filter Chain 흐름을 바탕으로, 실제 JWT 인증 3종(`JwtAuthenticationFilter`, `JwtAuthenticationEntryPoint`, `SecurityConfig`)을 구현하면서 정리한 내용이다. 이론을 알아도 실제로 짜보면 막히는 디테일들이 있었다.

## 1. JwtAuthenticationFilter — 토큰 검증 + 인증 객체 생성

`OncePerRequestFilter`를 상속한다. 이름 그대로 요청당 정확히 한 번만 실행되도록 보장해주는 클래스라서, forward/include로 디스패치가 여러 번 일어나도 중복 실행을 막아준다.

### 토큰 추출

```java
private static final String BEARER_PREFIX = "Bearer ";

String authorization = request.getHeader("Authorization");
if (authorization != null && authorization.startsWith(BEARER_PREFIX)) {
    String token = authorization.substring(BEARER_PREFIX.length());
    ...
}
```

헤더가 없거나 `Bearer ` 형식이 아니면 그냥 통과시킨다. 이 필터는 "토큰이 없다"를 에러로 취급하지 않는다 — 애초에 그 경로가 인증이 필요한 경로인지는 이 필터가 알 필요가 없고, 그건 뒤에서 `AuthorizationFilter`가 판단할 일이다.

### 검증 실패를 어떻게 다루는가

```java
try {
    jwtProvider.validateToken(token);
    Long userId = jwtProvider.getUserId(token);

    UsernamePasswordAuthenticationToken authenticationToken =
        new UsernamePasswordAuthenticationToken(userId, null, List.of());
    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
} catch (BusinessException e) {
    request.setAttribute(AUTH_ERROR_STRING, e.getErrorCode());
}

filterChain.doFilter(request, response);
```

처음 짤 때 이 `try/catch`를 빠뜨렸었다. `validateToken()`이 던지는 `BusinessException`을 그대로 흘려보내면, 이 필터는 `DispatcherServlet`보다 **앞**에서 실행되기 때문에 `@RestControllerAdvice`(`GlobalExceptionHandler`)가 절대 못 잡는다. 결과적으로 만료/위조 토큰을 보내면 우리가 만든 일관된 에러 포맷이 아니라 컨테이너 기본 에러 페이지가 나가게 된다.

:::warning 실패 시 응답을 여기서 직접 쓰지 않는다
catch 블록에서 바로 401 응답을 작성하고 끝낼 수도 있지만, 그러면 **토큰이 아예 없는 경우**를 놓친다. 토큰이 없으면 이 필터의 `if`문 자체를 안 타기 때문에, "토큰 없음"과 "토큰이 invalid함"이 서로 다른 코드 경로로 응답을 만들게 되어 형식이 갈라질 위험이 있다. 그래서 여기선 실패 사유(`ErrorCode`)만 `request` attribute에 남겨두고, 응답 작성 자체는 `AuthenticationEntryPoint` 한 곳으로 위임한다.
:::

### `UsernamePasswordAuthenticationToken`의 세 파라미터

이름 때문에 헷갈리지만 폼 로그인 전용 클래스가 아니라 `Authentication` 인터페이스의 범용 구현체다. 세 파라미터는:

| 파라미터 | 의미 | 이 프로젝트에서 |
|---|---|---|
| `principal` | 누구인지 | `userId` (Long) |
| `credentials` | 증명 수단 (원래는 비밀번호) | `null` — JWT 서명이 이미 증명을 끝냈으므로 의미 있는 값이 없음 |
| `authorities` | 권한 목록 (`Collection<? extends GrantedAuthority>`) | `List.of()` — role 체계가 없어서 빈 리스트 |

:::warning 생성자 함정: 2-arg vs 3-arg
`UsernamePasswordAuthenticationToken`은 생성자가 두 개다.

- `(principal, credentials)` — **`authenticated = false`**로 세팅됨 (로그인 시도 중 상태)
- `(principal, credentials, authorities)` — **`authenticated = true`**가 자동으로 세팅됨

반드시 3-arg 생성자를 써야 한다. 2-arg로 만들면 컴파일은 되지만 "인증 안 된" 객체가 `SecurityContext`에 들어가버려서, 이후 `AuthorizationFilter`가 여전히 미인증으로 판단해 401을 내려버리는 디버깅하기 까다로운 버그가 된다.
:::

`authorities`가 비어있어도 `isAuthenticated()`가 `true`인 이유는 권한 목록의 내용과 무관하게, **3-arg 생성자를 호출했다는 사실 자체**가 `authenticated` 플래그를 결정하기 때문이다.

### `@Component`를 붙이면 안 되는 이유

`OncePerRequestFilter`는 결국 `jakarta.servlet.Filter`다. Spring Boot는 컨텍스트에 있는 `Filter` 타입 빈을 발견하면 **서블릿 컨테이너 레벨에 자동으로 등록**한다. 그런데 `SecurityConfig`에서 `addFilterBefore`로 Security 체인에도 명시적으로 끼워넣을 것이므로, `@Component`를 붙이면 같은 필터가 두 경로(서블릿 컨테이너 자동등록 + Security 체인)에 중복 등록되어 요청마다 두 번 실행된다.

해결: `@Component`를 떼고, `SecurityConfig`에서 `new JwtAuthenticationFilter(jwtProvider)`로 직접 생성해서 넘긴다. `@RequiredArgsConstructor`는 그대로 둬도 된다 — 이건 단순히 생성자를 만들어주는 것뿐이라 컴포넌트 스캔 여부와 무관하다.

## 2. JwtAuthenticationEntryPoint — 인증 실패 응답 통일

`AuthenticationEntryPoint` 인터페이스를 구현한다. 메서드 하나, `commence(request, response, authException)`.

### 언제 호출되는가

직접 호출하는 게 아니라 `ExceptionTranslationFilter`가 호출한다.

```
JwtAuthenticationFilter
  → 성공: SecurityContext에 Authentication 세팅
  → 실패/토큰없음: SecurityContext 비어있는 상태로 다음 필터로
        ↓
AnonymousAuthenticationFilter
  → SecurityContext가 비어있으면 익명 Authentication으로 채움
        ↓
AuthorizationFilter
  → 인증 필요한 경로인데 익명이면 예외 던짐
        ↓
ExceptionTranslationFilter
  → "인증 자체가 안 된 상태"로 판단 → commence() 호출
```

즉 `commence()`가 호출됐다는 것 자체가 "인증되지 않은 상태로 보호된 리소스에 접근했다"는 뜻이다. 토큰이 없었든, invalid였든, expired였든 전부 여기로 수렴한다. (반대로 "인증은 됐지만 권한 부족"인 403 케이스는 `AccessDeniedHandler`가 처리하는데, 이 프로젝트는 role 체계가 없어서 거의 안 쓰인다.)

### 구현

```java
@RequiredArgsConstructor
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                          AuthenticationException authException) throws IOException {
        ErrorCode errorCode = (ErrorCode) request.getAttribute(JwtAuthenticationFilter.AUTH_ERROR_STRING);
        if (errorCode == null) {
            errorCode = ErrorCode.AUTH_TOKEN_INVALID;
        }
        ErrorResponse errorResponse = ErrorResponse.from(errorCode);

        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
```

`errorCode`가 `null`인 경우(토큰이 아예 없어서 필터가 attribute 자체를 안 남긴 경우)를 위한 기본값으로 `AUTH_TOKEN_INVALID`를 재사용했다 — "토큰 없음" 전용 코드를 새로 만들 수도 있지만, 기존 카탈로그를 점진적으로 늘려가는 컨벤션을 지켰다.

이 클래스는 `Filter`가 아니라 `AuthenticationEntryPoint`라서 `@Component`를 붙여도 위에서 본 이중등록 문제가 없다.

### `ObjectMapper`를 왜 직접 써야 하나

`@RestController`에서 DTO를 그냥 `return`하면 Spring MVC의 `HttpMessageConverter`가 내부적으로 `ObjectMapper`를 써서 JSON으로 바꿔준다. `GlobalExceptionHandler`가 `ResponseEntity`를 리턴할 때도 마찬가지다.

`commence()`는 `DispatcherServlet`보다 앞의 필터 단계라 이 자동 변환이 적용되지 않는다. 그래서 평소엔 보이지 않던 `ObjectMapper`를 직접 주입받아 `writeValueAsString()`으로 같은 일을 수동으로 해줘야 한다. `writeValueAsString()`이 던지는 `JsonProcessingException`은 `IOException`의 서브타입이라 `commence()`의 기존 `throws IOException` 선언으로 자연스럽게 커버된다.

## 3. SecurityConfig — 필터체인 조립

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtProvider jwtProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/apple", "/auth/refresh").permitAll()
                .anyRequest().authenticated())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

### 항목별 이유

- **`csrf().disable()`** — CSRF는 브라우저가 쿠키를 자동 첨부하는 걸 악용하는 공격이다. 토큰은 클라이언트가 명시적으로 헤더에 넣어야 하므로 이 공격 모델 자체가 성립하지 않는다.
- **`formLogin`/`httpBasic` disable** — `spring-boot-starter-security`만 있으면 Boot가 기본 로그인 폼/Basic Auth를 자동으로 끼워넣는다. 안 끄면 `/login` 리다이렉트 등 의도하지 않은 동작이 끼어들 수 있다.
- **`sessionCreationPolicy(STATELESS)`** — 세션 기반 인증은 첫 로그인 때 세션에 `SecurityContext`를 저장해두고 쿠키로 찾아오는 방식인데, JWT는 매 요청이 토큰으로 독립적으로 인증되므로 세션 자체가 불필요하다.
- **`authorizeHttpRequests` 순서** — `permitAll()` 매처가 `anyRequest()`보다 먼저 와야 한다. Spring Security는 등록된 순서대로 첫 매치를 적용하므로, `anyRequest()`를 먼저 적으면 그게 전부를 먹어버려 `permitAll()` 줄이 죽은 코드가 된다.
- **`exceptionHandling().authenticationEntryPoint(...)`** — 기본 EntryPoint 대신 우리가 만든 `JwtAuthenticationEntryPoint`를 `ExceptionTranslationFilter`에 등록한다.
- **`addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class)`** — `@Component`를 뗀 필터를 직접 생성해서, `AnonymousAuthenticationFilter`/`AuthorizationFilter`보다 확실히 앞선 위치(관습적으로 잘 알려진 기준점)에 끼워넣는다.

### `@Bean` 메서드가 `HttpSecurity`를 파라미터로 받는 이유

`@Bean` 메서드의 파라미터는 생성자 주입과 동일한 원리로 Spring이 컨테이너에서 찾아 넣어준다. 그런데 `HttpSecurity`는 **싱글턴이 아니라 prototype 스코프**다 — Spring Security의 자동 설정이 "호출할 때마다 새로 만들어지는 빌더"로 등록해두기 때문이다.

여러 개의 `SecurityFilterChain`을 정의하는 경우(예: `/api/**`와 `/admin/**`에 다른 인증 방식), 각 `@Bean` 메서드가 서로 독립적인 깨끗한 빌더를 받아야 설정이 섞이지 않는다. 그래서 필드로 들고 다니며 재사용하지 않고, 메서드가 호출되는 시점에 매번 새 인스턴스를 받아 그 자리에서 설정 → `build()` → 버리는 1회용 빌더로 쓰는 게 의도된 패턴이다.

## 전체 그림

| 컴포넌트 | 역할 |
|---|---|
| `JwtAuthenticationFilter` | 토큰 검증, 성공 시 `Authentication` 생성, 실패 시 `ErrorCode`만 attribute로 남김 |
| `JwtAuthenticationEntryPoint` | 인증 실패(토큰 없음/invalid/expired)를 한 곳에서 일관된 `ErrorResponse` JSON으로 응답 |
| `SecurityConfig` | 위 둘을 체인에 조립, 경로별 인증 요구사항 선언 |

`JwtProvider.getUserId()`는 구현해두고도 한동안 아무 데서도 안 쓰이던 메서드였는데, 이 필터에서 처음 실제로 쓰이게 됐다.
