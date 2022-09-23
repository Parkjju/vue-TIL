---
title: Redux - react-redux
---

## Redux with React

먼저 패키지 둘을 설치합니다.

```sh
npx create-react-app 프로젝트
yarn add redux react-redux
```

`react-redux`는 리액트용 리덕스입니다. 리액트 컴포넌트에서 저장소로 디스패치를 하고 스토어를 컴포넌트에 구독시키는 등의 작업을 할 수 있습니다.

먼저 통상 리덕스 코드 작성은 `store`라는 폴더 아래에 작성합니다. 위의 예시에서처럼 카운트값을 리덕스로 관리하는 코드를 작성하면 다음과 같습니다.

```javascript
// store/index.js
import { legacy_createStore } from 'redux';

const counterReducer = (state, action) => {
    switch (action.type) {
        case 'increment':
            return {
                counter: state.counter + 1,
            };
        case 'decrement':
            return {
                counter: state.counter - 1,
            };
        default:
            return {
                state,
            };
    }
};

const store = legacy_createStore(counterReducer);

// store export
export default store;
```

리듀서 생성 및 저장소 생성 코드까지는 동일하지만 리액트 컴포넌트와 저장소를 연결하기 위해서는 프로바이더 컴포넌트를 사용해야합니다. 이에 앞서 저장소를 익스포트해줍니다.

리덕스 저장소에 접근할 컴포넌트들은 프로바이더 컴포넌트 안에 감싸져 있어야 합니다. 리액트 앱의 엔트리포인트인 App 컴포넌트를 프로바이더로 감싼다면 다음과 같습니다.

```javascript
// index.js
import ReactDOM from "react-dom/client";
// Provider 컴포넌트 임포트
import { Provider } from "react-redux";

// store 임포트
import { store } from "./store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <Product />
  </Provider>
);
```

프로바이더 컴포넌트는 `store`프롭스를 가지며 이 프롭스에는 생성한 저장소를 전달하면 됩니다.

## 구독 설정

리덕스 저장소를 컴포넌트에 구독시키기 위해서는 `react-redux`의 훅인 `useSelector` 훅을 사용합니다.

`useSelector`의 파라미터는 상태값 반환 함수입니다. 이 함수는 인자로 `state`를 받으며 상태값 객체 프로퍼티에 접근하여 반환함으로써 이 상태값을 활용하는 컴포넌트를 저장소가 자동으로 구독하게 됩니다.

예를 들어 `counter`라는 상태값 업데이트 로직을 리듀서 함수에 정의하였고 리듀서의 `state`객체 파라미터의 속성으로 `counter`가 전달되고 있는 위의 예시를 보면 `useSelector`훅에 전달할 함수를 어떻게 정의해야할까요?

```javascript
import { useSelector } from 'react-redux';

const Component = () => {
    // 상태값 저장소로부터 가져오기
    const counter = useSelector((state) => state.counter);

    return (
        <div>
            <span>{counter}</span>
        </div>
    );
};
```

위와 같이 `useSelector`훅을 통해 저장소는 컴포넌트에 `counter`상태값을 뿌려주게 됩니다. 추후 정의할 컴포넌트의 액션 디스패치 로직을 통해서 counter상태값이 변경되면 `useSelector` 훅을 통해 현재 저장소에 구독되어 있는 `Component`라는 이름의 컴포넌트를 업데이트하게 됩니다.

## 컴포넌트에서 스토어로 dispatch 보내기

컴포넌트에서 스토어로 액션 디스패치를 보내기 위해서는 `useDispatch` 훅을 사용합니다.

`useDispatch` 훅의 반환값은 디스패치 함수입니다. 앞서 작성했던 디스패치 예시 코드에서처럼 액션에 대한 타입을 `useDispatch` 훅의 반환값 디스패치 함수의 파라미터로 전달합니다.

```javascript
import { useSelector, useDispatch } from 'react-redux';

const Component = () => {
    const counter = useSelector((state) => state.counter);

    // dispatch함수 생성
    const dispatch = useDispatch();

    const incrementHandler = () => {
        dispatch({ type: 'increment' });
    };

    const decrementHandler = () => {
        dispatch({ type: 'decrement' });
    };

    return (
        <div>
            <span>{counter}</span>
            <button onClick={incrementHandler}>Increment</button>
            <button onClick={decrementHandler}>Decrement</button>
        </div>
    );
};
```

컴포넌트의 `onClick`등의 이벤트를 통해 액션을 디스패치합니다.

위의 카운터 예제를 확장성있는 구조로 개선하기 위해서 리덕스에서는 디스패치할 액션 객체에 `type`속성 외에 사용자 정의 속성을 자유롭게 담아 보낼 수 있습니다.

1값만 증감시키는게 아니라 아무 값이나 증감시키기 위해 `increase`라는 타입을 리듀서 함수에 전달하고 해당 로직을 작성하면 다음과 같게 됩니다.

```javascript
const counterReducer = (state = { counter: 0 }, action) => {
    // ...
    if (aciont.type === 'increase') {
        return {
            // 액션 객체에 amount라는 속성을 새로 정의하여 디스패치
            counter: state.counter + action.amount,
        };
    }
    // ...
};
```

```javascript
import { useSelector, useDispatch } from 'react-redux';

const Component = () => {
    const counter = useSelector((state) => state.counter);

    // dispatch함수 생성
    const dispatch = useDispatch();

    const incrementHandler = () => {
        dispatch({ type: 'increment' });
    };

    // 5라는 값으로 하드코딩하는 것이 아니라 추후 사용자 입력으로 개선 가능
    // 컴포넌트 상태값으로 관리하면 됨
    const increaseHandler = () => {
        dispatch({ type: 'increase', amount: 5 });
    };

    const decrementHandler = () => {
        dispatch({ type: 'decrement' });
    };

    return (
        <div>
            <span>{counter}</span>
            <button onClick={incrementHandler}>Increment</button>
            <button onClick={decrementHandler}>Decrement</button>
            <button onClick={increaseHandler}>Increase 5</button>
        </div>
    );
};
```

:::warning redux immutable
자바스크립트에서 뮤테이션에 대한 중요성을 강조하는 글들이 많습니다. 리덕스에서도 마찬가지입니다. 상태값 관리 로직에 대해 사이드이펙트를 완전히 제거하기 위해 리듀서 함수에서는 반드시 **상태값 객체에 직접 접근하지 않아야 합니다.**
:::
