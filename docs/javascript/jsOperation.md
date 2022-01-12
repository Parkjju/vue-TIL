---
title: Javascript 동작원리
---

## 데이터 타입의 특징과 종류

1. 기본형
   - `Number`
   - `String`
   - `Boolean`
   - `Null`
   - `undefined`
   - `Symbol` (ES2015) : 유일한 값을 만들 때 사용
   - `BigInt` (ES2020) : 매우 큰 수를 다룰 때 사용
2. 참조형
   - `Object` : 프로퍼티와 메서드 개념을 포함하는 객체로서의 데이터타입

형 변환과 관련된 자료는 [다음을](https://ko.javascript.info/type-conversions) 참조하자.

주로 출력과 관련될 때 숫자가 문자로 자동 형 변환되며, 계산과 관련될 때 문자가 숫자로 자동 형 변환된다.

### Symbol 데이터타입

심볼 타입 데이터를 생성하는 방법은 다음과 같다.

```js
const user = new Symbol("I am user");
```

심볼 내에 `I am user`는 심볼을 설명하는 데이터이다. **설명이 들어가 있는 심볼은 다른 어떠한 값과 비교해도 절대 같아질 수 없다.**

```js
user === "I am user"; // false
```

동일한 설명으로 심볼을 생성하더라도 두 심볼은 같아질 수 없다.

```js
const user1 = new Symbol("I am user");
const user2 = new Symbol("I am user");
```

### typeof 연산자

typeof 연산자는 자바스크립트 데이터의 타입을 알아내는 함수로 데이터와 타입오브 함수 사이에 공백을 하나 두고 코드를 작성하거나 `typeof(Data)`와 같이 작성해도 된다.

```js
typeof "ABC";
typeof "ABC";
```

:::warning typeof 주의점
typeof null은 **object**를 반환한다.

typeof(작성한 함수)는 **function**을 리턴한다. (자바스크립트에서의 함수는 객체로 취급하지만, typeof연산자에 통과시켰을 때에는 function을 리턴한다.)
:::
