---
title: JavaScript - hoisting
---

## 호이스팅이란?

> Hoist - 감아올리다

호이스팅은 사전적 의미만 보면 무언가를 끌어 올린다는 것으로 이해할 수 있다. **스코프 범위 내에서 무언가를 끌어 올린다고 생각하자.**

자바스크립트는 모든 선언문 (var, let, const ,function, class)을 호이스팅한다. **호이스팅된 변수는 스코프 내에서의 어디에서든 최상위에서 선언한 것과 동일하다.**

(보이는 것으로 생각하면 최상단에 변수 선언이 끌어올려진 것으로 느껴지지만, 자바스크립트의 [실행 컨텍스트 객체와](https://parkjju.github.io/vue-TIL/js/execution.html#%E1%84%89%E1%85%B5%E1%86%AF%E1%84%92%E1%85%A2%E1%86%BC-%E1%84%8F%E1%85%A5%E1%86%AB%E1%84%90%E1%85%A6%E1%86%A8%E1%84%89%E1%85%B3%E1%84%90%E1%85%B3) 관련된 내용을 보면 더 명확히 이해가 가능하다.)

호이스팅이 어떤 현상을 보이는지에 대해 확인해보자.

```javascript
var hoistVariable;
console.log(hoistVariable); // undefined
```

```javascript
console.log(hoistVariable); // Error? X -> undefined
var hoistVariable;
```

## var vs let, const

`var` 키워드와 `let`, `const`로 선언한 변수는 호이스팅에 있어서 차이가 있다.
위의 호이스팅 예제 코드를 `let`이나 `const`로 선언하면 두 번재 예제코드에서 에러가 발생한다. 하지만 `let`, `const`도 외적으로 봤을 때에 호이스팅되지 않은 것처럼 보일 뿐이지 호이스팅된 것은 맞다.

[let과 const는 호이스팅 될까? - TDZ에 대한 개념](https://medium.com/korbit-engineering/let%EA%B3%BC-const%EB%8A%94-%ED%98%B8%EC%9D%B4%EC%8A%A4%ED%8C%85-%EB%90%A0%EA%B9%8C-72fcf2fac365)

`let`, `const` 키워드로 선언된 변수는 `var` 키워드로 선언된 변수와 데이터 할당까지의 과정이 다르게 동작한다. 변수에 값을 할당하기까지는 다음의 과정을 거친다.

1. 변수 선언 (declaration phase)
2. 변수 초기화 (initialization phase)
3. 변수 값 할당( assignment phase)

`var`키워드로 선언한 변수의 경우 선언과 초기화 단계가 동시에 이루어진다. 우변의 값이 할당되기 전 호이스팅되어 `undefined`가 출력되는 것이 그 이유다.

반면 `let`, `const`로 선언된 변수의 경우 변수 선언과 변수 초기화 단계가 분리되어 진행된다. 실행 컨텍스트 객체 내에서 변수 선언 단계는 **변수를 컨텍스트 객체의 프로퍼티로 등록하는 단계이기에** 실행 컨텍스트 상에서 변수 자체를 인식할 수는 있지만 메모리 할당 후 변수의 초기화가 되지 않아 **액세스는 할 수 없는 상태이다.**

`let` 키워드의 변수는 렉시컬 바인딩 코드를 만나야만 메모리 할당 및 초기화가 진행되는 것이다. 렉시컬 바인딩 코드는 쉽게 말해 `let variable`과 같은 선언문을 나타낸다.

선언은 이루어졌지만 렉시컬 바인딩이 이루어질때까지의 구역을 **TDZ(Temporal Dead Zone)** 이라고 한다.

참고로 `let`은 선언문에 따로 우변이 없어도 `undefined`로 자동 초기화 되지만 `const`의 경우에는 선언과 동시에 값 할당도 진행해야한다.

## Reference

1. [let과 const는 호이스팅 될까?](https://medium.com/korbit-engineering/let%EA%B3%BC-const%EB%8A%94-%ED%98%B8%EC%9D%B4%EC%8A%A4%ED%8C%85-%EB%90%A0%EA%B9%8C-72fcf2fac365)
