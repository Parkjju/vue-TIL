---
title: ES6 제너레이터
---

## 제너레이터란?

제너레이터는 **함수이다.** 평범치 않게 동작하는 함수이다. 일반적인 함수는 한 개의 값만 반환하거나 반환하지 않는데, **제너레이터는 여러 개의 값을 반환한다.**

또한 제너레이터 외부에서 함수가 실행되는 중에 **특정 부분에서 멈추고, 값을 외부에서 받아 하나씩 반환한다.**

제너레이터의 외적인 특징은 \*를 붙이면 제너레이터 함수가 된다.

함수의 실행은 특정 키워드 `yield`에서 멈추었다가 필요한 시점에서 다시 재개된다. 실행흐름 A 중간에 끊겨 `yield`를 통해 외부에 권한을 양도하고, 값을 새롭게 받아서 다시 실행흐름 A를 이어서 진행한다. `yield`후에 제어권이 **호출자에게 양도되는 것이다.** 또한 **호출자에 의해 다시 재개된다.**

의미론적인 부분보다는 코드를 살펴보며 이해를해보자.

```js
function* testGenerator() {
  yield 1;
  yield 2;
  yield 3;
  return 4;
}
```

`console.log(testGenerator())`에 함수를 실행해봐도 별 반응이 없을 것이다. 제너레이터 함수는 호출해도 **코드가 바로 실행되는 것이 아니라, 이터레이터(iterator) 객체를 반환한다.** 이터레이터 **객체를 반환하므로** 메서드를 가지게 되는데 이 메서드가 바로 `next()` 메서드이다. 이는 제너레이터의 주요 메서드이다.

## 제너레이터의 내부 동작

위의 제너레이터 코드를 가지고 이어서 알아보자.

```js
const iteratorObject = testGen();

iteratorObject.next();
// > {value: 1, done: false }
```

제너레이터 함수를 위와 같이 호출하였을 때 이 함수는 **이터레이터(iterator) 객체를 반환헌다.** 이때 이 객체는 **next()** 메서드를 갖는데 이 **next()** 메서드가 실행될 때 마다 `yield` 되었던 부분부터 바로 다음의 `yield`를 만날 때 까지 함수 내부가 실행된다. `yield`를 만나 함수 동작이 멈췄을 때 `yield` 뒤의 값(value)을 반환한다.

결론적으로 `next()`메서드는 항상 `value`와 `done` 프로퍼티를 갖는 객체를 반환한다.

**함수 코드의 실행이 끝났으면 done에 true값을 주어 반환하고, 그렇지 않으면 false로 반환된다.**

## 제너레이터 함수 외부에서 데이터 전달받기

제너레이터 외부에서 데이터를 주고받을 수 있는 이유는 **next()**메서드와 `yield`가 서로 번갈아가며 데이터를 주고받기 때문이다.

```js
function* testGenerator() {
  const a = yield 1;
  const b = yield a * 1;
  const c = yield b + 2;
  return a * b * c;
}
```

위와 같이 제너레이터 함수를 정의하고 다음에 작성된 코드들의 출력결과를 예측해보자.

```js
const iteratorObject = testGenerator();
console.log(iteratorObject.next());
console.log(iteratorObject.next(100));
console.log(iteratorObject.next(48));
console.log(iteratorObject.next(2));
```

:::details 해설

잘못된 접근을 생각해보면, 첫 `next()` 메서드 호출 후 `iteratorObject` 객체에는 각각 `{1, false}`로 프로퍼티 값이 할당되고, `a`에는 1값이 할당된다. 이와 같이 순차적으로 할당된 후 `a`, `b`, `c`에 각각 100, 50, 2가 할당된다. 따라서 최종 리턴값이 10000이 되는데 이는 오답이다.

올바른 접근으로 다시 생각해보자. 호출 순서에 따라 실행되는 코드와 결과를 나열해보면 다음과 같다.

```js
console.log(iteratorObject.next()); // 제너레이터 함수를 호출한다.

const a = console.log(iteratorObject.next()); // yield를 만나 값 1을 반환한다. // 제너레이터에서 yield된 1값을 출력한다.

console.log(iteratorObject.next(100)); // 제너레이터 함수 흐름이 이어지는 위치에 값 100을 할당한다.

const a = 100; // 전달된 값 100이 할당된다.
const b = console.log(iteratorObject.next(100)); // yield를 만나 값 (a*1)을 반환한다. // 제너레이터에서 yield된 a*1값을 출력한다.

console.log(iteratorObject.next(48)); // a*1값인 100을 출력하고 제너레이터 함수로 다시 진입

const b = 48; // 전달된 값 48을 할당.
const c = console.log(iteratorObject.next(48)); // yield를 만나 (b+2) 값 반환 // 제너레이터에서 yield된 b+2값을 출력한다.

console.log(iteratorObject.next(2)); // b+2값인 50을 출력하고 제너레이터 함수로 재진입

const c = 2;
return a * b * c;

console.log(iteratorObject.next(2)); //
```

즉 a에는 100, b에는 48, c에는 2가 전달된다.
:::
