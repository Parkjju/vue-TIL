---
title: Event

---
## 브라우저-웹 아키텍쳐
>“How is JavaScript asynchronous and single-threaded ?” The short answer is that JavaScript language is single-threaded and the asynchronous behaviour is not part of the JavaScript language itself, rather they are built on top of the core JavaScript language in the browser (or the programming environment) and accessed through the browser APIs. (출처 - [medium, Javascript Event Loop Explained](https://medium.com/front-end-weekly/javascript-event-loop-explained-4cd26af121d4)

(직역)자바스크립트는 어떻게 비동기적이면서 싱글-스레드 기반일 수 있을까? 이에 대한 답은 바로 비동기와 싱글-스레드라는 것들이 자바스크립트 언어 자체의 특성이 아니라 **브라우저 및 프로그래밍 환경에서의 자바스크립트 언어가 쌓아 올린 결과물이며 브라우저 API를 통해 접근할 수 있다.** 

그렇다면 자바스크립트는 **애초에 비동기적이지 않거나 싱글 스레드 기반 언어가 아니라는 것일까?** 

<figure>
  <img src="../.vuepress/assets/javascript/eventloop.png"/>
  <figcaption>출처 - https://medium.com/front-end-weekly/javascript-event-loop-explained-4cd26af121d4</figcaption>
</figure>

위 이미지는 브라우저 구성요소를 나타낸다.
1. 힙 : 객체들은 힙에 할당되며, 이들은 객체 실제 데이터가 차지하는 메모리를 가리키는 이름이다.
2. 스택 : 자바스크립트가 싱글 스레드 기반 언어라는 것을 증명하는 셈이다. 함수 호출이 `frame`의 스택을 기반으로 이루어진다. (Operation System - Memory management 개념 중 하나)
3. 브라우저 / 웹 API : 웹 브라우저에 내장되어 있고 브라우저 및 컴퓨터에 데이터를 나타내거나, 복잡한 작업을 할 때에 사용된다. 자바스크립트 기반으로 구축되었으며 우리 개발자들의 자바스크립트 코드 사용에 초능력(`extra superpowers`)를 제공해준다!
4. 콜백 큐(이벤트 큐) : 각종 비동기 코드가 푸시(저장, pushed to)되는 공간이다. 실행을 기다리게 된다.
5. 이벤트 루프 : 메인 스택에 실행될 프레임(함수)가  있는지 없는지를 `countinously`하게 체크한다. 실행될 프레임이 없으면 **콜백 큐를 체크한다.** 콜백 큐에 실행될 코드가 있으면 이를 메인 스택으로 가져온다.
6. 잡 큐(Job queue) : 이미지에는 없지만 ES6에 프라미스가 도입되며 생긴 개념이다. 프라미스의 `.then()` 인자로 전달되는 콜백 함수 방식에서 사용된다. `then` 방식을 `thenable`이라고도 표현한다. `then`메서드의 콜백은 잡 큐에 추가되며 프라미스가 리턴되거나 `resolve`되면 실행된다.


웹 API의 경우 한 예시로 위치정보를 얻는 API 사용 시 저수준(lower-level)작업을 특정 하드웨어와 커뮤니케이션을 통해 처리해야할 텐데 이러한 것들이 **웹 API라는 것을 통해 추상화된 것이다.**

## 브라우저-웹 아키텍쳐 (코드)
다음 코드를 보고 출력 결과를 예상해보자.
```javascript
function func1() {
  console.log('function 1');
  func2();
}

function func2() {
  setTimeout(function () {
    console.log('function 2');
  }, 0);

  func3();
}

function func3() {
  console.log('function 3');
}

func1();
```

예상되는 위 코드의 출력 결과는 다음과 같다.
1. `function 1`
2. `function 2` - `setTimeout`의 대기 시간이 0이므로 곧바로 출력된다.
3. `function 3`

하지만, 실제 출력 결과는 다음과 같다.
1. `function 1`
2. `function 3`
3. `function 2`

위와 같은 출력 결과가 나타나는 이유를 분석해보자.

## 비동기 코드의 실행
1. `func1`함수가 호출되며 콜 스택에 추가된다
2. `console.log('function 1')`이 콜 스택에 추가된 후, 콘솔에 결과를 출력한 뒤 스택에서 제거된다.
3. `func2`를 호출한다. 콜 스택에 추가된다.
4. `setTimeout` 함수가 콜 스택에 추가된다. 이 함수는 웹 API를 사용하기 때문에 컨트롤을 외부로 넘기고 콜 스택에 추가된 프레임을 제거한다. 
5. `func3` 함수를 호출한다. 콜 스택에 추가된다. 백그라운드에서 `setTimeout`과 관련된 API 작업이 브라우저에서 처리되고 있다. (타이머 인자값이 0이기 때문에 사실은 외부로 전달과 동시에 끝난 작업이지만, 비동기적인 양상을 더 과장하여 설명한 것)
6. `console.log('function 3')`가 콜 스택에 추가된 후 콘솔에 결과를 출력하고 다시 제거된다. 그 동안 `setTimeout` API는 콜백 큐에 `console.log('function 2')`를 추가해놓는다.
7. `console.log('function 3')`가 스택에서 제거된 후 차례로 `func2`, `func1` 함수가 스택에서 제거된다.
8. 모든 함수가 콜 스택에서 제거된 후에야 콜백 큐의 코드가 실행되어, `console.log('function 2')`가 최종적으로 출력된다.

여기서 중요한 점은 **콜백 큐의 코드가 호출 스택의 함수들이 모두 실행 완료된 후에야 실행된다는 것이다.** 

`setTimeout`함수의 지연 시간에 대한 인자값이 **콜백이 실행되는 정확한 지연 시간을 뜻하는 것이 아니라, 콜백이 실행되기 위한 최소 지연 대기 시간을 의미하는 것이다.**

> So the delay parameter in setTimeout(function, delayTime) does not stand for the precise time delay after which the function is executed. It stands for the minimum wait time after which at some point in time the function will be executed.

<figure>
  <img src="../.vuepress/assets/javascript/call-stack.gif"/>
  <figcaption>비동기 코드 처리 흐름</figcaption>
</figure>

콜 스택이 완전히 텅 빌때까지 콜백 큐의 함수가 스택에 추가되지 않는 것은 다음의 코드를 통해 확인할 수 있다.
```javascript
function funcA(){
  console.log('A');
  
  funcC();
}

function funcB(){
  setTimeout(()=>{
    console.log('B');
  }, 0);
}

function funcC(){
  console.log('C');
}

funcB();
funcA();
```

이러한 현상은 DOM이벤트 핸들러에도 동일하게 적용된다. `addEventListener` 함수의 인자로 콜백 함수가 전달되기 때문이다. 이벤트에 따른 콜백 함수가 콜백 큐에 등록된 후 스택이 비어있을 때 콜백 큐에서 스택으로 해당 함수가 이동한다.

## 이벤트 핸들러 내부의 this

### 인라인 이벤트 핸들러
인라인 이벤트 핸들러는 html 요소에 인라인 형식으로 콜백함수를 등록하는 방식이다. **관심사의 분리 원칙에 따라 이 방식은 사용하지 말아야 할 방식이다.**

```html
<button onclick="foo()">Click me!</button>
```

인라인 이벤트 핸들러 방식에서의 `this`는 전역객체 `window` 를 가리킨다.

<button onclick="foo()">Click me!</button>
<script>
  function foo(){
    alert(this);
  }
</script>

### 프로퍼티 방식 이벤트 핸들러
분리된 스크립트 태그에 이벤트 감지 코드를 작성한다. `GlobalEventHandlers`의 `onclick` 등의 코드를 기반으로 한다. 프로퍼티 방식 이벤트 핸들러에서 `this`는 이벤트와 바인딩된 HTML요소를 가리킨다.

<button class="btn">Click me!</button>
<script>
  const btn = document.querySelector(".btn");
  btn.onclick = function(e){
    alert(this);
  } 
</script>





## Reference
1. [Medium - Javascript Event Loop Explained](https://medium.com/front-end-weekly/javascript-event-loop-explained-4cd26af121d4)
2. [Poimeweb - Event](https://poiemaweb.com/js-event#reference)
3. [DEV - If Javascript is single threaded, How is it asynchronous?](https://dev.to/bbarbour/if-javascript-is-single-threaded-how-is-it-asynchronous-56gd)
4. [Medium - Understanding event loop, call stack, event & job queue in javascript](https://medium.com/@Rahulx1/understanding-event-loop-call-stack-event-job-queue-in-javascript-63dcd2c71ecd)