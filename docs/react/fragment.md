---
title: React Fragments, Portals & Refs
---

## JSX의 한계

`JSX`는 루트 레벨 컴포넌트를 둘 이상 인접한 상태로 리턴하면 에러가 발생합니다.

```javascript
function App(){
    return (
        <div></div>
        <div></div>
    )
}
// Error!
```

이는 리액트의 컴포넌트 생성 과정이 함수형 기반이기 때문입니다. 위의 div태그는 `React.createElement` 메서드를 통해 리액트 돔이 되는데 루트 레벨에서 `div`를 인접시키게 되면 한 함수에 리턴값이 두개가 되는 셈입니다.

위 문제를 해결하기 위해서는 루트 레벨에 인접한 최상위 컴포넌트들을 감싸면 됩니다.

이때 특정 HTML 태그, 예를 들어 div로 감싸게 된다고 할때 **div Soup** 라는 문제가 발생합니다.

```html
<div>
    <div>
        <div>
            <span>Hello!</span>
        </div>
    </div>
</div>
```

불필요한 div태그들이 모두 렌더링되는 문제가 발생하는 것입니다.

이를 해결하기 위한 개념은 바로 최상위에 특정 컴포넌트로 감싸는 것이 아니라 자식 컴포넌트들을 모두 렌더링 해주기만 하는 함수를 정의하는 것입니다. 함수의 children 프로퍼티를 통해 자식 컴포넌트들을 모두 호출하는 방식입니다.

이를 위한 문법이 바로 리액트 프래그먼트 입니다.

```javascript
function App() {
    return (
        <>
            <div></div>
            <div></div>
        </>
    );
}
// or
function App() {
    return (
        <React.Fragment>
            <div></div>
            <div></div>
        </React.Fragment>
    );
}
```

## React Portal

모달 컴포넌트를 예시로 들어 아래 코드를 보겠습니다.

```javascript
return (
    <>
        <Component></Component>
        <Modal></Modal>
    </>
);
```

위 컴포넌트 코드는 전체 컴포넌트의 일부로써 실제 돔으로 렌더링 되면 아래와 같은 형태를 갖게 됩니다.

```html
<div>
    <!-- 다른 컴포넌트 렌더링 결과 -->
    <h1>Hello!</h1>
    <!-- Modal 컴포넌트 렌더링 결과 -->
    <div id="modal">
        <p>Modal..</p>
    </div>
</div>
```

이는 성공적인 스타일링을 통해 문제가 없는 것처럼 보이더라도 시맨틱 관점에서 중첩 HTML 요소 아래에 위치하는 것이 올바르지 않습니다. 모달이 어떠한 요소 위에 오버레이 되는 지에 대한 명확한 이해가 어렵기 때문입니다.

시맨틱 문제는 구조적 관점에서 바라봤을때 발생하는 것이라면 기술적 관점에서 발생하는 문제는 CSS 상속과 관련된 것이 있습니다. [다음의 링크](https://jeonghwan-kim.github.io/2022/06/02/react-portal)를 참조해주세요.

:::warning Portal과 이벤트 버블링
모달과 같은 컴포넌트를 포탈을 통해 밖으로 꺼냈다고 하더라도 이벤트 버블링으로 상위 컴포넌트에서 처리가 이루어집니다. 자세한 내용은 위에 첨부한 링크를 참조해주세요.
:::

포털 사용을 위해서는 포털을 통해 이동시킬 장소를 지정하고 어떤 컴포넌트를 이동 시킬 지 지정하기만 하면 됩니다.

먼저 `react-dom`라이브러리로부터 `ReactDOM`을 임포트 합니다. `ReactDOM`에서 제공하는 `createPortal` 메서드를 통해 이동시킬 컴포넌트를 지정합니다.

`createPortal` 메서드는 두 파라미터를 받습니다.

1. 이동시킬 컴포넌트
2. 이동시킬 컴포넌트가 위치할 컨테이너
   이때 컨테이너는 리액트 프로젝트 `public`의 `index.html`에 생성하며 아무 HTML 태그를 id셀렉터 및 클래스 셀렉터와 함께 생성합니다.

이후 `createPortal` 메서드의 두 번째 파라미터에서 DOM API를 통해 해당 컨테이너를 불러오면 됩니다.

```javascript
import ReactDOM from 'react-dom';

function App() {
    return (
        <Box>
            {ReactDOM.createPortal(
                <Child myProp='customProp' />,
                document.querySelector('#modal-root')
            )}
        </Box>
    );
}
```

## ref

ref는 다른 DOM에 접근하여 작업을 할 수 있게 해줍니다. ref사용을 위해서는 컴포넌트 내에서 `useRef()` 훅을 사용합니다.

자바스크립트 코드와 JSX에서 렌더링하는 HTML 요소를 묶어주는 기능을 합니다.

```javascript
import { useRef } from 'react';

function App() {
    const spanRef = useRef();
    const divRef = useRef();

    return (
        <div>
            <div ref={divRef}>
                <span ref={spanRef}></span>
            </div>
        </div>
    );
}
```

JSX HTML에서 내장 프롭스인 `ref`를 사용하고 전달되는 값으로 `useRef` 호출 대상 변수를 등록합니다.

ref로 자바스크립트 객체와 HTML 요소를 연결하게 되더라도 **DOM 조작을 직접적으로 하지 않아야 합니다.** 데이터를 읽어오는 용도로만 사용합시다.

읽어오는 용도 외에 인풋 value를 조작하는 등의 동작을 하면 더 이상 리액트에서 관리가 되지 않습니다. 이를 비제어 컴포넌트라고 하며 자세한 내용은 [공식 문서](https://ko.reactjs.org/docs/uncontrolled-components.html)를 참조해주세요.

## Reference

1. [Udemy - React 완벽 가이드](https://www.udemy.com/course/best-react/)
2. [김정환블로그 - 리액트 Portal](https://jeonghwan-kim.github.io/2022/06/02/react-portal)
