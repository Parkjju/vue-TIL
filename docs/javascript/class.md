---
title: JavaScript - ES6 클래스
---

## ES6 클래스

자바스크립트는 기본적으로 **프로토타입 기반의 언어**이다. 클래스 문법은 존재하지 않았고 객체지향을 프로토타입 체인으로 구현할 수 있었다.

ES5,6를 거치면서 새롭게 클래스 문법을 지원하게 되었지만 프로토타입에 대한 철학을 부정한 것은 아니라는 사실! 프로토타입도 열심히 공부해두도록 하자.

## 클래스 선언과 객체 생성

`class` 키워드를 사용하여 클래스를 선언한다.

```javascript
class Person {} // 생성

const p1 = new Person(); // 객체의 생성

console.log(p1);
```

클래스 생성자함수를 만들어보자. 클래스 내에 `constructor` 키워드로 생성하면 된다.

```javascript
class Person {
    // 생성자(Contructor)
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // 메서드를 정의하자.
    printHello() {
        console.log(`안녕하세요! ${this.name}님!`);
    }
}

// 객체 생성
const hong = new Person('홍길동', 20);
console.log(hong.name);
console.log(hong.age);
hong.printHello();
```

`instanceof` 연산자를 통해 생성한 객체(인스턴스)가 특정 클래스로부터 나온 것인지 검사한다.

```javascript
console.log(hong instanceof Person); // true
```

## 클래스와 프로토타입

`typeof`연산자를 통해 클래스를 찍어보자.

```javascript
console.log(typeof Person); // 결과는?
```

연산에 대한 결과로 **function**이 나타난다. 자바스크립트에서는 함수도 객체이다. 클래스도 객체처럼 작동한다는 것이다.

```javascript
function plus(a, b) {
    return a + b;
}

plus.testProperty = plus(1, 2);
console.log(plus.testProperty); // 3
```

함수도 일반 객체와 마찬가지로 프로퍼티 추가가 잘 이루어지는 것을 볼 수 있다. 여기까지는 `function` 타입에 대한 설명이었다면 클래스가 어떻게 `function`타입으로 찍힐 수 있었을까? 클래스 선언문의 내부동작을 더 깊게 알아보자.

`Person`이라는 클래스를 선언했을때 클래스의 선언문은 다음과 같은 동작을 한다.

1. `Person`이라는 이름의 함수가 생성된다.
2. 함수 내부 블록은 클래스의 `constructor`를 그대로 가져온다. `constructor`가 없으면 빈 함수를 생성한다.
3. 메서드는 같은 이름의 `Person.prototype`에 추가된다. (클래스의 프로토타입 객체)
4. 프로토타입 객체(`.prototype`)쪽에 클래스 내부 메서드를 추가하는 것이기 때문에 인스턴스 생성 후 해당 메서드들에 쉽게 접근할 수 있게 된다. (클래스 내부 동작과 프로토타입)

:::warning 클래스 호이스팅
자바스크립트 클래스의 호이스팅은 `let` 키워드와 동일하게 동작한다. 렉시컬 바인딩 코드를 만나기 전까지 변수에 메모리 할당이 이루어지지 않는다.
:::

## 표현식 정의

자바스크립트 표현식에는 무명, 유명 표현식이 있다.

```javascript
// 무명 표현식
// 변수명이 클래스의 이름이 된다.
// 클래스의 name프로퍼티를 출력해보자.
const Person = class {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
};
console.log(Person.name);
```

```javascript
//유명 표현식
const Person = class namedPerson {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
};

console.log(Person.name); // namedPerson을 출력한다.
```

유명 표현식 사용 시, 변수 생성 후 클래스 할당으로 코드를 짤때 **할당된 변수로 new 키워드를 호출해야한다.**

```javascript
const me = new Person('경준', '26');
const me2 = new namedPerson('Jun', '26'); // Error
```

:::warning
클래스로 생성 시 내부 메서드 및 프로퍼티들은 **열거형 속성을 갖지 않는다.** 따라서 `for...in` 구문으로 출력을 시도하면 생성자 함수 내부의 프로퍼티 목록만 출력된다.

클래스 생성시 클래스 내부 메서드들은 프로토타입 객체에 존재하게 되고, 클래스 내부 생성자 함수의 프로퍼티들은 동일한 이름의 생성자 함수 내에 존재하게 된다.

```javascript
class Car {
    constructor(name, speed) {
        this.name = name;
        this.speed = speed;
    }

    speedUp() {
        console.log('FAST');
    }
}

myCar = new Car('KIA', 30);

for (let i in myCar) {
    console.log(i); //  name, speed
}
```

`Object.keys(Object.getPrototypeOf(인스턴스))` 코드를 통해서도 클래스 기반 객체 인스턴스 메서드는 출력되지 않는다. `Object.keys` 메서드가 열거형 속성을 갖는 데이터에 대해서만 취급하기 때문이다.

비-열거형 속성을 갖는 데이터에 대해 접근하려면 `Object.getOwnPropertyNames()` 메서드를 사용하면 된다.

`Object.getOwnPropertyNames(Object.getPropertyOf(클래스 객체 인스턴스))`
:::
