---
title: JavaScript - this
---

## 자바 this

자바스크립트 `this`는 인스턴스 자신을 가리키는 의미의 `this`가 아니다.

```java
public class Person{
	private String name;

    public Person(String name){
    	this.name = name;
    }
}
```

자바에서의 `this`는 객체 인스턴스 자신을 가리킨다.

## 자바스크립트 this

> 자바스크립트의 경우 함수 호출 방식에 의해 `this`에 바인딩할 어떤 객체가 동적으로 결정된다. 다시 말해, 함수를 선언할 때 this에 바인딩할 객체가 정적으로 결정되는 것이 아니고, **함수를 호출할 때 함수가 어떻게 호출되었는지에 따라** this에 바인딩할 객체가 동적으로 결정된다. - [Poimeweb - javascript this](https://poiemaweb.com/js-this)

바인딩은 요소와 데이터를 묶는 행위라고 보면 된다. `this` 결정 방식은 렉시컬 스코프와 반대이다. 렉시컬 스코프는 선언과 동시에 변수의 스코프가 정해지는 **정적 방식** 이라면 `this`의 경우 호출 방식에 따라 그때그때 달라지기 때문에 **동적 방식이다.**

함수를 호출하는 방식이라는 것이 어떻게 나누어질까?

1. 함수 호출
2. 메서드 호출
3. 생성자 함수 호출
4. `apply/call/bind` 호출

## 함수 호출

브라우저에서의 최상위 객체는 `window` 객체이다. 윈도우 객체는 전역변수를 프로퍼티로 갖는다.

```javascript
var globalVariable = "I'm global";
console.log(window.globalVariable); // I'm global

function foo() {
    console.log('bar');
}
window.foo(); // bar
```

`this`는 기본적으로 전역객체에 바인딩 된다. 내부함수(중첩)의 경우에도 전역객체와 바인딩된다.

```javascript
function foo() {
    console.log('foo called : ', this); // window

    function bar() {
        console.log('bar called : ', this);
    }
    bar();
}

foo();
```

메서드 **내부함수의 경우에도** 전역객체와 바인딩된다. 메서드의 `this`는 객체 인스턴스를 가리키지만 내부 중첩 함수는 전역 객체를 참조한다.

```javascript
var value = 'global';

var obj = {
    value: 'local',
    objectFunction: function () {
        console.log('foo called: ', this); // object
        console.log('foo called: ', this.value); // local

        function bar() {
            console.log('bar called: ', this); // window
            console.log('bar called: ', this.value); // global
        }

        bar();
    },
};

obj.objectFunction(); // global
// 객체 메서드 호출 시 괄호도 붙여야됨
```

콜백함수도 전역 객체를 참조한다. `setTimeout`을 호출하는 메서드 내부에 `setTimeout` 콜백함수를 작성한다.

```javascript
var obj = {
    value: 'local',
    objectFunction: function () {
        setTimeout(() => {
            function foo() {
                console.log('foo method called this : ', this); // window
            }
            foo();
        }, 1000);
        setTimeout(() => {
            function foo() {
                console.log('foo method called this.value : ', this.value); // global
            }
            foo();
        }, 1000);
    },
};

obj.objectFunction();
```

지금까지의 현상을 종합해보면 **내부함수는 함수의 종류에 상관없이 this가 전역객체를 바인딩한다는** 사실을 알 수 있다.

내부함수의 `this`가 전역 객체를 가리키는 이유는 설계 단계에서의 결함으로 인해 외부 함수가 내부 함수에 접근하여 `this`를 통한 값 변경 등의 작업을 완전히 예방하기 위해서이다. 중첩된 함수에서 `this`를 우리가 의도한 대로 사용하기 위해서는 다음과 같이 코드를 작성해야한다.

```javascript
var value = 'global';

var obj = {
    value: 'local',
    foo: function () {
        propertyOfLocalThis = this; // 중첩 함수에서의 안전한 this처리

        function bar() {
            console.log(
                'nested function bar called this without operation : ',
                this
            ); // window
            console.log(
                'nested function bar called this with operation : ',
                propertyOfLocalThis
            ); // Object
            console.log(
                'nested function bar called this.value with operation : ',
                propertyOfLocalThis.value
            ); // local
        }
        bar();
    },
};
```

## 메서드 호출

위에서 내부함수의 `this` 바인딩을 확인할 때에 메서드에서의 `this`는 객체 자신을 가리키는 것을 볼 수 있었다. **해당 메서드를 호출한 객체와 바인딩 된다.**

```javascript
var person = {
    name: '박경준',
    sayName: function () {
        console.log(this.name);
    },
};

person.sayName();
```

생성자 함수의 `prototype` 객체도 메서드를 가질 수 있다. 프로토타입에 대한 이해가 필요한 부분이지만 간단히 설명하자면 `prototype`은 생성자 함수로부터 만들어진 객체 인스턴스가 모두 참조할 수 있는 메서드 및 프로퍼티를 모아두는 공간이라고 보면 된다.

프로토타입에 대한 설명은 [작성해둔 문서를](https://parkjju.github.io/vue-TIL/javascript/prototype.html#%E1%84%91%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%90%E1%85%A9%E1%86%AB%E1%84%80%E1%85%AA-%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A2%E1%84%89%E1%85%B3-%E1%84%80%E1%85%B5%E1%84%87%E1%85%A1%E1%86%AB-%E1%84%8B%E1%85%A5%E1%86%AB%E1%84%8B%E1%85%A5) 참조하자.

```javascript
function Person(name, age) {
    this.name = name;
} // 생성자 함수

Person.prototype.callNameWithThis = function () {
    console.log(this.name); // 객체 인스턴스의 name 프로퍼티를 출력
}; // 프토토타입 체인을 통해 name 프로퍼티를 찾는다.

var Jun = new Person('Park Gyeong Jun', 25);
Jun.callNameWithThis(); // Park Gyeong Jun
```

## 생성자 함수 호출

일반 객체지향 언어와는 다르게 자바스크립트에서는 **어떤 함수에나 new 연산자만 붙이면 생성자 함수로 활용할 수 있다.** 이 또한 프로토타입과 관련된 내용이므로 기존 문서를 참고하자.

`new` 연산자와 함께 생성자 함수 호출 시 일어나는 일련의 과정을 살펴보자. [다음 링크에](https://parkjju.github.io/vue-TIL/javascript/prototype.html#%E1%84%91%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%E1%84%90%E1%85%A9%E1%86%AB%E1%84%80%E1%85%AA-%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A2%E1%84%89%E1%85%B3-%E1%84%80%E1%85%B5%E1%84%87%E1%85%A1%E1%86%AB-%E1%84%8B%E1%85%A5%E1%86%AB%E1%84%8B%E1%85%A5) 더 자세히 설명되어 있으니 참고하자.

간단히 정리하면 다음과 같은 과정을 따르게 된다.

1. 생성자 함수 생성과 동시에 동일한 이름의 프로토타입 객체가 생성된다. `constructor.prototype`으로 접근할 수 있다.
2. `new` 연산자 호출 시 빈 객체 하나가 생성된 뒤 `constructor.prototype` 프로토타입 객체를 `__proto__` 프로퍼티를 통해 가리키게 된다.
3. 생성자 함수의 프로토타입 객체로부터 각종 메서드 및 프로퍼티를 상속받은 후 파라미터에 따라 값 초기화가 이루어진다.

메서드 호출에 작성되어 있는 예제 코드만 이해하면 생성자 함수 호출에 대한 `this` 동작은 이해가 어렵지 않을 것이다.

```javascript
function Person(name) {
    this.name = name;

    console.log(this.__proto__); // 생성된 빈 객체의 프로토타입을 가리킨다.
    // 생성자 함수 Person을 가리키게 된다.
}

var Jun = new Person('Gyeong Jun');
```

원래라면 `Person` 생성자 함수 내에 작성된 `this.__proto__`는 글로벌 객체인 `window`의 프로토타입을 참조하는 것이 맞지만, 생성자 함수이기 때문에 특별하게 작동한 것이다.

위에서 언급했듯 자바스크립트 생성자 함수는 자유롭기 때문에 개발자 간의 암묵적인 약속이 필요하다. **일반적으로 자바스크립트 생성자 함수 이름의 첫 글자를 대문자로 표기하는 것으로 약속한다.**

그럼에도 누군가는 생성자 함수인 줄 모르고 단순 호출을 진행하기 때문에 `Scope-Safe Constructor Pattern`이라는 디자인 패턴을 가지고 생성자 함수를 작성한다.

```javascript
// Scope-Safe Constructor Pattern

// new 연산자가 있었으면 그대로 프로퍼티 값을 할당한다.
// new 연산자가 누락되어 있었으면 new를 사용한 객체 인스턴스를 생성하여 리턴해준다.

function TestNewOperator(arg) {
    if (!(this instanceof arguments.callee)) {
        console.log('new operator Missing!');
        return new TestNewOperator(arg + 'ERROR occurred!');
    } else this.testResult = arg + '...END!';
}

const testWithoutNewOperator = TestNewOperator('testing...');
console.log('Test Result without New : ', testWithoutNewOperator.testResult);

const testWithNewOperator = new TestNewOperator('testing...');
console.log('Test Result with New : ', testWithNewOperator.testResult);
```

위 예제코드의 흐름은 다음과 같다. 참고로, `arguments.callee` 프로퍼티는 현재 실행 중인 함수 자체를 가리킨다.

1. 생성자 함수를 작성한다.
2. 생성자 함수 호출자를 `this`를 통해 참조하는데, `new`를 통해 호출했을 경우 `arguments.callee`가 가리키는 생성자 함수의 인스턴스가 되므로 `this instanceof arguments.callee`가 \`true를 반환한다.
3. `new`없이 함수만 호출할 경우 `arguments.callee`가 여전히 생성자함수 자기 자신을 가리키고 있는데 `this`의 값이 전역객체 `window`를 가리키게 되어 `this instanceof arguments.callee`가 `false`를 반환한다.

## apply/call/bind 호출

먼저 자바스크립트의 `arguments` 객체에 대해 알아보자. [MDN - arguments 객체 문서를 참조하였다.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/arguments)

:::tip arguments
`arguments` 객체는 함수 내에서 사용되는 지역 변수이다. 함수에 전달되는 인자들에 접근할 수 있다. 배열 형태로 반환받으며 온전한 `Array`가 아닌 유사 배열이다. 인덱스를 통한 접근은 가능해도 **forEach, map 등의 메서드는 사용 불가능하다.**

인수는 `get` 뿐만 아니라 `set`도 할 수 있다. `arguments` 객체의 프로퍼티는 다음과 같다.

1. `arguments.callee` : 현재 실행 중인 함수의 이름을 참조한다.
2. `arguments.length` : 함수 전달 인수의 개수를 출력한다.

```javascript
function foo(a, b, c) {
    console.log('Arguments 호출 함수 이름 : ', arguments.callee);
    console.log('Arguments 개수 : ', arguments.length);
}

foo(1, 2, 3);
```

:::

### 1. apply 메서드

`apply` 메서드는 함수의 프로토타입 객체의 메서드이다. `Function.prototype.apply`이다.

```javascript
//기본 사용법
function howToUse(arg1, arg2) {
    this.myArg1 = arg1;
    this.myArg2 = arg2;
}
var emptyObject = {};

howToUse.apply(emptyObject, ['arg1 value', 'arg2 value']);
```

`new` 연산자를 통한 `this` 바인딩을 직접 해준다고 생각하면 된다. `this` 바인딩은 자바스크립트에서 정의해놓은 규칙에 따라 자동으로 진행되지만, `apply`를 통해 명시적으로 지정하는 것이다. `this` 바인딩 할 객체는 꼭 비어있을 필요가 없다. 프로토타입 체이닝을 통해 동적으로 프로퍼티를 추가/값 수정이 이루어지기 때문이다.

```javascript
function Person(name) {
    this.name = name;
}

foo = {}; // 빈 객체 생성

Person.apply(foo, ['this binding value']);
console.log(foo.name); // this binding value
```

`Person.apply()`는 본질적으로 `Person` 함수의 호출이다. `apply` 메서드 호출 시 별다른 파라미터 전달 없이도 메서드 호출자인 함수는 그대로 실행이 된다는 것이다.

```javascript
function printName(name) {
    this.name = name;
    console.log('my name is : ', this.name);
}

printName.apply(); // 파라미터 없이 printName실행
// name이 바인딩되지 않았으므로 undefined를 출력한다.
```

`apply` 메서드는 `arguments` 객체가 유사배열이기 때문에 사용하지 못하는 `Array` 객체 메서드를 사용하기 위해 주로 사용된다.

```javascript
function args() {
    console.log(arguments); // Arguments 관련 메서드,프로퍼티가 출력
    var myargs = Array.prototype.slice.apply(arguments);
    console.log(myargs); // Array 관련 메서드, 프로퍼티가 출력
}
```

위 코드는 `Array` 객체들이 상속받는 내부 메서드를 `prototype`으로 접근하여 그 중 `slice` 메서드를 호출한다. `slice` 호출과 동시에 `this`를 `arguments`와 바인딩하게 된다.

간단히 정리하면 **호출자 함수를 apply에 전달된 객체의 메서드인것 처럼 작동하게 되는 것이다.** `arguments`의 경우 유사 배열이기 때문에 호출하지 못하는 `slice`메서드를 `arguments.slice()` 메서드처럼 사용할 수 있게 된 것이다.

`call` 메서드의 경우에는 `apply`에 전달되는 파라미터를 콤마로 각각 분리하여 전달한다고 보면 된다. 배열로 전달하게 되면 배열 자체가 파라미터로 전달된다. 자세한 구분은 [What is the difference between call and apply?](https://stackoverflow.com/questions/1986896/what-is-the-difference-between-call-and-apply)를 참조하자.

```javascript
function thisTestFunction(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    console.log('My name is ', this.firstName, this.lastName);
}

var foo = {};

thisTestFunction.apply(thisTestFunction, ['GyeongJun', 'Park']);
thisTestFunction.call(thisTestFunction, 'GyeongJun', 'Park');
// 출력 결과는 동일하다.
```

call 메서드는 콜백 함수에서의 this를 바인딩하는 데에도 사용된다. 렉시컬 스코프가 기본인 자바스크립트에서는 선언부의 위치가 더 중요하기 때문에 `this`를 사용하는 콜백함수를 글로벌 스코프에서 선언할 경우 `window` 객체가 나타나게 된다.

콜백함수에 대한 설명은 [다음의 문서](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)를 참조하자. 콜백 함수는 **다른 함수의 인자로 전달되는 함수라고 이해하면 된다.**

생성자 함수의 프로토타입 객체 메서드에서 콜백함수를 호출하는 코드를 살펴보자. 콜백에서 `this`를 사용하면, 호출 결과로 객체가 나타나게 될까?

```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.printName = function (foo) {
    foo(); // 콜백을 호출한다.
};

function bar() {
    console.log(this.name);
}

var jun = new Person('Jun');
jun.printName(bar); // 출력 결과는?
```

객체 `jun`의 `printName` 메서드 콜백으로 `bar`를 호출한다. 예상이 되는 출력결과는 다음과 같다.

1. `bar`를 콜백으로 호출한 호출자 함수 `printName`를 메서드로 갖는 `jun`객체의 `name` 프로퍼티에 접근, 최종적으로 Jun을 출력하게 된다.
2. `bar`를 콜백으로 호출하였음에도, 렉시컬 스코프에 의해 `bar` 내의 `this`는 `window`를 가리키게 된다. 따라서, undefined가 출력된다.

정답은 2번이다. 콜백 함수 호출 시 `this`를 정확하게 이용하려면 값 바인딩을 직접 처리해야한다.

```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.printName = function (foo) {
    foo.apply(this); // apply를 통해 this값을 바인딩한다.
};

function bar() {
    console.log(this.name);
}

var jun = new Person('Jun');
jun.printName(bar); // 출력 결과는?
```

`printName` 메서드 정의 시 `this`를 콜백함수 `foo`와 바인딩하였다. 이때의 `this`는 호출자 함수 `printName` 스코프 기준이다. 따라서 `printName` 메서드를 갖는 `Person` 객체를 가리키고 있다. 정리하면, `Person`객체를 `foo` 콜백함수와 바인딩하여 `Person.foo()` 형태로 호출하게 되는 것이다.

이후 `jun.printName(bar)`를 호출하면 `bar` 콜백이 호출되며 `bar` 함수의 `this`는 이미 객체와 바인딩되어 있는 상태이기 때문에 객체의 `name` 프로퍼티에 접근하여 최종적으로 `Jun`을 호출한다.

## bind

`bind` 메서드는 `apply`, `call` 과는 다르게 `this`가 바인딩된 객체를 리턴하는 것이 아니라, `this`가 바인딩된 **함수를 리턴한다.**

```javascript
const thisObject = {
    x: 42,
    getX: function () {
        return this.x;
    },
};
var unboundResult = thisObject.getX;
console.log(unboundResult()); // undefined

var boundResultWithApply = unboundResult.apply(thisObject);
console.log(boundResultWithApply); // 42

const boundResultWithBind = unboundResult.bind(thisObject);
console.log(boundResultWithBind); // function{...}
```

`unboundResult`는 선언부에서 현재 `this`가 바인딩되어 있지 않기 때문에 그 결과를 출력해도 함수를 실행하여도 `thisObject`의 프로퍼티 `x`값인 42가 출력되지 않고, `undefined`가 출력된다.

`apply` 메서드는 위에서 언급했듯, **본질이 함수 호출에 있다.** 따라서 `apply` 메서드의 반환은 **함수 호출 반환값이 된다.** `thisObject`와 `unboundResult`를 바인딩한 뒤 `unboundResult`를 호출하게 되며, `this`는 `thisObject`를 가리키게 되므로 프로퍼티 x의 값인 42가 출력된다.

반면, `bind` 메서드는 **함수값을 반환하지 않고, 바인딩된 함수 자체를 반환한다.** `boundResultWithBind`를 호출하면 함수 객체 자체가 호출되는 것을 볼 수 있다. 확장성 면에서 `bind` 메서드가 더 좋다고 할 수 있다. `bind`메서드를 적용한 함수를 호출하려면 `boundResultWithBind()`, `boundResultWithBind(parameters)`의 형태로 일반 함수처럼 호출하면 된다.

bind 메서드를 활용한 리액트 커스텀 HTTP 리퀘스트 훅 예시를 보려면 [다음의 링크를](../react/hooks.md#bind-메서드-활용)참조해주세요.

## Reference

1. [Poimeweb - javascript this](https://poiemaweb.com/js-this)
2. [MDN - arguments](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/arguments)
3. [What is the difference between call and apply?](https://stackoverflow.com/questions/1986896/what-is-the-difference-between-call-and-apply)
4. [MDN - Callback Function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)
5. [Devdocs - bind()](https://devdocs.io/javascript/global_objects/function/bind)
