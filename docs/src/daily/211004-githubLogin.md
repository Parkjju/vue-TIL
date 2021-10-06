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

:::warning
코드의 유효기간은 10분밖에 되지 않으므로 이를 고려하자.
:::

`authorization code`는 URL파라미터에 있고, 클라이언트 아이디는 깃헙에서 발급 받았으므로 **클라이언트 시크릿만** 발급받으면 된다. 클라이언트 시크릿은 OAuth 세팅 화면에서 `Generate new secret`을 클릭하면 된다. **절대 노출이 되면 안되는 값이니 환경변수 처리를 꼭하자.**

## 액세스 토큰 발급

사용자로부터 권한 승인을 받게 되면 `authorization code`가 발급된다. 해당 코드를 가지고 깃헙에 클라이언트가 요청을 보내어 액세스 토큰을 발급받게 되는 것이다.

액세스 토큰을 발급받기 위해서는 `POST https://github.com/login/oauth/access_token` 문서를 참조하여 제시된 메서드와 URL에 클라이언트 요청에 보내면 된다. POST 기능의 컨트롤러를 다룰 라우터를 먼저 정의한 뒤 컨트롤러를 정의하면, 다음과 같은 형태로 작성할 수 있다.

```js
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const data = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const json = await data.json();
  res.send(JSON.stringify(json));
};
```

`config`객체를 정의하였고, 객체 내에는 깃헙에서 필요로 하는 변수명 (`client_id`, `client_secret`, `code`)들과 해당 값을 넣었고 `authorization code`의 경우 `req.query`를 통해 받아올 수 있다.

:::tip req.query vs req.params
다음과 같은 `http://localhost:4000/users/github/1/detail?code=...` 링크가 있다고 가정하자. 해당 링크의 req.query는 **?** 뒤로 쭉 이어지는 `code=...`와 같은 값들이고 req.params는 리퀘스트 URL의 파라미터들이다. 애초에 라우터 설계 시에 고려하였던 `:id`와 같은 값들인 것이다.
:::

위에서와 마찬가지로 `URLSearchParams`메서드를 통해 인코딩을 해주고 `fetch`를 통해 따로 페이지 리다이렉트 없이 API만 요청하고 json 객체를 반환받는다.

:::warning
fetch는 서버에 없고 브라우저에만 존재하기 때문에 모듈을 따로 설치해줘야한다.
:::

:::details fetch?
[fetch API mdn](https://developer.mozilla.org/en-US/docs/Web/API/fetch)의 문서를 참조해보면 다음과 같이 fetch 메서드를 정의할 수 있다.

```text
The global fetch() method starts the process of fetching a resource from the network, returning a promise which is fulfilled once the response is available.

fetch 메서드는 네트워크로부터 리소스를 가져오는 프로세스를 시작하여 프로미스를 반환합니다.
```

:::

:::details response.json() 메서드
컨트롤러에 정의한 config객체를 URL에 인코딩 후 담아서 해당 URL로 fetch를 보냈다. fetch는 프로미스를 반환하므로 어웨이트를 통해 변수에 리스폰스 객체를 담을 수 있고, 리스폰스 객체에는 `.json()` 메서드가 있으므로 사용 가능하며 `.json()` 메서드는 응답의 `body` 텍스트를 JSON 형태로 parsing한 뒤 완료 여부를 프로미스로 반환한다.
:::

최종적으로 POST메서드 요청에 대한 응답을 확인하기 위해 `res.send` 메서드로 JSON메서드를 찍어보면 액세스토큰이 발급되었음을 확인할 수 있게 된다.

## API 액세스

이제 발급받은 액세스 토큰을 가지고 API에 접근하여 유저 정보를 불러오면 된다. 액세스토큰을 발급받는 컨트롤러 함수 내에 다음의 코드를 추가한다.

```js
if ("access_token" in tokenRequest) {
  const { access_token } = tokenRequest;
  const userData = await (
    await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    })
  ).json();
  console.log(userData);
} else {
  return res.redirect("/login");
}
```

반환받은 `response` 객체에 `access_token`이라는 변수가 존재할 때 API를 처리해주는 코드이다. [github Web application flow](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#3-use-the-access-token-to-access-the-api) 문서에 따르면 `GET https://api.github.com/user` GET 메서드의 헤더에 `Authorization`과 토큰 값을 추가한 뒤 해당 URL에 요청을 보내면 유저 대신에 API를 요청할 수 있게 된다고 한다. 실제로 반환받은 객체를 찍어보면 각종 깃헙 유저 정보에 대한 것들이 출력된다.

private한 정보들은 null로 처리되어 있으며 [github docs - REST API document/emails](https://docs.github.com/en/rest/reference/users)를 참조하여 퍼블릭한 이메일 정보를 얻을 수 있다. 처리 코드는 다음과 같다.

```js
if ("access_token" in tokenRequest) {
  const { access_token } = tokenRequest;
  const apiUrl = "https://api.github.com";
  const userRequest = await (
    await fetch(`${apiUrl}/user`, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    })
  ).json();

  const emailData = await (
    await fetch(`${apiUrl}/user/public_emails`, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    })
  ).json(); // json처리를 해야 깔끔하게 보임.
  console.log(emailData);
} else {
  return res.redirect("/login");
}
```

fetch를 통해 이메일데이터를 얻었으면 권한 승인을 한 유저의 깃헙 이메일 목록이 출력 될 것이다. 이메일 목록들 중 primary하고 verified된 이메일을 골라서 서비스에 가입시키기를 원한다면 해당 조건에 맞춰서 객체를 저장해주면 된다.

```js
const emailObj = emailData.find(
  (email) => email.primary === false && email.verified === true // 내 계정의 경우 noreply로 메일 주소가 나와있어서 옵션을 다음과 같이 부여함.
);

if (!emailObj) {
  return res.redirect("/login");
}
```

이전에 유저가 서비스에 가입 시 깃헙 이메일로 가입한 적이 있다면 깃헙 로그인 API를 통해 로그인을 서비스에 시켜줄 것이고, 깃헙 이메일로 서비스에 가입하지 않았었다면 새로운 계정을 생성해준다. (패스워드 required이슈는 이후 해결할 듯)

```js
const existingUser = await User.findOne({ email: emailObj.email });

if (existingUser) {
  // 유저가 존재한다.
  req.session.loggedIn = true;
  req.session.user = existingUser;
  return res.redirect("/");
} else {
  const user = await User.create({
    //유저가 존재하지 않으면 계정을 하나 생성해준다.
    name: userData.name,
    username: userData.login,
    email: emailObj.email,
    password: "", //password required이슈
    socialOnly: true, //social로그인으로만 처리할 계정인지 여부 (userSchema에 디폴트 false로 추가해놓은 상태) )패스워드가 필요가 없다.
    location: userData.location,
  });
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
}
```
