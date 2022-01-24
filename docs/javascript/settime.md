---
title: ES6 비동기 처리 (1)
---

## setTimeout vs setInterval

비동기 처리 방식에는 프라미스(Promise), 제너레이터(Generator)등이 있다. 비동기적인 코드 예시로 `setTimeout()` 함수와 `setInterval()` 함수가 있다. `setTimeout()`은 일정시간 후에, `setInterval()`은 일정시간 마다 입력된 함수를 실행하는 함수이다. 위 두 함수는 **호출 스케줄링 함수라고 부른다.**

`setTimeout` 함수의 인자로는 실행할 함수, 대기 시간, 입력되는 함수의 파라미터가 전달된다. 파라미터로 입력되는 함수는 **함수의 호출이 아니라 함수 명을 전달하는 것이다.**

```js
// setTimeout 예시
function printHello() {
  console.log("Hello");
}

printHello(); // Hello
setTimeout(printHello, 2000); // 2초 뒤 Hello
```

```js
function printHelloWithParameter(word) {
  console.log(word);
}

printHelloWithParameter("Hello");
setTimeout(printHelloWithParameter, 2000, "Hello");
```

함수를 미리 정의한 뒤 함수명을 파라미터로 전달해도 되지만 화살표 함수(Arrow function)를 파라미터 내에 전달해도 된다.

```js
setTimeout((word) => console.log(word), 2000, "Hello");
```

호출 스케줄링을 취소하는 함수는 `clearTimeout` 함수이다.

`setTimeout` 함수를 호출하면 타이머 식별자를 반환한다. 스케줄링 함수마다 고유하게 갖는 값이다.

```js
const timerID = setTimeout((word) => console.log(word), 2000, "Hi~!");
console.log(timerID);
```

`clearTimeout` 함수는 이 타이머 식별자 값을 통해 호출 스케줄링 함수를 취소시킨다. 파라미터로 타이머 식별자 값을 전달하면 된다.

```js
const firstTimerID = setTimeout((word) => console.log(word), 2000, "Hi~!");
console.log(firstTimerID);

const secondTimerID = setTimeout((word) => console.log(word), 4000, "Hi~!");
console.log(secondTimerID);

clearTimeout(firstTimerID);
```

주기적으로 함수를 실행하기 위해서는 `setInterval()` 함수를 사용하면 된다. 또한 이 함수를 중단하기 위해서는 `clearInterval(타이머식별자 값)`을 실행하면 된다.

```js
const intervalTimerID = setInterval(() => console.log("Hello!"), 1000);

// ... 1초마다 Hello 출력

clearInterval(intervalTimerID); // 출력 중지
```

`setTimeout`과 `setInterval`을 혼용한 예시를 보자.

```js
const timerID = setInterval(() => console.log("Hello"), 1000);

const stopInterval = (tid) => {
  clearInterval(tid);
};

setTimeout(stopInterval, 9000, timerID);
```

:::warning
`setTimeout()`과 `setInterval()`의 파라미터로 전달되는 함수는 **function** 객체여야 한다.

[function 객체 mdn](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function)
:::

`setInterval` 함수에 값을 전달하여 증가시키다가 중단하는 예제를 보자.
:::details 해설

```js
let count = 0;

let timerID = setInterval(() => {
  console.log(timerID);
  count += 1;
  if (count == 10) {
    clearInterval(timerID);
  }
}, 1000);
```

:::
2초 단위로 흘러가는 시계를 출력해보자.
:::details 해설

```js
setInterval(() => {
  time = new Date();
  hour = time.getHours();
  minute = time.getMinutes();
  second = time.getSeconds();

  console.log(`${hour}:${minute}:${second}`);
}, 2000);
```

위 코드는 단순 출력에 대한 코드이고, HTML상에 DOM 접근을 통해 시간을 출력하기 위해서는

```js
function myClock() {
  let clock = document.getElementById("clock");
  let d = new Date();

  clock.innerText = ``; //...출력형태 백틱과 함께 지정
  // d.getHours() 등 이용
  setTimeout(myClock, 2000); // 재귀적 실행
}

window.onload = () => myClock(); // HTML로딩 완료 후 함수 호출
```

:::
