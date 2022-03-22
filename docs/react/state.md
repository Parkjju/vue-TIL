---
title: React State

---
## State

리액트 state는 데이터가 저장되는 곳이다. [리액트 기초 - 인터랙션 구현하기](https://parkjju.github.io/vue-TIL/react/start.html)에서 바닐라 자바스크립트만 사용하여 구현된 코드를 보면 이벤트 감지마다 `counter`변수를 증가시키는 것을 볼 수 있다.

먼저 코드의 구조를 봐보자.
```javascript
const root = document.getElementById("root");
const Container = () => {
  return (
    <div>
      <h3> Total Clicks : 0 </h3> // 하드코딩
      <button> Click me! </button>
    </div>
  );
};

ReactDOM.render(<Container/>, root);
```

컨테이너 컴포넌트 내에 클릭 수 표시 요소와 버튼을 추가하여 렌더링하고 있다. 이제 자바스크립트에서 변수를 하나 생성하고 이를 컨테이너 JSX에 전달하려면 어떻게 해야할까? `{}` 중괄호를 통해 전달하면 된다! 

```javascript
const Container = () => {
  return (
    <div>
      <h3> Total Clicks : {counter} </h3> // counter 변수의 전달
      <button> Click me! </button>
    </div>
  );
};
```

버튼 클릭 수에 따라 카운터 변수의 값을 하나씩 증가시켜보자. 프로퍼티 방식의 이벤트 핸들러를 등록해보면 다음과 같다.
```javascript
function countUp() {
    counter = counter + 1;
}

const Container = () => {
    return (
        <div>
            <h3>Total Clicks : {counter}</h3>
            <button
                onClick={() => {
                    countUp();
                }}
            >
                Click Me!
            </button>
        </div>
    );
};
```
하지만, 클릭 감지 후에 카운터변수가 실제로 증가는 하고 있지만 화면 상에 반영이 되고 있지 않는 것을 볼 수 있을 것이다. counter 변수를 콘솔에 출력해보면 값은 증가하고 있다. 코드의 흐름을 보면, `ReactDOM.render()`함수를 통한 `Container` 컴포넌트를 페이지가 로드된 시점에 단 한번만 렌더링 하고 있기 때문이다.

위의 문제를 해결하기 위해서는 **카운트업 함수 호출 시 렌더링을 한번 더 진행하면 된다.** 

```javascript
function countUp(){
  counter = counter + 1;
  ReactDOM.render(<Container/>, root); // 외부 함수로 따로 빼서 작성하면 더 이쁘겠죠?
}
```
위의 방식은 효율적이지 않다. 리 렌더링에 대한 생각을 빼먹으면 안되기 때문에 실수의 여지가 존재한다. 

:::tip Why React?
바닐라 자바스크립트로 코드를 작성할 경우 엄격한 기준으로 코드를 작성하지 않으면 리 렌더링과 관련된 부분이 브라우저 상에서 매우 비효율적으로 구현된다. 이게 무슨 말이냐 하면 단순 `innerText` 또는 `innerHTML`을 기반으로 코드 작성을 하게 될때 XSS 공격에 노출될 수 있고, 엄격한 기준 아래 텍스트 노드에 직접 접근하여 `appendChild`, `removeChild`등의 메서드를 사용하면 코드가 복잡해진다는 것이다.

심지어 `innerHTML`와 같이 코드를 작성하게 되면 업데이트 대상 요소만 바뀌는 것이 아니라 마크업 전체가 업데이트 되기 때문에 코드 규모가 커질 수록 리 렌더링 과정에서 브라우저 성능에 악영향을 미치게 된다. 

반면 리액트의 경우 실제 업데이트될 요소의 특정 부분만 업데이트 된다. `ReactDOM`은 기본적으로 XSS에 대한 공격도 방어할 수단을 갖추고 있다.

개발자 도구 요소 검색에 들어가 버튼 클릭을 직접 해보자. 요소의 어떤 부분이 깜빡 거리는지, 코드는 어떻게 짜여있는지 바닐라 자바스크립트와 리액트 코드를 비교해보면 좋을 것이다.
:::

## setState
이제 본격적으로 리액트 state에 대한 이야기가 시작된다. 변수와 함수를 선언하여 리액트 리렌더링을 직접 하는 방식은 번거롭다. 문제점을 한 마디로 정리하면 **리 렌더링의 트리거(발동)를 개발자가 모두 직접 다뤄야 한다는 것이다.** 이에 대해 자동화를 시켜줄 수 있는 함수가 바로 `React.useState()`이다.

```javascript
const App = () => {
  const data = React.useState();
  // JSX code...
};
```
JSX 작성에 앞서 `React.useState()`함수를 통해 반환받은 값을 출력해보면 배열(Array)이 나타난다. `[undefined, function]`의 형태인데, 0번째 인덱스 값이 리액트에서 관리할 데이터이고 1번째 인덱스 값이 데이터를 바꿀 때 사용하는 함수이다.

`React.useState(0)`함수에 파라미터를 전달함으로써 데이터 초기값을 지정할 수 있다. 

`React.useState()` 배열의 데이터 관리를 위해 변수를 하나 생성하여 JSX 전달해보자.
```javascript
const App = () => {
  const data = React.useState();
  const counter = data[0];
  const modifier = data[1];
  // JSX code...
  // return <div> Hello {data[0]} !!</div>
  // or return <div Hello {counter} !! </div>
```

위와 같은 방식도 좋지만, ES6 구조 분해 문법(Destructuring) 통해 더 보기좋게 표현할 수 있다.
```javascript
const App = () => {
  const data = React.useState();
  const [counter, modifier] = data;
  console.log(counter);
  console.log(modifier);
  // JSX code..
}
```

카운트 변수에 데이터를 담을 수 있게 되었으니 리 렌더링만 처리하면 된다. 기존에 `ReactDOM.render()`함수를 매번 호출하며 어떤 컴포넌트를 렌더링할지 고민해야 했다면, `useState`를 통해 **렌더링할 데이터와 관련된 1번째 인덱스의 Setter함수만 호출하면 된다.**

```javascript
const App = () => {
  let [counter, modifier] = React.useState(0); // Setter함수명 : modifier
  const countUp = () => {
    counter = counter + 1;
    modifier(counter); // Setter 호출 후 리렌더링 요청을 직접한다.
  };
  // JSX code...
}
```

:::warning Update Hook
리액트 `useState`의 두 번째 인자로 **함수가 전달된다.** 이 함수를 통해 `useState` 훅은 리액트 상태 변화를 감지하여 자동으로 리 렌더링을 진행한다. 이때 이 함수에 **이미 변환된 값을 전달하는 것이 아니라, 어떻게 변환시킬 지에 대해 방법을 인자로 전달하는 것이 더 안전하다.** 

함수 외부에서 값을 계산하게 되면 동일 스코프의 다른 함수에서 그 값을 사용한 뒤 원하지 않는 결과값을 주고받을 수 있기 때문이다. 

위 코드를 수정하면 다음과 같다.
```javascript
const App = () => {
  let [counter, modifier] = React.useState(0); // Setter함수명 : modifier
  const countUp = () => {
    modifier(counter => counter + 1); // 파라미터로 함수를 전달
    // 현재 counter가 파라미터로 전달
    // counter라는 값을 어떻게 변화시킬지
    // 화살표 함수!
  };
  // JSX code...
```

참고로, useState의 Setter함수 내에 전달되는 내부 함수의 파라미터는 암묵적으로 **현재 상태의 값이 할당된다.**
:::

리액트 `useState` 훅을 사용하는 다음 예제를 직접 구현해보자.

### 1. 시간을 분으로 변환해보자.

:::details 정답 코드
```javascript
    function App() {
      const [amount, setAmount] = React.useState(0);
      const [disabled, setDisabled] = React.useState(true);
      const onChange = (e) => {
        setAmount(e.target.value);
      };
      const reset = () => {
        setAmount(0);
      };
      const flip = () => {
        setDisabled((current) => !current);
      };

      return (
        <div>
          <h1>Super converter</h1>
          <label htmlFor='minutes'>Minutes</label>
          <input
            id='minutes'
            placeholder='Minutes'
            type='number'
            value={!disabled ? amount * 60 : amount}
            onChange={onChange}
            disabled={!disabled}
          />

          <label htmlFor='hours'>Hours</label>
          <input
            onChange={onChange}
            id='hours'
            placeholder='Hours'
            type='number'
            value={disabled ? Math.round(amount / 60) : amount}
            disabled={disabled}
          />
          <button onClick={reset}>Reset</button>
          <button onClick={flip}>Flip!</button>
        </div>
      );
    }
    const root = document.getElementById('root');
    ReactDOM.render(<App />, root);
```
:::





## Reference
1. [nomad coders - React로 영화 웹 서비스 만들기](https://nomadcoders.co/react-for-beginners/lobby)