---
title: JavaScript - closure
---

## 클로저

클로저 이해를 위해서는 실행 컨텍스트에 대한 선행 지식이 필요하다. 필수적이므로 꼭 다른 자료나 이전에 작성해둔 [문서](https://parkjju.github.io/vue-TIL/js/execution.html#%E1%84%89%E1%85%B5%E1%86%AF%E1%84%92%E1%85%A2%E1%86%BC-%E1%84%8F%E1%85%A5%E1%86%AB%E1%84%90%E1%85%A6%E1%86%A8%E1%84%89%E1%85%B3%E1%84%90%E1%85%B3)를 참조하자.

클로저 개념의 출발은 **함수의 종료 시점부터 시작된다.** 함수 종료 이후의 일들을 살펴보자.

1. 실행 컨텍스트 스택에서 종료된 함수의 실행 컨텍스트를 제거한다. (pop off)
2. 함수 호출자 실행 컨텍스트에게(calling context) 종료된 함수의 리턴값을 넘긴다. `return`문이 없는 함수라면 `undefined`를 호출자 실행 컨텍스트에게 넘긴다.
3. `pop off`된 함수 실행 컨텍스트가 소멸된다. **소멸된다는 것이 중요한데, 해당 실행 컨텍스트 내부의 각종 변수들이 함께 지워진다.**

## 함수를 반환하는 함수

다음 코드를 보자.

```javascript
let prefix = 1;

function Calculate() {
    function Add(a, b) {
        let result = a + b;
        return result;
    }
    return Add; // Add 함수를 반환한다.
}

let myCalculator = Calculate();
let calculatedResult = myCalculator(prefix, 2);

console.log(calculatedResult); // 3
```

위 코드를 실행 컨텍스트 측면에서 이해해보자. (실행단계까지 진행되었다고 가정)

1.  **line 1** 글로벌 실행 컨텍스트가 생성되고 `prefix` 변수가 VO 프로퍼티로 추가된 후 1로 값이 초기화된다. (`undefined` 초기화 과정은 설명에서 생략한다.)
2.  **line 3\~9** - 함수 명과 표현식이 VO 프로퍼티에 추가된다.
3.  **line 11** - `myCalculator` 변수가 우선 `undefined`로 초기화된다.
4.  **line 11** - `Calculate`함수 호출 후 새로운 함수 실행 컨텍스트가 생성되고 스택에 쌓인다.
5.  **line 4\~7** - 새로 생성된 함수 실행 컨텍스트에 진입한다. 진입 후에 `Add`함수 선언부를 만나게 되는데 현재 함수 실행 컨텍스트의 프로퍼티로 함수명,표현식을 프로퍼티에 추가한다.
6.  **line 8** - `Add`함수를 반환하고 `Calculate`함수는 종료된다. `Calculate`함수 실행 컨텍스트는 소멸된다.
7.  **line 11** - 함수 실행 컨텍스트에서의 `Add` 변수는 `Calculate` 함수 실행 컨텍스트의 소멸과 함께 사라지지만 `Add`로 선언했던 함수의 정의부는 유지되어 호출자인 글로벌 실행 컨텍스트로 넘어가게 된다.
8.  **line 11** - `undefined`로 초기화 되어 있던 `myCalculator` 변수는 함수 정의부가 넘어와 해당 함수로 새롭게 초기화된다.
9.  **line 12** - `myCalculator`함수 호출과 동시에 현재 실행 컨텍스트 객체(글로벌 실행 컨텍스트) 내의 프로퍼티에 `myCalculator`라는 프로퍼티가 있는지 검색한다. 12라인에서 리턴받은 함수 `myCalculator`를 호출한다.
10. **line 13** - 일반적인 함수 호출처럼 과정이 이루어져 `calculatedResult`에 3이 할당된다. (새로운 함수 실행 컨텍스트의 실행, 인자들의 프로퍼티 등록 등의 과정 등이 이루어진다.)

위 과정에서 주목해야할 점이 몇 가지 있다.

1. 함수 정의부가 변수에 저장되어 호출 직전까지 숨겨져있다. (`Calculate` 함수의 호출 직전까지 `Add`함수의 정의부가 `invisible`하다.)
2. 함수는 호출과 함께 실행 컨텍스트를 생성하고, `return` 또는 `}`과 함께 실행 컨텍스트가 소멸된다.

## 클로저 예시

클로저가 적용된 코드를 살펴보기 전에 먼저 직접 코드를 구현해보자. 함수를 호출할 때마다 카운터 값을 하나씩 증가시키는 코드이다.

```javascript
let counter = 0; // 전역 변수로 관리

function increment() {
    counter += 1;
}

increment(); // counter 1 증가

console.log(counter); // 1
```

전역 변수의 사용은 안그래도 자제되는 판국에, 자바스크립트는 더욱 무분별하게 사용될 여지가 많기 때문에 위의 코드는 최악의 디자인이다. 전역 변수가 아닌 지역 변수를 통해 `counter`변수를 관리할 방법은 없을까?

```javascript
let counter = 0;

function increment() {
    var localCounter = 0;
    localCounter += 1;
    return localCounter;
}

counter = increment();
```

위의 코드는 지역 스코프에서 글로벌 스코프 `counter`변수에 직접 접근하고 있지 않다. 값의 변화를 함수 단에서 처리하고 있는 상황인데, 여기서 문제는 **increment** 함수 실행 컨텍스트의 소멸과 함께 `localCounter`변수가 소멸된다는 것이다. 따라서 `increment` 함수를 몇 번이고 호출해도 메멘토처럼 같은 값만 반환받게 되는 것이다.

클로저는 바로 이러한 문제의식에서 출발한다. **지역 스코프에서 변수를 관리함과 동시에, 변수의 상태를 저장할 수 있는 방법이 있을까?**

클로저가 적용된 다음 코드를 살펴보자.

```javascript
function createCounter() {
    let counter = 0;
    const myFunction = function () {
        counter = counter + 1;
        return counter;
    };

    return myFunction;
}

const increment = createCounter();
const c1 = increment();
const c2 = increment();
const c3 = increment();

console.log('c1, c2, c3: ', c1, c2, c3);
```

1.  **line 1\~9** - `createCounter` 함수의 선언부이다. 글로벌 실행 컨텍스트에 프로퍼티로 저장된다.
2.  **line 11** - `increment` 변수선언과 함께 `undefined`값으로 초기화된다.
3.  **line 11** - `createCounter`함수 호출과 함께 실행 컨텍스트가 스택에 하나 쌓인다.
4.  **line 2** - `counter`변수가 함수 실행 컨텍스트에 프로퍼티로 저장된다.
5.  **line 3\~6** - 변수 `myFunction`이 함수 정의부와 함께 실행 컨텍스트의 프로퍼티로 저장된다.
6.  **line 8** - 함수 반환과 함께 실행 컨텍스트가 소멸된다.
7.  **line 11** - `undefined`로 초기화 되어 있던 `increment`변수에 `myFunction`의 정의부가 들어온다.
8.  **line 12** - **(이후 과정 중요)** `c1` 변수 선언과 함께 `undefined`로 초기화된다.
9.  **line 12** - `increment`함수 호출 후 글로벌 실행 컨텍스트 객체에서 `increment` 프로퍼티가 있는지 검색한다. `createCounter`함수 호출 이후에 `myFunction`의 정의부가 프로퍼티 값으로 저장되어 있으므로 정상적으로 함수 호출이 진행된다.
10. **line 12** - `increment`함수 실행컨텍스트를 새로 생성한 뒤 내부를 보니 `counter`변수가 존재한다. 실행 컨텍스트 내에 선언된 `counter` 변수가 없고, 스코프 체인으로 변수를 찾아봐도 선언되어 있지 않다.
11. **line 12** - `counter = counter + 1`은 결국 `counter = undefined + 1`로 처리되며 `counter`변수에는 1이 저장된다.

이후 과정을 똑같이 생각해보면 `c1`, `c2`, `c3`에는 모두 똑같이 1값으로 저장되어야 하는 것이 옳은것으로 생각된다. 하지만 1,2,3이 각 변수에 할당된다. 함수 실행 컨텍스트에서 접근하는 `counter` 변수가 스코프 체인을 통해 전역객체 `window` 프로퍼티에 등록되는 **암묵적 전역** 메커니즘이 적용된걸까? `console.log(window.counter)`를 찍어봐도 `undefined`가 출력될 것이다.

위와 같은 일반적인 흐름으로는 결과값이 설명이 되지 않는다. **클로저에는 또 다른 메커니즘에 존재하는 것이다.** 새로운 함수를 선언하고 그 함수를 변수에 저장할 때에 **함수 정의부 뿐만 아니라 클로저도 저장된다.**

**클로저에는 함수 생성 당시의 스코프에 존재하는 모든 변수들이 포함된다.**

위에서의 코드 흐름에 대한 설명은 결론적으로 잘못되었다. 클로저 메커니즘이 적용된 흐름으로 다시 생각해보자.

1. **line 1\~9** - `createCounter`함수가 글로벌 스코프에 선언되었다. 프로퍼티로 저장되는 것은 동일하다.
2. **line 11** - `increment`변수 선언, `undefined`로 초기화되는 것 역시 동일하다.
3. **line 11** - `createCounter`함수가 호출된다.
4. **line 2** - `counter` 변수가 `undefined`로 초기화되며 `createCounter`함수 실행 컨텍스트 객체의 프로퍼티로 등록된다.
5. **line 3\~6** - `myFunction`에 함수 정의부가 할당된다. **이때 변수에 저장되는 데이터가 함수 객체이므로 클로저가 함수의 부분으로써 함께 저장된다.**
6. **line 3\~6** - `myFunction`의 클로저에는 `counter` 변수가 있는데 이 값에는 0이 저장된 채로 함수에 할당된다. 이후 `return`을 만나 실행 컨텍스트가 소멸되어도 클로저에 저장된 `counter`의 상태는 소멸되지 않고 유지된다.

글로벌 스코프나 로컬 스코프에서의 변수를 살필때에 클로저를 살피는 방식으로 인해 `counter`변수의 값이 유지될 수 있는 것이다.

**클로저는 함수 생성 시 해당 스코프에 있는 모든 변수들의 컬렉션이다.**

클로저는 함수라면 어떤 곳에서 선언되었든 클로저를 갖게 된다. 글로벌 스코프에서 선언된 함수라도 클로저를 갖게 되는 것이다. 글로벌 스코프 함수는 전역객체 프로퍼티, 전역변수 등에 모두 접근할 수 있기 때문에 사실상 클로저를 쓰는 의미가 없긴하다.

함수가 함수를 반환할 때 클로저는 더 의미있게 사용될 수 있다. 글로벌 스코프에서 분리되어 사용되어야 한다.

다음 코드를 스스로 분석해봄으로써 클로저에 대한 정리를 마무리해보자.

```javascript
let c = 4;
function addX(x) {
    return function (n) {
        return n + x; // 이 함수가 리턴될 때의 x는 클로저에 저장되어 있는 상태이다.
    };
}
const addThree = addX(3);
let d = addThree(c);
console.log('example partial application', d);
```

## 정리

> The way I will always remember closures is through the backpack analogy. When a function gets created and passed around or returned from another function, it carries a backpack with it. And in the backpack are all the variables that were in scope when the function was declared. (출처 - \[medium - I never understood javascript closure\]([https://medium.com/dailyjs/i-never-understood-javascript-closures-9663703368e8](https://medium.com/dailyjs/i-never-understood-javascript-closures-9663703368e8 'https://medium.com/dailyjs/i-never-understood-javascript-closures-9663703368e8')) )

클로저에 대한 개념을 기억하기 위해 **백팩 비유에 대해서 생각하자.** 함수 선언 후 또 다른 함수에 넘어갈 때에는 백팩에 담겨 넘어가며, 백팩에는 변수들이 담겨있으며 이 백팩이 바로 클로저이다.

## Reference

1. [Poimeweb - Closure](https://poiemaweb.com/js-closure)
2. [Medium - I never understood Javascript closures](https://medium.com/dailyjs/i-never-understood-javascript-closures-9663703368e8)
