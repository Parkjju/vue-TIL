---
title: [Redux] - Redux toolkit
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
