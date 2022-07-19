---
title: React useEffect
---

## useEffect

리액트 라이브러리가 하는 일은 UI를 렌더링하는 것입니다. 여기서 사이드이펙트라는 용어가 등장하게 되는데 **UI 렌더링 외의 다른 모든 작업들을 통칭하여 사이드이펙트라고 합니다.** (HTTP 요청 보내기, 로컬 스토리지 이용하기 등)

원래라면 사이드이펙트는 컴포넌트 밖에서 처리되어야 하는 것이 맞습니다. 리액트 컴포넌트 함수 안에서 사이드이펙트를 처리하게 되면 자동으로 리 렌더링이 되는 리액트 특성 상 부작용이 많이 발생할 수 있기 때문입니다. 사이드이펙트 처리를 전역적으로 할 수도 없기에 컴포넌트 함수 내부에서 처리하기 위해 `useEffect` 훅을 사용하게 됩니다.

`useEffect(() => {...}, [dependencies])`

`useEffect`훅은 두 번째 파라미터에 전달된 의존성이 변경될때마다 첫 번째 전달된 함수가 재실행됩니다.

```javascript
import { useState, useEffect } from 'react';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedUserLoggedInInformation =
            localStorage.getItem('isLoggedIn');

        if (storedUserLoggedInInformation === 'LOGGED_IN') {
            setIsLoggedIn(true);
        }
    }, []);
}
```

위 코드는 컴포넌트 첫 렌더링 시 로컬 스토리지에 유저 로그인 정보가 남아있는지를 확인하여 컴포넌트 로그인 관련 상태값을 변경해줍니다. 이때 사이드이펙트는 로그인 정보를 얻어오는 부분이고 `useEffect`로 처리하지 않을 경우 컴포넌트 자동 렌더링에 따라 매번 로그인 정보를 요청하게 됩니다.

위 코드는 의존성 주입이 되지 않은 상태이기에 초기 렌더링에만 `useEffect`가 실행되며 이후 컴포넌트 내의 어떠한 부분이 변경되더라도 해당 함수는 실행되지 않게 됩니다.

:::warning 클린업
`useEffect`로 폼 입력에 대한 사이드이펙트 처리 시에 의존성 주입 후 매 입력마다 함수를 실행하도록 하면 함수 실행의 효율성이 떨어지게 됩니다.

이때 `useEffect`의 클린업 함수를 사용하면 디바운싱이라는 기법을 통해 효율성을 끌어올릴 수 있습니다. 디바운싱에 대한 설명은 [다음 문서를](https://www.geeksforgeeks.org/debouncing-in-javascript/) 참조해주세요.

```javascript
function App(){
    useEffect(() => {
        const identifier = setTimeout(() => {
            console.log("Checking from validity..");
            setFormIsValid(....);
        },500);

        return () => {
            console.log("CLEANUP...");
            clearTimeout(identifier);
        }


    }, [input1, input2]);
    return (
        // ...
    )
}
```

useEffect는 리턴값으로 함수를 지정합니다. 이 함수는 클린업 함수라고 부릅니다. 클린업 함수는 쉽게 말해 `useEffect` 실행 후 첫 번째 파라미터로 전달된 함수들이 실행되기 전에 먼저 실행되는 함수를 의미합니다.

컴포넌트 생명주기 관점에서 이를 바라보면 의존성으로 등록된 상태값 업데이트에 따라 이전의 컴포넌트가 언마운트(Unmount)되기 전 클린업 함수가 실행되는 것입니다.

디바운싱 기법과 함께 이해를 해본다면 폼 내부 값 변경에 따라 의존성에 등록된 상태값이 변경되고 이에 따라 이전 상태값을 갖던 컴포넌트도 언마운트가 됩니다. 이때 컴포넌트 언마운트 시 클린업 함수가 실행되는데 500밀리초 동안 잠시 타이머를 설정해둔 내부 함수가 클린업 함수에 의해 동작하지 않게 되고 다음 컴포넌트를 마운트하게 됩니다.

다음 컴포넌트도 역시 500밀리초를 잠시 대기하게 되는데 이때 사용자가 입력을 500밀리초 이상 멈추고 있었던 상황이라면 내부에서 `console.log`와 `setFormValid`함수가 함께 실행되며 컴포넌트 마운트가 이루어집니다.
:::

## Reference

1. [Debouncing in JavaScript](https://www.geeksforgeeks.org/debouncing-in-javascript/)
2. [Understanding react useEffect cleanup function](https://blog.logrocket.com/understanding-react-useeffect-cleanup-function/)
3. [zerocho - React Hooks! useEffect편](https://www.zerocho.com/category/React/post/5f9a6ef507be1d0004347305)
