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

:::tip instanceof 연산자
`instanceof`는 특정 인스턴스가 생성자 함수 A로부터 생성되었는지 확인하는 연산자이다. 사용하는 방법은 `객체명 instanceof 생성자 함수명`으로 사용한다. 객체와 생성자 두개가 필요하므로 이항 연산자이다.
:::

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const personObject = new Person("홍길동", 20);
const literalObject = {
  name: "홍길동",
  age: 20,
};

console.log(personObject instanceof Person); // true
console.log(literalObject instanceof Person); // false
```

`literalObject`는 Person 생성자 함수로부터 생성된 인스턴스가 아니므로 `instanceof` 연산자의 결과가 false이다. 하지만 `literalObject`의 `__proto__` 프로퍼티를 통해 객체 원형이 `Person` 생성자 함수와 동일한 이름의 프로토타입 객체를 가리키도록 한다면 결과는 달라진다.

```js
literalObject.__proto__ = Person.prototype;
console.log(literalObject instanceof Person); // true
```

또한 리터럴 객체이더라도 `Object` 원형을 상속하므로 `literalObject instanceof Object`의 결과는 `true`가 된다. `instanceof` 연산자 이외에도 `isPrototypeOf()` 메서드도 있다.

```js
let p = new Person("Park", 20);
Person.prototype.isPrototypeOf(p); // true
// Person.prototype - Person 생성자 함수의 프로토타입 객체
```

## 프로토타입 예제 (1)

아래 코드를 프로토타입 체인을 통해 상속이 구현되도록 바꿔보자. 또, 각 객체로부터 파생되는 다양한 객체들을 프로토타입 상속을 이용하여 생성해보자.

```js
const apt = {
  color: "red",
  rooms: 4,
  toilet: 1,
  turnon() {
    console.log("turn on...");
  },
};

const villa = {
  color: "black",
  rooms: 3,
  toilet: 1,
  turnon() {
    console.log("turn on...");
  },
};

const oneroom = {
  color: "blue",
  rooms: 1,
  toilet: 1,
  turnon() {
    console.log("turn on...");
  },
};
```

:::detail 해설
위의 세 객체는 **건물이라는** 범주 안에 포함된다. 이를 `house`라고 정의했을 때 공통된 프로퍼티를 빼 내어 상속관계를 확립하면 된다.

객체들 중 `toilet`프로퍼티와 `turnon()` 메서드는 동일한 상황이므로 `house`라는 객체로 일단 묶는다.

```js
const apt = {
  color: "red",
  rooms: 4,
};

const villa = {
  color: "black",
  rooms: 3,
};

const oneroom = {
  color: "blue",
  rooms: 1,
};
const house = {
  toilet: 1,
  turnon() {
    console.log("turn on...");
  },
};
```

`apt`, `oneroom`, `villa`는 모두 `house` 객체로부터 `toilet`, `turnon`을 상속받는다. 세 객체가 갖는 `__proto__` 속성을 `house`객체로 할당시키면 상속 구현이 완료된다.

```js
apt.__proto__ = house;
console.log(apt.toilet); // 1
apt.turnon(); // turn on...

oneroom.__proto__ = house;
// ....
```

또 `apt`, `villa`, `oneroom` 객체를 상속받는 객체를 생성해보자.

```js
const riverView = {
  name: "한강뷰 아파트",
  price: "10억",
};

riverView.__proto__ = apt;

console.log(riverView.name); // 한강뷰 아파트
console.log(riverView.rooms); // 4
```

`apt`객체는 toilet과 turnon을 가지고 있지 않았음에도 프로토타입 체인으로 인해 `riverView`객체에서도 apt의 원형 프로퍼티와 메서드에 접근할 수 있다.

:::

## 프로토타입 예제 (2)

위 코드에서 이어질때 `riverView` 객체를 `for .. in` 반복문에 순회시킬 때의 결과를 예측해보자.

`for..in` 반복문에 대한 설명은 [다음의 링크를 참조하자.](https://parkjju.github.io/vue-TIL/javascript/set.html#set%E1%84%80%E1%85%AA-%E1%84%87%E1%85%A1%E1%86%AB%E1%84%87%E1%85%A9%E1%86%A8%E1%84%86%E1%85%AE%E1%86%AB)

:::detail 해설
객체를 `for...in` 반복문에 순회시킨다는 것이 무엇을 의미하는지 생각해보자.

```js
for (let i in riverView) {
  console.log(i);
}
// 부모 프로퍼티까지 모두 순회한다.
```

**프로토타입 체인이 연결되어 있는 프로토타입의 멤버(프로퍼티, 메서드)들이 모두 출력된다.**

참고로, `Object.keys(riverView)`와 `Object.values(riverView)` 메서드는 `for-of`문으로 출력해야 하며 (not Enumerable) 프로토타입 체인으로 연결된 부모 객체 **프로퍼티는 출력하지 않는다.**

:::

## 프로토타입 예제 (3)

위 코드를 생성자 함수와 new 연산자를 사용하는 예제로 바꿔보자. 즉, `house` 생성자 함수를 바탕으로 `apt`, `villa` 등 객체를 생성하면 된다.

:::detail 해설

```js
const makeHouse = function (name, color, rooms) {
  this.name = name;
  this.color = color;
  this.rooms = rooms;
}; // name, color, rooms는 모두 객체마다 다른 값을 가진다.
makeHouse.prototype.toilet = 1; // toilet은 공통 속성
makeHouse.prototype.turnon = function () {
  // turnon은 공통속성
  console.log("turn on...");
};

const apt = new makeHouse("riverView", "white", 4);
```

new 연산자가 붙은 뒤에 빈 객체를 생성, `toilet`과 `turnon`과 같은 공통 프로퍼티를 먼저 할당하고 `makeHouse`내에 전달된 값들을 할당한다.

:::

## 프로토타입 예제 (4)

생성자 함수 내의 속성값을 외부에서 수정하지 못하도록 변경하자. `생성자함수.prototype.property`로 접근하여 값을 바꿀 수 있는데 이를 금지시켜야 상속의 의미가 명확해진다.

이를 금지하는 방법은 다음과 같다.

1. 생성자 함수 내에서 `const`로 멤버를 선언한다.
2. 해당 값을 외부에서 접근하는 getter 메서드를 정의한다. (const 선언만으로는 공개된 프로퍼티로써 접근할 수 없게 되기 때문이다.)

코드를 보자.

```js
const makeHouse = function (inputName, color, rooms) {
  const name = inputName;
  this.getName = () => console.log(name);
  this.color = color;
  this.rooms = rooms;
};

apt = new makeHouse("riverView", "white", 3);
apt.getName(); // riverView
```
