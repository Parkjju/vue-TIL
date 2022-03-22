---
title: React Props

---
## 시나리오

컴포넌트 재사용에 대한 시나리오를 생각해보자. 기능에 따른 버튼을 각각 구현한다고 가정했을 때 다음의 컴포넌트를 생각해보자.
1. 작성 내용에 대한 저장 기능을 하는 버튼
2. 저장 완료 후 최종 반영을 하는 확인 버튼
3. etc ..

버튼에 따라 스타일은 다르겠지만 **버튼이라는 기본적 요소 특징은 공유하기 마련이다.** 예를 들어 `padding`, `backgroundColor`, `border` 등. 스타일 프로퍼티를 다른 컴포넌트에서 **재사용하는 방법을 모를 때의 코드를 봐보자.**

```javascript
    function SaveBtn() {
      return (
        <button
          style={{
            backgroundColor: 'tomato',
            color: 'white',
            padding: '10px 20px',
            border: 0,
            borderRadius: 10,
          }}
        >
          Save Changes
        </button>
      );
    }
    function ConfirmBtn() {
      return <button>Confirm</button>;
    }
    function App() {
      return (
        <div>
          <SaveBtn />
          <ConfirmBtn />
        </div>
      );
    }
    const root = document.getElementById('root');
    ReactDOM.render(<App />, root);
```

`SaveBtn` 컴포넌트가 있고 다섯 가지의 스타일 프로퍼티를 정의하였다. `ConfirmBtn` 컴포넌트에 대한 스타일 프로퍼티는 정의하지 않았음에도 코드가 벌써 복잡해지는 것을 확인할 수 있다.

이 모든 문제는 바로 **공통되는 성격의 HTML 요소 간 프로퍼티를 주고 받지 못하는 상황에서 비롯된다.** 

## Props
React `Props`는 컴포넌트의 커스텀 프로퍼티를 객체 형태로 저장하는 데이터이다. 코드를 보자.
```javascript
      console.log(props.disabled);
      return (
        <button
          style={{
            backgroundColor: 'tomato',
            color: 'white',
            padding: '10px 20px',
            borderRadius: 10,
          }}
        >
          {props.banana}
        </button>
      );
    };
    function App() {
      return (
        <div>
          <Btn banana='Save Changes' />
          <Btn banana='Continue' />
        </div>
      );
    }
    const root = document.getElementById('root');
    ReactDOM.render(<App />, root);
```

1. `Btn`이라는 공통 컴포넌트 하나를 생성한다. 스타일도 함께 정의한다.
2. `Btn` 컴포넌트에 `banana` 프로퍼티를 생성한다. 
3. `Btn` 컴포넌트의 텍스트노드 공간에 하드코딩 데이터 대신 `{props.banana}`를 입력한다.
4. `Btn` 컴포넌트를 등록할 때 `banana`프로퍼티가 존재하면 버튼 텍스트에 매번 삽입하게 된다.

**Btn** 컴포넌트를 보면 인자로 `props`가 전달되고 있는 것을 볼 수 있다. `props`인자는 컴포넌트에 사용자가 사용한 프로퍼티를 객체 형태로 저장한 공간이다.

`console.log(props)`를 해보면 `Btn`컴포넌트 렌더링 수에 따라 각 컴포넌트가 갖는 프로퍼티 목록이 객체 안에 들어있음을 확인할 수 있다.

정의되지 않은 프로퍼티에 대해서는 `undefined` 값을 갖게 된다.

:::tip
`props`는 구조분해 할당 문법을 통해 `props`객체 내부 프로퍼티에 직접 접근할 수 있다. 아래 코드의 출력 결과는 동일할 것이다.

```javascript
const Btn = (props) => {
  console.log(props.banana);
  console.log(props.text);
} // ... 

const Btn = ({banana, text}) => {
  console.log(banana);
  console.log(text);
}
```
:::

## props 이벤트
버튼 컴포넌트에 이벤트 리스너를 등록해보자.
```javascript
function App(){
  const [value, setValue] = React.useState("Btn text");
  const changeValue = setValue("Changed!");
  
  return(
    <div>
     <Btn text={value} onClick={changeValue} />
     <Btn text="Continue" />
   </div>
  );
}
```

버튼 텍스트를 `useState`로 등록해놓고 컴포넌트의 프로퍼티로 전달한다. 또한 클릭 이벤트 발생 시 버튼 내의 텍스트를 Changed!로 바꾸기 위해 `onClick`프로퍼티 방식으로 이벤트 리스너를 등록한다.

커스텀 컴포넌트에 이벤트 리스너를 등록하는 방법이 위와 같을까? 아니다. 아무리 명칭을 `onClick`이라고 정의했다 한들 커스텀 컴포넌트의 프로퍼티들은 `props`라는 객체 아래에 담기는 데이터일 뿐이다. `props` 객체 내에 `changeValue`라는 함수 표현식은 담기겠지만 이 함수가 이벤트 리스너로써 등록된 것은 아니라는 것이다.

```javascript
const Btn = (props) => {
  return(
    <button onClick={props.onClick}></button>
  );
}
// ...JSX codes
```

## React MEMO, re-rendering
이벤트 리스너 등록을 통해 버튼의 내부 텍스트에 변화를 주어 **컴포넌트 리 렌더링을 처리하였다.** 

문제는, 커스텀 버튼 컴포넌트 내에 렌더링 추적을 위해 `console.log`를 심어두면 **이벤트를 발생시킨 event.currentTarget** 해당 커스텀 컴포넌트를 동일하게 사용하는 형제 컴포넌트도 리 렌더링 된다는 것이다.

사실 `changeValue` 호출 후 첫 번째 커스텀 버튼 컴포넌트의 텍스트는 `Save Changes`로 변동되었으므로 리 렌더링이 되어야 한다. (props 챕터의 예제 코드를 살펴보자.)

반면 두 번째 커스텀 버튼 컴포넌트의 경우 텍스트, 즉 `state`의 직접적 변화가 없는데도 리 렌더링이 되었다.

`props`의 변화가 없을 때 불필요한 컴포넌트 리 렌더링을 막아주는 것이 바로 `React.memo()` 훅이다.

```javascript
const Btn = () => {
  // ... 컴포넌트 정의
}

const MemorizedBtn = React.memo(Btn); // memo훅을 적용할 컴포넌트를 인자로 전달한다.
```

:::warning
[React 공식문서](https://ko.reactjs.org/docs/hooks-reference.html#usememo)에 따르면 `React.memo()` 훅을 **사이드이펙트 보장의 수단으로 사용하지 말라고 한다.** 리 렌더링에 대해 문제가 없는 코드임에도 막연한 두려움으로 해당 훅을 남용하는 것은 바람직하지 않다.
:::

## propTypes
`propTypes` 패키지는 **컴포넌트 프로퍼티의 타입을 검사해주는 기능을 한다.**

먼저 `prop-types` 패키지를 설치해줘야 하는데, 경고 문구를 콘솔 상에서 확인하고 싶으면 **development** 버전을 설치해야한다.

```html
<!-- prop-types development version -->
<script src="https://unpkg.com/prop-types@15.6/prop-types.js"></script>
```

이후 생성한 버튼 컴포넌트에 `propTypes` 객체를 통해 컴포넌트 내부 프로퍼티에 대한 타입을 객체 형태로 정의해주면 된다.

```javascript
Btn.propTypes = {
  text: PropTypes.string,
  fontSize: PropTypes.number
}
```
이후 커스텀 컴포넌트를 붙일 때 타입에 맞지 않는 프로퍼티 값을 사용하면 경고문이 콘솔에 출력된다.

`PropTypes`객체에는 다양한 프로퍼티들이 존재하는데, 이중 `isRequired`프로퍼티를 커스텀 프로퍼티 타입으로 정의해두면 **해당 프로퍼티는 무조건 값이 할당되어 있어야 한다.**






## Reference
1. [nomad coders - React로 영화 웹 서비스 만들기](https://nomadcoders.co/react-for-beginners/lobby)