---
title: Snack - [Spring] Clock 주입으로 시간 의존 테스트 풀기 — @Value 빈 생명주기와 final 필드
tags: ['Java', 'Spring', 'Test']
---

## 개요

`JwtProvider.generateAccessToken`을 테스트하려는데, 내부에서 매 호출마다 `new Date()`를 써서 같은 입력으로도 매번 다른 토큰이 나온다는 문제에 부딫혔다. 이걸 풀어가는 과정에서 `java.time.Clock` 주입 패턴, `@Value` 필드 주입과 Spring 빈 생명주기, `final` 필드와 생성자 주입의 관계까지 함께 정리하게 됐다.

## 문제 상황

```java
private String generateToken(Long userId, long expiration) {
    Date now = new Date();
    return Jwts.builder()
            .subject(String.valueOf(userId))
            .issuedAt(now)
            .expiration(new Date(now.getTime() + expiration))
            .signWith(secretKey)
            .compact();
}
```

`Date now`가 호출 시각에 따라 매번 달라지므로, 토큰의 `issuedAt`/`expiration` claim도 매번 달라지고 최종 JWT 문자열(서명 포함)도 매번 다르게 인코딩된다. 그래서 "생성된 문자열이 토씨 하나 안 틀리고 동일한지" 같은 검증은 애초에 성립하지 않는 명제다.

`Date`는 콘크리트 클래스라 Mockito로 직접 목업하기도 까다롭다 (`mockConstruction` 같은 무거운 장치가 필요). 1차로 떠올린 대안은 시간을 통제하지 않고 **허용 오차(tolerance)** 를 두는 방식이었다 — 호출 전/후 시각을 테스트 코드에서 직접 찍어두고, 토큰을 까서 나온 `issuedAt`이 그 구간 안에 들어오는지만 확인하는 식. 다만 이건 "정확히 통제"가 아니라 "근사적으로 검증"이라 근본적인 해법은 아니었다.

## java.time.Clock으로 시간을 주입 가능한 의존성으로 만들기

더 근본적인 해법은 `new Date()`를 직접 호출하는 대신, 시간 소스 자체를 외부에서 주입받는 것이다. JDK는 이를 위한 표준 추상화로 `java.time.Clock`을 제공한다.

- `Clock.systemUTC()` — 운영에서 쓸 실제 시간
- `Clock.fixed(Instant, ZoneId)` — 테스트에서 시간을 완전히 고정

```java
Clock fixedClock = Clock.fixed(Instant.parse("2026-06-17T00:00:00Z"), ZoneOffset.UTC);
```

이렇게 고정해두면 `issuedAt`/`expiration`이 정확히 예측 가능한 값이 되어, 더 이상 tolerance 없이 "정확히 이 값"으로 검증할 수 있다.

:::tip 그래도 완전히 똑같진 않을 수 있다 — JWT는 초 단위까지만 저장한다
`Clock`으로 시간을 완전히 고정했는데도 `isEqualTo` 비교가 실패하는 경우가 있다. JWT 스펙(RFC 7519)의 `iat`/`exp`(NumericDate)는 **초 단위**로 정의되어 있어서, JJWT가 토큰을 인코딩할 때 밀리초를 truncate한다. 그래서 디코딩한 `claims.getIssuedAt()`은 밀리초가 항상 `0`인 `Date`인데, 비교 대상으로 만든 `Date.from(clock.instant())`는 (seed `Instant`에 밀리초가 남아있다면) 그대로 밀리초를 갖고 있어서 둘이 어긋난다.

해결책 1 — AssertJ의 `isCloseTo`로 허용 오차를 두기:
```java
assertThat(claims.getIssuedAt()).isCloseTo(Date.from(clock.instant()), 1000); // 1초 이내 허용
```

해결책 2 — 비교 대상도 JWT와 동일하게 초 단위로 truncate해서 정확히 맞추기:
```java
Date expected = Date.from(clock.instant().truncatedTo(ChronoUnit.SECONDS));
assertThat(claims.getIssuedAt()).isEqualTo(expected);
```

`isCloseTo`가 "JWT는 초 단위까지만 보장한다"는 의도를 코드에 더 명확히 드러내기 때문에 보통 더 선호된다.
:::

### 처음 시도: secretKey와 같은 패턴 (필드 + @PostConstruct)

`JwtProvider`엔 이미 비슷한 패턴이 있었다 — `secretKey`를 `@PostConstruct`에서 초기화하는 코드. 그래서 처음엔 `Clock`도 똑같이 따라갔다.

```java
private Clock clock;

@PostConstruct
public void init() {
    this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    clock = Clock.systemUTC();
}
```

근데 이 방식은 테스트할 때 `ReflectionTestUtils.setField(provider, "clock", Clock.fixed(...))`로 `init()`이 채운 값을 덮어써야 한다 — 정확히 `secretKey` 때문에 reflection이 필요했던 문제를 `Clock`에도 그대로 옮겨놓은 것뿐이었다. 애초에 시간 의존 테스트가 어려워서 `Clock` 작업을 시작한 거였는데, 같은 패턴을 또 적용하면 문제를 해결한 게 아니라 필드 하나를 더 늘린 셈이 된다.

:::tip secretKey는 왜 어쩔 수 없이 이 패턴인가
`jwtSecret`은 `@Value` 필드 주입 방식이라 생성자 호출 시점엔 아직 `null`이다 (아래 빈 생명주기 참고). 그래서 `secretKey` 변환은 구조적으로 `@PostConstruct`까지 미뤄야 한다. 반면 `Clock`은 생성자 시점에 바로 받을 수 있는 값이라, 같은 제약이 적용될 이유가 없다.
:::

### 더 나은 해법: 생성자 주입

```java
private final Clock clock;

public JwtProvider(Clock clock) {
    this.clock = clock;
}
```

이러면 테스트에서 `new JwtProvider(Clock.fixed(...))`로 끝난다 — reflection이 전혀 필요 없다. `Clock`을 클래스가 스스로 만드는 게 아니라 **외부에서 받기만** 하기 때문에, 운영에서는 Spring이 등록된 `Clock` 빈(`Clock.systemUTC()`)을 넣어주고, 테스트에서는 직접 원하는 값을 넣어줄 수 있다. 이게 의존성 주입이 테스트 가능성을 만들어주는 핵심이다 — Spring이 있어야만 성립하는 개념이 아니라, "의존성을 내부에서 만들지 않고 외부에서 받는다"는 원칙 자체가 핵심이다.

생성자에 파라미터를 추가해도 `@Value` 필드 주입은 그대로 동작한다. 생성자 인자 주입과 필드 주입(`@Value`)은 같은 빈 안에 공존할 수 있다.

## @Value 필드 주입과 Spring 빈 생명주기

`secretKey`가 왜 `@PostConstruct`까지 미뤄져야 했는지를 정확히 이해하려면 빈 생명주기 순서를 봐야 한다.

```
1. 빈 정의 등록 (컴포넌트 스캔, 메타데이터 — 인스턴스 생성 훨씬 이전)
2. 생성자 호출 → 인스턴스 생성 (이 시점 필드는 모두 기본값: null / 0 / false)
3. @Value 필드 주입 → jwtSecret 등 실제 값으로 채워짐
4. @PostConstruct(init()) 호출 → 이제서야 jwtSecret을 안전하게 쓸 수 있음
5. 초기화 완료 → "완성된 빈"으로 취급, 다른 곳에 주입되거나 조회 가능해짐
```

**1번과 2~5번은 다른 개념이다.** "빈 등록"은 `@Component`를 컴포넌트 스캔으로 발견해 "이 클래스는 빈이 될 거다"라고 메타데이터를 기록하는 것이고, 실제 인스턴스를 만들고 의존성을 채우는 2~5번은 그 빈 정의를 가지고 인스턴스를 초기화하는 별개의 과정이다.

핵심은: 생성자가 실행되는 시점(2번)에 `jwtSecret`은 아직 `null`이다. `@Value` 필드 주입(3번)은 생성자가 끝난 *후에* 리플렉션으로 일어나기 때문이다. 그래서 생성자 안에서 `Keys.hmacShaKeyFor(jwtSecret.getBytes(...))`를 시도하면 `NullPointerException`이 난다 — 주입이 끝났다고 보장되는 가장 빠른 시점인 `@PostConstruct`(4번)까지 미뤄야 하는 이유다.

:::tip 필드 주입이 아니라 생성자 파라미터로 받았다면?
```java
public JwtProvider(@Value("${jwt.secret}") String jwtSecret) {
    this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
}
```
이 경우엔 Spring이 생성자를 호출하기 *전에* `${jwt.secret}` 값을 resolve해서 인자로 넘겨주므로, 생성자 안에서 바로 `secretKey`를 만들 수 있다. 즉 `@PostConstruct`가 필요했던 건 Spring 빈이라서 어쩔 수 없는 게 아니라, **필드 주입 방식을 선택했기 때문**에 생긴 제약이다.
:::

덧붙여 `@PostConstruct`에서 `secretKey`를 매번 새로 계산하지 않고 한 번만 변환해서 캐싱해두는 효과도 있고, `Keys.hmacShaKeyFor()`가 키 길이를 검증해 너무 짧으면 `WeakKeyException`을 던지기 때문에 — 그 변환이 앱 시작 시점(`@PostConstruct`)에 일어나면 잘못된 시크릿으로는 **애플리케이션이 아예 뜨지 못하고 fail-fast** 한다는 부가 이득도 있다.

## final 필드와 생성자 주입의 관계

`@PostConstruct`에서 할당하는 필드(`secretKey`, 초기 버전의 `clock`)는 **`final`로 선언할 수 없다.** Java는 `final` 인스턴스 필드를 생성자(또는 인스턴스 초기화 블록)가 끝나는 시점까지 정확히 한 번 확정 할당해야 한다고 강제하는데, `@PostConstruct` 메서드는 생성자가 끝난 *이후*에 호출되는 일반 메서드라 그 시점엔 `final` 필드에 손댈 수 없다 (컴파일 에러).

반면 생성자 주입으로 받는 필드는 생성자 본문에서 할당이 끝나므로 `final`로 선언 가능하다.

```java
private final Clock clock;            // OK — 생성자에서 할당
public JwtProvider(Clock clock) { this.clock = clock; }
```

```java
private final Clock clock;            // 컴파일 에러
@PostConstruct
public void init() { this.clock = Clock.systemUTC(); }  // 생성자 이후라 final 할당 불가
```

즉 "필드 + `@PostConstruct`" 패턴은 구조적으로 항상 가변(mutable) 필드를 만들고, 생성자 주입은 불변성까지 함께 얻을 수 있다는 차이가 있다.

## @Configuration / @Bean

`Clock`은 우리가 만든 클래스가 아니라 JDK 표준 타입이라, Spring이 컴포넌트 스캔만으로는 "어떻게 만들어야 하는지"(`systemUTC()`인지 `fixed(...)`인지) 알 방법이 없다. 그래서 직접 레시피를 알려줘야 한다.

```java
@Configuration
public class ClockConfig {

    @Bean
    public Clock clock() {
        return Clock.systemUTC();
    }
}
```

`@Configuration`은 `@Component`를 기반으로 한 애너테이션이라 컴포넌트 스캔으로 자동 감지되고, 그 안의 `@Bean` 메서드 반환값이 컨테이너에 빈으로 등록된다. 이게 없으면 `JwtProvider` 생성자가 `Clock`을 요구할 때 Spring이 `NoSuchBeanDefinitionException`으로 시작 자체를 실패시킨다.

:::tip CGLIB 프록시와 싱글톤 보장
`@Configuration` 클래스는 Spring이 내부적으로 CGLIB 프록시로 감싼다. 같은 클래스 안에서 `@Bean` 메서드가 다른 `@Bean` 메서드를 Java 코드로 직접 호출해도, 진짜로 새 인스턴스를 또 만드는 게 아니라 이미 등록된 싱글톤을 가로채 반환한다. `ObjectMapper`, `RestTemplate`처럼 외부/JDK 타입을 주입받고 싶을 때 항상 등장하는 패턴이다.
:::

## 정리

| 필드 | 주입 방식 | final 가능? | 이유 |
|---|---|---|---|
| `jwtSecret` | `@Value` 필드 주입 | - | 생성자 시점엔 아직 없는 값이라 구조상 필드 주입 |
| `secretKey` | `@PostConstruct`에서 파생 | 불가 | `jwtSecret`이 생성자 이후에야 준비되므로 변환도 생성자 이후로 미뤄짐 |
| `clock` | 생성자 주입 | 가능 | 생성자 시점에 바로 받을 수 있는 값이라 굳이 미룰 필요 없음 |

시간이든 시크릿이든 "이 값을 클래스가 스스로 만드는가, 아니면 외부에서 받는가"가 테스트 가능성을 가르는 핵심이었다. 같은 클래스 안에서도 값의 성격에 따라 주입 방식이 달라질 수 있고, 그 선택이 `final` 가능 여부와 reflection 필요 여부까지 그대로 이어진다는 게 이번에 정리한 핵심이다.
