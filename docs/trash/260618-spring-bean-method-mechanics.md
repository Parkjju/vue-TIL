---
title: Snack - [Spring] @Bean 메서드와 다중 빈 주입(List<T>)의 동작 원리
tags: ['Java', 'Spring']
---

## 개요

[`SecurityConfig`](./260618-jwt-security-implementation.md)를 작성하면서 `@Bean public SecurityFilterChain securityFilterChain(HttpSecurity http)`라는 메서드 시그니처를 보고 "이건 어떤 인터페이스를 구현한 것도 아닌데 왜 이렇게 쓰는가"를 파고들다가, Spring의 빈 생산/소비 분리, 빈 생명주기, `List<T>` 주입 메커니즘까지 정리하게 됐다.

## 1. `@Override`는 계약, `@Bean`은 타입 기반 발견

`AuthenticationEntryPoint.commence(...)`나 `OncePerRequestFilter.doFilterInternal(...)`은 인터페이스/부모클래스가 시그니처를 그대로 강제한다. 틀리면 `@Override`가 컴파일 에러를 낸다 — **계약(contract)**이 있는 것이다.

`@Bean` 메서드는 그런 계약이 전혀 없다. `SecurityConfig`는 무언가를 `implements`/`extends`하고 있지 않다. 실제로:

- 메서드 **이름**은 아무거나 가능하다 (`securityFilterChain`이든 다른 이름이든 Spring 입장에서 상관없음 — 빈 이름의 기본값으로 쓰이는 정도)
- **파라미터**는 그냥 의존성 주입 요청이다. 어떤 타입을 받을지는 작성자가 "내가 이 결과물을 만들기 위해 뭐가 필요한가"로 자유롭게 정한다
- 강제력이 있는 부분은 **리턴 타입 하나뿐**이다. Spring Security가 찾고 있는 게 `SecurityFilterChain` 타입이기 때문에 그 타입으로 리턴해야 인식된다

`ClockConfig`도 같은 원리다.

```java
@Bean
public Clock clock() {
    return Clock.systemUTC();
}
```

`clock()`이라는 이름이 강제된 게 아니라, `JwtProvider`가 생성자에서 `Clock` 타입을 요구하길래 그 타입을 리턴하는 메서드를 만든 것뿐이다.

## 2. 생산자와 소비자는 완전히 분리되어 있다

`WebSecurityConfiguration` 내부에는 대략 이런 코드가 있다.

```java
@Autowired(required = false)
void setFilterChains(List<SecurityFilterChain> securityFilterChains) {
    this.securityFilterChains = securityFilterChains;
}
```

여기서 헷갈리기 쉬운 지점: "이 메서드가 `HttpSecurity`를 파라미터로 받는 빈만 선택해서 모으는 건가?" — **아니다.** `WebSecurityConfiguration`은 `SecurityFilterChain`을 만든 메서드의 파라미터가 뭐였는지 전혀 모르고 알 필요도 없다.

- **생산 (production)**: `SecurityConfig.securityFilterChain(HttpSecurity http)`가 호출될 때, `HttpSecurity`는 이 메서드 자신이 결과물을 만들기 위해 필요로 하는 재료다. 메서드가 끝나면 `HttpSecurity`는 사라지고 완성된 `SecurityFilterChain` **객체**만 남는다.
- **소비 (consumption)**: `WebSecurityConfiguration`이 보는 건 이미 다 만들어진 결과물(인스턴스)뿐이다. 그 인스턴스가 어떤 메서드 이름·파라미터로 만들어졌는지는 결과물에 흔적이 남지 않는다.

:::tip 파라미터는 선택 기준이 아니다
파라미터가 0개든, `HttpSecurity` 하나든, 다른 빈 5개든 — `WebSecurityConfiguration`은 똑같이 수집한다. **리턴 타입이 `SecurityFilterChain`이라는 것 하나만** 본다. `HttpSecurity`를 파라미터로 받는 이유는 순전히 "그래야 내가 결과물을 만들기 편해서"이고, 소비자 쪽 계약과는 무관하다.
:::

## 3. 빈은 두 단계로 나눠서 봐야 한다

- **빈 정의 등록** — 컨테이너 부팅 초기, 모든 `@Configuration` 클래스의 `@Bean` 메서드를 스캔해서 "빈 정의(BeanDefinition)"로 미리 등록해둔다. 누가 누구를 필요로 하는지와 무관하게 먼저 끝나는 작업이다.
- **의존성 해결** — 그 이후, 누군가 특정 타입을 요구하면 컨테이너는 "Config 클래스를 다시 뒤지는" 게 아니라, 이미 만들어둔 빈 정의 레지스트리에서 **타입으로 인덱스 조회**한다 (`getBeansOfType(SecurityFilterChain.class)`에 해당하는 동작). `List<T>` 형태로 요청하면 매칭되는 빈을 전부 모아 리스트로 만들어주는 것도 별도 규칙이다.

## 4. 누가 먼저 만드는가 — eager singleton과 pull 생성

`SecurityConfig.securityFilterChain()`은 `WebSecurityConfiguration`이 요청해서 비로소 만들어지는 게 아니다. Spring 컨테이너의 기본 동작은 **싱글턴 스코프 빈을 컨텍스트 시작 시점에 전부 미리(eager) 만들어버리는 것**이다 (`@Lazy`를 안 붙이면). `WebSecurityConfiguration`의 요구사항이 아예 없었어도 이 메서드는 그냥 호출된다.

그럼 `@Autowired(required = false) void setFilterChains(...)`는 뭘 하는 걸까 — 두 가지 경우가 있다.

- **`SecurityConfig`의 빈이 먼저 만들어져 있던 경우**: 이미 싱글턴 캐시에 있는 걸 그냥 가져다 쓴다 (다시 호출 안 함 — 싱글턴 빈은 컨텍스트당 한 번만 만들어지고 캐시된다).
- **`WebSecurityConfiguration`이 먼저 처리되는 경우**: 의존성을 채우려는 시점에 아직 빈이 없으면, 컨테이너가 그 자리에서 즉시 만들어낸다 (진짜 "pull" 방식 생성).

어느 경로든 결과는 같다. 어느 쪽이 실제로 일어나는지는 두 `@Configuration` 클래스가 처리되는 순서에 달려있고, 이건 개발자가 정하는 게 아니라 Spring이 내부적으로 결정한다.

## 5. 런타임 3-phase 모델

여기까지는 전부 "빈이 언제 **만들어지는가**"였다. "언제 실제로 **쓰이는가**"는 완전히 다른 phase다.

### Phase 1 — 애플리케이션 부팅 (Configuration phase)

1. `SecurityConfig.securityFilterChain()`이 호출돼서 `SecurityFilterChain` 인스턴스가 만들어짐
2. `WebSecurityConfiguration`이 그걸 수집해서 `List<SecurityFilterChain>`을 받음
3. 그 리스트를 가지고 **`FilterChainProxy`**(핵심 객체)를 하나 만듦
4. 이 `FilterChainProxy`가 톰캣에 `springSecurityFilterChain`이라는 이름의 `Filter`로 등록됨

여기까지는 HTTP 요청이 한 건도 안 들어온 상태다.

### Phase 2 — 실제 요청 처리 (Runtime phase)

톰캣 입장에서 Spring Security는 **`Filter` 구현체 단 하나**(`FilterChainProxy`)다. 톰캣은 `SecurityFilterChain`이라는 개념 자체를 모른다.

```
[톰캣이 아는 세계]
요청 → 톰캣의 필터 목록 → ... → FilterChainProxy (톰캣이 아는 건 이게 전부) → DispatcherServlet

[FilterChainProxy 내부 — 톰캣은 이 안을 전혀 모름]
FilterChainProxy.doFilter(request) 호출되면:
  1. 자기가 들고 있는 List<SecurityFilterChain>을 순회
  2. 각 SecurityFilterChain.matches(request)로 이 요청에 맞는 체인 하나를 찾음
  3. 매칭된 체인의 getFilters()로 실제 필터 목록(JwtAuthenticationFilter 등)을 꺼내서 차례로 실행
```

`SecurityFilterChain` 인터페이스가 딱 `matches()`/`getFilters()` 두 메서드만 가진 이유가 여기서 설명된다 — `FilterChainProxy`가 "이 요청에 맞는 체인 찾기 + 그 체인의 필터 꺼내기"라는 두 가지 일만 하면 되기 때문이다.

:::tip 빈 생성과 런타임 사용은 다른 메커니즘
Phase 1은 Spring 컨테이너의 DI 해석(타입 기반 조회, 싱글턴 캐싱)이고, Phase 2는 이미 만들어진 객체의 평범한 메서드 호출(리스트 순회 + 매칭)이다. 매 요청마다 Spring 컨테이너가 다시 끼어드는 게 아니다.
:::

## 6. `List<T>` 주입과 단일 타입 주입의 차이

`setFilterChains`가 `List<SecurityFilterChain>`이 아니라 단일 `SecurityFilterChain`을 받는 형태였다면 어땠을까. 후보 빈이 2개 이상 있으면 Spring은 추측하지 않는다 — **부팅 시점에 즉시 실패**한다.

```
NoUniqueBeanDefinitionException: expected single matching bean but found 2: securityFilterChain, test
```

이건 런타임에 요청이 들어왔을 때 터지는 게 아니라 애플리케이션이 뜨는 시점에 fail-fast로 처리된다. 모호한 의존성을 "알아서 적당히 골라서 동작은 시켜준다" 방식으로 처리하는 일은 없다.

단일 타입으로 좁히는 명시적인 방법은 있다.

- **`@Primary`** — 후보 빈 메서드 중 하나에 붙이면 "단일 주입 요청엔 이게 기본값"이라고 선언
- **`@Qualifier("beanName")`** — 주입받는 쪽에서 "이름이 이거인 빈을 달라"고 명시
- 주입받는 변수/파라미터 이름이 후보 빈 이름 중 하나와 정확히 일치하면 자동 매칭되는 보조 규칙도 있음

`WebSecurityConfiguration`이 굳이 `List<T>`로 받는 이유가 여기서 나온다. 여러 개의 `SecurityFilterChain`(예: `/api/**`는 JWT 인증, `/admin/**`는 다른 방식)을 두는 건 에러 상황이 아니라 **의도된 설계**다. 단일 타입으로 받았다면 체인을 2개 이상 만드는 순간 매번 `@Primary`/`@Qualifier`로 충돌을 해소해야 했을 텐데, `List<T>`는 "몇 개든 다 가져온다"가 설계 의도라서 그런 충돌이 원천적으로 발생하지 않는다.
