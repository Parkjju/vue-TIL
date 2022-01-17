---
title: ES6 프로토타입 문법적 접근 (2)
---

[ES6 프로토타입 객체 문법적 접근 (1)로부터](./prototypeReal.md) 이어지는 내용입니다.

## 생성자 함수와 내부에서 처리되는 동작들

**생성자 함수는 공장이다.**

```js
// 객체 리터럴
const animal = {
  name: "tiger",
  age: 20,
};
```

위의 객체 리터럴과 비슷한 객체를 수없이 만들어야 하는 경우에 **생성자 함수를 만들어놓고 사용한다.**

:::tip

생성자 함수의 첫 글자는 관례적으로 대문자로 작성합니다. `animal`이 아닌 `Animal`로 작성하는 것이 그 예시입니다.

:::

생성자 함수가 생성될 때 객체 자기자신을 가리킬 때에는 `this`를 사용하고, new 연산자를 통해 새로운 객체를 만드는 데 new 연산자를 사용하지 않으면 `undefined` 처리가 된다.

```js
function Animal(name, age) {
  this.name = name;
  this.age = age;
}

let myAnimal = new Animal("고양아", 2);
```

## 생성자 함수의 내부 실행과정

```js
function Person(name, age) {
  // this = {}
  this.name = name;
  this.age = age;
  // return this
}
```

**`this`라는 빈 객체를 하나 생성한 뒤에 속성을 추가한다..** 모든 작업을 처리한 뒤 `this` 객체를 리턴하는 것으로 생성자 함수가 종료된다.

## 프로토타입 객체의 속성

`contructor` 프로퍼티는 함수를 참조한다. (가리킨다) 즉 참조를 값으로 가지는 프로퍼티이다. `constructor` 프로퍼티를 통해 생성자 함수와 생성자 함수의 프로토타입 객체는 서로를 참조하게 된다. (서로가 연결고리 역할을 한다.)

```js
function Animal(name, age) {
  this.name = name;
  this.age = age;
}

Animal.prototype.printA = function () {
  console.log("A");
};

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.printB = function () {
  console.log("B");
};

let animalObject = new Animal("tiger", 20);
animalObject.printA(); // A

let personObject = new Person("Park", 30);
personObject.printB(); // B
```

위 예시의 흐름을 정리해보면 다음과 같다.

1. `Animal` 생성자 함수가 new 연산자를 만나 `Animal` 프로토타입 객체가 만들어진다. name 프로퍼티와 age 프로퍼티에 각각 `tiger`, `20` 값이 할당된다.
2. `Animal` 프로토타입 객체의 프로퍼티로 (prototype 프로퍼티를 통해 프로토타입 객체에 접근하는 방식 되새기기) `printA` 메서드와 `printB` 메서드를 정의한다.
3. 객체 생성 뒤 프로토타입 객체의 프로퍼티로 정의한 함수에 접근한다.
4. `Animal`로 생성한 객체로 `printB` 함수를 호출하고 싶으면 `printA`를 포기하고 `animalObject.__proto__ = Person.prototype;`으로 객체 프로토타입을 변경하면 된다.

## 인스턴스를 생성한 생성자 함수 알아내기

인스턴스는 new 연산자와 생성자 함수로 생성된 객체를 의미한다.

프로토타입 객체의 프로퍼티 `constructor`가 생성자 함수를 가리키므로 이를 확인하면 인스턴스를 생성한 생성자 함수를 알아낼 수 있다.

new 연산자로 생성된 인스턴스는 **자신의 프로토타입에서** (생성자 함수와 함께 생성된 동일한 이름의 프로토타입 객체) 프로퍼티와 메서드를 상속받으므로 프로토타입 객체의 `constructor` 속성을 참조 가능하다. (이해가 되지 않으면 다시 천천히 읽어보기.)

위 예시를 다시 살펴보자.

```js
console.log(animalObject.constructor); // Animal 생성자 함수를 가리킨다.
```

간단한 예제를 확인해보자.

```js
function A() {}
const testObject = new A();
console.log(testObject.constructor);
```

testObject는 A 프로토타입 객체를 가리키고 testObject에는 `constructor`프로토타입이 정의되어 있지 않으므로 A 프로토타입 객체에 있는 `constructor` 프로퍼티가 프로토타입 체이닝에 의해 출력된다.

다음의 예시도 살펴보자.

```js
function A() {}
console.log(A.prototype.__proto__);
```

함수 A의 `prototype` 프로퍼티는 자신과 이름이 동일한 프로토타입 객체를 가리킨다. 이 프로토타입 객체의 `__proto__` 프로퍼티, 원형은 최상위 오브젝트인 `Object`를 가리킨다.
