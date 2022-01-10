---
title: ES6 set 자료구조
---

## set

map과 set 자료구조는 ES6에서 새롭게 도입되었다.

map은 key와 value를 한 쌍으로 묶는다는 점에서 **객체(Object)와** 유사하고, set은 중복을 허용하지 않는다는 점을 제외하고 **배열(Array)과** 유사하다.

set은 key, value쌍이 있을 때 **value들의 집합 또는 컬렉션이다.**

:::tip set의 특징
배열(Array)는 같은 값을 가질 수 있지만, set(집합)은 같은 값을 중복해서 가질 수 없다. 중복된 값을 추가해도 변화가 없다.

**이러한 성질을 이용하여 중복을 제거하는 용도로도 많이 쓰임.**
:::

```js
let arr1 = [1, 2, 3, 4, 5, 5];
console.log(arr1); // 1,2,3,4,5,5
console.log(arr1[4]); // 5
console.log(arr1[5]); // 5
```

:::tip set 사용법

1. 생성 --> new
2. 추가 --> add
3. 삭제 --> delete
   :::

```js
// 생성
let ar1 = new Set(); // 공집합 하나 생성
console.log(ar1); // object set 객체를 반환, Set(0) {size: 0}, set은 length가 아닌 size이다.

// 추가
ar1.add("A");
ar1.add("B");
console.log(ar1); // Set(2) {'A', 'B'}
```

:::warning 배열과 set의 차이

1. 인덱스 유무

```js
let ar1 = new Set();
ar1.add("a");
console.log(ar1[0]); // undefined
```

set데이터에 값을 집어넣고 **인덱스로 접근을 시도하면 undefined가 출력된다.**

2. 중복 여부

```js
let ar1 = new Set();
ar1.add("a");
ar1.add("a");
console.log(ar1.size); // 1
```

set데이터에 중복된 값을 삽입하면 해당 원소가 추가될 뿐만 아니라 사이즈도 증가하지 않는다. 중복원소 제거를 위한 용도로 사용됨.

:::

```js
// 하나만 삭제
let ar1 = new Set();
ar1.add("A");
ar1.add("B");

ar1.delete("A");
console.log(ar1); // delete메서드는 Boolean을 리턴한다. Set(1) {'B'}

// 전체 삭제
ar1.clear();
console.log(ar1); // Set(0) {size: 0}
```

## set 생성법과 스프레드 연산자

Set 자료구조의 데이터 생성과 동시에 값을 추가하는 방법은 다음과 같다.

```js
// 생성과 동시에 값을 추가
let ar = new Set().add("a").add("b");
console.log(ar); //Set(2) {'a', 'b'}

// ar과 동일한 원소를 지님
let ar1 = new Set(["a", "b"]);
```

스프레드 연산자를 이용하여 Set을 출력하는 방법은 다음과 같다.

:::tip Spread연산자
Spread(펼침) 연산자는 이터러블 객체(Iterable Object)의 요소를 하나씩 분리하여 전개하는 연산자를 의미한다.

```js
let testArr = ["k", "o", "r", "e", "a"];
console.log(...testArr); //k o r e a
console.log([...testArr]); // ['k', 'o', 'r', 'e', 'a']

console.log(..."hello"); //h e l l o
console.log([..."hello"]); //  ['h', 'e', 'l', 'l', 'o']
```

:::

```js
let mySet = new Set().add("a").add("b");
console.log(...mySet); // a b
console.log([...mySet]); // ['a', 'b']
```

## for문과 forEach문

자바스크립트에서 주로 사용되는 반복문은 **전통적인 for문과** **forEach문이** 있다.

:::tip forEach문 사용법
이터러블 객체의 메서드로 사용되며, forEach 메서드의 파라미터로 **함수가 전달될 수 있다.**

```js
// 기존 함수 정의방식
let ar = [1, 2, 3];
ar.forEach(function(x) {
  console.log(x);
}); // 1,2,3

// 화살표함수 이용
ar.forEach((val) => console.log(val)); // 1,2,3
// 파라미터가 하나이므로 괄호는 생략가능하다.
```

참고로 자바스크립트에서도 for in 구문이 적용될 수 있다.

```js
let ar = [1, 2, 3];
for (let i in ar) {
  console.log(i); // 1,2,3
}
```

:::

## set과 반복문

set 자료구조는 인덱스 개념이 존재하지 않으므로 for문은 물론 for-in 구문으로 출력을 시도해도 **undefined가** 출력된다.

**for-of구문을 사용하여 출력해야한다.**

:::tip for of vs for in
for in 반복문은 열거형 속성(Enumerable)이 있는 객체에 대해서만 적용 가능하고, for of는 iterable 객체이면 모두 적용 가능하다. set자료구조의 경우 열거형 속성은 없지만 iterable객체이므로 for of 반복문으로만 접근 가능한 것이다.
:::

```js
let ar = ["a", "b", "c"];

for (let i of ar) {
  console.log(i);
} // a,b,c

// 스프레드 연산자를 통해 배열로 바꿔 출력
let newArr = [...ar];
console.log(newArr); // ['a', 'b', 'c']
```

set의 메서드로 **keys(), values()가** 존재하는데 이들이 반환하는 객체 또한 **이터레이터(Iterator) 객체이면서 열거형 속성을 갖지 않는다.** 따라서 for-in구문이 아닌 for-of로 접근하거나 **next()** 메서드를 활용한다.

:::tip next() 메서드
이터레이터 객체는 next() 메서드를 갖는다. next메서드를 통해 반복자 객체 각 원소에 순차적으로 접근할 수 있다.

```js
let ar = new Set(["a", "b", "c"]);
console.log(ar.keys().next()); // {value: 'a', done: false}

let arKey = ar.keys();
console.log(arKey.next()); // {value: 'a', done: false}
console.log(arKey.next()); // {value: 'b', done: false}
console.log(arKey.next()); // {value: 'c', done: false}
console.log(arKey.next()); // {value: undefined, done: true}
```

next 메서드의 결과값으로 done 프로퍼티가 존재하는데 이는 반복자 객체의 전체 원소를 순회 완료했는지에 대한 여부를 알려주는 프로퍼티이다.
:::

set의 `entries()` 메서드는 각 원소를 배열 쌍으로 만들어준다.

```js
for (i of ar.entries()) {
  console.log(i);
} // ['a', 'a'], ['b', 'b']
```
