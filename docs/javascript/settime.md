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
