---
title: React 기초 - 인터랙션 구현해보기

---
## React

리액트는 인터랙티브한 UI를 만들기 위해 제작된 오픈소스 라이브러리이다. 인터랙티브라는 것에 대한 의미가 사전적으로는 알겠지만 실제 체감을 하기 위해서는 직접 코드를 작성해봐야 한다. 리액트 인터랙티브 구현에 앞서 바닐라 자바스트립트만 사용하여 클릭 시 카운터가 올라가는 코드를 작성해보자.

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <span
      >Total clicks:
      <span id="counter">0</span>
    </span>
    <button id="btn">Click me!</button>
    <script>
      let counter = document.querySelector('#counter');
      const button = document.querySelector('#btn');

      function handleClick() {
        let count = parseInt(counter.textContent);
        count += 1;

        let newCount = document.createTextNode(count);
        counter.removeChild(counter.firstChild);
        counter.appendChild(newCount);
      }
      button.addEventListener('click', handleClick);
    </script>
  </body>
</html>
```

위 코드에 리액트 라이브러리를 적용하면 어떻게될까? 우선 라이브러리를 HTML파일 상에 임포트해주자.`react`와 `react-dom`을 가져오면 된다. 리액트 라이브러리를 불러온 후 브라우저 로딩이 되었으면 개발자 도구의 콘솔에 `React`를 입력해보자. 관련된 데이터들이 출력된다.

**리액트는 HTML을 직접 작성하지 않는 것을 원칙으로 한다.**

## 리액트 객체 생성
리액트 라이브러리 사용을 위해 불러오는 패키지 및 라이브러리는 `React`와 `React-dom`이 있다. 

`React`는 어플리케이션이 인터랙티브하게 작동될 수 있도록 만들어주는 라이브러리이고, `React-dom`은 리액트 요소들을 HTML `body`에 붙여준다.

`ReactDOM`의 `render`메서드를 통해 html body에 요소를 붙일 수 있는데, 이때 이 메서드의 파라미터는 다음과 같다.
1. 리액트 요소를 담은 변수
2. 리액트 요소를 붙일 위치

리액트 요소를 붙일 위치는 일반적으로 `root`라는 아이디를 갖는 `div`태그에 붙인다. 스크립트 태그를 통해 루트 태그를 불러온 뒤 붙여주는 작업을 하면 된다.

```html
<!-- html태그들 ... -->
<body>
  <div id="root"></div>
</body>
<script>
  const root = document.getElementById("root");
  
  const 리액트_객체를_담을_변수명 = React.createElement("HTML_태그명");
  ReactDOM.render(리액트_객체를_담은_변수명, root);
</script>
```

:::tip
둘 이상의 엘리먼트를 root에 붙이고 싶으면 해당 엘리먼트들을 상위 엘리먼트 하나로 묶어서 상위 엘리먼트를 루트에 붙이자. 부모 요소 생성 시 리액트 `createElement` 메서드 세 번째 파라미터에 배열 형태로 자식 요소들을 전달하면 된다.

```javascript
const root = document.getElementById("root");
const childOne = React.createElement("span", null, "child one!");
const childTwo = React.createElement("span", null, "child two!");
const parent = React.createElement("div", null, [childOne, childTwo]); // 부모 요소 생성

ReactDOM(parent, root);
```
:::

`React`의 `createElement` 메서드 활용 시 html태그만 인자로 전달할 수 있는 것은 아니다. 다음의 인자들이 메서드 인자로 들어갈 수 있다.
1. html 태그명
2. 해당 태그의 프로퍼티, 객체 형태로 전달한다. `const span = React.createElement("span", {id: "mySpan"});`
3. 태그 내부의 컨텐츠 내용. ``const span = React.createElement("span", {id: "mySpan"}, "Hello World!");

위 코드는 리액트의 전체적인 흐름을 설명해주는 코드이다. 기존 자바스크립트 코드와 어떤 차이점이 있을까?

기존 자바스크립트 코드는 다음과 같은 흐름으로 진행된다.
1. html을 먼저 생성한다.
2. `querySelector`등의 메서드로 html 요소를 가져온다.
3. 여러가지 내부 메서드를 통해 html을 수정한다.

반면 리액트 기반의 코드는 다음과 같은 흐름으로 진행된다.
1. 리액트 요소를 붙일 위치를 자바스크립트로 받아놓는다.
2. html에 요소를 붙일때까지 모든 작업을 자바스크립트로 처리하게 된다.

브라우저 렌더링 과정을 보면, DOM API를 조작함에 있어 레이아웃 조정과 래스터라이징 등 여러가지 성능 저하를 일으킬 잠재 요인들이 존재한다. 이벤트 감지나 트리거가 있으면 매번 이를 처리하게 된다는 것이 문제인 것이다.

반면 리액트의 경우 특별한 [비교 알고리즘(diffing algorithm)](https://ko.reactjs.org/docs/reconciliation.html#the-diffing-algorithm)을 통해 HTML을 꼭 업데이트 해야만할 때 업데이트 하기 때문에 더 성능적으로 좋은 것이다.

## 리액트 이벤트
`React.createElement`로 생성한 엘리먼트에 이벤트를 등록하는 방법은 메서드 파라미터로 전달할 때 두 번째로 전달하는 프로퍼티에 **프로퍼티 방식의 이벤트 핸들러를 등록하면 된다.** 자세한 내용은 [Javascript Fundamental - Event](https://parkjju.github.io/vue-TIL/js/event.html) 문서를 참조하자.

```javascript
const btn = React.createElement("button", {
  onClick: () => {
    alert("Clicked!");
  }
}, "Click me !");

ReactDOM.render(btn, root);
```

사실, 지금까지의 `React.createElement` 방식을 통한 요소 생성 방식은 잘 이용하지 않는 방식이다. 
## Reference 
1. [nomad coders - React로 영화 웹 서비스 만들기](https://nomadcoders.co/react-for-beginners/lobby)