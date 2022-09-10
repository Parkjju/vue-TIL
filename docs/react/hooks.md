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

코드의 골자는 같되 상태값, 즉 데이터를 다루는 세부 방식만 다른 예시를 현실적인 부분에서 찾아본다면 **HTTP 리퀘스트를 다루는 부분에서 찾아볼 수 있습니다.**

GET 요청을 보내는지 POST 요청을 보내는 지의 여부는 다를 수 있겠지만 에러 또는 로딩에 대해 상태값으로 관리하고, 에러의 처리에 대한 부분도 공통적으로 묶어 함수 형태로 재사용할 수 있습니다.

리퀘스트를 날리는 방법은 내부적으로 다양할 수 있습니다. 메서드의 차이, 헤더 설정 등의 차이가 다양하겠지만 이를 한 코드 내에 작성해두면 해당 코드는 크기가 커질 수 있겠지만 이를 재사용함에 있어서 효율적이다는 점도 있습니다.

`useFetch`라는 커스텀 훅을 생성하고 여러가지 요청들을 받아올 수 있게 코드를 작성해보면 다음과 같습니다.

```javascript
import { useState } from 'react';

// requestConfig 파라미터
const useFetch = (requestConfig) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = async () => {
        // ...
    };
};
```

useFetch 훅의 파라미터로 **requestConfig** 라는 이름으로 리퀘스트 설정들을 객체 형태로 전달하면, 커스텀 훅의 내부 함수 sendRequest에서 객체 각 프로퍼티에 접근하여 다양한 요청에 따라 분기시켜 필요한 API에 요청을 보내게 될 것입니다.

```javascript
const useFetch = (requestConfig, applyData) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(requestConfig.url, {
                // 메서드 디폴트 값 처리
                method: requestConfig.method ? requestConfig.method : 'GET',
                headers: requestConfig?.headers,
                body: JSON.stringify(requestConfig.body),
            });

            if (!response.ok) {
                throw new Error('Request failed!');
            }
            const data = await response.json();

            applyData(data);
        } catch (err) {
            setError(err.message || 'Something went wrong!');
        }
        setIsLoading(false);
    };

    return {
        isLoading,
        error,
        sendRequest,
    };
};
```

로딩과 에러를 상태값으로 관리하고 requestConfig객체의 `url`, `method`, `body`를 각 컴포넌트에서 정의하여 훅의 파라미터로 전달합니다.

세부 데이터를 다루는 로직은 두 번째 파라미터로 `applyData`라는 이름으로 정의하여 정제하고 최종적으로 훅의 리턴값으로 객체를 정의하는데 로딩 상태, 에러상태, 데이터 fetch함수를 프로퍼티로 전달합니다.

위의 훅을 컴포넌트 함수에서 호출해보겠습니다.

```javascript
const Component = () => {
    const { isLoading, error, sendRequest } = useFetch({
        url: '요청URL',
        method: '요청메서드',
        headers: '요청헤더',
    });

    useEffect(() => {
        sendRequest();
    }, [sendRequest]);
};
```

컴포넌트가 위와 같이 정의되어 있고 useFetch훅의 리턴 객체로부터 fetching 함수를 꺼내온 뒤 useEffect 훅을 통해 컴포넌트 렌더링과 동시에 이를 호출합니다.

이때 무한루프 문제가 발생하게 되는데, useFetch 훅의 리턴값으로 나온 isLoading, error는 커스텀 훅 속에서 상태값으로 관리되고 있고 `sendRequest` 함수는 useFetch 훅 호출과 동시에 생성됩니다.

useFetch훅 호출과 동시에 함수가 새로운 주소값에 할당 및 생성되고 useEffect 의존성 목록에 따라 Component라는 이름의 컴포넌트가 재평가되게 됩니다.

sendRequest함수 내에서는 isLoading과 error 상태값을 변경시키는데 Component라는 이름의 컴포넌트의 상태값이 변한 것으로 간주되어 **컴포넌트의 재평가가 전체적으로 이때 이루어지게 됩니다.**

컴포넌트 재평가와 동시에 sendRequest 함수는 useFetch 호출에 따라 재생성 되고 원시타입이 아닌 참조타입이기 때문에 컴포넌트의 재평가가 무한루프 형태로 이루어집니다.

이를 해결하기 위해서는 useFetch훅 내에 정의했던 sendRequest 함수를 useCallback 훅으로 감싸고 파라미터로 전달되었던 requestConfig객체, applyData함수도 의존성으로 추가합니다.

이때 의존성으로 추가된 두 데이터도 참조타입이기 때문에 객체를 useMemo로 감싼 뒤에 관리해야 합니다.

위의 코드에서 useFetch훅의 데이터 핸들링은 applyData라는 함수 내에서 이루어집니다.

`const data = response.json()`으로 데이터를 받고 `data`로부터 각종 프로퍼티들을 추출한 뒤 이를 활용하고자 합니다.

이 모든 로직을 `useFetch`훅 내에 적용하게 되면 `useFetch`의 재사용성은 현저히 떨어지게 됩니다.

```javascript
const Child = () => {
    const { isLoading, error, sendRequest } = useFetch();

    // rawData의 개수는 여러개일 수 있다고 가정
    const refineData = (rawDataOne, rawDataTwo) => {
        // rawData를 정제하여 리턴하는 함수
    };

    const postData = async () => {
        sendRequest(
            {
                // useFetch로부터 가져온 fetch함수
                // applyData의 인자로 refineData 함수를 전달
            },
            refineData
        );
    };
};
```

위의 Child 컴포넌트에서 데이터를 정제하는 함수`refineData`는 로우데이터로 여러개를 동시에 받을 수 있습니다. 하지만 컴포넌트 내에서 sendRequest 함수로 fetch를 보낼 때 위에서 정의한 applyData 인자에 해당하는 함수는 **파라미터를 하나만 받고 있는 상황입니다.**

## bind 메서드 활용

이때 여러개의 파라미터가 전달되는 `refineData` 함수를 파라미터에 대한 별도의 작업 없이 그대로 전달하게 되면 원하지 않는 동작이 발생하게 될 것입니다.

이때 사용하는 것은 자바스크립트의 bind메서드입니다.

자바스크립트의 바인딩 메서드에 대한 내용은 [다음의 링크](https://parkjju.github.io/vue-TIL/js/this.html#bind)를 참조해주세요.

```javascript
const Child = () => {
    const { isLoading, error, sendRequest } = useFetch();

    const refineData = (rawDataOne, rawDataTwo) => {
        // 데이터 정제 로직
    };

    const postData = async (myPostData) => {
        sendRequest(
            {
                // POST관련 설정 객체
            },
            refineData.bind(null, myPostData)
        );
    };
};
```

`bind`메서드의 첫 번째 파라미터로 `refineData`에서 호출되는 this를 sendRequest함수의 맥락으로 설정해두게 되는데 refineData에서는 this를 사용하지 않으므로 null로 설정합니다.

`bind` 메서드는 함수입니다. bind 메서드 호출 시에 2번째 이후로 전달하는 파라미터들은 bind메서드 호출 결과인 함수에 전달할 파라미터가 될 것입니다.

바인딩된 함수를 sendRequest에 전달하면 refinedData함수의 컨텍스트가 바뀌어 sendRequest함수 정의부에서의 applyData 함수처럼 역할을 하게 됩니다.

`postData` 함수의 파라미터로 전달된 `myPostData`가 `refineData`함수와 바인딩 되면서 먼저 `refineData`의 첫 번째 인자인 `rawDataOne`에 할당됩니다.

이후 `sendRequest`함수가 호출되면서 `applyData`함수에 바인딩된 `refineData`함수가 할당되고 호출이 되는데 이때 전달된 `applyData`(refineData) 함수의 파라미터는 `rawDataTwo`에 할당되어 동작하게 됩니다.

바인딩 순서에 유념하며 코드를 작성해야 합니다.
