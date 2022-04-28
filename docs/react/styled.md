---
title: React styled-components

---
## styled components 
항상 어떤 라이브러리를 사용하는 데에는 이유가 필요합니다. `styled-components`는 CSS-in-JS 기반의 라이브러리인데 여러 방식의 CSS-in-JS 중 가장 편안하고 직관적인 기능을 갖습니다.

리액트에서 CSS-in-JS 방식을 사용하는 데에는 크게 세 가지 방법이 있습니다.
1. 컴포넌트의 `style`프로퍼티를 정의한다. `style={{backgroundColor:black}}`과 같은 형태입니다.
2. 글로벌 CSS파일을 정의하고 (style.css) App.js에서 임포트한다.
3. `App.module.css`처럼 모듈 CSS 방식을 사용한다.

3번째인 모듈 CSS방식을 사용하면 CSS 클래스 셀렉터가 해시 값으로 매핑되어 컴포넌트 간 같은 클래스 이름으로 모듈 CSS를 정의 하더라도 빌드 과정에서 랜덤한 클래스명으로 변경되어 컴포넌트끼리 스타일 충돌이 일어나지 않는다는 장점이 있습니다.

여기에서 더 나아가 `styled-components`는 css 파일을 생성하지 않고 컴포넌트를 템플릿 리터럴 방식으로 스타일링합니다. 

```sh
npm install styled-components
```
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
            <Child bgColor="black"/>
            <Child bgColor="red"/>      
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

스타일 컴포넌트는 기본적으로 템플릿 리터럴로 코드가 작성되기 때문에 `${}` 형태로 프롭스에 접근할 수 있습니다. CSS 프로퍼티 변수화를 위해 프롭스의 커스텀 프로퍼티를 함수 형태로 반환해주면 됩니다.

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
  border-radius:50px;
`;
// -----

function App() {
    return (
        <Box>
            <Child bgColor="black"/>
            <Sibling bgColor="red"/>      
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
## Reference

1. [styled-components 공식문서](https://styled-components.com/)
2. [벨로퍼트 styled-components](https://react.vlpt.us/styling/03-styled-components.html)