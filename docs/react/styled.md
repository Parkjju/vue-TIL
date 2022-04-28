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








## Reference

1. [styled-components 공식문서](https://styled-components.com/)
2. [벨로퍼트 styled-components](https://react.vlpt.us/styling/03-styled-components.html)