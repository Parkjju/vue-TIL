---
title: React Todo list
---

## React 투두 리스트 세팅

먼저 CRA를 통해 리액트 프로젝트를 하나 생성합니다.

```sh
npx create-react-app todoApp
```

[CRA 정리 문서를 보고](./cra.md) 리액트 투두 리스트에 필요한 프로젝트를 제외한 파일들을 모두 삭제합니다. `src` 폴더 아래에 갖고있는 파일은 다음과 같습니다.

1. App.js
2. App.module.css
3. Button.js
4. Button.module.css
5. index.js

이후 App.js 파일을 수정하여 투두 앱을 만들어봅시다.

## 투두 앱 제작

투두 앱 제작을 위해서는 다음 과정들이 필요합니다.

1. 인풋박스 데이터 입력 마무리 시 인풋박스 내부 텍스트 비워주기 - 인풋박스 데이터를 state로 관리
2. form태그 내에 `preventDefault` 메서드 적용하여 페이지 새로고침 안되도록 하기 - 자바스크립트
3. 인풋박스로부터 데이터를 받아서 어딘가에 저장하기 - 투두리스트 전체 데이터를 state로 관리

바닥부터 App컴포넌트를 로직 흐름에 따라 코딩해봅시다.

먼저 인풋박스의 데이터를 실시간으로 감지해야하므로 인풋박스에 이벤트 핸들러를 프로퍼티 방식으로 달아줍니다. 인풋박스 텍스트 변화를 감지하는 이벤트는 `onChange`입니다. 이벤트 감지 이후 실행되는 함수명 또한 `onChange`라고 정의해줍시다.

```js
import { useState } from 'react';

function App() {
    const onChange = () => {};

    return (
        <div>
            <form>
                <input
                    onChange={onChange}
                    type='text'
                    placeholder='type your todos..'
                />
            </form>
        </div>
    );
}
```

이벤트를 감지했으면 이에 따른 데이터 변화를 리액트 `state`로 관리하여 리 렌더링을 진행해야합니다. `useState`훅을 사용합니다. 이후 `onChange`함수에 `setToDo` 세터 함수를 호출합니다.

```js
import { useState } from 'react';

function App() {
    const [toDo, setToDo] = useState(''); // 추가

    const onChange = (event) => setTodo(event.target.value); // 추가

    return (
        <div>
            <form>
                <input
                    onChange={onChange}
                    type='text'
                    placeholder='type your todos..'
                />
            </form>
        </div>
    );
}
```

`setToDo` 세터함수를 통해 인풋박스에 입력된 데이터가 `toDo` 상태값에 반영되고 있습니다. 이 상태값을 버튼 클릭 이벤트 감지 시 특정한 배열에 저장하려고 합니다. 배열 또한 추후 투두리스트 목록 출력을 위한 역할을 해야하기 때문에 상태값으로써 관리해야합니다. (리 렌더링의 효율화를 위함입니다.)

:::warning React 불변성
리액트에는 대전제가 있습니다. 바로 **불변성입니다.** 굳이 `useState`훅까지 써가면서 상태값을 따로 관리해야하는 이유가 무엇일까요?

```javascript
var a = 1;
var b = a;

a += 1;
console.log(b); // 1
```

자바스크립트 원시 타입 중 하나인 `Number`타입에 대해서는 문제가 크게 없는 것으로 보입니다. 다음 코드를 봐볼까요?

```javascript
var obj1 = { one: 1, two: 2 };
var obj2 = obj1;

obj2.one = 2;

console.log(obj1); // ?
```

위 코드를 실행 시 `obj1`, `obj2`는 서로 **같은 참조값을 갖게 되는 것입니다.** 즉, 객체 타입의 변수는 서로 같은 참조값을 가질 위험성이 있으며 이는 버그로 이어지게 됩니다. 이러한 문제로 인해 객체를 많이 다루게 될 리액트에서는 애초에 따로 관리한다는 차원에서 `useState`를 통해 상태값으로 객체를 관리하게 되는 것입니다.
:::

```js
import { useState } from 'react';

function App() {
    const [toDo, setToDo] = useState('');
    const [toDos, setToDos] = useState([]);

    const onChange = (event) => setToDo(event.target.value);
    const onSubmit = (event) => {
        //추가
        if (toDo == '') {
            // 빈 입력 검사
            return;
        }
        event.preventDefault(); // preventDefault
        setToDos((currentToDos) => [toDo, ...currentToDos]); // todo배열에 데이터 추가
        // Setter함수를 이용하자!
        setToDo(''); // 입력 비우기
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    onChange={onChange}
                    type='text'
                    placeholder='type your todos..'
                />
                <button>Add TODO!</button>
            </form>
        </div>
    );
}
```

입력된 toDo를 상태배열인 `currentToDos`에 추가해줍니다.

## Reference

1. [nomad coders - React로 영화 웹 서비스 만들기](https://nomadcoders.co/react-for-beginners/lobby)
2. [React에서 왜 불변성을 지켜야할까?](https://webigotr.tistory.com/293)

<Disqus/>
