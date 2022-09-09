---
title: React hook
---

udemy React 완벽 가이드 - 커스텀 훅 섹션의 정리 내용입니다.

## Rules of Hooks

훅을 정의하는 데에 있어 중요한 규칙 두가지가 있습니다.

1. 리액트 훅은 리액트 컴포넌트 함수 안에서만 호출되어야 합니다.
2. 중첩되는 형태로 호출하지 말아야 합니다. (useEffect안에서 use~ 훅을 호출할 수 없습니다.)
3. useEffect훅은 주변 컴포넌트로부터 참조하는 모든 데이터들을 의존성으로 추가합니다.

## 커스텀 훅

커스텀 훅도 리액트에 내장된 `useState` 등의 정규 함수입니다. 커스텀 훅은 일반 정규 함수와 다르게 **상태 설정에 대한 로직을 포함한** 함수입니다. 상태값을 사용하는 컴포넌트가 stateful 컴포넌트, 그 반대는 stateless 컴포넌트입니다.

커스텀 훅은 useState 등의 정규 함수와 다르게 **다른 리액트 훅 및 상태값들을 함께 사용할 수도 있습니다.** 훅의 규칙 중 중첩된 형태가 금지되었던 기존 훅들과 다른 점입니다.

간단히 정리하면 커스텀 훅은 상태값 관리 로직을 하나로 묶어 재사용 가능한 함수로써 활용한다는 것입니다.

## 커스텀 훅의 예시

두 컴포넌트가 App 컴포넌트에서 렌더링됩니다. 한 컴포넌트는 1초마다 0을 기점으로 1씩 증가하고 다른 컴포넌트는 1초마다 1씩 감소하는 컴포넌트입니다.

1씩 증가하느냐 감소하느냐의 차이를 제외하면 나머지 코드의 구성이 완전히 동일한 상황에서 리팩토링을 위해 해당 코드를 떼어 새로운 함수로 정의한다고 하면 **훅의 규칙에 위반되게 됩니다.** 훅은 항상 리액트 컴포넌트 함수 내에서만 호출되어야 한다는 것입니다.

일반적으로 hooks라는 이름으로 컴포넌트를 생성하고 훅 정의를 위한 자바스크립트 파일을 생성합니다. 함수를 정의함에 있어서 **반드시 함수명 앞에 use라는 키워드를 붙여 정의해야 합니다.** 이는 엄격한 규칙이며 지금 정의하는 이 함수가 리액트 훅으로써 활용되며 그 규칙을 따르겠다는 선언과도 동일한 역할을 하게 되는 것입니다.

```javascript
function App() {
    return (
        <React.Fragment>
            <ForwardCounter />
            <BackwardCounter />
        </React.Fragment>
    );
}
```

```javascript
import { useState, useEffect } from 'react';

import Card from './Card';

const ForwardCounter = () => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevCounter) => prevCounter + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return <Card>{counter}</Card>;
};

export default ForwardCounter;
```

```javascript
import { useState, useEffect } from 'react';

import Card from './Card';

const BackwardCounter = () => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevCounter) => prevCounter - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return <Card>{counter}</Card>;
};

export default BackwardCounter;
```

위의 세 컴포넌트가 있습니다. 백워드 카운터 컴포넌트와 포워드 카운터 컴포넌트는 각각 상태값을 counter로 두어 상태값 변경 로직에 따라 값을 렌더링하고 있습니다.

여기에 useCounter라는 커스텀 훅을 추가하여 각 카운터 컴포넌트에 추가해보겠습니다.

```javascript
// useCounter.js
import { useEffect, useState } from 'react';

const useCounter = () => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevCounter) => prevCounter - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // 변경 로직에 따라 달라진 상태값을 리턴한다.
    return counter;
};

export default useCounter;
```

Backward 컴포넌트에서 useCounter 훅을 호출한다면 **Backward 컴포넌트의 상태값은 자동으로 useCounter에서 다루는 상태값과 바인딩되어 함께 움직이게 됩니다.**

상태값이 바인딩된다는 것은 커스텀 훅 호출자 컴포넌트에서 생성 및 관리한 상태값들 전부가 커스텀 훅으로 들어간다는 것을 의미하지 않습니다. 위의 useCounter 훅을 보면 마지막에 값 변경 로직에 따라 달라진 상태값을 리턴하고 있는데, 이는 useState 훅에서 구조분해 문법을 통한 value, setter 함수를 리턴받는 것과 동일합니다.

Backward 컴포넌트에서 useCounter의 리턴값을 받으면 이 값은 컴포넌트 내에서 고정적인 값으로 활용되는 것이 아니라 **커스텀 훅 호출 컴포넌트의 상태값을 다루는 맥락에 맞추어 함께 움직이게 된다는 것입니다.**

```javascript
import useCounter from '../hooks/useCounter';

import Card from './Card';

const BackwardCounter = () => {
    const counter = useCounter();

    return <Card>{counter}</Card>;
};

export default BackwardCounter;
```

단순히 `const counter = useCounter();` 코드 한줄로 대체되었음에도 불구하고 `counter`라는 변수가 일반적인 변수로 활용되는 것이 아니라 BackwardCounter 컴포넌트의 상태값으로써 동작하게 된다는 것입니다.

훅에서 리턴하는 값의 형태는 어떤것이 되어도 상관없습니다.

위의 예시를 개선해야 한다면 전체적인 로직은 동일하고 1이 증가하느냐 감소하느냐 여부만 다르기 때문에 **카운터 상태값이 어떠한 형태로 업데이트 될 것인지에 대해서 동작하는 함수를 커스텀 훅의 매개변수로 전달하면 됩니다.**

커스텀 훅은 일반 자바스크립트 함수처럼 매개변수를 받을 수 있습니다. (또는 flag를 두어 더할지 뺄지 여부를 결정할 수도 있겠죠. 여기서부터는 정답이 없는 부분입니다.)

## 커스텀 훅의 현실적인 예시
