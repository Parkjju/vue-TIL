---
title: React useEffect

---
## 개요

리액트 `useState`는 이벤트 트리거에 따라 `state`에 등록해둔 `Setter`함수가 호출되면 **함수 종료 후 컴포넌트가 리 렌더링 된다.** 이 말은 즉슨 상태 관리를 함에 있어 **컴포넌트 내부 전체 코드가 매번 재실행된다는 것이다.** 

컴포넌트가 리 렌더링 됨에 따라 **매번 실행하지 않아도 되는 코드가 있을까?** 바로 `fetch API`와 같은 외부 API 호출 함수들이다. 이러한 함수나 코드들을 컴포넌트 첫 렌더링 때 한 번만 실행할 수 있게 해주는 리액트 훅이 바로 `useEffect`이다.

## 코드

`useEffect` 훅은 두개의 파라미터를 받는다.
1. 실행 함수
2. 디펜던시 리스트(Dependency list)

**디펜던시 리스트에 전달된 데이터 상태가 변할 때 마다 인자로 전달된 함수가 실행되는 훅이다.**

```javascript
import { useState, useEffect } from 'react';

function App(){
  const [counter, setValue] = useState(0);
  const [keyword, setKeyword] = useEffect("");
  
  const onClick = () => setValue((prev) => prev+1);
  const onChange = () => setKeyword(event.target.value);
  
  useEffect( () => {
    console.log("Run when counter changes!")
  }, [counter]);
    
  useEffect( () => {
    console.log("Run when keyword changes!")
  }, [keyword]);
  
  return (
    <div>
    	<input value={keyword} type="text" onChange={onChange}/>
    	<button onClick={onClick}>Click me!</button>
    </div>
  );
}
```

1. `counter`와 `keyword` 상태를 리액트에 등록한다.
2. 인풋박스에 텍스트 입력시 해당 값을 인풋박스 내부 값 변화가 `onChange`이벤트를 트리거하여 `onChange`함수가 실행된다. `keyword` 상태가 변화된다. 
3. `keyword` 상태가 변화되어 원래는 `App`컴포넌트 전체가 리 렌더링 된다. **하지만 useEffect에 등록된 console.log("Run when counter changes!")는 실행되지 않는다.** 디펜던시 리스트에 `keyword`가 없기 때문이다.
4. `counter`변수도 마찬가지이다. 온클릭 이벤트가 트리거 되어 `App`컴포넌트 전체가 리 렌더링 되더라도 `useEffect`에 등록된 `counter`에 대한 상태 변화 함수만 실행한다.

## clean-up function
`useEffect`훅은 `clean-up function`을 다룰 수 있다. `useEffect`는 리액트 컴포넌트의 라이프사이클을 다루게 되는데, 클린업 함수는 **componentWillUnmount** 단계에서 실행되는 함수이다. 다양한 라이프사이클이 있으며 이에 대한 내용은 [다음 링크를](https://krpeppermint100.medium.com/js-useeffect%EB%A5%BC-%ED%86%B5%ED%95%9C-react-hooks%EC%9D%98-lifecycle-%EA%B4%80%EB%A6%AC-3a65844bcaf8) 참조하자. 

```javascript
function Hello() {
  function create() {
    console.log('Created!');
    return destroy;
  }

  function destroy() {
    console.log('Destroyed!');
  }
  useEffect(create, []); 
  return <h1>Hello!</h1>;
}

function App() {
  const [showing, setShowing] = useState(false);
  const onClick = () => setShowing((prev) => !prev);
  return (
    <div>
      {showing ? <Hello /> : null}
      <button onClick={onClick}>{showing ? 'Hide' : 'Show'}</button>
    </div>
  );
}
```
위 코드에서 버튼 클릭을 통해 `showing` 상태가 변화됨에 따라 `Hello` 컴포넌트가 마운트되고 언마운트 되는데, 마운트 될 때에 컴포넌트 내에 정의된 `useEffect`훅에 따라 `create` 함수가 호출되어 실행되며, 언마운트 될 때에 클로저로 `create`함수에서 리턴된 `destroy`가 호출된다.

이에 따라 `Hello` 컴포넌트 컴포넌트 렌더링 시 `Created!`, 컴포넌트 파괴 시 `Destroyed!`가 콘솔에 출력된다.



## Reference
1. [nomad coders - React로 영화 웹 서비스 만들기](https://nomadcoders.co/react-for-beginners/lobby)
2. [React hooks stale closures](https://dmitripavlutin.com/react-hooks-stale-closures/)
3. [Understanding react useEffect cleanup function](https://blog.logrocket.com/understanding-react-useeffect-cleanup-function/)
4. [React useEffect훅과 라이프사이클](https://krpeppermint100.medium.com/js-useeffect%EB%A5%BC-%ED%86%B5%ED%95%9C-react-hooks%EC%9D%98-lifecycle-%EA%B4%80%EB%A6%AC-3a65844bcaf8)