---
title: DailyTech - Github 로그인 구현
---

본 문서는 [nomad coders - 유튜브 클론을 요약한 문서입니다.](https://nomadcoders.co)

## Github Login API

[Github web application flow](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps) 문서를 참고하여 개발한다.

1. 깃헙 접속 - 프로필 - settings
2. Developer settings - OAuth Apps - created new OAuth app
3. 각종 정보 입력
   - HompageURL - 로컬호스트 URL 입력해도 됨.
   - authorization callback URL - authorization code 전달 URL지정 (사용자 임의로 가능, `http://localhost:4000/users/github/callback`)

이후의 흐름은 다음과 같다.

- Request a user's GitHub identity
  - 유저를 깃헙으로 리다이렉트 시켜서 인증을 받는다.
  - 퍼그 파일에 a태그 추가하여 깃헙으로 리다이렉트 시켜주는데, 파라미터로 깃헙 OAuth 클라이언트 아이디를 전달해야한다.
  - url에 파라미터를 적용하는 방법은 `http://.......?client_id=value&param1=val1&param2=val2`와 같다.
  - 사용자의 더 다양한 정보를 받고싶으면 스코프를 지정해준다. 스코프는 공백을 기준으로 구분된다. [Github API scopes](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)
  - 사용자의 이메일을 읽어오기 위한 스코프 형식은 `http://....?client_id=value&scope=user:email`과 같다.

템플릿에 콜백 URL을 직접 작성하는 것은 역시나 비효율적이다. 콜백 URL 전달을 위한 컨트롤러와 라우터를 새롭게 마련한다.

컨트롤러는 다음과 같이 작성하면 된다.

```js
export const startGithubLogin = (req, res) => {
  const config = {
    client_id: "c15240d66f1f3683af34",
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config);
  const baseUrl = "https://github.com/login/oauth/authorize";
};
```

URL 파라미터들을 각각 객체로 정리하여 나타내면 깔끔해진다. 이를 주소창으로 전달하기 위해서는 인코딩 작업이 필요한데 `URLSearchParams` 생성자를 활용하면 된다.

:::warning
객체로 정리하는 url 파라미터들은 사용자 정의에 따라 마음대로 변수명을 작성하는 것이 아니라 깃헙이 원하는 대로 작성하여 전달해야한다. 그렇게 하지 않으면 404에러가 발생한다.
:::

모든 것이 정상적으로 처리되면 서버 가동 후 authorize버튼을 클릭할 수 있게 되는데, 클릭 후에 URL의 변화를 보면 OAuth앱 생성 시 작성했던 authorization URL의 주소로 변경되어 있다. `http://localhost:4000/users/github/callback?code=...` 뒤의 코드를 유저에게 보내주게 된다.
