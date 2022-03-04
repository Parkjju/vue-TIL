---
title: hoisting
---

## 호이스팅이란?

> Hoist - 감아올리다

호이스팅은 사전적 의미만 보면 무언가를 끌어 올린다는 것으로 이해할 수 있다. **스코프 범위 내에서 무언가를 끌어 올린다고 생각하자.**

자바스크립트는 모든 선언문 (var, let, const ,function, class)을 호이스팅한다. **호이스팅된 변수는 스코프 내에서의 어디에서든 최상위에서 선언한 것과 동일하다.**

우선, 호이스팅이 어떤 현상을 보이는지에 대해 확인하자.

```javascript
var hoistVariable;
console.log(hoistVariable); // undefined
```

```javascript
console.log(hoistVariable); // Error? X -> undefined
var hoistVariable;
```

:::warning var vs let, const
`var` 키워드와 `let`, `const`로 선언한 변수는 호이스팅에 있어서 차이가 있다.
위의 호이스팅 예제 코드를 `let`이나 `const`로 선언하면 두 번재 예제코드에서 에러가 발생한다. 하지만 `let`, `const`도 외적으로 봤을 때에 호이스팅되지 않은 것처럼 보일 뿐이지 호이스팅된 것은 맞다.

[let과 const는 호이스팅 될까? - TDZ에 대한 개념](https://medium.com/korbit-engineering/let%EA%B3%BC-const%EB%8A%94-%ED%98%B8%EC%9D%B4%EC%8A%A4%ED%8C%85-%EB%90%A0%EA%B9%8C-72fcf2fac365)

:::
