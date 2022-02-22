---
title: Scope

---
## 스코프란?

아무개가 묻는다. 스코프가 뭐니?

이에 대한 대답을 3초만 생각해보자. 범위? 엄밀한 의미를 따져보기 위해 다음의 코드를 살펴보자.

``` javascript
var x = 'hello';

function foo(){
  var x = 'bar';
  console.log(x);
}

foo(); // bar
console.log(x); // hello
```

> 스코프는 참조 대상 식별자(identifier, 변수, 함수의 이름과 같이 어떤 대상을 다른 대상과 구분하여 식별할 수 있는 유일한 이름)를 찾아내기 위한 규칙이다. 자바스크립트는 이 규칙대로 식별자를 찾는다. - Poimeweb

스코프는 **범위가 아닌 규칙이다.** 대상 구분을 위한 유일한 기준 식별자를 찾아내기 위한 규칙이다. 식별자 간의 충돌을 방지해주는 아주 고마운 녀석이다.

스코프는 비단 자바스크립트에만 적용되는 것이 아닌 프로그래밍 전체를 봐도 꼭 필요한 개념이다. 대학 신입생때 C언어 전역변수 선언에 대한 경험이 다들 있지 않은가. 변수는 전역범위, 함수와 반복문 조건문 등의 블록 내의 범위, 중첩 반복문 등에서의 새로운 범위 등이 에서 선언되곤 했다. 다양한 상황에서도 변수간의 이름 충돌이 일어나지 않게 하는 것이 바로 스코프이다.

## 스코프 구분

자바스크립트에서 스코프를 구분하면 다음과 같다.

1. 전역 스코프 (Global Scope) - 코드 어디에서든 참조가 가능
2. 지역 스코프 (Local Scope or Function-level scope) - 함수 코드 블록이 만든 스코프. 코드 블록 내부 또는 내부에 중첩된 블록에서 참조 가능.

변수는 선언된 지역에 따라 전역 변수와 지역 변수로 나뉠 수 있다. 전역 변수는 전역 스코프를 갖고, 지역 변수는 지역 스코프를 갖는다.

## 자바스크립트 스코프

대부분의 언어는 **블록 레벨 스코프를** 따른다. 코드 블록 내에서 유효한 스코프를 뜻한다.

```c
int main(void){
	if(1){
    	int x = 5;
        printf("%d\n",x); 
    }
    printf("x = %d\n", x); // undeclared Error!
    
    return 0;
}
```

위의 c 코드에서 조건문 내에 선언된 x는 조건문 밖에서 호출해도 컴파일러가 인식하지 못한다. 하지만 자바스크립트에서는 어떨까?

```javascript
function functionScope(){
    if(true){
        var functionScopeVariable = 1;
        console.log(functionScopeVariable);
    }
    console.log(functionScopeVariable);
}

functionScope(); // 1이 두번 출력된다.
```

조건문 블록 내에서 선언된 `x` 변수가 조건문 블록 밖에서도 유효한 상태로 존재한다. 위 변수를 함수 레벨 스코프가 아닌 블록 레벨 스코프로 제한하기 위해서는 `let` 키워드를 사용하면 된다.

```javascript
function blockScope(){
  if(true){
    let blockScopeVariable = 1;
    console.log(blockScopeVariable);
  }
  
  console.log(blockScopeVariable); // ReferenceError!
}

blockScope();
```

변수 `blockScopeVariable`이 블록레벨 스코프로 처리되어 에러가 출력되는 것을 볼 수 있다.

## 전역 스코프

전역에 선언한 변수는 어디에서든 참조할 수 있게된다. `var`로 선언한 전역 변수는 전역객체 `window`의 프로퍼티이다. 함수 내부에서도 역시 참조할 수 있다.

```javascript
var globalScopeVariable = 1; // 전역 선언
console.log(window.globalScopeVariable); // 1

function foo(){
  console.log(globalScopeVariable); // 1
}
foo();
```

안그래도 전역 변수의 선언은 자제하라고 당부받는데, 자바스크립트의 경우 다른 언어처럼 별도의 시작점(Entry Point, C에서 main함수)이 없기 때문에 전역 변수의 선언이 너무나도 쉽게 이루어진다. 더 조심하도록 하자.

## 비 블록 레벨 스코프

자바스크립트는 기본적으로 **함수 레벨 스코프이다.** 따라서 전역 스코프에서 함수가 아닌 다른 블록 스코프를 마련하여 변수를 선언한다고 해도 이는 **전역 스코프 변수가 된다.** (`var` 키워드로 선언했다는 가정하에. `const`는 블록레벨 스코프이다.)

## 함수 레벨 스코프

C에서의 블록레벨 스코프를 생각하면 된다. 함수 안과 밖은 완전 다른 세계인 것이다.

```javascript
var scopeTest = 'global!';

function foo(){
  var scopeTest = 'local!';
  console.log(scopeTest);
}

console.log(scopeTest);  // global!
foo(); // local!
```

전역 스코프 선언 변수는 함수 내에서도 참조가 가능하지만 변수명이 중복될 경우 지역변수를 우선하여 참조한다.

함수가 중첩된 경우는 어떨까? 직접 이해해보자.

```javascript
var scopeTest = 'global!';

function foo(){
  var scopeTest = 'local!';
  console.log(scopeTest);
  
  function bar(){
    var scopeTest = 'local in local!';
    console.log(scopeTest);
  }
  bar();
}

console.log(scopeTest); // global !
foo(); // local! / local in local!
```

흐름을 간단히 정리해보면 다음과 같다.

1. 글로벌 스코프 `scopeTest`값인 `global!`이 출력된다.
2. foo호출시 지역스코프 우선 규칙으로 인해 `local!`이 출력된다.
3. foo 함수 내의 bar 호출시 지역스코프 우선 규칙으로 인해 `local in local!`이 출력된다.

지역 스코프에서는 전역 스코프의 변수에 접근할 수 있기 때문에 전역 변수의 값을 당연히 변경할 수 있다.

```javascript
var scopeTest = 'global state..';

function foo(){
  var scopeTest = 'local state..';
  console.log(scopeTest); // local state..
  
  function bar(){
    scopeTest = 'local in local state..?';
    console.log(scopeTest);
  }
  bar();
  
  console.log(scopeTest); // local in local state..?
}

console.log(scopeTest); // global state..
foo();
```

위 코드는 특별한 행태를 보이는 것 같지만 자바스크립트 함수레벨 스코프에 대한 이해와 지역 스코프 우선이라는 특징을 잘 인지한 상태에서 천천히 보면 어렵지 않다.

1. 글로벌 스코프 변수값인 `gloabl state..`가 출력된다.
2. `foo()` 호출 후 함수레벨 스코프 내의 `scopeTest` 값 `local state..`가 출력된다.
3. `bar()` 호출 후 별도의 변수 선언 없이 `scopeTest` 변수에 접근하고 있으므로 전역 스코프의 변수임을 인식하고 `foo()` 함수레벨 스코프의 `scopeTest` 변수에 접근한다.
4. 스코프 인식 후 변수에 `local in local state..?` 값을 대입한다.
5. `bar()` 함수레벨 스코프에서 `local in local state..?` 값을 출력한다.
6. `bar()` 함수 호출이 끝난 뒤 `bar()`함수 입장에서의 외부 스코프 범위의 변수인 `scopeTest`를 출력하게 되는데, 이는 `bar()` 함수 내에서 이미 `local in local state..?` 값으로 새롭게 초기화된 상태이다.
7. `local in local state..?`를 최종적으로 출력하며 `foo()` 함수가 종료된다.


## 렉시컬 스코프
우선 코드를 보고 출력결과를 예측해보자.

```javascript
var scopeTest = 'global scope';

function foo(){
  var scopeTest = 'local scope';
  
  bar();
}

function bar(){
  console.log(scopeTest);
}

foo(); // ?
bar(); // ?
```

처음에 생각했던 나의 흐름은 다음과 같았다. 
1. `foo()` 호출 후 로컬 스코프에서 `scopeTest`가 새로 선언된다. 로컬 스코프 우선으로 인해 `scopeTest`에는 `local scope` 값이 할당된다.
2. `foo()` 내에서 `bar()` 가 호출된다.
3. 호출된 `bar()` 스코프 내에 `scopeTest`가 선언되지 않아 스코프 체인으로 선언된 곳을 찾는다.
4. 외부 스코프인 `foo()`에서 `local scope` 값을 찾아 출력한다.
5. `bar()` 호출시에는 바로 전역 스코프로 이동하여 `global scope`를 출력한다.

물론 자바스크립트에서는 다르게 동작한다. 이렇게 생각한 스코프가 잘못된 개념이 아니라 다른 프로그래밍 언어에서 구현되어 있는 스코프 개념이다.

자바스크립트의 흐름은 간단하다. `bar()` 함수가 어디서 호출되는 지에 상관 없이 **선언된 위치에 따라** 스코프 체인을 실행한다.

함수가 **호출된 위치에 따라** 상위 스코프가 변하는 개념을 **동적 스코프(Dynamic scope)** 라고 하며 자바스크립트에서처럼 함수가 **선언된 위치에 따라** 상위 스코프가 변하는 개념을 **렉시컬 스코프(Lexical scope), 정적 스코프(Static scope)** 라고 한다.

## 암묵적 전역
코드부터 보자.

```javascript
var scopeQuiz = "quiz! - ";

function foo(){
  whatScope = "Is it local?";
  console.log(scopeQuiz + whatScope);
}

foo();
if(whatScope != undefined){
  console.log("Global object property!");
}
```

콘솔 상에 나타난 출력 결과는 어떨지 예상이 가는가? `whatScope`는 전역 스코프에서도, `foo()` 내의 로컬 스코프에서도 선언되지 않은 변수이다. 스코프 체인을 통해 전역 스코프를 탐색해도 `whatScope`가 없으므로 에러가 발생하게 되는 것일까?

답은 그렇지 않다. 암묵적 전역 현상은 바로 선언되지 않은 변수에 값을 할당할때 **해당 값을 동적으로 전역 객체(window)의 프로퍼티로 추가하게 되는 것이다.** 위 코드에서 `window.whatScope`를 콘솔에 출력해보면 정상적으로 값이 출력될 것이다.

:::warning
암묵적 전역이 적용된 프로퍼티는 **변수가 아니다.** 객체 프로퍼티로 추가된 것이므로 선언에 따른 호이스팅이 이루어지지 않는다.

```javascript
console.log(hoistingTestX); // undefined
console.log(hoistingTestY); // ReferenceError

var hoistingTestX = "Hello!";

function foo(){
  hoistingTestY = "implicit Global Scope";
}
```

위 코드를 실행하면 `ReferenceError`가 발생한다. `foo()` 스코프 내에 작성된 `hoistingY`는 변수가 아닌 전역 객체 프로퍼티이기 때문에 호이스팅이 이루어지지 않기 때문이다. `hoistingTestX`는 호이스팅이 일어나 첫 번째 `console.log(hoistingTestX)`에서 `undefined`가 출력될 것이다.
:::

전역 객체로 추가된 프로퍼티는 `delete` 연산자를 통해 삭제할 수 있다. **delete는 객체 프로퍼티 삭제에만 이용 가능하고 변수 삭제에는 이용 불가능하다.**

## 전역변수 최소화
전역변수 사용의 최소화를 위해 사용 시 전역 스코프에 무분별한 선언이 아니라 **한 객체에 묶어서 관리한다.**
```javascript
var GLOBALVAR = {};

GLOBALVAR.myConstants = {
  prefix: 1,
  suffix: 2
};

console.log(GLOBALVAR.myConstants.prefix);
console.log(GLOBALVAR.myConstants.suffix);
```

## 즉시실행함수를 통한 전역변수 사용 억제
IIFE라고 불리는 즉시실행함수는 주로 전역스코프의 오염을 방지하기 위해 사용된다. 함수를 즉시실행함수로 선언하기 위한 방법은 일반적인 함수 선언을 괄호로 감싸면 된다. 이 외에도 다양한 방법이 있는데 이에 대해서는 [다음의 자료를](https://velog.io/@doondoony/javascript-iife) 참조하자. 

IIFE의 특징은 다음과 같다.
1. 함수 선언 시 이름은 작성하지 않는다.
2. 즉시 실행 함수에서 선언하는 변수는 외부에서 접근이 불가능하다.
3. 즉시실행함수를 변수에 할당할 시 함수 블록이 담기는 것이 아닌 리턴값만 담긴다.
4. 파라미터의 전달은 `(function (param){ //...block }(paramValue))`의 형태로 전달한다.


```javascript
// IIFE 파라미터 전달
(function (printParam){
  console.log(printParam);
}('printVal'));
```


```javascript
// IIFE와 전역변수 감추기 예시
(function() {
    var globalObject = {};

    globalObject.propOne = {
        name: "hello",
        value: "prop one!!"
    };

    console.log(globalObject.propOne.name);
}());

console.log(globalObject);
```

즉시실행함수는 생성과 동시에 바로 호출된 후 **소멸한다는 특징이 있다.** 이에 따라 전역 스코프에서 다룰 수 밖에 없는 데이터의 경우 **즉시실행함수 내에 선언 및 활용함으로써 전역스코프에서 해당 전역변수를 활용하지 못하도록 억제할 수 있다.**

## Reference

[Poimeweb - 스코프](https://poiemaweb.com/js-scope)
[cracking vue.js - Scope](https://joshua1988.github.io/vue-camp/js/scope.html)
[doondoony.log - 자바스크립트의 IIFE](https://velog.io/@doondoony/javascript-iife)