---
title: [Redux] Redux란?
---

## 개요

리액트의 Context API는 크로스-컴포넌트 통신과 앱 전역에서 사용되는 상태값을 활용할 수 있게 해주었습니다.

하지만 컴포넌트의 데이터가 빈번하게 바뀌는 것을 표현하기 위해 컨텍스트 API가 사용된다거나 한 컴포넌트가 다양한 컨텍스트를 불러오는 로직을 갖는다면 중첩 컨텍스트 프로바이더 구조가 너무 복잡한 형태로 바뀌게 됩니다.

이러한 문제점들을 해결하기 위해 또 다른 전역상태 관리 라이브러리인 리덕스가 등장하게 됩니다.

## 작동방식

리덕스의 핵심은 **하나의 저장소에 전체 어플리케이션 모든 상태를 저장한다는 것입니다.**

중앙저장소는 컴포넌트를 구독하고 UI 변경사항을 감지하여 달라진 데이터를 뿌려줍니다.

컴포넌트에서 달라지는 데이터를 관리하는 주체는 컴포넌트가 아닌 **리듀서함수 내에서 이루어집니다.** (useReducer와는 다른 개념)

이때 컴포넌트와 리듀서 함수는 **디스패치 함수로 연결됩니다.** 컴포넌트로부터 액션이 감지되고 이는 리듀서 함수로의 디스패치를 전달할 트리거 조건이 됩니다.

![redux](../.vuepress/assets/react/redux.jpg)

## 구조 파악

CRA 리액트 앱 생성에 앞서 리덕스의 전체적인 구조를 파악합니다. 빈 폴더 아래 node.js 프로젝트로 초기화를 먼저 진행합니다. (`npm init -y`)

이후 리덕스를 설치합니다. (`npm install redux`)

```javascript
const redux = require('redux');

// deprecated
const store = redux.createStore();
// or redux.legacy_createStore()
```

리덕스의 `createStore` 메서드는 현재 deprecated되었다고 표시되지만 문제없이 작동됩니다. 취소선을 보고싶지 않다면 `redux.legacy_createStore()`로 코드를 작성합니다.

리듀서 함수는 기존 state와 디스패치를 통해 전달된 액션을 파라미터로 받습니다. 이후 리턴값으로 새로운 상태값을 가진 객체를 내보냅니다.

리듀서 함수는 동일한 입력에 대해 동일한 값만 내보내는 **순수함수이어야 합니다.** (사이드이펙트가 없어야함. HTTP리퀘스트 등)

대략적인 흐름은 다음과 같습니다.

1. 리덕스 객체 불러오기
2. 리덕스 객체로부터 저장소 생성 메서드 호출, 이때 파라미터로 리듀서 함수를 전달하고 리듀서 함수는 counter상태값을 1 증가시키는 로직을 갖는다.
3. subscriber 함수를 정의한다. 리듀서함수 호출을 통해 달라진 데이터를 subscriber함수에서 받아 처리하는 역할을 한다.
4. 저장소 객체의 subscribe메서드 호출과 함께 파라미터로 3번에서 정의한 `subscriber`함수를 전달한다.
5. 저장소 객체의 dispatch 메서드를 호출하고, 파라미터에는 액션을 자바스크립트 객체로 정의하여 전달한다.

:::warning default 상태값
리듀서함수 정의시에 상태값의 업데이트 형태를 정의한 뒤 이를 객체로 리턴하게 되는데, `legacy_createStore` 메서드에 리듀서함수를 파라미터로 전달할 때에 이 리듀서가 한번 호출되기 때문에 초기 파라미터로 전달된 상태값 `state`가 undefined 입니다.

따라서 디폴트값을 객체 형태에 맞게 전달해야합니다.
:::

```javascript
// 리덕스 객체 불러오기
const redux = require('redux');

// 리듀서함수 정의
const counterReducer = (state = { counter: 0 }, action) => {
    return {
        counter: state.counter + 1,
    };
};

// 저장소 객체 생성
const store = redux.legacy_createStore(counterReducer);

// 초기 상태값 호출
console.log(store.getState());

// 구독함수 정의
const counterSubscriber = () => {
    const latestState = store.getState();
    console.log(latestState);
};

// subscribe메서드 정의 및 구독함수 파라미터로 전달
store.subscribe(counterSubscriber);

// 디스패치를 통해 리듀서 함수 트리거
// 액션 객체에 대한 타입을 정의한다.
store.dispatch({ type: 'increment' });
```

저장소의 dispatch메서드에 전달할 액션 객체는 `type` 속성을 갖는데, 이는 반드시 고유해야합니다.

위의 코드에서 리듀서 함수는 액션 타입에 따른 분기가 이루어지지 않고 있습니다. 저장소 생성과 함께 전달될때 리듀서함수가 파라미터로 전달, 상태값 초기화가 이루어지게 되는데 초기 상태값은 0이 되길 원함에도 불구하고 액션 타입에 따른 분기가 이루어지지 않기 때문에 초기값도 1로 출력되게 됩니다.

이때 action파라미터의 type속성을 통해 이러한 문제를 해결할 수 있습니다.

```javascript
const counterReducer = (state = { counter: 0 }, action) => {
    if (action.type === 'increment') {
        return {
            counter: state.counter + 1,
        };
    }
    if (action.type === 'decrement') {
        return {
            counter: state.counter - 1,
        };
    }
    return state;
};
```

액션의 타입에 따라 상태값 변경 로직을 구분해두고 이에 모두 해당하지 않는다면 초기 상태값이라고 인식하여 디폴트값으로 전달된 상태값을 그대로 리턴하면 됩니다.
