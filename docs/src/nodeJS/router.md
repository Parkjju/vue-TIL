---
title: 라우터(router)
---

# 라우터(router)

라우터는 컨트롤러와 URL 관리를 쉽게 하도록 도와주는 역할을 한다. 미니 어플리케이션(`mini-application`)을 만든다고 할 수 있다.

구현하는 서비스의 기능별로 URL을 구분짓는다고 가정해보면

```text
/join -> 회원가입
/login -> 로그인
/search -> 검색페이지

/edit -> 회원정보 수정 페이지
/delete -> 회원 탈퇴
...
```

위와 같이 나눌 수 있다. 하지만 삭제 및 수정 기능의 경우 유저에 대한 관리도 있지만 다른 업로드 컨텐츠(영상 및 사진)들에 대해서도 똑같이 적용되게 된다.
이를 깔끔히 정리하기 위해 라우터가 필요하다.

```text
/users/edit -> 회원정보 관리
/users/delete -> 회원탈퇴

/videos/watch -> 영상 페이지
/videos/edit -> 영상 수정
...
```

정리하면, 라우터는 작업중인 주제별로 URL을 나누어 관리한다.

특정 주제로 묶이지 않는 라우터, 가령 위의 예시에서 `/join`, `/login`들은 **글로벌 라우터**라고 한다. `join`이나 `login`같은 경우 유저 라우터에서 관리될 수도 있겠지만 외부에서 접근하는 입장을 고려했을 때 몇가지 라우터들은 기능 측면에서 벗어나 마케팅 측면에서 고려해야할 때도 있다.

## 라우터 제작

`express`패키지를 이용하여 라우터를 제작하는 예시 코드는 다음과 같다.

```js
const videoRouter = express.Router(); // 라우터 생성

app.use("/videos", videoRouter);
const handleWatchVideo = (req, res) => res.send("Watch Video");
videoRouter.get("/watch", handleWatchVideo);
```

1. `express`모듈의 라우터 메서드를 호출하여 비디오 관련 API를 관리하는 라우터를 생성한다.
2. 비디오 라우터는 `/videos`라는 URL에서 관리된다.
3. 비디오 라우터도 `get`메서드를 호출할 수 있으며 비디오 라우터의 특정 URL과 관련된 동작을 정의할 수 있다.
4. 예시에서는 `handleWatchVideo`라는 함수가 콜백으로 전달되었고 이는 HTML을 응답으로 보내준다.

`videoRouter`의 `get`메서드를 통해 통해 `/video/watch`라는 URL로 접근하는 것이 아닌 `/watch`라는 간단한 URL로 접근할 수 있다.

:::tip
`Router.route("url");` 메서드.

router.route(path)
Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware. Use router.route() to avoid duplicate route naming and thus typing errors.

Building on the router.param() example above, the following code shows how to use router.route() to specify various HTTP method handlers.

router.route('/users/:user_id')
.all(function (req, res, next) {
// runs for all HTTP verbs first
// think of it as route specific middleware!
next()
})
.get(function (req, res, next) {
res.json(req.user)
})
.put(function (req, res, next) {
// just an example of maybe updating the user
req.user.name = req.params.name
// save user ... etc
res.json(req.user)
})
.post(function (req, res, next) {
next(new Error('not implemented'))
})
.delete(function (req, res, next) {
next(new Error('not implemented'))
})

```

```
