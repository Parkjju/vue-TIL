---
title: why Typescript?
---

노마드코더의 타입스크립트 강의 요약본입니다.

## 타입 안정성

자바스크립트는 매우 유연한 언어이다.

```javascript
console.log([1, 2, 3, 4] + false);
// '1,2,3,4false'
// ??
```

위의 코드는 아무도 작성하지 않을 코드이다. 하지만 아래의 예시를 봐보자.

```javascript
function divide(a, b) {
    return a / b;
}

console.log(divide(2, 3));
// 0.6666666....
console.log('??');
// NaN
// ??
```

함수 호출 시 올바른 갑 입력에 대해서만 작동하는 것이 아니라 잘못된 입력에 대해서도 함수가 호출되고 실행까지 문제없이 이루어지게 된다.

문제는 런타임에 발생하는 에러이다.

```javascript
const me = { name: 'jun' };
me.greet();
// Uncaught TypeError...
```

위의 코드는 런타임에 발생하게 되는 에러이다. 위와 같이 심각한 오류는 사실상 런타임이 아닌 컴파일 이전에 처리되어야 하는 코드이다. 타입스크리트를 통해 위의 오류를 사전에 방지하는 것이 매우 중요하다.

## 타입스크립트 시작하기

타입스크립트 코드는 컴파일 시 자바스크립트 코드로 변환된다. 에러가 감지되면 컴파일 시도 자체가 이루어지지 않는다.

이러한 보호 조치가 이루어지는 것은 **타입스크립트의 타입 추론이라는 특징 때문에 발생하게 된다.**

```javascript
let name = 'Jun';

// 타입스크립트에서도 같은 타입으로의 값 변화는 가능하다.
name = 'Park';

// 다른 타입의 값으로는 변화가 불가능하다.
name = 1;

// 타입스크립트의 타입 선언
let boolOne: boolean = false;

// Type Checker로부터 에러 반환
// 서로 다른 타입으로의 값 할당
let boolTwo: boolean = 'string';

// number로 이루어진 배열임을 선언
let arr: number[] = [];
```

위 코드 중 콜론을 사이에 두고 타입을 선언하는 것이 **명시적 타입이고,** 일반적인 자바스크립트 변수 선언 방식은 **묵시적 타입이다.** 특정 타입으로 선언된 변수는 묵시적 타입에 따라 다른 타입의 대입 연산이 이루어질 경우 Type Checker가 에러를 발생시킨다.

## Reference

1. [노마드코더 Typescript](https://nomadcoders.co/typescript-for-beginners/lobby)
