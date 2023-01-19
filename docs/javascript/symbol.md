---
title: JavaScript - ES6 Symbol
---

## ES6 심볼(Symbol) 타입

심볼 타입은 ES6에서 추가된 원시형 타입 중 하나이다. 따라서 객체의 속성으로 사용된다.

심볼타입을 사용하면 **유일무이한 값, 고유한 값을 가진다.** 심볼 타입의 값은 고유한 값이면서 **변경 불가능한 값이다.**

타입 기초 문서는 [다음의 링크에](./jsOperation.md) 작성해두었다.

## 심볼 타입을 사용하는 이유

**객체 속성으로 심볼을 사용하는** 이유는 값의 충돌을 피하기 위함이다. 다음의 예제를 살펴보자.

```js
let ar = [1,2,3,4,5];
alert(ar.length)l //5는 배열의 길이이며 요소 수를 알 수 있는 내장된 속성이다.

ar.length = 50; // ar배열에 length라는 이름의 속성을 새롭게 추가하고 50을 할당

// 50이라는 값이 할당되지 않아야 정상이지만 할당이 되는 문제가 발생한다.
```

```js
// 심볼 사용
let ar = [1, 2, 3, 4, 5];
const length = Symbol('length'); // new 연산자 사용 안함.

ar[length] = 50; // 심볼 변수 length를 다음의 형식으로 집어넣는다.

console.log(ar.length); // 5
console.log(ar[length]); // 50
```

위 예제에서 심볼 변수 `length`와 배열 ar의 프로퍼티 `length`는 완전히 구분된 값으로서 존재한다.

## 심볼 사용법

심볼은 new 연산자를 사용하지 않는다. `let symbol = Symbol();` 이러한 형태로 사용한다.

`Symbol()` 의 괄호 안은 비워두어도 되고 문자열을 넣어 생성해도 되며 내부에 삽입할 문자열은 단순**디스크립션(description)의** 의미만 지닐 뿐 고유한 값을 갖는 데에 있어서 어떤 영향을 끼치는 것은 아니다.

따라서 description 인자는 심볼의 고유값을 구분하지 못한다. **심볼은 매번 심볼함수 호출 시 새로운 심볼 값을 생성해내기 때문이다.**

```js
let symbol1 = Symbol('name1');
let symbol2 = Symbol('name1');

symbol1 == symbol2; // false
```

:::danger Symbol 출력
디버깅 목적으로 alert함수에 Symbol타입 변수를 전달하게 되면 오류가 발생한다. **심볼 타입 변수는 문자열로 변환할 수 없기 때문이다.**

`console.log` 함수에 전달하면 다음과 같은 형태로 출력된다. `Symbol(description)`

```js
let symbol = Symbol('a');
alert(symbol); //Uncaught TypeError: Cannot convert a Symbol value to a string
console.log(symbol); //Symbol(a)
```

:::

또한 심볼타입은 `for .. in` 구문으로 출력되지 않는다. **원래는 배열 객체에 속성을 추가하면 for .. in 구문으로 출력 시 해당 속성도 함께 출력된다.**

```js
let a = [1, 2, 3];
a.someProperty = 10;

for (let i in a) {
    console.log(i); // 0,1,2,someProperty
}

// 심볼타입 사용 - 은닉화가 적용된다.

let symbolProperty = Symbol('symbolProperty');
a[symbolProperty] = 10;

for (let i in a) {
    console.log(i);
} // 0,1,2,someProperty으로 위와 같은 결과가 출력되지만
console.log(a); //[1, 2, 3, someProperty: 10, Symbol(symbolProperty): 10] 이와같은 결과가 나타난다.
console.log(a[symbolProperty]); // 프로퍼티의 값만 출력 10
```
