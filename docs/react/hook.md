---
title: React Hook Form

---
## why React-hook-form?

타입스크립트 기반의 리액트 폼 컴포넌트를 제작하는 상황입니다.
1. `form` 태그를 생성하고, onSubmit 이벤트 리스너를 등록합니다. `preventDefault()`로 제출된 값에 대해 컨트롤 해야하기 때문입니다.
2. `form` 내부에서 `input` 등의 폼 태그들을 생성합니다. 이때 `onChange` 이벤트를 등록하여 값의 변화를 감지해야합니다.
3. 각 이벤트 리스너에 대한 함수 정의 시 타입스크립트 기반에서는 이벤트에 대한 제네릭을 사용하여 어떤 이벤트인지 선언해야합니다. 가령 `onSubmit` 이벤트에 대해서는 다음과 같이 코드를 작성합니다.

```javascript
const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  // code....
}
```

폼에 대한 인풋 태그들이 한 두가지면 제네릭을 매번 써서 코딩해도 그렇게 귀찮지 않을 수 있지만, 폼의 사이즈가 커질수록 손이 많이 가는 것이 사실입니다.

꼭 타입스크립트의 제네릭 등록이 아니더라도 각 폼에 대한 `value`를 `state`로써 감지해야하고, 폼마다 `useState`를 사용해야 한다는 것도 큰 문제입니다.

또한 폼 검증 (form validation)문제도 존재합니다. 조건에 맞지 않는 폼 제출 시 이에 대한 에러 메세지를 또 `state`로 관리해야합니다.

## 기존 코드와 비교해보기

일반적인 폼 컴포넌트 제작 순서에 따라 코드를 작성해봅니다.

폼 태그, 인풋 태그를 작성하고 인풋 태그의 내부 값을 상태값으로 관리합니다.
```javascript
function Component(){
  const [value, setValue] = useState("");
  
  const onChange = (event: React.FormEvent<HTMLFormElement>) => {
    const value = event.currentTarget.value;
    setValue(value);
  }
  
  return (
    <form>
      <input value={value} onChange={onChange}/>
      <button>Add</button>
    <form/>
  )
}
```

폼 태그에 `onSubmit` 이벤트 리스너를 등록합니다.

```javascript
function Component(){
  const [value, setValue] = useState("");
  
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setValue(value);
  }

  // 추가된 onSubmit 이벤트리스너 함수
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(value); // submit 이벤트 감지 시 입력되어 있는 value값을 출력한다.
  }
  
  return (
    <form onSubmit={onSubmit}> // 추가된 onSubmit
      <input value={value} onChange={onChange}/>
      <button>Add</button>
    <form/>
  )
}
```

위 코드를 보면 폼 두개에 대한 이벤트 핸들링도 쉽지 않다는 것이 느껴집니다. 이때 react-hook-form을 사용하면 코드가 어떻게 변할까요?

```sh
npm install react-hook-form
```

`react-hook-form`을 먼저 설치한 후 폼 태그를 다룰 컴포넌트 파일에서 `useForm`을 불러옵니다.

```javascript
import { useForm } from "react-hook-form";

function Component(){
  const {register, watch} = useForm();
  console.log(watch());
  
  return (
    <div>
      <form>
        <input {...register("value")}/>
      </form>
    </div>
  )
}
```

