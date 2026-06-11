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
