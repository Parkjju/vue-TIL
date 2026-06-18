---
title: Snack - [Spring] @WebMvcTest가 nested 컨트롤러를 인식하지 못하는 문제
tags: ['Java', 'Spring', 'Test']
---

## 개요

`GlobalExceptionHandler`를 직접 테스트하기 위해 `@WebMvcTest` 안에 예외를 일부러 던지는 더미 컨트롤러를 테스트 클래스 내부의 nested class로 만들었는데, 컨트롤러가 아예 동작하지 않는 문제를 겪었다. 처음엔 예외 핸들러 매칭 문제로 의심했지만, 실제 원인은 전혀 다른 곳에 있었다.

## 증상

```java
@WebMvcTest(controllers = GlobalExceptionHandlerTest.TestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class GlobalExceptionHandlerTest {

    @RestController
    static class TestController {
        @GetMapping("/test/business-exception")
        void throwBusinessException() {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
    }

    @Test
    void test() throws Exception {
        mockMvc.perform(get("/test/business-exception"))
                .andExpect(status().is4xxClientError());  // 실패: 500이 나옴
    }
}
```

`USER_NOT_FOUND`는 404로 떨어져야 하는데, 실제로는 500이 나왔다.

## 잘못된 가설들

### 1차 의심: 예외 핸들러가 잘못 매칭되는 줄 알았다

`GlobalExceptionHandler`에 `handleBusinessException(BusinessException)`과 `handleInternalServerException(Exception)`이 같이 있으니, Spring이 더 구체적인 타입(`BusinessException`)이 아니라 더 막연한 타입(`Exception`)으로 잘못 매칭하는 게 아닐까 의심했다. 하지만 이건 Spring MVC의 핵심 동작이라 거의 확실히 정상 동작한다 — 실제로 응답 바디까지 까보니 가설이 틀렸다는 게 드러났다.

### 응답 바디를 직접 확인하니 전혀 다른 그림이 나왔다

```
MockHttpServletResponse:
    Body = {"code":"INTERNAL_SERVER_ERROR","message":"서버 에러가 발생했습니다."}
```

`GlobalExceptionHandler`는 분명히 동작하고 있었다(우리가 만든 JSON 형식이 그대로 나왔으니까). 문제는 "어떤 핸들러가 선택됐는가"가 아니라 "그 전에 무슨 예외가 던져졌는가"였다.

### DEBUG 로깅으로 진짜 원인을 잡았다

`logging.level.org.springframework.web=DEBUG`를 임시로 켜고 다시 돌려보니:

```
Handler:
    Type = org.springframework.web.servlet.resource.ResourceHttpRequestHandler

Resolved Exception:
    Type = org.springframework.web.servlet.resource.NoResourceFoundException
```

요청이 `TestController`에 도달한 적이 없었다. `/test/business-exception` 요청이 **정적 리소스 핸들러**로 떨어졌고, 거기서 "그런 리소스 없음"(`NoResourceFoundException`)이 발생해서 그게 `handleInternalServerException`으로 처리된 것뿐이었다. 즉 `RequestMappingHandlerMapping`에 `TestController`의 매핑이 **처음부터 등록되지 않았던 것**이다.

:::tip 증상만 보고 진단하면 안 되는 이유
"예외 핸들러 매칭"이라는 첫 가설은 그럴듯해 보였지만, 실제 응답 바디와 DEBUG 로그를 까보지 않았다면 한참을 잘못된 방향으로 헤맸을 것이다. 같은 500이라도 원인은 완전히 다를 수 있다 — 항상 실제 응답(상태/바디/핸들러 타입)을 먼저 확인하고 가설을 세워야 한다.
:::

## visibility 문제인가 확인

nested class가 `static`이지만 패키지-private이었어서, 혹시 접근 제어자 때문인가 싶어 `public static class` + `public` 메서드로 바꿔서 재현해봤다. **동일하게 실패했다.** `ResourceHttpRequestHandler`로 떨어지는 것도 동일. 즉 visibility는 원인이 아니었다.

## 진짜 원인: nested class 자체가 문제

같은 컨트롤러를 **별도 파일의 top-level 클래스**로 분리하자 바로 정상 동작했다.

```java
// TestController.java (별도 파일)
@RestController
public class TestController {
    @GetMapping("/test/probe")
    public String probe() {
        return "ok";
    }
}
```

```java
@WebMvcTest(controllers = TestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ProbeTest {
    @Test
    void probe() throws Exception {
        mockMvc.perform(get("/test/probe")).andExpect(status().isOk());  // 통과
    }
}
```

`@WebMvcTest(controllers = ...)`로 지정한 컨트롤러가 **테스트 클래스 내부의 nested class일 경우 컨트롤러로 인식되지 않는다.** `static`이든 `public`이든 상관없이, 테스트 클래스 안에 선언된 nested class라는 것 자체가 문제였다.

## 결론

`@WebMvcTest`에서 더미/테스트 전용 컨트롤러가 필요하면, 테스트 클래스 안에 nested class로 넣지 말고 **같은 패키지의 별도 파일에 top-level 클래스로 작성**해야 한다. 코드 양이 늘어나는 게 아쉽긴 하지만, nested class로 합쳐서 "한 파일에서 다 보이게" 하려던 시도 자체가 `@WebMvcTest`의 컨트롤러 인식 메커니즘과 맞지 않았다.

:::warning 디버깅 순서
이번 케이스처럼 "그럴듯한 첫 가설"에 바로 코드를 고치려 들지 말고, ① 실제 응답(상태/바디) 확인 → ② 필요하면 DEBUG 로깅으로 컨테이너 내부 동작(어떤 핸들러가 매칭됐는지) 확인 → ③ 의심되는 변수를 하나씩 통제한 최소 재현 코드로 검증, 순서로 가는 게 결국 더 빠르다.
:::
