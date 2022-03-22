---
title: React JSX

---
## JSX
JSX는 자바스크립트 확장 문법인데 리액트 요소를 만드는 것을 편리하게 할 수 있도록 도와준다. 기존의 `React.createElement` 방식으로 리액트 요소를 생성하지 않아도 된다는 것이다. 요소 생성 방식은 옛날 방식이다.

거두절미하고 생성하는 방법을 알아보자.

```javascript
const Title = <h1 id="title" onMouseEnter={ () => console.log("mouse Enter!") }>Title!</h1>
```

요소 타입은 `h1`, props는 `id`, `onMouseEnter`,  컨텐츠는 `Title!`로 된 리액트 요소이다. 다만 위의 코드를 그대로 실행하게 되면 `Uncaught SyntaxError: Unexpected token '<'`과 같은 오류가 발생하게 되는데, 이는 브라우저가 알아듣지 못하는 코드 형태이기 때문이다.

`Babel`이라는 도구를 통해 **JSX 형식의 코드를 React.createElement() 함수 호출 방식으로 컴파일해야 정상적으로 브라우저에서 코드가 작동한다..** 우선은 UNPKG를 사용하여 바벨을 가져와보자.
```html
<body>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel">
    // JSX코드..
  </script>
  <!-- ... -->
</body>
```

:::warning CSS-in-JS
JSX문법이 아무리 HTML과 닮았다고 해도 근본은 자바스크립트 코드이다. JSX 내에서 CSS 코드를 작성할 때 주의할 점으로 `style` 프로퍼티를 자바스크립트 형식으로 표기해야한다. 가령 CSS의 `class`키워드를 사용할 경우 JSX에서는 `<h1 className="myClass">Hi~</h1>`과 같이 작성해야 한다는 것이다.
:::

## 부모 - 자식관계 생성
JSX로 리액트 요소를 한 상위 요소로 묶기 위해서는 어떻게 하면 될까? 함수형 컴포넌트 방식이 여기서 등장한다.
```javascript
const root = document. getElementById("root");
const One = () => { // 함수형으로 작성, html엘리먼트를 리턴한다.
  return <span>Child One</span>;
};

const Two = () => { // 함수형으로 작성, html엘리먼트를 리턴한다.
  return <span>Child Two</span>;
};

const Parent = () => {
  return (<div>
    <One/>
    <Two/>
  </div>);
}; // 함수형 컴포넌트 하나로 묶기
ReactDOM.render(Parent, root);
```

:::warning
컴포넌트의 이름의 첫 글자는 무조건 대문자로 작성한다. 함수형 컴포넌트 이름을 `Title`이 아닌 `title`로 작성할 경우 이후 JSX 코드를 실제 html 요소와 혼동되기 때문이다.
:::


## Reference
1. [nomad coders - React로 영화 웹 서비스 만들기](https://nomadcoders.co/react-for-beginners/lobby)