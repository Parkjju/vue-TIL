---
title: Snack - [Java] nimbus JWKSource로 Apple identityToken 검증하기
tags: ['Java', 'Spring', 'Security']
---

## 개요

Apple Sign In의 `identityToken`(JWT)을 서버에서 검증하려면 Apple이 공개한 JWKS(JSON Web Key Set)에서 공개키를 가져와 서명을 확인해야 한다. `nimbus-jose-jwt` 라이브러리의 `JWKSource`, `JWKSourceBuilder`를 사용해 이 과정을 구현하면서 정리한 개념과 코드.

## JWK / JWKS 개념

-   **JWK (JSON Web Key)**: 암호화 키(공개키/개인키)를 JSON으로 표현하는 표준 포맷. RSA, EC 등 키 종류와 모듈러스/지수 값 등을 담는다.
-   **JWKS (JWK Set)**: 여러 개의 JWK를 배열로 담은 JSON. Apple은 `https://appleid.apple.com/auth/keys`에서 자신이 토큰 서명에 사용하는 공개키들의 집합을 공개한다.
-   여러 개인 이유: IdP(Apple)는 보안을 위해 서명용 키를 주기적으로 교체(rotation)한다. 교체 과도기에는 신/구 키가 동시에 JWKS에 존재할 수 있다.

### 비대칭키 기반 검증 구조

-   Apple은 **개인키**로 `identityToken`(JWT)에 서명한다.
-   우리 서버는 Apple이 공개한 **공개키**로 그 서명을 검증한다.
-   즉 Apple만이 토큰을 발급할 수 있고, 우리는 그 토큰이 진짜 Apple이 발급한 것인지만 확인할 수 있다 (공개키로는 위조 불가).

## kid (Key ID)

JWT 헤더에 들어있는 필드로, "이 토큰이 어떤 키로 서명됐는지"를 식별하는 문자열이다.

```json
{ "alg": "RS256", "kid": "W6WcOKB" }
```

JWKS에는 여러 개의 키가 들어있으므로, 검증 측은 받은 토큰의 `kid`로 JWKS에서 매칭되는 키 하나를 찾아야 한다. 키 교체 시 Apple은 새 `kid`로 서명을 시작하므로, 기존에 캐시해둔 JWKS에 새 `kid`가 없으면 재조회가 필요하다.

## JWKSource\<C\>

"조건에 맞는 JWK를 찾아서 돌려주는 객체"에 대한 인터페이스.

-   핵심 메서드: `get(JWKSelector selector, C context)` → 조건(주로 `kid`)에 맞는 JWK 목록 반환
-   `JWKSourceBuilder`로 만든 구현체는 Apple JWKS 엔드포인트에서 받아온 키 목록을 캐싱해두고, `get()` 호출 시 그 캐시에서 검색한다.

## SecurityContext (= C)

`JWKSource<C>`의 제네릭 타입 파라미터로, "이 키 조회 요청이 어떤 맥락에서 온 건지" 추가 정보를 넘기기 위한 자리다. 메서드가 없는 빈 마커 인터페이스에 가깝다.

### 왜 멀티테넌트 용도인가

여러 IdP/여러 고객사를 다루는 시스템(멀티테넌트)을 예로 들면:

-   B2B SaaS의 SSO: 회사 A는 Okta, 회사 B는 Azure AD, 회사 C는 Google Workspace를 IdP로 사용 → 유저가 로그인하면 "이 유저는 회사 A 소속이니 Okta JWKS를 봐야 한다"는 판단이 필요
-   여러 소셜 로그인 동시 지원: Apple 토큰 → Apple JWKS, Google 토큰 → Google JWKS, Kakao 토큰 → Kakao JWKS

이때 `SecurityContext`에 "회사 A" 또는 "Google provider" 같은 정보를 담아 넘기면, `JWKSource` 구현체가 그 정보를 보고 올바른 키 소스로 분기할 수 있다.

```java
class MultiIdpJWKSource implements JWKSource<TenantContext> {
    Map<String, JWKSource<TenantContext>> sourcesByTenant;

    public List<JWK> get(JWKSelector selector, TenantContext context) {
        String tenantId = context.getTenantId();          // 분기 키
        JWKSource<TenantContext> target = sourcesByTenant.get(tenantId); // 분기는 여기서!
        return target.get(selector, context);
    }
}
```

`SecurityContext`(`= context`)는 "분기 판단에 필요한 정보를 운반"하는 역할만 하고, 실제 분기 로직(Map 조회 등)은 개발자가 작성한 `JWKSource` 구현체 코드 안에 있다.

:::tip 왜 그래도 제네릭은 지정해야 하나
멀티테넌트 기능을 안 쓰더라도, 라이브러리가 범용적으로 제네릭 인터페이스로 설계되어 있어서 타입 파라미터를 비워두면(raw type) 컴파일러 경고가 발생한다. 특별한 컨텍스트가 필요 없다면 가장 기본 타입인 `SecurityContext` 자체를 타입 파라미터로 쓰고, `get()` 호출 시 `context` 자리에 `null`을 넘기면 된다.
:::

## Apple 하나만 쓰는 경우의 선택

Apple/Google/Kakao처럼 **고정된 소수의 알려진 Provider**라면, `SecurityContext` 기반 분기보다 Provider별로 클라이언트를 분리하는 게 단순하다.

-   `AppleAuthClient` → JWKSource #1 (Apple JWKS)
-   `GoogleAuthClient` → JWKSource #2 (Google JWKS)
-   `KakaoAuthClient` → JWKSource #3 (Kakao JWKS)

`AuthService`에서 로그인 요청의 provider 타입을 보고 어떤 클라이언트를 호출할지 분기하면 끝난다.

`SecurityContext` 기반 멀티테넌트 패턴은 Provider 목록이 코드 작성 시점에 고정되어 있지 않고 **런타임에 동적으로 등록되는 경우**(엔터프라이즈 SSO 등)에 필요하다.

## JWKSourceBuilder로 구현

```java
@Component
public class AppleAuthClient {
    private JWKSource<SecurityContext> jwkSource;

    private static final String KEY_ADDRESS = "https://appleid.apple.com/auth/keys";

    @PostConstruct
    public void init() throws URISyntaxException, MalformedURLException {
        URL url = new URI(KEY_ADDRESS).toURL();
        this.jwkSource = JWKSourceBuilder.<SecurityContext>create(url)
                .cache(Duration.ofDays(1).toMillis(), JWKSourceBuilder.DEFAULT_CACHE_REFRESH_TIMEOUT)
                .build();
    }
}
```

### cache(timeToLive, cacheRefreshTimeout)

`JWKSourceBuilder.cache(long, long)`는 빌더 자신을 반환하는 fluent builder 메서드다. 누적된 설정은 마지막 `.build()` 호출 시점에 한 번에 조합되어 실제 `JWKSource` 구현체가 생성된다.

두 파라미터는 모두 밀리초 단위지만 의미가 다르다.

| 파라미터              | 기본값          | 의미                                                                 |
| --------------------- | --------------- | -------------------------------------------------------------------- |
| `timeToLive`           | 5분 (`300_000`) | 캐시된 JWK Set을 얼마나 오래 신선하다고 볼지 — 정책적으로 조정하는 값 |
| `cacheRefreshTimeout`  | 15초 (`15_000`) | TTL이 지나 재조회할 때, 그 HTTP 호출 자체의 네트워크 타임아웃          |

`cacheRefreshTimeout`은 "정책"이 아니라 "네트워크 호출 타임아웃"이므로 보통 기본값을 그대로 둔다. TTL만 정책에 맞게(예: 1일) 조정하는 것이 일반적이다.

### @PostConstruct에서 checked exception을 그대로 던지는 이유

`new URI(KEY_ADDRESS).toURL()`에서 발생할 수 있는 `URISyntaxException`/`MalformedURLException`은 **하드코딩된 URL 문자열을 파싱하는 과정**에서 나는 것으로, 네트워크 문제가 아니라 코드 자체의 오류다. 재시도해도 결과가 달라지지 않는다.

이런 경우는 fail-fast가 맞다 — 빈 생성 시점에 예외를 던져 애플리케이션 기동을 막는 것이, 런타임에 이상 동작으로 이어지는 것보다 훨씬 빨리 문제를 발견할 수 있다.

:::warning JWKS fetch 실패는 별개 문제
URL 생성 실패(코드 오류)와 JWKS fetch 실패(네트워크 타임아웃 등)는 다른 레이어다. 후자는 `cacheRefreshTimeout`, `retrying()`, `outageTolerant()` 같은 빌더 옵션으로 다루는 영역이다.
:::

## 검증 흐름 정리

1. `identityToken`(JWT) 헤더를 파싱해 `kid` 추출
2. `jwkSource.get(selector, context)` 호출 — `kid` 기준 `JWKSelector`로 매칭되는 JWK 조회 (캐시에 없으면 재조회)
3. 조회한 JWK → `RSAKey` → `RSASSAVerifier` 생성
4. `signedJWT.verify(verifier)`로 서명 검증
5. 통과 시 `iss`/`aud`/`exp` 클레임 검증 후 `sub`(Apple 고유 유저 ID) 추출
