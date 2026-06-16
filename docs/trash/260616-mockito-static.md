---
title: Snack - [Java] Mockito MissingMethodInvocationException — static 메서드 스텁 실패
tags: ['Java', 'Spring', 'Test', 'Mockito']
---

## 개요

`TokenHasher.hash()`처럼 static 메서드를 `given()`/`when()`으로 스텁하려다 `MissingMethodInvocationException`을 만났다. 원인과 `mockStatic`을 이용한 해결법을 정리한다.

## 문제 상황

```java
@MockitoBean
private TokenHasher tokenHasher;

@Test
void refreshTokenTest() {
    given(jwtProvider.validateToken(testToken)).willReturn(true);
    given(TokenHasher.hash(testToken)).willReturn("test-hashed-token"); // 여기서 예외

    assertThatThrownBy(() -> authService.refreshToken(testToken))
            .isInstanceOf(BusinessException.class)
            .hasFieldOrPropertyWithValue("errorCode", ErrorCode.AUTH_TOKEN_INVALID);
}
```

`given(TokenHasher.hash(testToken))` 라인에서 `org.mockito.exceptions.misusing.MissingMethodInvocationException`이 발생한다.

## 원인

`given(...)`/`when(...)`은 "괄호 안 메서드 호출이 mock 인스턴스에 대한 호출이었다"는 사실을 Mockito가 내부적으로 기록해뒀다가, 그 기록 위에 스텁을 거는 방식으로 동작한다.

`TokenHasher.hash(testToken)`은 **static 메서드 호출**이라 mock과 무관하게 즉시 실제 SHA-256 로직이 실행돼버린다. `@MockitoBean private TokenHasher tokenHasher` 필드를 선언해도 소용없다 — 코드가 `tokenHasher.hash(...)`가 아니라 `TokenHasher.hash(...)`로 직접 부르기 때문에, 그 mock 인스턴스는 애초에 호출 경로에 끼지 않는다.

결과적으로 Mockito는 "직전에 mock에 대한 메서드 호출이 없었다"고 판단해 `MissingMethodInvocationException`을 던진다.

:::tip 같은 예외가 발생하는 다른 케이스
- final 클래스/메서드를 스텁하려 했을 때
- mock이 아닌 실제 객체의 메서드를 `given()`에 넘겼을 때
- argument matcher(`any()` 등)를 mock 호출이 아닌 곳에서 썼을 때
:::

## 해결법 — Mockito.mockStatic

static 메서드를 그대로 유지하면서 스텁하려면 `Mockito.mockStatic`을 try-with-resources로 감싼다.

```java
import org.mockito.MockedStatic;
import org.mockito.Mockito;

try (MockedStatic<TokenHasher> mocked = Mockito.mockStatic(TokenHasher.class)) {
    mocked.when(() -> TokenHasher.hash(testToken)).thenReturn("test-hashed-token");

    assertThatThrownBy(() -> authService.refreshToken(testToken))
            .isInstanceOf(BusinessException.class)
            .hasFieldOrPropertyWithValue("errorCode", ErrorCode.AUTH_TOKEN_INVALID);
}
```

`given(...)` 대신 `mocked.when(() -> ...).thenReturn(...)` 문법을 쓴다. static mock은 일반 mock과 API가 다르고 `MockedStatic` 객체로 별도 관리된다.

:::warning try 블록 스코프 주의
static mock은 스택 기반으로 등록된다. try 블록을 벗어나면 자동으로 원래 동작(실제 SHA-256 로직)으로 복구된다. 블록 밖에서 같은 클래스를 호출하는 다른 코드가 있어도 영향받지 않는다.
:::

Mockito 5.x부터 inline mock maker가 기본값이라 (Spring Boot 3.5 기준 `spring-boot-starter-test`에 포함) `mockito-inline` 별도 의존성 추가는 필요 없다.

## 정리 — 더 이상 필요 없는 mock 필드

`mockStatic`으로 전환하면 `@MockitoBean private TokenHasher tokenHasher;` 필드는 의미가 없어진다. static 호출은 인스턴스 mock과 무관하기 때문이다. 그대로 두면 안 쓰이는 mock으로 남아 코드를 읽는 사람을 혼란스럽게 하므로 제거하는 게 맞다.
