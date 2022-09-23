---
title: Redux - @reduxjs/toolkit
---

## 리덕스 toolkit

리덕스를 활용하여 앱을 제작하다보면 크기가 커지면서 각종 상태값들이 전부 한 곳에 모이게 됩니다. 이때 액션의 타입별로 분기해야할 로직들이 너무 많아지고, 각 액션 타입에 대해 불변성을 지키기 위해 객체 복사를 위한 속성들의 수도 너무 많아지게 됩니다. 또한 액션의 타입이 다양해짐에 따라 개발자에게 혼동을 줄 여지도 커지게 됩니다.

이러한 문제점들을 해결해주는 써드파티 라이브러리가 바로 리덕스 툴킷입니다.

```sh
yarn add @reduxjs/toolkit
```

리덕스 툴킷은 리덕스라이브러리를 포함하기 때문에 중복으로 둘 다 저장할 필요가 없습니다. 따라서 리덕스 툴킷을 설치하였으면 기존의 리덕스는 삭제합니다.

```sh
yarn remove redux
```

리덕스에서 리듀서함수를 정의할 때에 액션 타입에 따른 분기를 직접 if문으로 처리했어야 했습니다. 리덕스 툴킷에서는 이를 **슬라이스라는 기능을 통해** 자동으로 처리해줍니다.

`createSlice` 메서드를 사용하여 슬라이스를 정의합니다. 메서드 파라미터로는 객체를 전달하며 해당 객체는 세 가지의 프로퍼티를 갖습니다.

1. `name` - 슬라이스의 id값입니다.
2. `initialState` - 슬라이스에서 관리할 상태값들의 초기 값입니다.
3. `reducers` - 상태값과 연관된 리듀서들을 정의합니다.

`createSlice`메서드에 전달된 리듀서들은 기존 리덕스 라이브러리에서 액션 타입에 따른 분기의 처리가 필요 없어집니다. 따라서 리듀서 함수 정의 시 파라미터로 액션 타입 분기를 위한 목적이라면 `action` 파라미터를 받지 않아도 됩니다.

액션 객체의 페이로드 데이터를 가지고 상태값을 업데이트 할 때에만 액션객체를 활용하면 됩니다.

```javascript
import { createSlice } from '@redux/toolkit';

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        // action payload 활용 예시
        increase(state, action) {
            state.counter = state.counter + action.amount;
        },
        // payload가 없을때는 굳이 액션 객체를 받지 않는다.
        toggleCounter(state) {
            state.showCounter = !state.showCounter;
        },
    },
});
```

:::tip 리덕스 툴킷에서의 불변성
본래 상태값을 다룰때 immutable 규칙을 엄격히 지키기 위해서는 상태값에 직접 접근하지 않는것이 중요했습니다.

리덕스 툴킷에서는 내장 라이브러리가 자동으로 활용되어 상태값에 직접 접근하여 값을 변화시킴에도 기존 상태값 객체에서 복사되어온 값을 변형시키게 되며, 변형된 값을 기존의 상태값 객체를 덮어씌우게 됩니다.

결론적으로, 위와 같은 코드로 작성해도 immutable하게 상태값이 관리됩니다.
:::

위의 예시 코드는 `counter`라는 상태값과 `showCounter`라는 상태값을 한 세트로 묶어 `counterSlice`라는 슬라이스로 관리하고 있습니다.

기존 리덕스 라이브러리였다면 저장소에 구분없이 모든 상태를 한번에 관리했을 것입니다. 슬라이스도 사실 마찬가지로 어플리케이션 규모가 커지면서 다른 성격의 상태값들이 많이 생기게 될 것이고 이를 스토어에 한번에 관리하기가 어려워집니다.

리덕스 툴킷에서는 `configureStore`라는 메서드를 제공하여, 스토어 생성 시 여러 리듀서들을 매번 전달하게 되는 것이 아니라 자바스크립트 객체 형태로 전달하여 더 직관적인 코드 작성을 돕습니다.

```javascript
import {createSlice, configureStore} from "@redux/toolkit";

// .. counterSlice

const store = configureStore({
    reducer:
})
```

`configureStore` 메서드의 파라미터에는 객체를 전달합니다. `reducer`라는 프로퍼티를 정의하며 이 프로퍼티에 대한 값은 슬라이스의 리듀서를 전달하면 됩니다.

전역 스코프에서 접근할 수 있는 리듀서를 정의하는 것이며 전달할 슬라이스가 하나라면 그대로 슬라이스를 전달하면 되고 관리할 슬라이스가 여러개라면 자바스크립트 객체에 키-밸류 쌍으로 전달하면 됩니다.

```javascript
const store = configureStore({
    reducer: counterSlice.reducer,
});
// or

const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        another: anotherSlice.reducer,
    },
});
```

## 슬라이스에 접근하기

스토어 생성과 함께 리듀서가 정의되어 있다면, `react-redux`의 `useSelector`훅을 통해 구독된 컴포넌트에서 액션을 디스패치해야합니다.

슬라이스의 리듀서들은 액션 객체의 타입 속성으로 분기되는 것이 아니라 **슬라이스 객체 생성 시 자동으로 할당받는 키값으로 분기됩니다.** 슬라이스의 액션 키값을 저장하기 위해서는 `sliceName.actions`로 접근합니다.

```javascript
// ... counterSlice 정의

const store = configureStore({
    reducer: counterSlice.reducer,
});
// slice 액션 추출 및 익스포트
export const counterActions = counterSlice.actions;

export default store;
```

```javascript
// 구독을 위한 셀렉터, 디스패치 훅
import { useSelector, useDispatch } from 'react-redux';

// 슬라이스 액션 임포트
import { counterActions } from '../store/index';

const Counter = () => {
    const dispatch = useDispatch();

    const counter = useSelector((state) => state.counter);

    const incrementHandler = () => {
        // 액션 디스패치
        dispatch(counterActions.increment());
    };

    const increaseHandler = () => {
        // 액션 디스패치
        dispatch(counterActions.increase(10));
    };

    return (
        <main className={classes.counter}>
            <h1>Redux Counter</h1>
            <div>
                <button onClick={incrementHandler}>Increment</button>
                <button onClick={increaseHandler}>Increment 5</button>
            </div>
        </main>
    );
};

export default Counter;
```

위의 액션 디스패치 코드를 보면 **슬라이스로부터 추출한 액션에 접근하여 해당 슬라이스의 리듀서를 호출하는 것처럼 보입니다.**

실제로는 각 리듀서마다 슬라이스 생성 시에 자동으로 할당된 키값을 디스패치 함수에 담아 보내고 있는 것이고, **디스패치 함수는 해당 키값을 기준으로 슬라이스의 어떤 리듀서를 호출할 지 결정하게 되는 것입니다.**

리덕스 툴킷에서 페이로드에 추가 데이터를 담아 슬라이스 리듀서를 정의할 때에는 디스패치 함수 파라미터로 `action.reducerName(payload)`형태를 전달하면 됩니다.

페이로드를 받아온 리듀서 함수는 기존 리덕스 라이브러리에서 처럼 아무 이름으로 페이로드 속성을 정의하여 받아오는 것이 아니라 **반드시 action.payload 라는 이름으로 접근해야합니다.**

```javascript
const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment(state) {
            state.counter++;
        },

        increase(state, action) {
            // action.payload에 주목!
            state.counter = state.counter + action.payload;
        },
    },
});
```

:::tip 다중 슬라이스 처리
위에서 언급했듯 `configureStore`로 생성되는 스토어에 리듀서를 전달할때 여러 슬라이스의 리듀서를 한 객체 안에 담아 전달하는 경우가 많습니다.

이때 스토어를 컴포넌트에 `useSelector`를 통해 구독시키려면 `configureStore`로 정의된 `reducer`프로퍼티의 밸류값으로 전달한 객체의 프로퍼티에 한번 더 접근해야합니다.

```javascript
const store = configureStore({
    reducer: {
        reducerOne: sliceOne.reducer,
        reducerTwo: sliceTwo.reducer,
    },
});
// ...
const Component = () => {
    const myState = useSelector((state) => state.reducerOne.stateName);
};
```

:::

## 파일 분리

`store.js`파일 내에서 전체 슬라이스를 한번에 관리하게 되면 파일 크기가 너무 커지게 되고 확장성 있는 설계에 어려움이 따르게 됩니다.

파일을 분리하는 방식은 여러가지가 있겠지만, 강의에서 제공해준 방식은 다음과 같습니다.

1. `store` 폴더의 `index.js`에는 `configureStore`로 생성한 스토어 객체만 둔다.
2. 슬라이스별로 파일을 생성한다.
3. 각 파일에서 슬라이스의 **리듀서만** `export default`로 추출하고 해당 슬라이스의 `actions`객체는 `export const`로 추출한다.
4. 슬라이스 파일에서 추출한 리듀서는 `configureStore`로 가져와서 `reducer` 프로퍼티에 전달한다.
