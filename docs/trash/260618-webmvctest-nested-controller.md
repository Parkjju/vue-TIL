---
title: Snack - [Spring] @WebMvcTest 개념 정리 + GlobalExceptionHandler 테스트 구축기
tags: ['Java', 'Spring', 'Test']
---

## 개요

`GlobalExceptionHandler`(`@RestControllerAdvice`)를 직접 검증하는 테스트를 `@WebMvcTest`로 처음부터 구축하면서 정리한 개념과, 그 과정에서 만난 트러블슈팅 3가지를 묶어 정리한다.

## 1. `@WebMvcTest`란

애플리케이션 전체가 아니라 **MVC 관련된 부분만** 컨텍스트에 올리는 슬라이스 테스트 어노테이션이다.

**만들어지는 것**: `@WebMvcTest(controllers = ...)`로 지정한 컨트롤러, `@RestControllerAdvice`/`@ControllerAdvice`, Jackson 컨버터, `MockMvc` 자체(자동 포함).

**만들어지지 않는 것**: `@Service`, `@Repository`, `DataSource`/JPA `EntityManagerFactory`/커넥션 풀 — DB 관련 인프라 전체. 그리고 우리가 직접 만든 `@Configuration` 클래스(`SecurityConfig` 등)도 포함되지 않는다.

여기서 핵심은 **제외 기준이 "무게"가 아니라 "역할(스테레오타입)"**이라는 점이다. `JwtProvider`처럼 가벼운 `@Component`도 카테고리상 제외 대상이고, `SecurityConfig`처럼 우리가 직접 검증하고 싶은 설정도 똑같이 제외된다. 그래서 "이 빈이 가벼운가"가 아니라 "지금 검증하려는 대상이 정확히 무엇인가"로 `@WebMvcTest`를 쓸지 말지 판단해야 한다.

## 2. `@AutoConfigureMockMvc`란

`@WebMvcTest`와 경쟁하는 옵션이 아니라, **"MockMvc를 추가로 만들어달라"는 기능 스위치**다. `@SpringBootTest`는 기본적으로 `MockMvc`를 만들어주지 않기 때문에(웹 환경을 안 띄우거나 진짜 서버를 띄우는 옵션이라서), 거기에 MockMvc 방식 테스트를 끼워넣고 싶을 때 추가로 붙인다.

| 조합 | 컨텍스트 범위 | MockMvc |
|---|---|---|
| `@WebMvcTest` 단독 | 좁음 (MVC만) | 자동 포함 |
| `@SpringBootTest` 단독 | 전체 | 없음 |
| `@SpringBootTest` + `@AutoConfigureMockMvc` | 전체 | 추가됨 |
| `@WebMvcTest` + `@AutoConfigureMockMvc` | 좁음 | 중복(불필요) — 이미 포함돼있어서 의미 없음 |

단, `@AutoConfigureMockMvc`에는 `addFilters` 같은 커스터마이징 옵션도 있어서, `@WebMvcTest`와 같이 써서 동작을 조정하는 건 의미가 있다 (뒤에서 다룬다).

## 3. MockMvc 기본 사용법

`mockMvc.perform(요청).andExpect(검증)` 구조다.

### 요청 만들기 — `MockMvcRequestBuilders`

```java
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
```

`get(url)`, `post(url)` 등으로 빌더를 만들고 체이닝으로 살을 붙인다.

| 메서드 | 용도 |
|---|---|
| `.header(name, value)` | 헤더 추가 (`Authorization` 등) |
| `.contentType(MediaType.APPLICATION_JSON)` | 요청 바디가 JSON이라고 선언 |
| `.content(String json)` | 요청 바디 |

### 검증하기 — `MockMvcResultMatchers`

```java
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
```

`status()`, `jsonPath("$.필드명")` 모두 한 번에 검증 객체가 나오는 게 아니라 **2단계**다. `status()`는 `StatusResultMatchers`라는 "도구함"을 먼저 리턴하고, 그 위에서 `.isOk()`/`.isUnauthorized()` 같은 구체적인 메서드를 호출해야 실제 검증 로직(`ResultMatcher`)이 만들어진다. `jsonPath("$.code")`도 동일하게 `JsonPathResultMatchers`를 먼저 받고 `.value(...)`로 마무리한다.

```java
mockMvc.perform(get("/genres"))
    .andExpect(status().isUnauthorized())
    .andExpect(jsonPath("$.code").value("AUTH_TOKEN_INVALID"));
```

## 4. 왜 `GlobalExceptionHandler`를 따로 테스트해야 했나

다른 기능(인증, Genre API 등)을 테스트하면서 우연히 `GlobalExceptionHandler`의 핸들러들이 간접적으로만 검증되고 있었는데, 실제로 `/auth/apple`에 빈 바디로 요청했을 때 `HttpMessageNotReadableException`이 처리 안 되고 500으로 새는 실제 버그를 발견했다. 이런 사각지대를 없애려면 5개 핸들러(`BusinessException`, `DataIntegrityViolationException`, `MethodArgumentNotValidException`, `HttpMessageNotReadableException`, 일반 `Exception`)를 각각 직접, 독립적으로 검증하는 테스트가 필요했다.

기존 실제 엔드포인트로 5가지 예외를 전부 끌어내기는 어렵고(특히 `DataIntegrityViolationException`이나 진짜 500), 그렇게 하면 나중에 비즈니스 로직이 바뀔 때 이 테스트도 같이 깨지는 불필요한 결합이 생긴다. 그래서 **각 예외를 일부러 던지는 테스트 전용 더미 컨트롤러**를 만들어 검증을 완전히 독립시키는 접근을 택했다.

```java
@RestController
public class TestController {
    @GetMapping("/test/business-exception")
    void throwBusinessException() {
        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
    }
    @GetMapping("/test/data-integrity")
    void throwDataIntegrity() {
        throw new DataIntegrityViolationException("test");
    }
    @PostMapping("/test/method-argument-not-valid")
    void throwMethodArgumentNotValid(@RequestBody @Valid TestRequest request) {}
    record TestRequest(@NotBlank String value) {}
}
```

`MethodArgumentNotValidException`은 생성자가 `MethodParameter` + `BindingResult`를 요구해서 직접 `new`하기 번거롭다. 그래서 직접 던지지 않고, `@Valid` 검증이 걸린 파라미터를 두고 일부러 검증 실패를 유도해서 Spring이 자연스럽게 던지게 했다. `HttpMessageNotReadableException`도 같은 엔드포인트에 바디를 완전히 비워서 보내면 자연스럽게 발생시킬 수 있다.

여기까지 준비하고 막상 돌려보니, 세 가지 문제를 연달아 만났다.

## 트러블슈팅 1 — `@EnableJpaAuditing`과의 충돌

`@WebMvcTest`로 컨텍스트를 띄우는데 다음 예외가 났다.

```
Caused by: BeanCreationException: Error creating bean 'jpaAuditingHandler': Cannot resolve reference to bean 'jpaMappingContext'
Caused by: BeanCreationException: Error creating bean 'jpaMappingContext': JPA metamodel must not be empty
```

`@WebMvcTest`는 컨텍스트 부팅 시 "기준이 되는 설정 클래스"가 필요해서 메인 `@SpringBootApplication` 클래스(`DignifyApplication`)를 그 기준으로 쓰는데, 그 클래스에 **직접 붙어있던 `@EnableJpaAuditing`**은 슬라이스 테스트의 제외 대상이 아니어서 그대로 처리됐다. 이 어노테이션이 등록하는 `jpaAuditingHandler` 빈은 실제 Entity 메타모델(`jpaMappingContext`)을 필요로 하는데, `@WebMvcTest`는 JPA/DB 계층을 안 띄우니 메타모델이 비어있어서 터진 것이다.

**해결**: `@EnableJpaAuditing`을 메인 애플리케이션 클래스에서 떼어내 별도의 `@Configuration` 클래스로 옮긴다.

```java
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}
```

운영 앱에서는 컴포넌트 스캔으로 똑같이 로드되고, `@WebMvcTest`에서는 이 설정 클래스 자체가 스캔 범위 밖이라 문제가 되는 빈이 아예 안 들어온다.

## 트러블슈팅 2 — Spring Boot 기본 보안 설정이 가로챔

다음 문제로, 더미 컨트롤러를 호출했더니 401 + `WWW-Authenticate: Basic realm="Realm"`이 나왔다.

```
WARN ... UserDetailsServiceAutoConfiguration : Using generated security password: ...
```

`@WebMvcTest`는 우리가 만든 `SecurityConfig`도 스캔 범위에서 제외하는데, `spring-boot-starter-security`가 클래스패스에 있으면 Spring Boot가 **우리 설정이 없을 때를 대비한 기본 보안 설정**(생성된 유저 1명, HTTP Basic, 모든 경로 보호)을 자동으로 깔아버린다. `/test/...` 경로에 인증 정보 없이 요청하니 더미 컨트롤러에 도달하기도 전에 이 기본 설정이 막은 것이다.

(우리 실제 `SecurityConfig`를 `@Import`하는 건 해결책이 아니다 — `/test/...`는 `permitAll()` 목록에 없어서 우리 진짜 필터로도 여전히 막힌다.)

**해결**: 이 테스트는 보안과 무관하니 필터 자체를 끈다.

```java
@WebMvcTest(controllers = TestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class GlobalExceptionHandlerTest { ... }
```

## 트러블슈팅 3 — nested 컨트롤러가 인식되지 않음

더미 컨트롤러를 테스트 클래스 안의 nested static class로 만들었는데, 여전히 500이 났다. 이번엔 원인이 완전히 달랐다.

### 잘못된 가설: 예외 핸들러 매칭 문제?

`handleBusinessException(BusinessException)`과 `handleInternalServerException(Exception)`이 같이 있으니 Spring이 더 막연한 타입으로 잘못 매칭하는 줄 알았다. 하지만 이건 Spring MVC의 핵심 동작이라 거의 확실히 정상이다 — 응답 바디를 까보니 가설이 틀렸다.

### 실제 응답을 까보니

```
Body = {"code":"INTERNAL_SERVER_ERROR","message":"서버 에러가 발생했습니다."}
```

`GlobalExceptionHandler`는 분명히 동작하고 있었다. 문제는 "어떤 핸들러가 선택됐는가"가 아니라 "그 전에 무슨 예외가 던져졌는가"였다.

### DEBUG 로깅으로 진짜 원인 확인

`logging.level.org.springframework.web=DEBUG`로 다시 돌려보니:

```
Handler:
    Type = org.springframework.web.servlet.resource.ResourceHttpRequestHandler
Resolved Exception:
    Type = org.springframework.web.servlet.resource.NoResourceFoundException
```

요청이 `TestController`에 도달한 적이 없었다. 정적 리소스 핸들러로 떨어졌고, "그런 리소스 없음"이 발생해서 그게 `handleInternalServerException`으로 처리된 것뿐이었다. 즉 `RequestMappingHandlerMapping`에 `TestController`의 매핑이 **처음부터 등록되지 않았던 것**이다.

:::tip 증상만 보고 진단하면 안 되는 이유
같은 500이라도 원인은 완전히 다를 수 있다. 항상 실제 응답(상태/바디/핸들러 타입)을 먼저 확인하고 가설을 세워야 한다.
:::

### visibility 문제인지 확인

nested class가 패키지-private이어서 접근 제어자 때문인가 싶어 `public static class` + `public` 메서드로 바꿔 재현했다. **동일하게 실패**했다. visibility는 원인이 아니었다.

### 진짜 원인: nested class 자체가 문제

같은 컨트롤러를 **별도 파일의 top-level 클래스**로 분리하자 바로 정상 동작했다.

```java
// TestController.java (별도 파일)
@RestController
public class TestController {
    @GetMapping("/test/probe")
    public String probe() { return "ok"; }
}
```

`@WebMvcTest(controllers = ...)`로 지정한 컨트롤러가 **테스트 클래스 내부의 nested class일 경우 인식되지 않는다.** `static`이든 `public`이든 상관없이, 테스트 클래스 안에 선언된 nested class라는 것 자체가 문제였다.

**해결**: 더미 컨트롤러는 nested class로 합치지 말고, 같은 패키지의 별도 파일에 top-level 클래스로 작성한다.

## 정리

| 트러블슈팅 | 원인 | 해결 |
|---|---|---|
| JPA metamodel must not be empty | 메인 클래스의 `@EnableJpaAuditing`이 슬라이스 제외 대상이 아님 | 별도 `@Configuration`으로 분리 |
| 401 Unauthorized (기본 Basic Auth) | `SecurityConfig`는 제외되지만 Boot 기본 보안 설정은 살아있음 | `@AutoConfigureMockMvc(addFilters = false)` |
| 컨트롤러가 라우팅되지 않음 (500) | `@WebMvcTest(controllers=...)`가 nested class를 인식 못 함 | top-level 클래스로 분리 |

세 트러블슈팅 모두 패턴이 같다 — `@WebMvcTest`가 "이건 MVC 레이어가 아니다"라고 판단해서 제외하거나 인식하지 못하는 대상이 있고, 증상(500/401)만 보고 바로 코드를 고치기 전에 ① 실제 응답(상태/바디) 확인 → ② 필요하면 DEBUG 로깅으로 내부 동작 확인 → ③ 의심 변수를 하나씩 통제한 최소 재현으로 검증하는 순서가 결국 가장 빠르다.
