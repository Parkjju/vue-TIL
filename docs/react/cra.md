---
title: React CRA

---
## React create-react-app

리액트 CRA를 실행하기 위해서는 Node.js가 설치되어 있어야 한다. 

```sh
npx create-react-app myApp
```

CRA 실행 후 디렉토리 구조는 다음과 같다.
```text
myApp--|
       |--node_modules
       |
       |--public
       |     |--favicon.ico
       |     |--index.html..
       |     |--...etc
       |
       |--src
       |   |--App.js
       |   |--index.js
       |   |--....etc files
       |--.gitignore
       |--package-lock.json
       |--package.json
       |--README.md
```

위 구성은 기본 파일들이며, 테스트 관련 로직을 실제로 구현하는 것이 아니면 public폴더와 src폴더 내의 파일들은 etc로 표기해둔 기타 파일들을 모두 삭제해도 된다.

## App.js

```javascript
function App(){
  return (
    <div>
    	<h1>Welcome black!</h1>
    </div>
  );
}

export default App;
```
App.js 파일은 App이라는 이름의 함수형 컴포넌트이다. index.js파일에 App컴포넌트를 불러온 후 렌더링하게 된다.

## index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

리액트 `StrictMode`에 대해서는 [공식 문서를](https://ko.reactjs.org/docs/strict-mode.html) 참조하자.

생성했던 App컴포넌트를 `import`로 불러와 `ReactDOM.render`메서드로 렌더링하고 있다. 또한 `render`메서드의 두번째 파라미터로 `index.html`에 생성되어 있는 `<div id="root"></div>`를 불러와 해당 메서드에 등록한다.

## CRA 모듈
CRA 여러 기능에 대해 배우다가 가장 놀랐던 부분은 **CSS의 모듈화이다.** CSS-in-JS의 일환으로 나타난 **CSS module** 기능인데, CRA에서 제공하는 기능이다. `Appname.js`로 컴포넌트를 정의하고 **Appname 컴포넌트에만 적용되는 CSS를** `Appname.module.css`로 생성하면 된다. 

`Appname.module.css`파일은 일반 CSS파일 작성하는 것처럼 활용하면 되며, 클래스 셀렉터로 정의할 경우 JSX에서 `className`프로퍼티를 통해 접근하면 된다.

```css
/* Button.module.css */
.btn {
  color"white";
  background-color:tomato;
}
```

```javascript
import styles from "./Button.module.css";

function Button({text}){
  return <button className={styles.btn}>{text}</button>;
}
```
이후 `yarn start`와 같은 스크립트 명령어를 통해 로컬 서버에서 돌리게 되면 클래스명이 **해시 값으로 랜덤하게 설정되어** 등록된다. 

해시값으로 설정된 클래스명은 **컴포넌트별로 구분되며,** 서로 다른 컴포넌트 모듈 CSS는 **같은 이름의 클래스 셀렉터로 코드를 작성해도 해시값으로 구분된다.** 

위의 기능이 CSS 모듈을 이용할 수 밖에 없게 해주는 기능인 것 같다.

:::tip
CRA프로젝트 내에서는 `node_modules`에 리액트 라이브러리가 이미 설치되어 있기 때문에 어느 곳의 자바스크립트 파일에서든 **import문을** 통해 리액트 훅들을 불러와 사용할 수 있다. 

```javascript
import { useState } from "react"; // react로부터 useState를 import

function App(){
  const [counter, setValue] = useState(0);
  // ....
}

export default App;
```
:::
## Reference
1. [nomad coders - React로 영화 웹 서비스 만들기](https://nomadcoders.co/react-for-beginners/lobby)
2. [React Docs - Create React App](https://ko.reactjs.org/docs/create-a-new-react-app.html#create-react-app)
3. [React Docs - strict mode](https://ko.reactjs.org/docs/strict-mode.html)