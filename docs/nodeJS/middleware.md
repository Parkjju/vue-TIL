---
title: 미들웨어(middleware)
---

# 미들웨어(middleware)

리퀘스트(request)와 리스폰스(response) 사이에 존재하는 소프트웨어이며 각종 API를 관리한다.

코드 구현 단계에서 이벤트 핸들러(Event Handler)로 작성했던 코드들이 바로 미들웨어이다.

:::warning
MVC모델에 따라 핸들러는 사실 컨트롤러(controller)로 표현해야 정확하다.
:::

모든 컨트롤러는 미들웨어이며 기존에 전달했던 리퀘스트와 리스폰스 객체 이외에 넥스트`(next)`라는 변수도 전달된다.

```js
// express();
const gossipMiddleware = (req, res, next) => {
  console.log("I'm in the Middle!");
  next();
};

const handleHome = (req, res) => {
  return res.end();
};

app.get("/", gossipMiddleware, handleHome);

//app.listen()..
```

`gosssipMiddleware`라는 미들웨어를 정의한 뒤 `get` 메서드의 중간 파라미터로 전달하면 미들웨어 내부에 정의된 `next()`함수 호출을 통해 그 다음 함수인 `handleHome` 함수가 호출되게 된다.

코드 흐름상 `handleHome`은 파이널웨어(finalware)가 된다.

**미들웨어는 리퀘스트에 응답하는 함수가 아니라 리퀘스트를 연장하는 함수이다.** 제어권을 다음 함수로 넘기는 것이다.

## use 메서드

`.use(Middleware)` 메서드는 `.get("/", callback)` 메서드보다 앞서서 사용해야한다. `use`메서드는 모든 라우트에 적용된다는 성질을 가진다.

```js
const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  console.log("Allowed, you may continue.");
  next();
};

const handleProtected = (req, res) => {
  return res.send("Welcome to the private lounge.");
};

app.use(privateMiddleware);
app.get("/protected", handleProtected);
```

1. `use` 메서드에 미들웨어를 전달한다.
2. 해당 미들웨어는 전체 라우트를 검사하여 `protected` URL과 동일한 지 판단한다.
3. 요청 URL이 `protected`이면, `res.send()`의 인자를 보내준다.
4. 해당되지 않으면 `next()`함수를 호출한다.

정리하면, 미들웨어는 `get`메서드에서는 하나의 라우트에서만 작동하고 `use`메서드에서는 모든 라우트에서 작동한다.

## morgan

`npm i morgan`을 통해 `morgan` 미들웨어를 설치할 수 있다.

```js
import morgan from "morgan"; //morgan이라는 이름으로 모건 미들웨어 가져오기
```

모건 미들웨어를 불러온 후 활용하는 코드는 다음과 같다.

```js
import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev"); //here!

const home = (req, res) => {
  return res.send("hello");
};
const login = (req, res) => {
  return res.send("login");
};

app.use(logger);
app.get("/", home);
app.get("/login", login);

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
```

모건 미들웨어는 페이지 요청에 대한 응답의 로그를 보여주는 역할을 한다.

```sh
[nodemon] restarting due to changes...
[nodemon] starting `babel-node server.js`
✅ Server listenting on port http://localhost:4000 🚀
GET / 200 14.400 ms - 5
```

모건 메서드의 5가지 옵션에 따라 로그 내용이 달라진다.

모건 미들웨어 또한 **미들웨어이므로 next가 미들웨어의 인자로 전달된다.** (모건 소스코드 확인하기)
