---
title: URL Param
---

# URL 파라미터

라우터 정의 후 해당 라우터를 활용하여 특정 URL에 접근, 콜백을 실행할 수 있었다.

```js
myRouter.get("/myurl", mycallback);
```

라우터에서 관리하는 API중, 삭제나 수정과 같이 게시글의 id가 필요한 API에 있어서 필요한 것이 바로 파라미터이다.

```js
videoRouter.get("/:id", see);
```

:::tip
파라미터의 이름이 반드시 id여야할 필요는 없다.
:::
위와 같이 콜론과 함께 파라미터를 전달하게 되면 추후 클라이언트 측에서 URL을 요청할 때 이에 대한 응답으로 익스프레스가 `/1/edit`, `/2/edit`.....과 같이 숫자를 대입해준다.

콜론 표기는 익스프레스에게 콜론 뒤의 문자열이 변수임을 알려주는 것이다.

다음은 예시 코드이다.

```js
// Router.js
export const see = (req, res) => {
  console.log(req.params);
  return res.send("see");
};
```

라우터 모듈에서 `req.params.id`를 찍어보면 클라이언트가 URL을 요청하면서 보낸 URL 파라미터의 값이 출력된다.

```sh
{ id: '934292939293293' }
GET /videos/934292939293293 200 3.746 ms - 3
```

:::danger
watch API가 upload API 보다 먼저 라우터의 URL을 할당받게 되면 익스프레스 입장에서 볼 때 `/upload`라는 URL을 변수의 수많은 값들 중 하나로 보게 된다. API 정의 순서에 주의!
:::

## 정규식

[익스프레스 라우팅](https://expressjs.com/ko/guide/routing.html)을 참조해보면 다양한 정규식을 볼 수 있다.

정규식이란 문자열로부터 특정 정보를 추출해내는 방법이다.

[정규식 정리 블로그](https://beomy.tistory.com/21)

```js
// Router.js
videoRouter.get("/:id(\\d+)", see);
```

`(\\d+)`라는 정규식을 추가했더니, URL로 숫자 이외의 타입을 받으면 URL 인식을 하지 못한다.
