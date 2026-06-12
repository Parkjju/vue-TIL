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

1. `identityToken`(JWT) 헤더를 파싱해 `kid`/`alg` 추출
2. `alg`이 `RS256`인지 화이트리스트 체크 (algorithm confusion 방지)
3. `jwkSource.get(selector, context)` 호출 — `kid` 기준 `JWKSelector`로 매칭되는 JWK 조회 (캐시에 없으면 재조회)
4. 조회한 JWK → `RSAKey` → `RSAPublicKey` → `RSASSAVerifier` 생성
5. `signedJWT.verify(verifier)`로 서명 검증
6. 통과 시 `iss`/`aud`/`exp` 클레임 검증 후 `sub`(Apple 고유 유저 ID)/`email` 추출

아래부터는 각 단계를 구현하면서 정리한 세부 개념이다.

## SignedJWT — 파싱 + 검증을 한 객체로

`identityToken`은 `header.payload.signature` 형태의 compact 문자열일 뿐이다. `SignedJWT.parse(identityToken)`으로 변환하면:

- `.getHeader().getKeyID()` / `.getHeader().getAlgorithm()`으로 헤더 값에 구조적으로 접근
- `.getJWTClaimsSet()`으로 `iss`/`aud`/`exp`/`sub`/`email` 등 payload 클레임을 객체로 추출
- `.verify(verifier)`로 서명 검증 — `header.payload` 원본 바이트(raw signing input)를 객체가 내부적으로 보관하고 있어서, base64url 디코딩/바이트 처리를 직접 할 필요가 없다

즉 "파싱된 구조 + 검증 기능"을 한 객체로 묶어주는 래퍼다.

## alg 화이트리스트 체크 — algorithm confusion 방지

`kid`로 JWK를 조회할 때 `JWKMatcher`에 `algorithm(alg)` 조건을 넣을 수도 있지만, 권장하지 않는다.

- Apple JWKS의 `kid`는 이미 유일하므로 `alg` 조건을 추가해도 매칭 결과가 더 좁아지지 않는다
- 오히려 JWK 항목에 `alg` 필드가 없거나 표기가 다르면 매칭이 실패할 수 있다

대신 **헤더의 `alg`을 우리가 기대하는 값(`RS256`)과 별도로 비교**한다.

```java
Algorithm alg = signedJWT.getHeader().getAlgorithm();
if (alg == null || !alg.equals(JWSAlgorithm.RS256)) {
    throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_ALGORITHM_INVALID);
}
```

- `Algorithm`은 `equals()`가 알고리즘 이름(문자열) 기준으로 오버라이드되어 있어서 `.equals()`로 안전하게 비교 가능
- 이게 바로 **algorithm confusion 공격**(예: `alg: none`, 또는 RS256↔HS256 키 혼동)을 막는 핵심 방어선이다. JWK 매칭과는 별개의 보안 검증이므로 분리해서 처리한다.

## JWKMatcher / JWKSelector / SecurityContext — kid로 키 조회

```java
String kid = signedJWT.getHeader().getKeyID();
JWKMatcher jwkMatcher = new JWKMatcher.Builder().keyID(kid).keyType(KeyType.RSA).build();
JWKSelector jwkSelector = new JWKSelector(jwkMatcher);
List<JWK> listOfJwk = jwkSource.get(jwkSelector, null);
```

- `JWKMatcher` = 검색 조건(`kid` 일치 + RSA 키 타입)
- `JWKSelector` = 그 조건을 `jwkSource.get()`이 받는 형식으로 감싸는 wrapper
- `jwkSource.get(selector, context)`의 두 번째 인자는 `SecurityContext`(앞서 정리한 멀티테넌트용 마커 인터페이스)인데, `JWKSourceBuilder`로 만든 단일 Provider용 소스는 이 값을 쓰지 않으므로 `null`을 넘기는 게 일반적이다
- `keyType(KeyType.RSA)`를 추가하면, 이후 `(RSAKey) jwk` 다운캐스팅이 항상 안전해진다 (Apple이 향후 키 타입을 바꿔도 매칭 단계에서 걸러짐)

리스트가 비어있으면 그 `kid`에 대응하는 키가 없다는 뜻이므로 검증 실패로 처리한다.

## JWK → RSAPublicKey 변환과 다운캐스팅

`JWK`는 추상 베이스 클래스이고, `RSAKey`/`ECKey`/`OctetSequenceKey` 등은 키 종류별 서브클래스다. `toRSAPublicKey()`는 `RSAKey`에만 있는 메서드라 캐스팅이 필요하다.

```java
JWK jwk = listOfJwk.getFirst();
RSAKey rsaKey = (RSAKey) jwk;                 // 다운캐스팅
RSAPublicKey rsaPublicKey = rsaKey.toRSAPublicKey(); // JOSEException 가능
```

`JWKMatcher`에 `keyType(KeyType.RSA)`를 넣어뒀기 때문에, 여기서 `ClassCastException`이 날 가능성은 매칭 단계에서 이미 제거된 상태다.

## RSASSAVerifier — 서명 "검증"이 의미하는 것

```java
JWSVerifier jwsVerifier = new RSASSAVerifier(rsaPublicKey);
if (!signedJWT.verify(jwsVerifier)) {
    throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_INVALID);
}
```

**왜 `kid`를 위조해도 토큰을 위조할 수 없는가**

공격자가 헤더의 `kid`를 Apple의 실제 키 ID와 동일하게 써넣고, 자신이 가진 임의의 키로 RS256 서명을 만들어 보내도:

- JWKS에 있는 건 그 `kid`에 대응하는 **공개키**뿐이다. 공개키로는 서명을 "생성"할 수 없고 "검증"만 할 수 있다
- 서명을 생성하려면 그 `kid`와 짝을 이루는 **Apple의 개인키**가 필요한데, 이건 Apple 내부에만 존재한다
- 서버는 그 `kid`에 대응하는 **공개키로 서명을 검증**한다 → 공격자의 개인키로 만든 서명은 Apple 공개키와 매칭되지 않음 → `verify()`가 `false`

즉 `kid`는 "어떤 공개키를 쓸지" 알려주는 식별자일 뿐이고, 실제 보안은 `verify()`가 "이 서명이 그 공개키와 짝이 되는 개인키로 만들어졌는가"를 수학적으로 확인하는 데서 나온다. **`list.get(0)`으로 꺼낸 `JWK`가 곧 "Apple이 그 토큰에 서명할 때 사용한 개인키와 짝을 이루는 공개키"**다.

## claims 검증 — null-safe 비교 패턴

```java
JWTClaimsSet jwtClaimsSet = signedJWT.getJWTClaimsSet();

if (!appleHost.equals(jwtClaimsSet.getIssuer())) {
    throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_INVALID);
}

List<String> aud = jwtClaimsSet.getAudience();
if (aud == null || !aud.contains(appId)) {
    throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_INVALID);
}

Date exp = jwtClaimsSet.getExpirationTime();
if (exp == null || exp.before(new Date())) {
    throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_INVALID);
}
```

- **`iss`**: `"https://appleid.apple.com".equals(claims.getIssuer())`처럼, **null이 아닐 게 확실한 리터럴/상수를 `.equals()`의 호출 주체(왼쪽)에 두는 패턴**이다. `getIssuer()`가 `null`을 반환해도 `String.equals(null)`은 예외 없이 `false`를 반환하므로, 별도 null 체크 없이 "값이 없으면 검증 실패"로 자연스럽게 처리된다. 반대로 `claims.getIssuer().equals(appleHost)`로 쓰면 `getIssuer()`가 `null`일 때 `NullPointerException`이 발생한다.
- **`aud`**: JWT 표준(RFC 7519)상 `aud`는 배열일 수 있다. 우리 client_id(iOS Bundle ID)가 그 배열 안에 "포함되어 있는지"가 검증의 본질이므로 `.contains()`를 쓴다. `get(0)`으로 첫 번째 값만 보는 것보다 안전하다.
- **`exp`**: `Date`에는 `String.equals(null)` 같은 null-safe 메서드가 없으므로, `exp == null ||`을 앞에 붙여 단락 평가(short-circuit)로 NPE를 막는다.

nonce는 iOS 클라이언트가 `ASAuthorizationAppleIDRequest.nonce`를 설정해서 보내는 경우에만 필요한 replay 공격 방지용 검증인데, 이 프로젝트의 `AppleSignInRequest`는 `identityToken`만 받으므로 생략했다.

## 예외 처리 — ParseException / JOSEException 통일

`SignedJWT.parse()`(`ParseException`), `rsaKey.toRSAPublicKey()`(`JOSEException`), `jwkSource.get()`(`KeySourceException`)은 모두 checked exception이다. 메서드 전체를 하나의 try로 감싸고 multi-catch로 묶는다.

```java
public AppleIdentity verifyIdentityToken(String identityToken) {
    try {
        // ... 위의 모든 검증 단계 ...
        return new AppleIdentity(jwtClaimsSet.getStringClaim("email"), jwtClaimsSet.getSubject());
    } catch (ParseException | JOSEException e) {
        log.warn("Identity Token 처리 중 예외 발생: {}", e.getMessage());
        throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_INVALID);
    }
}
```

- `KeySourceException`은 `JOSEException`의 서브타입이라 별도 catch가 필요 없다
- 개별 호출마다 wrapper 메서드를 만드는 대신, "이 메서드 안에서 발생하는 파싱/키 변환 예외는 모두 '유효하지 않은 토큰'으로 귀결된다"는 의미로 메서드 전체를 감쌌다 — nest가 1단계만 늘어나고 분기별 wrapper가 불필요하다
- 검증 도중 명시적으로 던지는 `BusinessException`(unchecked)은 이 catch에 걸리지 않으므로, 분기별로 다른 로그 메시지를 남기는 기존 구조와 충돌하지 않는다

**로그 레벨**: 모든 검증 실패는 `log.warn`이다. 알고리즘 불일치, 서명 실패, iss/aud 불일치, 만료, 파싱 실패는 모두 "클라이언트가 보낸 토큰이 잘못됐다"는 의미이고, 서버 코드 자체는 정상 동작 중이다. `log.error`는 Apple JWKS 엔드포인트 자체가 응답하지 않는 등 서버/인프라 문제에만 쓴다. 모니터링에서 `error`에 알림을 걸어두는 경우가 많은데, 클라이언트의 잘못된 토큰 하나마다 `error`로 찍히면 알람 피로가 생기고 진짜 서버 문제가 묻힌다.

## AppleIdentity record와 email 수집

```java
/**
 * identity 토큰에서 받는 값들
 * @param email 유저 이메일
 * @param sub Apple 고유 ID
 */
public record AppleIdentity(String email, String sub) {
}
```

Java에는 기본 제공 튜플이 없어서, 여러 값을 묶어 반환할 때는 `record`가 자연스럽다. `AbstractMap.SimpleEntry`도 가능하지만 `.getKey()`/`.getValue()`만 있어서 어떤 값이 무엇인지 호출부에서 헷갈리기 쉽다.

`email`은 Apple identity token의 `email` 클레임이 **최초 로그인 시점에만** 내려오고 이후 로그인에는 없을 수 있다. 인증 로직 자체에는 `sub`만 있으면 충분하지만, 신규 가입 시점에 `User.email`(NOT NULL UNIQUE) 컬럼을 채워야 하고 추후 이메일 발송 등에 쓸 수도 있어서, `verifyIdentityToken`의 반환값에 `email`도 함께 포함시켰다.

## 최종 코드

```java
package com.rta.dignify.client.apple;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.*;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.JWKSourceBuilder;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.rta.dignify.dto.auth.AppleIdentity;
import com.rta.dignify.global.exception.BusinessException;
import com.rta.dignify.global.exception.ErrorCode;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;
import java.time.Duration;
import java.util.Date;
import java.util.List;

@Slf4j
@Component
public class AppleAuthClient {
    private JWKSource<SecurityContext> jwkSource;

    private static final String keyAddress = "https://appleid.apple.com/auth/keys";
    private static final String appleHost = "https://appleid.apple.com";
    private static final String appId = "parkjju.dignify";

    @PostConstruct
    public void init() throws URISyntaxException, MalformedURLException {
        URL url = new URI(keyAddress).toURL();
        this.jwkSource = JWKSourceBuilder.<SecurityContext>create(url)
                .cache(Duration.ofDays(1).toMillis(), JWKSourceBuilder.DEFAULT_CACHE_REFRESH_TIMEOUT)
                .build();
    }

    public AppleIdentity verifyIdentityToken(String identityToken) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(identityToken);
            Algorithm alg = signedJWT.getHeader().getAlgorithm();

            if (alg == null || !alg.equals(JWSAlgorithm.RS256)) {
                log.warn("JWS 알고리즘 불일치");
                throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_ALGORITHM_INVALID);
            }

            String kid = signedJWT.getHeader().getKeyID();
            JWKMatcher jwkMatcher = new JWKMatcher.Builder().keyID(kid).keyType(KeyType.RSA).build();
            JWKSelector jwkSelector = new JWKSelector(jwkMatcher);

            List<JWK> listOfJwk = jwkSource.get(jwkSelector, null);
            if (listOfJwk == null || listOfJwk.isEmpty()) {
                log.warn("JWK List is Empty");
                throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_INVALID);
            }

            JWK jwk = listOfJwk.getFirst();
            RSAKey rsaKey = (RSAKey) jwk;
            RSAPublicKey rsaPublicKey = rsaKey.toRSAPublicKey();
            JWSVerifier jwsVerifier = new RSASSAVerifier(rsaPublicKey);

            if (!signedJWT.verify(jwsVerifier)) {
                log.warn("signedJWT verify 실패");
                throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_INVALID);
            }

            JWTClaimsSet jwtClaimsSet = signedJWT.getJWTClaimsSet();

            if (!appleHost.equals(jwtClaimsSet.getIssuer())) {
                log.warn("Identity Token iss 불일치");
                throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_INVALID);
            }

            List<String> aud = jwtClaimsSet.getAudience();
            if (aud == null || !aud.contains(appId)) {
                log.warn("Identity Token appId 불일치");
                throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_INVALID);
            }

            // 이미 만료된 identityToken
            Date exp = jwtClaimsSet.getExpirationTime();
            if (exp == null || exp.before(new Date())) {
                log.warn("Identity Token 만료");
                throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_INVALID);
            }

            return new AppleIdentity(jwtClaimsSet.getStringClaim("email"), jwtClaimsSet.getSubject());
        } catch (ParseException | JOSEException e) {
            log.warn("Identity Token 처리 중 예외 발생: {}", e.getMessage());
            throw new BusinessException(ErrorCode.AUTH_IDENTITY_TOKEN_INVALID);
        }
    }
}
```

:::tip 더 고수준 API도 있다
nimbus의 `DefaultJWTProcessor` + `JWSVerificationKeySelector`를 쓰면 kid 추출 → 키 선택 → 서명 검증 → 알고리즘 검증을 `process()` 한 번으로 처리할 수 있다 (Spring Security의 `NimbusJwtDecoder`도 내부적으로 이 방식). 위 구현은 내부 동작을 이해하기 위해 단계별로 직접 작성한 것이고, 실무에서는 고수준 API로 대체 가능하다.
:::
