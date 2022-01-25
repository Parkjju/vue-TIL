---
title: ES6 비동기 처리 (2)
---

## 비동기 처리

비동기 처리에는 다양한 방법이 존재한다. 콜백함수, 프라미스, 제너레이터, 어싱크 어웨트 등의 것들이 그 예시가 된다.

[Cracking Vue.js - 프라미스에 대한 글을 참조하자.](https://joshua1988.github.io/vue-camp/es6+/promise.html#%E1%84%91%E1%85%B3%E1%84%85%E1%85%A1%E1%84%86%E1%85%B5%E1%84%89%E1%85%B3%E1%84%85%E1%85%B3%E1%86%AF-%E1%84%89%E1%85%A1%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%92%E1%85%A2%E1%84%8B%E1%85%A3-%E1%84%92%E1%85%A1%E1%84%82%E1%85%B3%E1%86%AB-%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%B2) (내가 작성함 😉)

일련의 값들을 비동기적인 코드로 설정된 상태로 곱하여 최종 값을 산출하는 코드를 콜백 함수, 프라미스, 제너레이터로 구현해본다.

## 1. 콜백 함수

```js
setTimeout(
  (x) => {
    let result = x;

    console.log(result);

    setTimeout(
      (x) => {
        result *= x;

        console.log(result);

        setTimeout(
          (x) => {
            result *= x;
            console.log(result);
          },
          1000,
          30
        );
      },
      1000,
      20
    );
  },
  1000,
  10
);
// 콜 백 지 옥
```

A 함수를 실행하는 흐름 속에 B 함수를 실행하고, 그 속에서 C 함수를 실행하고 ... 이런 흐름이 중첩되는 것이 콜백 지옥이다.

<figure>

![callback](../.vuepress/assets/javascript/callback.png)

<figcaption>

출처: https://adrianalonso.es/desarrollo-web/apis/trabajando-con-promises-pagination-promise-chain/

</figcaption>

</figure>

## 2. 프라미스

1. `new Promise()`를 호출한다. 호출하면 **대기(pending)**상태가 된다.
2. 대기상태가 되면 **콜백 함수를 선언할 수 있고** 인자로 `resolve`, `reject`를 받는다. 즉 `Promise(resolve, reject)`의 형태를 갖는 것이다.
3. 콜백함수 내에서 처리한 뒤 `resolve` 메서드를 호출하면 **이행(Fulfilled)상태이다.**
4. 성공 시 `.then()`이 리턴값을 받아서 계속해서 처리를 수행한다.

```js
new Promise((resolve, reject) => {
  setTimeout(
    (x) => {
      let result = x;
      console.log(x);

      resolve(result); // resolve 메서드의 인자값이 then 메서드로 전달된다.
    },
    1000,
    10
  );
}).then((result) => {
  return new Promise((resolve, reject) => {
    setTimeout(
      (x) => {
        console.log(x);
        result *= x;
        console.log(result);

        resolve(result);
      },
      1000,
      20
    );
  });
});
```

**코드를 직접 짜보자**

## 3. 제너레이터

```js
function calculator(a, b) {
  return a * b;
}
// 제너레이터부터 다시 시작
```
