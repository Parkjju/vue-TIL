---
title: nodejs - 서버구축
---

## import express

1. `npm i express`
2. 서버를 구축할 `.js`파일 생성
3. `express` 모듈 임포트
4. 익스프레스 함수를 통해 객체 생성

```js
import express from 'express';

const app = express();

const handleListening = () => console.log('Server listening on port 4000 !!');
app.listen(4000, handleListening);
```

## 서버 구축

서버는 클라이언트의 리퀘스트(request)를 리스닝(listening)하고있다.

클라이언트로부터 행동이 감지될 때까지 기다리도록 해야한다.
익스프레스 함수로 생성한 객체의 `.listen()` 메소드를 호출함으로써 위의 기능이 구현된다.
`.listen()` 메소드에는 콜백이 전달된다.

콜백 전달 이전에 **서버에게 어떤 포트를 리스닝할지 알려줘야한다.**

## 요청 처리

익스프레스로 객체 생성 후 다른 페이지 생성 없이 바로 서버를 돌리게 되면 `Cannot GET /`라는 메세지가 출력되어있다.
`/`는 루트 페이지를 의미하며, 루트 페이지를 얻어올 수 없다고 말하는 것이다. (GET 메서드)

마찬가지로 `Cannot GET /page`라고 한다면 page라는 이름의 페이지를 GET 할 수 없다는 의미이다.

1. 익스프레스 함수로 앱을 생성한다.
2. `.listen`메서드로 요청을 감지한다.
3. **요청에 대한 처리 코드 작성은 앱 생성과 listen 메서드 사이에 작성한다**

```js
// express()로 app객체 생성하는 코드
app.get('/', () => console.log('Somebody is trying to go home.'));
// app객체 listen메서드로 요청 리스닝하는 코드
```

`.get()` 메서드는 다음과 같은 인자들을 받는다.

1. 라우트(요청할 페이지 링크) 설정
2. 요청 성공시 콜백 함수

겟 메서드를 통해 브라우저에서 요청을 하기는 했지만 이에 대한 서버의 응답처리를 마련하지 않은 상태이다. (무한 로딩상태)

## 응답 처리

리퀘스트(request) 객체를 찍어보자.

해당 작업 진행 전 JS 이벤트 리스너에 대해 복습해보면

1. `button.addEventListener("click", handleClick);` - 버튼 요소에 이벤트 추가
2. 클릭 이벤트 발생 시 콜백함수인 `handleClick` 함수로 `event`객체가 전달된다.

위의 두 과정처럼 익스프레스 객체의 `.get` 메서드도 동일하게 처리된다.

1. `app.get('/', handleHome)`으로 GET 요청을 보낸다.
2. GET 요청이 정상적으로 이루어지면 콜백에 인자를 전달하는데 여기서는 **response, request** 객체 두 개를 전달하게 된다.
3. `request, response` 객체들을 출력해보자.

```js
// express로 객체 생성
const handleHome = (req, res) => {
    console.log(req);
    console.log(res);
};
app.get('/', handleHome);
// .listen으로 요청 리스닝
```

`response.end()` 메서드로 요청을 종료할 수도 있다.

```js
// ..
const handleHome = (req, res) => {
    return res.end(); //here!!
};
app.get('/', handleHome);
// ...
```
