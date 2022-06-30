---
title: 자바스크립트 코딩테스트 대비 메서드 정리
---

## Infinity

전역 객체 속성, 무한대를 표시하는 값입니다.

```javascript
console.log(Infinity);
```

## == vs ===

`===`은 자료형까지 같아야 true를 반환합니다.

```javascript
console.log(null == undefined); // true
console.log(null === undefined); // false
```

## parseInt

문자열을 10진수, 16진수 등의 정수로 반환합니다.

```javascript
console.log(parseInt('100', 10)); // 100
console.log(parseInt('100', 8)); // 64
console.log(parseInt('100', 2)); // 4
```

## parseFloat

문자열을 실수형 값으로 반환합니다.

```javascript
console.log(parseFloat('5.8')); // 5.8
```

## 배열 메서드

### concat()

두 배열을 합칩니다.

```javascript
let arr = ['one', 'two', 'three'];
let arr2 = ['four', 'five'];

console.log(arr.concat(arr2)); // one two three four five
```

:::warning
arr에서 `concat`메서드를 호출해도 arr배열의 값이 변하지는 않습니다.
:::

### push, pop, unshift, shift

1. push() : 배열 끝에 항목을 추가합니다.
2. pop() : 배열 끝에서 항목을 제거합니다.
3. unshift() : 배열 앞에 항목을 추가합니다.
4. shift() : 배열 앞에서 항목을 제거합니다.

```javascript
let arr = ['one', 'two', 'three'];

arr.push('four');
console.log(arr); // one two three four

arr.pop();
console.log(arr); // one two three

arr.unshift('zero');
console.log(arr); // zero one two three

arr.shift();
console.log(arr); // one two three
```

### indexOf

배열 원소의 인덱스를 찾습니다.

```javascript
let arr = [1, 2, 3];
console.log(arr.indexOf(Math.max(...arr)));
```

### splice()

특정 요소를 삭제 또는 교체합니다.

splice에는 다음 세 가지 인자가 들어갑니다.

1. start : 배열 변경의 시작 인덱스. 음수가 들어가면 끝부터 시작합니다.
2. deleteCount : 배열에서 제거할 요소 수
    - 이 인자를 생략하면 start부터 끝까지 모든 원소를 다 지웁니다.
    - start가 0일때 배열 length보다 큰 값을 지정하면 모든 원소를 지웁니다.
3. item1, item2... : 추가할 원소

```javascript
let arr = ['one', 'two', 'three', 'four'];

arr.splice(2, 0, 'two half'); // ['one', 'two', 'two half', 'three', 'four']

arr.splice(2, 2); // ['one', 'two', 'four']

arr.splice(2, 0, 'three'); //  ['one', 'two', 'three', 'four']
```

:::tip 시간복잡도
splice의 시간 복잡도는 O(n)이다.
:::

### slice()

배열을 인덱스 기준으로 잘라낸 새로운 복사 배열을 반환합니다.

인덱스는 start부터 end-1까지만 가져옵니다. start를 음수로 지정하면 끝 원소부터 시작하고, arr.slice(-3)으로 호출해야 끝 원소까지 복사하여 가져올 수 있습니다.

```javascript
let arr = ['one', 'two', 'three', 'four'];
arr.slice(1, 2); // two three

arr.slice(-3, -1); // two three
arr.slice(-3); // two three four
```

### fill()

start부터 end-1까지 특정 값 하나로 채웁니다. `fill(채울 값, start, end);`

```javascript
let arr = ['one', 'two', 'three', 'four'];

arr.fill(1, 0, 2); // 1, 1, three, four
arr.fill(2, -2); // 1, 1, 2, 2
```

### filter()

`filter`메서드에 전달된 조건을 만족하는 항목으로 구성된 배열을 반환합니다. 조건함수의 인자는 `filter` 호출자 각 아이템입니다.

```javascript
let score = [1, 2, 3, 4, 5];

score.filter((item) => item > 1); // 2,3,4,5
```

### flat()

중첩 배열에 대한 평탄화 작업을 진행합니다. 중첩 단계 이상의 인자를 전달하면 1차원 배열이 반환됩니다. 또는 배열 구멍을 제거합니다.

```javascript
const arr1 = [1, 2, [3, 4]];
arr1.flat();
// [1, 2, 3, 4]

const arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

const arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

const arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const arr5 = [1, 2, , , 3, 4]; // 1,2,empty,3,4
arr5.flat(); // [1,2,3,4]
```

### includes()

배열이 인자로 전달된 항목을 포함하는지 확인합니다.

```javascript
let arr = ['one', 'two', 'three', 'four'];
arr.includes(one); // true
```

### join()

배열을 `join`의 인자로 전달된 값으로 이어붙인 문자열을 반환합니다.

```javascript
let arr = ['one', 'two', 'three', 'four'];

arr.join('.'); // 'one.two.three.four'
```

### map()

각 값에 map에 전달된 동작을 처리한 결과로 수정합니다. 원본 배열은 수정되지 않습니다.

```javascript
let arr = [1, 2, 3];
arr.map((item) => item * item); // 1, 4, 9
```

### sort()

배열을 정렬합니다. 일반적인 오름차 / 내림차순 정렬이 아닌 유니코드 기준 정렬입니다. 1,2,11,3이 있을 경우 1,2,3,11이 아닌 1,11,2,3으로 정렬됩니다.

merge sort방식으로, 시간복잡도가 O(nlogn)이라는 특징이 있습니다.

오름차순 정렬을 하려면 sort메서드 내에 비교함수를 정의합니다.

```javascript
const scores = [1, 2, 11, 0];

scores.sort((item1, item2) => item1 - item2); // 0, 1, 2, 11
scores.sort((item1, item2) => item2 - item1); // 11, 2, 1, 0
```

### reverse()

배열을 역순으로 정렬합니다. 원본 배열을 수정합니다.

```javascript
let arr = [1, 2, 3, 4, 5];

arr.reverse(); // 5,4,3,2,1
```

이 메서드 또한 유니코드 기준으로 정렬합니다.

### reduce()

배열 요소의 누산값을 계산할 때에 사용합니다. 1번째 파라미터로 누적값, 2번째 파라미터로 배열 순회중인 현재 요소의 값을 전달하고 3,4번째 파라미터는 생략해도 됩니다.

```javascript
let arr = [1,2,3];

let result = arr.reduce((누적되고 있는 값, 현재 순회중인 요소값) => {
    return 누적되고 있는 값 + 현재 순회중인 요소 값
})

console.log(result); // 6
```

:::tip forEach vs map
자바스크립트의 배열 메서드중 forEach와 map이 있는데, 두 메서드는 모두 배열 객체 내부 요소들을 순회하며 특정 동작을 취한다는 데에 공통점이 있다.

반면 `forEach`의 경우 인자로 전달될 콜백함수 내에서 **어떠한 값도 리턴하지 않는다.** 단순 출력을 위한 `console.log` 같은 동작만 이루어지며 강제로 return을 시도할 경우 undefined가 반환된다.

```javascript
const a = [1, 2, 3];
a.forEach((item) => console.log(item));
a.forEach((item) => item + 1); // undefined
```

`map`의 경우에는 배열 요소에 대해 값의 변경을 시도할 때에 사용된다. immutable하므로 요소 조작 후 리턴을 한다고 해도 다시 대입연산에 전달해야한다.

```javascript
// map메서드는 immutable하므로 const로 선언해도 상관없다!
const arr = [1, 2, 3];

const modifiedArr = arr.map((item) => item + 1);

console.log(arr); // [1,2,3]
console.log(modifiedArr); // [2,3,4]
```

:::

## Set 자료구조

배열로부터 중복값을 제외한 집합을 반환합니다.

```javascript
let arr = [1, 1, 2, 2, 2, 3, 4];
let s = new Set(arr); // {1, 2, 3, 4}
```

### size

set은 인덱스 개념이 존재하지 않습니다. length가 아닌 size 속성으로 전체 원소 개수를 구할 수 있습니다.

```javascript
let arr = [1, 1, 2, 2, 2, 3, 4];
let s = new Set(arr); // {1, 2, 3, 4}

console.log(s.size); // 4
```

### add, delete, has, clear

1. add(item) : 원소를 하나 추가합니다. O(1)
2. delete(item) : 원소를 하나 제거합니다. O(1)
3. has(item) : 원소를 가지고 있는지 확인합니다. O(1)
4. clear() : 전체 원소를 비웁니다.

```javascript
let arr = [1, 1, 2, 2, 2, 3, 4];
let s = new Set(arr); // {1, 2, 3, 4}

s.add(5); // {1,2,3,4,5}
s.delete(1); // {2,3,4,5}
s.has(2); // true
s.clear(); // Set(0)
```

## Map 객체

파이썬의 딕셔너리와 유사한 자료구조를 갖습니다. `(key, value)`쌍을 하나의 원소로 갖습니다.

### set()

Map객체에 key, value쌍을 넣습니다.

```javascript
let m = new Map();

m.set('one', '하나');
m.set('two', '둘');

console.log(m); // Map(2) {'one' => '하나', 'two' => '둘'}
```

### get()

주어진 키에 해당하는 값을 반환합니다.

```javascript
let m = new Map();

m.get('one'); // 하나
```

### has()

주어진 **키 값이 있는지 확인합니다.**

```javascript
let m = new Map();

m.set('one', '하나');

m.has('one'); // true
```

### for-of 적용

:::tip for in vs for of

-   for in : 객체의 열거 가능한 **속성에** 대해 반복합니다.
-   for of : 객체의 반복 가능한 요소에 대해 반복합니다.
    :::

```javascript
let score = new Map();

score.set('국어', 90);
score.set('영어', 100);
score.set('수학', 70);

for (let [key, value] of score) {
    // 구조분해 적용
    console.log(key, value);
}
```

## String 객체

### concat()

```javascript
let str = 'String';

console.log(str.concat(' Modified!')); // String Modified!
```

### includes()

```javascript
let str = 'abc bd';

str.includes('ad'); // false
str.includes('bd'); // true
```

### split()

문자열을 인자로 전달된 구분자를 기준으로 나눈 후 배열로 반환합니다.

```javascript
let str = '하나,둘,셋,넷';
let arr = str.split(',');

// 다시 join하기
console.log(arr.join(',')); // 하나,둘,셋,넷
```

### replace()

특정 패턴에 일치하는 문자열을 교체합니다. 패턴이 일치하는 가장 첫 번째 요소만 변경합니다.

```javascript
let str = 'abc abcd abcde';
console.log(str.replace('abc', 'HELLO')); // HELLO abcd abcde
```

### slice()

인덱스 기준으로 문자열을 잘라냅니다. 배열 slice와 유사하게 작동합니다.

```javascript
let str = 'Hello';
str.slice(1, 3); // el
```

### indexOf()

인자로 전달된 문자열과 첫번째로 만나는 문자열 인덱스를 반환합니다.

```javascript
let str = '안녕하세요 홍길동입니다.';
str.indexOf('길동'); // 7
```

### toLowerCase() / toUpperCase()

소문자 / 대문자로 변환합니다.

```javascript
let str = 'abc';
if (str == str.toLowerCase()) {
    console.log('소문자입니다.');
} else {
    console.log('대문자입니다.');
}
```

## Math 메서드

1. Math.abs() : 절대값을 반환합니다.
2. Math.cbrt() : 세제곱근을 반환합니다.
3. Math.ceil() : 소수점 첫번째 자리에서 올립니다.
4. Math.floor() : 소수점 첫번째 자리에서 버립니다.
5. Math.max() : 최댓값을 반환합니다.
6. Math.min() : 최소값을 반환합니다.
7. Math.pow(x,y) : x의 y제곱을 반환합니다.
8. Math.random() : 0과 1사이의 난수를 반환합니다.
9. Math.round() : 소수점 첫번째 자리에서 반올림합니다.

:::tip toFixed()
toFixed()는 지정 소수점 다음 자리수에서 반올림합니다.

```javascript
let var = 1.235

var.toFixed(1); // 1.2
var.toFixed(2); // 1.24
```

:::
