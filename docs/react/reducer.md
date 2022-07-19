---
title: React useReducer
---

## useReducer

`useReducer`는 `useState`와 유사한 역할을 합니다. `useState`보다 더 복잡한 상태값 관리가 필요할 때에 사용하게 됩니다.

> useReducer를 사용하면 상태 업데이트 로직을 컴포넌트에서 분리시킬 수 있습니다. - 출처 : [벨로퍼트](https://www.zerocho.com/category/React/post/5f9a6ef507be1d0004347305)

`useReducer`는 파라미터 둘을 받습니다.

1. `reducer` : 새로운 상태를 만드는 로직
2. `initialState` : 초기 상태값

이때 `reducer` 파라미터는 또 다시 `state`와 `action`이라는 파라미터를 받습니다. 또한 새로운 상태값이 로직에 따라 만들어졌으면 이를 리턴합니다.

1. `state` : 기존 상태값
2. `action` : 주로 `type` 프로퍼티를 갖는 객체로 사용됩니다. 상태값 변경 로직을 `action.type`을 통해 선택할 수 있게 됩니다.

```javascript
// 컴포넌트 밖에 정의한다.
const reducer = (state, action) => {
    switch (action.type) {
        case '로직 1':
        // ... 로직 1 처리
        case '로직 2':
        // ... 로직 2 처리
        default:
        // ...
    }
};

function App() {
    const [number, dispatch] = useReducer(reducer, 0);

    //...
}
```

`const [number, dispatch]` 부분에서 `number`는 `initialState`에서 시작하여 `dispatch` 로직에 따라 변경될 상태값을 나타냅니다.

`dispatch`는 함수이며 호출 시 리듀서 함수에서 정의한 타입을 객체 프로퍼티로 전달하며 호출하면 됩니다. (`dispatch({type: '로직 1'})`)

리듀서 함수는 컴포넌트 내부 데이터에 대해 의존적이지 않기 때문에 컴포넌트 밖에 새롭게 정의하는 것이 좋습니다.

사용자로부터 입력을 받는 폼의 데이터를 상태값으로 관리하는 시나리오를 생각해보겠습니다. 이때 관리해야할 상태값으로 폼에 입력되는 데이터들과 submit이 감지되기 전 해당 데이터 유효한지 여부 등이 있을 것입니다.

`useState`로 두 상태값을 두어 관리해도 되지만 두 데이터는 의존적으로 서로 묶여 관리되어야 더 좋습니다.

이때 `useReducer`를 적용하게 되는 흐름은 다음과 같게 됩니다.

1. `useReducer`훅 임포트와 함께 호출한다. 이때 배열 디스트럭쳐링을 통해 상태값, 디스패치 함수를 변수에 저장하고 `useReducer`훅의 파라미터로 리듀서 함수와 초기 상태값을 전달한다.
2. 컴포넌트 밖에서 리듀서 함수를 정의한다. 디스패치 함수 파라미터로 전달될 액션에 따라 로직 처리를 한 뒤 리턴한다. 리턴하는 형태는 디스패치로 전달된 객체 프로퍼티에 맞춰 진행한다. `return {data: "Hello"}`
3. 컴포넌트 내부에서 폼에 대한 유효성 검사를 진행한다. 이때 `onSubmit` 또는 `onChange` 등의 프롭스로 이벤트 핸들링을 하게 되는데 이때 `dispatch` 함수를 호출한다. `dispatch({type: "로직 1", data: ""})`

```javascript
const initialState = {
    value: 'Hello',
    isValid: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_INPUT':
            return {
                ...state,
                [isValid]: true,
                [value]: action.value,
            };
        default:
            return state;
    }
};

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const onChange = (e) => {
        const { value } = e.target;
        dispatch({
            type: 'CHANGE_INPUT',
            value,
        });
    };

    return (
        <>
            <Input onChange={onChange} />
        </>
    );
}
```

만약 `useEffect`를 통해 값의 변화를 추적한다고 할 때 **값의 유효성 여부를 판단하는 필드가 있다고 가정해보겠습니다.** 이때 입력된 값이 유효함에도 `useEffect`의 의존성으로 등록되었을 경우 계속해서 `useEffect` 로직이 실행된다는 문제가 발생합니다.

이때 `useReducer`의 결과값 배열의 첫 번째 요소로 관리되는 상태값을 객체 디스트럭쳐링으로 유효성 필드만 추출한 뒤 이를 useEffect의 의존성으로 등록하면 더 효율적으로 함수를 작성할 수 있게 됩니다.

useState는 상태값 업데이트가 쉽고 간단한 데이터를 다룰 때에 사용합니다. `useReducer`는 상태값에 대해 여러 로직으로 나누어 관리할 때에 사용합니다.

## Reference

1. [벨로퍼트와 함께하는 모던 리액트](https://react.vlpt.us/basic/20-useReducer.html)
