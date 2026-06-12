---
title: Snack - [Spring] Sign in with Apple, identityToken은 서버에서 어떻게 검증하나
tags: ['Spring', 'Security']
---

## 개요

iOS 앱에서 "Sign in with Apple"으로 받은 `identityToken`을 백엔드에서 어떻게 검증하는지 정리한다. `client_secret`이 왜 필요한 경우와 필요 없는 경우가 나뉘는지, 검증은 정확히 어떤 연산인지, 검증 후 그 토큰을 어떻게 활용하는지까지 다룬다.

## 1. client_secret이 필요한가?

OAuth2/OIDC에서 `client_secret`은 **앱(서버)의 신원을 증명**하는 값이다. 유저의 신원 증명이 아니다. Apple은 고정 문자열 대신 **p8 개인키로 서명한 JWT**를 `client_secret`으로 요구한다.

이게 필요한 시나리오는 **`authorization_code`를 Apple `/auth/token` 엔드포인트로 교환**하는 경우다. 보통 웹 기반 Sign in with Apple(JS SDK)이나, Apple로부터 직접 `access_token`/`refresh_token`을 받아야 할 때 쓰인다.

iOS 네이티브 앱은 다르다. `AuthenticationServices` 프레임워크가 기기에서 직접 Apple과 통신해서 인증을 끝내고, 그 결과로 **이미 Apple이 서명 완료한 `identityToken`(JWT)**을 클라이언트가 보유한 채로 받는다. 백엔드는 이 토큰이 "진짜 Apple이 서명한 게 맞나"만 확인하면 된다 — `client_secret` 없이 **공개키로 서명 검증만** 하면 끝.

:::tip p8 키는 언제 필요한가
회원탈퇴 시 Apple `/auth/revoke`를 호출해야 하는데, 이건 "우리가 Apple에게 요청을 보내는" 동작이라 우리 쪽 신원 증명(`client_secret`/p8)이 필요하다. 로그인 시점에는 불필요.
:::

## 2. 왜 클라이언트가 이미 받은 토큰을 서버가 또 검증하나

"검증 완료"의 의미를 구간별로 나눠봐야 한다.

- **Apple ↔ iOS 클라이언트**: Apple이 유저(Face ID/비밀번호)를 인증하고, 그 결과로 서명된 JWT를 클라이언트에 발급. 여기서 검증된 건 "이 사람이 진짜 Apple ID 소유자다"라는 사실.
- **iOS 클라이언트 ↔ 백엔드**: 이 구간은 Apple이 전혀 관여하지 않는다. 클라이언트가 뭘 보내든 백엔드 입장에서는 "네트워크로 들어온 바이트 덩어리"일 뿐이다.

클라이언트는 변조/우회/리플레이가 가능한 영역이다. 탈옥 기기에서 가짜 토큰을 만들거나, 과거에 가로챈 다른 사람의 토큰을 재전송할 수도 있다. 그래서 서버가 직접 서명을 재검증해야 "이 토큰이 진짜 Apple 개인키로 서명되었고, 우리 앱(`aud`)을 위한 것이며, 만료되지 않았다"를 보장할 수 있다.

이건 Apple 로그인만의 특수 케이스가 아니라 **클라이언트로부터 들어오는 모든 입력은 서버가 독립적으로 재검증한다**는 일반적인 Zero Trust 원칙이다.

## 3. 검증은 서버에서 직접 한다 (Apple에 물어보지 않음)

```
1. Apple JWKS 엔드포인트(GET https://appleid.apple.com/auth/keys)에서 공개키 목록 다운로드
   → 유일한 외부 네트워크 호출, 결과는 캐싱 (24시간 권장)

2. identityToken의 JWT 헤더에서 kid(key ID) 확인
   → 캐싱된 공개키 목록 중 해당 kid의 공개키 선택

3. 그 공개키로 identityToken의 서명을 로컬에서 직접 검증 (네트워크 호출 아님)

4. 서명 통과 시 payload의 iss/aud/exp/sub 클레임을 로컬에서 검증
```

"이 토큰 유효해?"라고 Apple에게 매번 물어보는 API는 없다. Apple이 공개한 공개키를 한 번 받아 캐싱해두고, 서버가 매 요청마다 로컬에서 암호학적으로 검증하는 구조다.

Java/Spring에서는 `nimbus-jose-jwt`의 `RemoteJWKSet` + `DefaultJWTProcessor`가 이 과정을 담당한다.

```java
RemoteJWKSet<SecurityContext> keySource =
    new RemoteJWKSet<>(new URL("https://appleid.apple.com/auth/keys"));

ConfigurableJWTProcessor<SecurityContext> jwtProcessor = new DefaultJWTProcessor<>();
jwtProcessor.setJWSKeySelector(
    new JWSVerificationKeySelector<>(JWSAlgorithm.RS256, keySource));

JWTClaimsSet claims = jwtProcessor.process(identityToken, null);
// iss, aud(bundle id), exp 검증 후 통과해야 claims 리턴
```

:::warning RS256 vs ES256
Apple JWKS는 **RSA 키(RS256)**다. `client_secret` 생성(p8, EC 키, ES256)과 `identityToken` 검증(RSA, RS256)을 혼동한 레퍼런스 글들이 종종 있다. 둘은 키 형식도 검증 연산도 완전히 다르므로, `JWSVerificationKeySelector`에 알고리즘을 잘못 지정하면 "키는 있는데 검증 실패" 같은 에러가 난다.
:::

## 4. 서명 검증이라는 연산의 의미

JWT는 `header.payload.signature` 구조다. 각 부분은 base64url로 인코딩된 JSON이고, 누구나 디코딩해서 내용을 볼 수 있다 — base64는 인코딩일 뿐 암호화가 아니다. 서명이 위조를 막아줄 뿐이다.

검증은 대략 이렇게 동작한다 (RS256 기준):

1. `header + "." + payload`를 SHA-256으로 해시 → `hash_A`
2. `signature`를 Apple의 RSA 공개키로 검증 연산 → `hash_B`
3. `hash_A == hash_B`면 통과 = "Apple 개인키 소유자가 서명한 게 맞다"

RSA는 공개키/개인키가 수학적으로 대칭적인 연산이라 "복호화"라는 비유가 어느 정도 통하지만, 정확한 용어는 **"verify"**다. ECDSA(ES256)는 "복호화"라는 연산 자체가 존재하지 않고 완전히 다른 절차(곡선 위의 점 연산)로 검증하기 때문에, "검증 = 복호화"라고 일반화하면 틀린다. JOSE/JWT 표준에서도 항상 "verify"라고 부르고 "decrypt"는 JWE(암호화된 payload)라는 별개 개념에서만 쓴다.

## 5. 검증과 페이로드 디코딩은 한 묶음으로 처리해야 한다

디코딩(base64 decode)과 서명 검증은 개념적으로는 별개의 연산이다. 디코딩은 암호학적 비밀이 필요 없는 단순 변환이라 서명이 가짜여도 가능하다.

하지만 "디코딩 먼저, 검증은 나중에"로 분리하면, 검증 전의 payload 값을 실수로 먼저 사용해버리는 위험이 생긴다. 위조된 토큰의 `sub`로 DB 조회/유저 생성이 일어날 수 있다.

그래서 `jwtProcessor.process(identityToken, null)`은 다음을 한 번에 처리한다.

1. payload 디코딩
2. 서명을 공개키로 검증
3. 검증 실패 시 예외를 던지고 끝 (디코딩 결과에 접근 불가)
4. 검증 성공해야만 `JWTClaimsSet`(디코딩된 payload) 리턴

**검증 통과 = 디코딩 결과를 신뢰해도 됨**이 보장되는 한 묶음의 작업으로 설계되어 있다.

## 6. 검증 후, 그 토큰으로 뭘 하나

검증이 끝나면 `identityToken` 자체는 더 쓸 일이 없다. payload에서 필요한 정보만 꺼내고 버린다 (DB에 저장하지 않음).

1. **클레임 추출**: `sub`(Apple 고유 유저 ID)가 핵심. `email`은 참고용.
2. **`sub`로 유저 식별/생성**: `UserAuth` 테이블에서 `provider="APPLE" AND providerUserId=sub`로 조회. 있으면 기존 `User`, 없으면 `User`+`UserAuth` 신규 생성 (닉네임은 서버에서 자동 생성).
3. **자체 JWT 발급**: 식별된 `User.id`를 기반으로 우리 서버가 서명한 access/refresh 토큰을 새로 발급 (HS256).
4. **refresh token 저장**: 평문이 아닌 SHA-256 해시로 `UserToken` 테이블에 저장.
5. **응답 반환**: `AuthTokenResponse(accessToken, refreshToken, expiresAt)`. 이후 모든 API 요청은 이 access token으로 인증한다.

정리하면, `identityToken`은 "문을 한 번 열어주는 1회용 열쇠"고, 문을 연 뒤에는 우리가 발급한 "우리만의 출입증"(자체 JWT)으로 갈아탄다.

## 7. 우리 자체 JWT는 왜 HS256(대칭키)인가

Apple의 `identityToken`은 RS256(비대칭)인데, 우리가 새로 발급하는 access/refresh token은 HS256(대칭)을 쓴다. 기준은 **"발급자와 검증자가 같은 주체인가"**다.

| | HMAC (HS256) | RSA/ECDSA (RS256/ES256) |
|---|---|---|
| 키 구조 | 서명/검증에 **동일한 비밀키** 사용 | 서명(개인키) / 검증(공개키) 분리 |
| 적합한 상황 | 발급자 = 검증자 (같은 서버) | 발급자 ≠ 검증자 (여러 외부 시스템이 검증) |
| 연산 비용 | 가벼움 (해시 연산) | 무거움 (모듈러 거듭제곱 등) |
| 키 관리 | secret 1개만 안전하게 보관 | 개인키/공개키 쌍 관리, 공개키 배포 |

- **Apple identityToken (RS256)**: Apple이 발급한 토큰을 전 세계 수많은 백엔드가 검증해야 한다. Apple이 모든 검증자에게 비밀키를 나눠줄 수 없으니, 공개키로 검증 가능한 비대칭 방식이 필수다.
- **우리 자체 JWT (HS256)**: 우리 서버가 발급하고, 우리 서버만 검증한다. 외부 누구도 검증할 필요가 없으므로 secret 하나만 안전하게 보관하면 충분하고, 공개키를 배포할 이유도 없다. 연산도 가벼워서 매 API 요청마다 검증해도 부담이 적다.

즉 **검증자가 자기 자신뿐이면 HMAC(대칭), 검증자가 불특정 외부 다수면 RSA/ECDSA(비대칭)**을 쓴다.

## 8. JwtProvider 구현 — 자체 access/refresh 토큰 발급/검증

`identityToken` 검증 후 발급하는 "우리만의 출입증"을 만드는 컴포넌트다. jjwt(`io.jsonwebtoken`) 기반.

### 초기화

```java
@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
```

- `@Value`로 주입되는 건 `application.properties`의 `jwt.secret`(환경변수 `${JWT_SECRET}`로 한 번 더 치환됨), `jwt.access-token-expiration`(1시간), `jwt.refresh-token-expiration`(30일)
- `jwt.secret`은 `String`이지만 jjwt의 `signWith()`은 `SecretKey` 타입을 요구하므로, `@PostConstruct`에서 `Keys.hmacShaKeyFor(byte[])`로 한 번만 변환해 캐싱
- `@PostConstruct`는 "생성자 호출 + `@Value` 필드 주입이 끝난 직후" 호출되는 게 핵심이다. 이 순서가 보장되어야 `secret`이 채워진 상태에서 `secretKey`를 만들 수 있다 (역순이면 NPE)

### 토큰 발급

```java
public String generateAccessToken(Long userId) {
    return generateToken(userId, accessTokenExpiration);
}

public String generateRefreshToken(Long userId) {
    return generateToken(userId, refreshTokenExpiration);
}

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

- `.subject(String.valueOf(userId))`: `sub` 클레임에 **우리 DB의 `User.id`**를 담는다. Apple `identityToken`의 `sub`(Apple 고유 유저 ID)와 같은 자리지만, "누구의 발급 체계 안의 식별자인가"만 다를 뿐 "이 토큰의 주체가 누구냐"는 의미는 동일하다.
- `.issuedAt(now)`: `iat` 클레임, 발급 시각 (검증 로직에서 직접 쓰진 않고 감사/디버깅 목적)
- `.expiration(new Date(now.getTime() + expiration))`: `exp` 클레임, 만료 시각. 이 값이 있어야 파싱 시점에 jjwt가 자동으로 만료 여부를 체크한다
- `.signWith(secretKey)`: HS256 대칭키로 서명. 키 타입(`SecretKey`)으로부터 알고리즘이 자동 추론된다
- `.compact()`: 최종 `header.payload.signature` 문자열 생성

### 토큰에서 userId 추출

```java
public Long getUserId(String token) {
    Claims claims = Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    return Long.valueOf(claims.getSubject());
}
```

- `Jwts.parser()`: `Jwts.builder()`와 대칭되는 파서 시작점
- `.verifyWith(secretKey)`: 파싱과 동시에 서명을 검증하도록 설정 — 키가 안 맞거나 토큰이 변조됐으면 `JwtException` 발생
- `.parseSignedClaims(token)`: 실제 파싱 + 서명 검증 + 만료 검증을 한 번에 수행 (검증 실패 시 예외, 성공해야만 다음 단계로). "검증과 디코딩은 한 묶음"이라는 5번 항목의 원칙과 동일한 패턴이다
- `.getPayload()`: `Jws<Claims>`(서명 검증까지 끝난 JWT 전체 래퍼)에서 `Claims`(payload)만 추출
- `claims.getSubject()`: `sub` 클레임을 꺼내서 `Long`으로 역변환 (`generateToken`의 `String.valueOf(userId)`와 대응)

`Claims`는 `Map<String, Object>`를 상속하는 인터페이스로, JWT payload를 표현한다. `getSubject()`/`getExpiration()` 같은 표준 클레임용 타입 안전 getter를 제공하고, 커스텀 클레임은 `claims.get("key", Type.class)`로 꺼낸다.

### 토큰 검증

```java
public boolean validateToken(String token) {
    try {
        Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
        return true;
    } catch (ExpiredJwtException e) {
        throw new BusinessException(ErrorCode.AUTH_TOKEN_EXPIRED);
    } catch (JwtException e) {
        throw new BusinessException(ErrorCode.AUTH_TOKEN_INVALID);
    }
}
```

- `ExpiredJwtException`은 `JwtException`의 하위 클래스라서, **더 구체적인 예외를 먼저 catch**해야 한다. 순서를 바꾸면 만료 케이스도 `JwtException` 블록에서 잡혀버려 `AUTH_TOKEN_EXPIRED`로 못 간다
- `SignatureException`(서명 위조), `MalformedJwtException`(형식 오류) 등은 모두 `JwtException`의 하위 클래스라 두 번째 catch에서 한 번에 처리됨
- 실패 시 `false`를 리턴하는 게 아니라 예외를 던지므로, 리턴 타입 `boolean`은 사실상 의미가 없다 (항상 `true`거나 예외). `void`로 바꾸거나 호출부에서 try-catch 없이 호출만 해도 무방

:::tip 검증과 추출을 분리할지 말지
`getUserId`도 내부적으로 `parseSignedClaims`를 호출하므로 서명/만료 검증을 이미 수행한다. 따라서 `validateToken`을 별도로 호출하지 않고 `getUserId` 호출 자체가 검증 역할을 겸하게 할 수도 있다. 어느 쪽으로 갈지는 호출하는 쪽(필터/서비스)의 흐름에 따라 결정하면 된다.
:::

### getUserId는 어디서, 어떻게 쓰이나

**1. `JwtAuthenticationFilter` — 인증이 필요한 모든 API 요청마다**

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {

        String token = resolveToken(request); // "Authorization: Bearer xxx"에서 추출

        if (token != null) {
            jwtProvider.validateToken(token);
            Long userId = jwtProvider.getUserId(token);

            Authentication auth = new UsernamePasswordAuthenticationToken(
                    userId, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}
```

요청이 들어오면 헤더의 `accessToken`에서 `userId`를 꺼내 `SecurityContextHolder`에 등록한다. 이후 컨트롤러에서 `@AuthenticationPrincipal Long userId` 등으로 "현재 요청한 유저가 누구인지" 꺼내 쓴다. 매 요청마다 DB에서 세션을 조회하지 않고, 토큰 자체에 담긴 `userId`로 stateless하게 식별하는 게 핵심이다.

**2. `AuthService.reissueToken` — refresh token으로 재발급**

```java
public AuthTokenResponse reissueToken(String refreshToken) {
    jwtProvider.validateToken(refreshToken);
    Long userId = jwtProvider.getUserId(refreshToken);

    // UserToken에 저장된 refresh token hash와 일치하는지 추가 검증

    String newAccessToken = jwtProvider.generateAccessToken(userId);
    String newRefreshToken = jwtProvider.generateRefreshToken(userId);
    // ...
}
```

요약하면 **"토큰 문자열 → `getUserId()` → `Long userId` → 이 userId로 해당 유저의 데이터를 조회/수정"**이 JWT 기반 인증의 핵심 흐름이다.
