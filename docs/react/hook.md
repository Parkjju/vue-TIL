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

`useForm`의 `register`함수 리턴값을 `input`에서 디스트럭쳐링 합니다. 

`register`의 반환 객체가 어떤 프로퍼티로 구성되어 있는지 확인하기 위해 원하는 문자열을 `register`에 전달하여 출력해봅니다.
```javascript
console.log(register('Hello!'));
// {name: 'Hello!', onChange: ƒ, onBlur: ƒ, ref: ƒ}
```

`onChange`, `onBlur` 이벤트 핸들러가 등록되어 있는 것을 확인할 수 있습니다. `react-hook-form`사용 전에는 모두 직접 등록해주어야 했던 것들을 `register`함수 호출 결과 객체가 프로퍼티로써 갖고 있고, 이를 HTML 폼 태그 어트리뷰트로 구조분해하여 전달하면 되는 것입니다.

## Form Validation
폼에 대한 유효성 검사가 또한 필수적입니다. 타입스크립트 코드로 작성할때 `onSubmit` 이벤트를 생각하시면 됩니다. 

입력 마무리 후 `submit`이벤트가 발생하게 되면 별도의 유효성 검사가 없을 때 해당 데이터들이 서버로 보내지게 됩니다. 

일반적으로 자바스크립트 기반으로 폼에 대한 유효성 검사를 하게된다면 `event.preventDefault()` 메서드 호출을 통해 서버로의 데이터 제출을 막고 검사를 진행하게 됩니다.

리액트에서도 마찬가지로 `onSubmit` 이벤트에 대해 제네릭을 `const onSubmit = (event: React.FormEvent<HTMLFormElement>)`과 같이 정의하여 함수를 작성해야합니다.

이러한 작업들을 `react-hook-form`에서 대신 해주는 함수가 바로 `handleSubmit`입니다. `form`태그에 프로퍼티 방식으로 `onSubmit` 이벤트를 등록하고, 이벤트에 해당하는 핸들러 함수 부분에 `handleSubmit()`을 호출합니다.

보통 프로퍼티 방식으로 이벤트 핸들러를 등록하게 되면 **함수를 호출하지 않고 함수 이름을, 즉 함수형 컴포넌트 내에 정의된 이벤트 핸들러 함수를 레퍼런스만 합니다.** 하지만 `react-hook-form`에서는 **`handleSubmit`함수를 호출합니다.**

```javascript
import { useForm } from "react-hook-form";

function Component(){
  const {register, handleSubmit } = useForm();
  const onValid = (data:any) => {
    console.log(data)
  }

  
  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        <input {...register("value", minLength:10, required:true)}/>
      </form>
    </div>
  )
}
```

`handleSubmit`함수는 인자로 콜백함수 두개를 받습니다. 첫 번째 인자는 유효성 검사에 데이터가 정상적으로 통과되었을때 호출하는 콜백함수이고, 두 번째 인자는 유효성 검사에 데이터가 통과하지 못했을 때 호출하는 콜백함수입니다. 두 번째 콜백 함수는 필수적이지 않습니다.

위 코드에서 `onValid`라는 이름으로 정의된 함수를 `handleSubmit` 함수가 콜백함수로 등록한 상황이고, input에서 유효성 검사가 통과되면 `onValid`함수가 실행되는 것입니다. `onValid`에는 인자로 유효성 검사에서 통과한 데이터를 받습니다.

`register`에서 유효성 검사를 추가하고 싶으면 HTML input 태그의 유효성 조건을 `register`의 두 번째 인자로 전달하면 됩니다. 

위의 코드는 `minLength`가 10이고, `required`라는 유효성 조건이 붙은 상태입니다.

또한 유효성 검사에서 통과하지 못했을때 그에 대한 오류를 확인할 수 있는 객체가 있습니다. 바로 `formState`이라는 객체입니다.

```javascript
import { useForm } from "react-hook-form";

function Component(){
  // formState 추가
  const {register, handleSubmit, formState } = useForm();
  const onValid = (data:any) => {
    console.log(data)
  }
  
  // 유효성 검사에서 통과하지 못한 에러 객체 확인
  console.log(formState.error);

  
  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        <input {...register("value", minLength:10, required:true)}/>
      </form>
    </div>
  )
}
```

`formState.error`를 console.log에 전달해두면 `submit` 이벤트에서 유효성 검사를 못했을때 왜 검사를 통과하지 못했는 지에 대해 알려줍니다. 객체 형태로 나타내는데, 에러에 대한 타입과 메세지 등이 프로퍼티로 구성됩니다.

에러 메세지는 `register`에서 커스텀할 수 있습니다. [다음 공식 문서를 참고해보세요.](https://react-hook-form.com/kr/advanced-usage#:~:text=%EC%97%90%EB%9F%AC-,%EB%A9%94%EC%84%B8%EC%A7%80,-%3C/%3E) 공식 문서에는 `value`와 함께 메세지를 정의하라고 설명하고 있습니다. `minLength: {value: 10, message: "10글자 이상 입력하세요."}`와 같이 사용합니다.

위 코드에 에러메세지를 추가해보겠습니다.

```javascript
import { useForm } from "react-hook-form";

function Component(){
  // formState 추가
  const {register, handleSubmit, formState } = useForm();
  const onValid = (data:any) => {
    console.log(data)
  }
  
  // 유효성 검사에서 통과하지 못한 에러 객체 확인
  console.log(formState.error);

  
  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
                <input
                    {...register('Value', {
                        minLength: {
                            value: 10,
                            message: '10글자 이상 입력하세요!',
                        },
                        required: {
                            value: true,
                            message: 'Required!!!',
                        },
                    })}
                />        
      </form>
    </div>
  )
}
```

유효성 검사에 대한 객체 프로퍼티는 `value`, `message`뿐만 아니라 `pattern`이라는 것도 존재한다. 폼에 대한 유효성 검사 조건으로 단순 `required`, 최소 입력 개수 등이 있겠지만 그걸 넘어 더욱 복잡한 조건으로 유효성 검사를 해야할 때도 있다. 

회원가입 시 아이디나 이메일 형식이라던가, 패스워드 형식 등이 그에 해당한다.

`pattern` 속성에는 정규식 형태로 입력 형식을 정의할 수 있다. 그 동안 정규식에 대한 내용을 미뤄왔다는 이제는 정리할 때가 왔다.

위 코드에서 form 내의 input부분만 발췌해보자.

```javascript
<input
    placeholder='Email'
    {...register('Email', {
        required: {
            value: true,
            message: 'Required!!!!',
        },
      // pattern추가.
        pattern: {
            value: /[A-Za-z0-9._%+-]+@naver\.com/g,
            message: 'Only naver.com emails allowed',
        },
    })}
/>
```

value에 정규표현식이 들어간 상태이다. **정규표현식은 따옴표로 감싸지 않는다.**

:::tip 타입스트립트 폼 제네릭 설정
타입스크립트 기반의 react-hook-form을 사용할 때에는 `useForm`훅에 유효성 검사 대상 폼 데이터 타입을 지정하여 제네릭으로 전달해야합니다.

```javascript
interface IForm{
  email:string,
  username: string,
}
  
function Component(){
  const {formState:{errors}} = useForm<IForm>();
  //  .....
  // form 내에 email과 username으로 register된 인풋태그 2개가 배치되어 있다.
}
```
:::


## 유효성 검사 커스텀
유효성 검사에 대한 조건을 커스텀 한다는 것은 라이브러리나 HTML자체에서 제공하는 몇 가지 유효성 검사, 즉 `pattern`의 정규식을 통과하고 `required`도 통과하며 `minLength`같은 조건들을 모두 만족했음에도 검사 해야만 하는 조건이 있는 상황을 말합니다.

패스워드 재 입력 과정에서 첫 번째 패스워드와 두 번째 패스워드가 다르면 분명 심각한 상황인데, 이를 JSX return 태그들 내에서 프로퍼티를 통해 처리할 수 있는 방법이 없습니다. 

함수를 정의해야 하는데 이때 사용되는 것이 바로 onValid 함수입니다. 

onValid는 기본적인 유효성 검사 조건을 모두 만족했을 때 실행되는 함수이지만 커스텀된 유효성 검사를 추가적으로 진행하는 함수이기도 합니다. 

onValid함수는 인자로 `data`를 받고 이 `data`안에는 유효성 검사를 진행할 데이터들이 모여있습니다. 즉 submit된 폼 내의 데이터들을 말합니다. 

예를 들어 회원가입을 할때 `username`, `password1`, `password2`를 입력해야한다고 가정하면 data객체의 프로퍼티로 `username` `password1` `password2`가 있으며 각각 접근할 수 있는 것입니다.

그럼 이제 onValid 함수를 통해 커스텀 유효성 검사 조건을 하나 마련해보겠습니다.
```javascript
interface IForm{
  username: string,
  password1: string,
  password2: string
}

function Register(){
  const {setError} = useForm<IForm>();
  
  const onValid = (data : IForm) => {
    if(password1 !== password2){
      setError("password1", {message: "password must same"})
    }
  }
}
```

onValid함수가 호출되고 패스워드 둘에 대한 유효성 검사가 진행됩니다. 이때 두 패스워드가 다르다는 if문에 진입하면 useForm훅의 **setError** 함수를 호출합니다.

`setError`의 첫 번째 인자로는 유효성 검사에 통과하지 못한 대상을 전달하고 두 번째 인자로 에러메세지를 객체에 감싸 전달합니다.

위에서의 onValid 활용이 특정 폼들에 대한 유효성 커스텀이었다면 전체 폼에 대한 유효성 검사도 진행할 수 있습니다. 사실상 전체 폼 유효성검사 통과 이후에도 특정 이유로 인한 error raise 상황이 발생할 수 있는 것입니다.

:::tip setError shouldFocus
setError함수의 인자로 shouldFocus를 지정할 수 있다. 객체로 감싸 `{shouldFocus: true}`와 같이 표기하면 setError로 인한 에러 발생시 커서가 에러 발생 폼으로 자동 전환된다.
:::

:::tip setValue
setValue함수는 원하는 폼에 대한 값을 새롭게 설정한다.

onValid함수가 있다는 가정 하에 다음과 같이 사용할 수 있다.
```javascript
const onValid = (data:IForm) => {
  if(data.todo.length > 10) {
    setError("todo", {message: "짧게 쓰세용"});
  }
  setValue('todo', ""); // todo로 register된 폼 비우기
}
```
:::

커스텀 방법 두번째로 register의 인자인 `validate`가 있다. 코드 작성부터 보자.
```javascript
<input
    placeholder='First Name'
    {...register('firstName', {
        validate: (value) => // register의 인자로 객체로 감싼 validate를 전달.
            !value.includes('jun') || 'jun 포함하지마',
    })}
/>
```

validate는 함수를 객체 프로퍼티에 대한 값으로 받는다. 이 함수는 인자로 `value`를 받는데, 이는 폼을 통해 전달된 값을 말한다. 에러 처리의 방법으로 위와 같이 `!value.includes('jun') || '에러메세지'`의 방식으로 처리하게 된다.

`value`는 includes함수를 가지며 `includes`에 전달한 문자열을 포함하면 true, 포함하지 않으면 false를 반환한다.

위의 `||`연산자를 통해 value에 jun이 포함되어 있었다면 첫 번째 조건 탈락으로 다음 에러메세지로 검사가 넘어가게 되는데, 에러메세지는 그 자체로 에러이므로 결과적으로 `jun 포함하지마`가 firstName의 에러로 저장된다.

또한 validate에 한 가지 함수만 전달할 수 있는 것이 아니라 둘 이상의 함수도 전달할 수 있다.

```javascript
<input
    placeholder='First Name'
    {...register('firstName', {
        // 객체 정의
        validate: {
          noJun: (value) => !value.includes('jun') || "No JUN!!",
          noPark: (value) => !value.includes('jun') || "No PARK!!!",
        }
    })}
/>
```
위와 같이 객체 리터럴을 validate에 전달해도 된다. 에러메세지 호출 시 별도의 객체 프로퍼티 접근이 필요없고 `errors?.firstName?.message`로 접근하면 된다.