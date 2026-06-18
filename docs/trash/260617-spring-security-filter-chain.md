---
title: Snack - [Spring Security] Filter Chain 전체 흐름 정리
tags: ['Java', 'Spring', 'Security']
---

## 개요

JWT 기반 stateless API에 Spring Security 인증을 붙이기 전에, "도대체 이게 어떻게 동작하는가"를 먼저 정리했다. 폼 로그인 위주로 설명하는 자료가 많아서, JWT 커스텀 인증 관점에서 핵심만 추렸다.

## Filter Chain이란

Spring Security는 컨트롤러에 도달하기 *전에* 요청을 가로채는 Servlet Filter들의 묶음이다.

```
HTTP 요청 → Tomcat → [Spring Security 필터 체인] → DispatcherServlet → Controller
```

"필터 체인"이라고 부르지만 실제로는 `FilterChainProxy`라는 하나의 필터로 등록되고, 그 내부에서 여러 개의 작은 필터가 정해진 순서로 실행되는 구조다. JWT 검증을 담당할 커스텀 필터도 이 체인 안의 한 자리를 차지하게 된다.

## 체인 안의 주요 필터 (JWT API 기준)

| 순서 | 필터 | 역할 |
|---|---|---|
| 1 | `SecurityContextHolderFilter` | 요청 시작 시 SecurityContext를 빈 상태로 세팅 |
| 2 | **(커스텀 JWT 필터 삽입 위치)** | Authorization 헤더 읽고 토큰 검증 → 성공 시 SecurityContext에 인증 정보 채움 |
| 3 | `AnonymousAuthenticationFilter` | 이 시점까지 SecurityContext가 비어있으면 "익명 사용자"로 **명시적으로** 채움 |
| 4 | `ExceptionTranslationFilter` | 뒤쪽 인가 필터에서 던진 인증/인가 예외를 잡아서 401/403으로 변환 |
| 5 | `AuthorizationFilter` | "이 경로 인증 필요한데 너 인증됐어?" 체크, 아니면 예외를 던짐 |

핵심은 3번이다. `AnonymousAuthenticationFilter`가 "인증 안 됨"을 `null`이 아니라 명시적인 익명 `Authentication` 객체로 채워두기 때문에, 뒤에서 "이 요청이 진짜 인증된 사용자인지"를 판단할 기준이 생긴다.

## 핵심 객체 3개

- **`Authentication`** — "누가 요청했는가"를 담는 객체. principal(유저 식별자), authorities(권한 목록), 인증 여부 플래그를 가진다.
- **`SecurityContext`** — 현재 요청의 `Authentication`을 담는 그릇.
- **`SecurityContextHolder`** — `SecurityContext`를 꺼내올 수 있는 정적 접근점(ThreadLocal 기반). 컨트롤러/서비스 어디서든 `SecurityContextHolder.getContext().getAuthentication()`으로 현재 유저 정보에 접근할 수 있다.

## "인증됐다"는 게 정확히 무엇인가

폼 로그인 같은 전통적인 흐름에서는 `AuthenticationManager` → `AuthenticationProvider` → `UserDetailsService`(DB 조회 + 비밀번호 검증)가 인증을 대신 처리해준다.

**JWT 방식은 이 체계를 쓰지 않는다.** 토큰 자체가 이미 서명으로 검증된 증명서이기 때문에, 표준 패턴은 커스텀 필터 안에서 *직접* `Authentication` 객체를 만들어 `SecurityContextHolder`에 꽂아넣는 것이다.

```
Authorization: Bearer <token> 읽기
  → JwtProvider로 서명/만료 검증
  → JwtProvider.getUserId(token)으로 유저 ID 추출
  → Authentication 객체 생성 (principal = userId)
  → SecurityContextHolder에 세팅
```

:::tip AuthenticationManager 없이도 되는 이유
`AuthenticationManager`/`AuthenticationProvider`는 "자격증명을 검증해서 신뢰를 부여하는" 책임을 진다. JWT는 발급 시점에 서명으로 이미 신뢰가 보장된 토큰이므로, 매 요청마다 이 매니저 체계를 다시 거칠 필요가 없다. 커스텀 필터가 검증 + Authentication 생성을 한 번에 처리하는 게 일반적인 JWT 인증 패턴이다.
:::

## 인증 실패가 401로 변환되는 경로

토큰이 없거나 유효하지 않으면 SecurityContext가 비어있는 상태로 남는다. 이후 흐름:

```
SecurityContext 비어있음
  → AnonymousAuthenticationFilter가 익명으로 채움
  → AuthorizationFilter가 "인증 필요한 경로인데 익명이네" 판단 → 예외 던짐
  → ExceptionTranslationFilter가 예외를 받아서 분기:
      - 아예 인증이 안 된 상태였다면 → AuthenticationEntryPoint.commence() 호출 (보통 401)
      - 인증은 됐지만 권한이 부족하면 → AccessDeniedHandler.handle() 호출 (403)
```

role 체계가 없는 프로젝트라면 거의 항상 전자(401)만 쓰게 된다.

:::warning 필터에서 직접 응답을 쓰면 놓치는 경우
커스텀 필터 안에서 "토큰이 invalid하면 바로 401 응답을 써버리자"는 접근은, **토큰이 아예 없는 경우**를 놓친다. 토큰이 없으면 필터가 아무 것도 하지 않고 그냥 다음 필터로 넘기기 때문에, 익명 필터 → 인가 필터 → ExceptionTranslationFilter 경로를 타게 된다. 따라서 "토큰 없음 / invalid / expired"를 일관된 형식으로 응답하려면 `AuthenticationEntryPoint` 하나로 통일하는 편이 안전하다. 필터는 검증만 하고, 실패 사유를 request attribute 같은 곳에 남겨둔 뒤 SecurityContext를 비워서 넘기면 EntryPoint가 그걸 읽어 적절한 에러 코드로 응답할 수 있다.
:::

## SecurityConfig가 하는 일

위 모든 흐름은 `SecurityFilterChain` 빈 하나로 선언한다.

- `authorizeHttpRequests(...)` — 어느 경로가 `permitAll`이고 어느 경로가 `authenticated()`인지
- `addFilterBefore(커스텀필터, 기준필터.class)` — 커스텀 JWT 필터를 체인의 어느 위치에 꽂을지
- `sessionCreationPolicy(STATELESS)` — 세션을 만들지 않음. 매 요청마다 토큰으로 처음부터 인증
- `csrf().disable()` — CSRF는 브라우저 세션/쿠키 기반 공격 방어 장치라 stateless API에는 보통 비활성화
- `exceptionHandling(...)` — 커스텀 `AuthenticationEntryPoint` 등록

## 정리

| 이미 있던 것 | 새로 필요한 것 |
|---|---|
| `JwtProvider` (검증 + userId 추출) | 커스텀 JWT 필터 (`OncePerRequestFilter`) |
| `BusinessException`/`ErrorCode`/`ErrorResponse` | `AuthenticationEntryPoint` (401 응답을 기존 에러 응답 형식으로 통일) |
| | `SecurityConfig` (경로별 인증 요구사항 + 필터 위치 선언) |

`JwtProvider.getUserId()`는 구현해두고도 그동안 아무 데서도 호출되지 않던 메서드였는데, 이 필터에서 처음 실제로 쓰이게 된다.
