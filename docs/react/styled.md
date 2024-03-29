---
title: React styled-components

---
## styled components

항상 어떤 라이브러리를 사용하는 데에는 이유가 필요합니다. `styled-components`는 CSS-in-JS 기반의 라이브러리인데 여러 방식의 CSS-in-JS 중 가장 편안하고 직관적인 기능을 갖습니다.

리액트에서 CSS-in-JS 방식을 사용하는 데에는 크게 세 가지 방법이 있습니다.

1. 컴포넌트의 `style`프로퍼티를 정의한다.
2. 글로벌 CSS파일을 정의하고 (style.css) App.js에서 임포트한다.
3. `App.module.css`처럼 모듈 CSS 방식을 사용한다.

```javascript
<Component style={{ backgroundColor: black }}></Component>
```

3번째인 모듈 CSS방식을 사용하면 CSS 클래스 셀렉터가 해시 값으로 매핑되어 컴포넌트 간 같은 클래스 이름으로 모듈 CSS를 정의 하더라도 빌드 과정에서 랜덤한 클래스명으로 변경되어 컴포넌트끼리 스타일 충돌이 일어나지 않는다는 장점이 있습니다.

여기에서 더 나아가 `styled-components`는 css 파일을 생성하지 않고 컴포넌트를 템플릿 리터럴 방식으로 스타일링합니다.

```sh
npm install styled-components
```

:::warning
타입스크립트에서 `styled-components`를 사용하려면 반드시 `--save-dev` 옵션을 부여해야합니다.
```sh
npm install --save-dev @types/styled-components
```

혹여나 Module not found 에러가 계속 발생하면 `yarn` 패키지 매니저로 설치합니다.
```sh
yarn add @types/styled-components --dev
```

타입스크립트에서 다음의 명령어도 실행해야 모듈이 인식될때도 있습니다.
```sh
npm i styled-components
```
:::

```javascript
// App.js
import styled from 'styled-components';

const Box = styled.div`
    display: flex;
`;

const ChildOne = styled.div`
    background-color: teal;
    width: 100px;
    height: 100px; 
`;
const ChildTwo = styled.div`
    background-color: tomato;
    width: 100px;
    height: 100px;
`;

const Text = styled.span`
    color: white;
`;

function App() {
    return (
        <Box>
            <ChildOne>
                <Text>Hello</Text>
            </ChildOne>
            <ChildTwo />
        </Box>
    );
}

export default App;
```

임포트한 `styled`는 다양한 프로퍼티들이 존재합니다. 프로퍼티는 HTML 태그명들의 집합입니다.
`styled.TagName`형태로 접근하여 바로 뒤에 백틱으로 감싸 CSS 코드를 작성하면 됩니다.

이렇게 작성한 코드는 스타일링된 컴포넌트가 되어 이후 자식 컴포넌트로써 사용될 수 있습니다. 닫는 태그가 없도록 `self-closing` 형태로 스타일 컴포넌트를 호출해도 되고 여닫는 태그로 감싸 스타일 컴포넌트 내에 또 다른 자식 컴포넌트를 사용해도 됩니다.

:::tip extension
비주얼 스튜디오 코드에서 styled-components를 위한 익스텐션을 제공합니다. `vscode-styled-components`를 설치하면 스타일 컴포넌트 정의 시 자동완성이 이루어집니다.
:::

## 스타일 컴포넌트 확장

스타일 컴포넌트의 경우 CSS 프로퍼티 값이 일정하지 않은 경우가 많습니다. 즉 하드코딩의 형태가 아닌 변수 형태로 처리되는 것이죠. 컴포넌트의 커스텀 프로퍼티 정의 후 이를 **프롭스 형태로 내려주어 사용하면** 스타일 컴포넌트의 프로퍼티 확장이 이루어집니다. 아래 예제 코드를 보겠습니다.

```javascript
function App() {
    return (
        <Box>
            <Child bgColor='black' />
            <Child bgColor='red' />
        </Box>
    );
}
```

`Child`라는 컴포넌트의 커스텀 프로퍼티 `bgColor`를 정의 후 이 프로퍼티 값에 따라 `Child` 컴포넌트 배경색을 변경하는 코드입니다. 이를 위해서는 `styled.div`로 스타일 컴포넌트를 생성할 때에 아래 코드와 같이 작성하면 됩니다.

```javascript
const Child = styled.div`
    background-color: ${(props) => {
        return props.bgColor;
    }};
    width: 100px;
    height: 100px;
`;

// background-color: ${(props) => props.bgColor};
```

스타일 컴포넌트는 기본적으로 템플릿 리터럴로 코드가 작성되기 때문에 ${} 형태로 프롭스에 접근할 수 있습니다. CSS 프로퍼티 변수화를 위해 프롭스의 커스텀 프로퍼티를 함수 형태로 반환해주면 됩니다.

### 중복된 스타일링

프로퍼티 확장에 더불어 컴포넌트 간 코드의 중복을 피하는 방법도 있습니다.

일반적으로 스타일링을 진행하게 되면 여러 컴포넌트 간 중복되는 스타일링이 발생하기 마련입니다. 스타일 컴포넌트를 활용하면 효율적으로 코드를 작성할 수 있습니다.

아래의 코드는 `Child` 컴포넌트가 있고 `Sibling` 컴포넌트가 이 컴포넌트의 형제로 동일한 스타일링 프로퍼티들을 사용하며 `border-radius` 프로퍼티만 추가하는 상황입니다.

```javascript
const Child = styled.div`
    background-color: ${(props) => {
        return props.bgColor;
    }};
    width: 100px;
    height: 100px;
`;

// ----- 추가된 코드!
const Sibling = styled(Child)`
    border-radius: 50px;
`;
// -----

function App() {
    return (
        <Box>
            <Child bgColor='black' />
            <Sibling bgColor='red' />
        </Box>
    );
}
```

`Sibling` 컴포넌트에 `Child` 컴포넌트 프로퍼티를 전부 복사 붙여넣기 하지 않고 위의 형태로 코드를 작성함으로써 더 효율적으로 컴포넌트 스타일링을 진행할 수 있습니다.

### as 프로퍼티

컴포넌트 프로퍼티 확장 이외에 **스타일링은 그대로 가져가되 HTML 태그만 변경하고 싶을 경우** `as` 프로퍼티를 활용합니다.

```javascript
function App() {
    return (
        <Box>
            <Btn>Log in</Btn>
            <Btn as='a' href='/'>
                Link
            </Btn>
        </Box>
    );
}
```

`Btn` 컴포넌트가 있고 스타일링도 되어 있는 상태입니다. 또 다른 컴포넌트 `Link`를 생성하여 `styled(Btn)`으로 코드를 작성하면 문제가 해결될까요? 문제는 바로 HTML 요소를 변경하고 싶은 것이기 때문에 해결되지 않습니다.

이럴 때에 위에서 `as="a"`라는 코드처럼 변경하고자 하는 태그 명을 `as` 프로퍼티에 전달하면 됩니다.

### attrs

`styled-components`에서는 `attrs`라는 기능을 제공합니다. 특정 컴포넌트가 여러번 중복되어 사용되면서 HTML 어트리뷰트 또한 동일하게 적용되어야 한다고 할때 컴포넌트에 매번 값을 전달해야하는 문제가 있습니다. 이때 사용하는 것이 `attrs` 입니다.

```javascript
// ----- 추가된 코드
const Child = styled.input.attrs({ required: true, minLength: 10 })`
    background-color: tomato;
`;
// -----

function App() {
    return (
        <Father>
            <Child />
            <Child />
            <Child />
            <Child />
        </Father>
    );
}
```

## Animation

`styled-components`에서는 애니메이션을 위한 기능도 제공합니다. `keyframes`를 먼저 임포트해줍니다.

```javascript
import styled, { keyframes } from 'styled-components';
```

이후 애니메이션을 정의해주는데 **스타일 컴포넌트 정의와 동일한 형태로 이루어집니다.** (템플릿 리터럴 방식)

```javascript
const rotateAnimation = keyframes`
from{
    transform:rotate(0deg);
}to{
    transform:rotate(360deg);
}
`;
```

## pseudo selector

`styled-components`에서는 좀 더 컴포넌트 단위로 쪼개어 CSS 작업을 할 수 있도록 특별한 pseudo selector들을 제공합니다. `Box` 컴포넌트 아래에 `span` 이 태그에 스타일링을 진행하는 상황입니다. 이 `span`태그는 `styled`로 정의되지 않은 일반 HTML 태그이기 때문에 스타일 프로퍼티라던지 글로벌 CSS 등의 원초적인 방법을 사용해야 합니다.

하지만 `span`을 감싸는 `Box` 스타일 컴포넌트 내에서 `span`태그를 선택할 수 있게끔 기능을 제공합니다.

```javascript
const Box = styled.div`
    height: 200px;
    width: 200px;
    border-radius: 100px;
    background-color: tomato;
    display: flex;
    justify-content: center;
    align-items: center;
    // ----- 여기!
    span {
        font-size: 30px;
        &:hover {
            font-size: 50px;
        }
    }
    // -----
`;

function App() {
    return (
        <Father>
            <Box>
                <span>😀</span>
            </Box>
        </Father>
    );
}
```

관련 내용은 공식 문서의 [Supported CSS](https://styled-components.com/docs/api#supported-css)를 참조하시면 좋습니다.

추가적으로 위의 코드는 `Box` 컴포넌트에 속하는 `span`태그에 대한 스타일링이 `span`이라는 HTML요소에 너무 의존적이게 됩니다. 의존적인 문제를 해결하기 위해 `span`태그를 스타일 컴포넌트로 대체하고 `Box` 스타일 컴포넌트 내에서 직접 타겟팅할 수 있습니다.

```javascript
// styled 컴포넌트 정의
const Text = styled.span`
    font-size: 30px;
`;

const Box = styled.div`
    height: 200px;
    width: 200px;
    border-radius: 100px;
    background-color: tomato;
    display: flex;
    justify-content: center;
    align-items: center;
    // ----- 여기!
    // Box안에 있는 Text를 직접 타겟팅
    ${Text} {
        &:hover {
            font-size: 50px;
        }
    }
    // -----
`;

function App() {
    return (
        <Father>
            <Box>
                <Text>😀</Text>
            </Box>
        </Father>
    );
}
```

`span`이라는 의존성에서 벗어나기 위해 스타일 컴포넌트를 `styled.span`으로 생성하였는데 추후 다른 HTML요소로 변경하고 싶다면? `as` 프로퍼티를 활용하면 됩니다.

:::tip document에 CSS 적용하기
`styled-components`는 스타일이 적용되는 특정 컴포넌트를 제작하게 됩니다. `reset CSS`나 폰트와 같이 도큐먼트 전체에 적용될 스타일은 어떻게 적용해야할까요? `styled-components`에서는 `createGlobalStyle`이라는 컴포넌트를 제공합니다. 

```javascript
// App.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
body{
  background-color:green;
}
`

function App(){
  return (
    <>
      <GlobalStyle/>
      <Router/>
    </>
  );
}
```

참고로 `App` 컴포넌트 내에서 빈 태그로 감싸는 것을 **Fragments** 라고 합니다. 어떤 두 컴포넌트를 묶기 위해 필요없는 `div` 태그를 사용하는 것이 아니라 빈 태그로 감싸기 위해 사용합니다.
:::

## theme
`styled-components`에서는 `theme`이라는 기능을 제공합니다. 최상위 단계에서 **어플리케이션에서 사용할 스타일을 한 객체에 담아 `props` 형태로 전달하기 위해 사용합니다.** `styled-components`에서 **ThemeProvider를** 임포트 해줍니다. 코드 작업은 **index.js에서** 진행합니다.

:::tip color picker
[Flat UI Palette](https://flatuicolors.com/palette/defo)에서 원하는 컬러를 쉽게 가져올 수 있습니다!
:::

```javascript
// index.js
import { ThemeProvider } from "styled-components";

const myTheme = {
  textColor: "#1abc9c",
  bgColor: "white"
};

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={myTheme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
```

`ThemeProvider`를 통해 `theme`을 제공하면 `App` 컴포넌트를 통해 뻗어져 나가는 자식 컴포넌트 전체가 `styled-components`로 생성된 컴포넌트에서 프롭스 형태로 컬러를 받을 수 있습니다.

```javascript
// Component.js
import styled from "styled-components";

const Header = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.backgroundColor};
`
```

:::tip Typescript theme 적용하기
타입스크립트에서 `styled-components`의 `theme` 기능을 사용하기 위해 [Typescript Theme API reference](https://styled-components.com/docs/api#typescript)를 참조합니다. 먼저 `Definitely Typed`에서 라이브러리를 설치합니다.
```sh
npm install --save-dev @types/styled-components
```

이후 타입스크립트의 **선언 파일을 생성해야합니다.** 파일명은 `styled.d.ts`로 생성하고 `src` 아래에 위치시킵니다.

```typescript
// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string;

    colors: {
      main: string;
      secondary: string;
    };
  }
}
```

선언 파일을 통해 `styled-components`로부터 상속을 받아 개발자가 관리하고자 하는 `theme` 객체에 대하여 인터페이스를 먼저 정의해줘야 합니다. API 문서에 따라 `DefaultTheme`이라고 정의를 하겠습니다.

이후에는 실제로 `DefaultTheme`에 대한 내부 속성들을 (스타일들) 정의합니다. `my-theme.ts` 타입스크립트 파일 하나를 생성하고 정의합니다. 선언 파일에서 새롭게 만들었던 `DefaultTheme` 인터페이스를 임포트한 뒤에 내부 속성을 정의합니다.
```typescript
import { DefaultTheme } from 'styled-components';

const myTheme: DefaultTheme = {
  borderRadius: '5px',

  colors: {
    main: 'cyan',
    secondary: 'magenta',
  },
};

export { myTheme };
```

디테일한 속성들을 정의한 뒤에 익스포트 하여 `theme`을 사용합니다. 
:::
## Reference

1. [styled-components 공식문서](https://styled-components.com/)
2. [벨로퍼트 styled-components](https://react.vlpt.us/styling/03-styled-components.html)