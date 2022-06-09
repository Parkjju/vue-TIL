---
title: React 상태관리(Recoil)

---
## 상태관리

리액트를 공부하다보면 전역 상태 관리라는 용어를 접하게 됩니다. 어째서 전역 상태를 관리하게 될 상황을 맞닥뜨리게 되는지 시나리오를 생각해봅시다.

1. 로그인 여부에 따라 컴포넌트가 달라져야 합니다.
2. 로그아웃 상태 컴포넌트에서 로그인 상태 컴포넌트로 변경하기 위해서는 해당 컴포넌트까지 프롭스를 전달해야합니다.
3. 로그인 여부의 경우 전역적인 불리언 값으로 관리되어야 다른 하위 컴포넌트에서 프롭스를 받을 수 있습니다.
4. 서비스 규모가 커질 경우 컴포넌트의 프롭스로 뿌려줘야 할 것들이 너무나 많아지게 됩니다.

위의 시나리오를 생각해볼 때 전역 상태 관리 라이브러리가 없다고 가정하면 끔찍하기 짝이 없습니다. 왜 써야하는 지에 대해 간단히 알아보았으니 `Recoil`이라는 전역 상태 라이브러리에 대해 공부해봅시다.

## Recoil

Recoil은 `atom`이라는 것으로 전역 상태를 관리하게 됩니다. 기존 방식처럼 프롭스를 뿌려줄 최상위 컴포넌트로부터 매번 컴포넌트 프로퍼티에 값을 전달하는 것이 아니라 `atom`이라는 단위로 외부에 전역 상태를 저장하고 **변화된 상태를 적용할 컴포넌트와 커플링을 진행하는 것입니다.**

먼저 라이브러리를 설치해줍니다.

```sh
npm install recoil
```

`Recoil` 사용 흐름은 다음과 같습니다.

1. `atoms.js`에 `atom`단위로 관리할 상태값을 정의한다. 이때 `atom`에는 `key` 프로퍼티가 있어야한다.
2. 커플링 대상 컴포넌트에서 `useRecoilValue` 함수를 호출하면서 파라미터로 정의한 `atom`을 가져온다.

`atom`의 키값은 유일하도록 작성해야합니다.

```js
// atoms.ts
import { atom } from 'recoil';

export const myAtom = atom({
    key: 'myAtom',
    default: true,
});
```

```js
// Component.js
import { useRecoilValue } from 'recoil';

function Component() {
    const myAtom = useRecoilValue(myAtom);

    return <Child myProp={myAtom} />;
}
```

`useRecoilValue`훅을 사용하여 객체 생성 및 관리를 하면 해당 객체가 리코일의 아톰과 커플링됩니다. 커플링된 아톰을 또 다른 컴포넌트에서 세팅하기 위해서는 `useSetRecoilState`을 사용합니다. 이 훅은 리액트의 `useState`의 Setter 함수와 동일하게 작동합니다. (current 값을 변화시키는 함수로써의 역할)

```javascript
import { useSetRecoilState } from 'recoil';
import { isDarkAtom } from './atoms'; // myAtom파일이 저장되어 있는 위치

function Component() {
    const setter = useSetRecoilState(myAtom);

    return <button onClick={() => (current) => !current}>Click Me!</button>;
}
```

recoil의 훅 중 `useRecoilValue`는 등록된 아톰의 상태값을 get하는 훅이고 `useRecoilSetState` 훅은 아톰 상태값을 set하는 setter함수 훅이라면, `useRecoilState`은 리액트의 `useState`와 마찬가지로 상태값을 get하고 set하는 두 기능 모두를 담는 훅입니다.

타입스크립트 기반에서는 아톰에 대한 타입 제네릭을 `atom` 함수에 전달해야합니다. 다음은 배열 state를 관리하는 코드입니다.

인터페이스 IValue는 

```javascript
import {atom, useRecoilState} from "recoil";

interface IValue{
  text:string,
  myType: "TYPE_ONE" | "TYPE_TWO" | TYPE_THREE"
}

const valueState = atom<IValue[]>({
  key:"value",
  default: []
})


function Component(){
  const [value, setValue] = useRecoilState(valueState);
}  
```

`valueState`라는 아톰은 key를 value로 갖고 디폴트값으로 빈 배열을 갖는 아톰입니다. 타입스크립트 기반에서는 아톰을 생성할때(뿐만 아니라 다른 제네릭을 정의할때도 마찬가지) 배열로 생성하게 된다면 해당 배열 값이 어떤 타입의 원소들로 이루어지는지도 알려줘야합니다.

`valueState`아톰의 경우 각 원소가 `IValue`라는 인터페이스를 갖습니다. `IValue`타입의 객체는 내부 프로퍼티 두 개를 갖는데 각각 `string`형 `text`라는 프로퍼티와 특이한 타입의 `myType`프로퍼티를 갖습니다.

interface IValue의 `myType`은 string형 기반인데, **모든 string을 허용하는 타입이 아니라 위에 명시된 세 문자열에 대해서만 타입으로 허용하겠다는 의미로 해석하면 됩니다.**

:::tip 어트리뷰트 방식 이벤트핸들러에 인자 전달하기
```javascript
function Component(){
  const onClick = (param) => {
    // ...
  }
  
  return (
    <div>
    	<button onClick={() => onClick("PARAM!")}>파라미터 보내기!</button>
    </div>
  )
}
```
어트리뷰트 방식 이벤트 핸들러 함수에 인자를 전달하기 위해서는 **익명함수를 onClick 이벤트 핸들러에 호출해버리면 된다.**
:::

## Selector
셀렉터는 Recoil 공식문서에서 `derived state`라고 한다. 직역하면 파생된 상태값이라고 할 수 있겠는데, 이게 어떤 의미일까?

Recoil의 atom함수를 사용하여 버블 상태값 하나를 선언했다고 해보자. 컴포넌트 여기 저기서 `useSetRecoilState` 훅을 통해 내부 상태값에 변화를 계속해서 쌓아가고 있는데 이때 여러 컴포넌트로부터 발생한 상태값 변화가 **한 곳에 집결한다는 것이 중요하다.** 

한 공간(atom)에 상태들이 머무르게 되는데 Recoil에서는 **셀렉터를 통해 이 상태들을 구분지을 수 있다.** 구분지은 이 상태들이 또 다른 버블 state로 관리가 되기 때문에 derived state인 것이다.

다음 코드를 보자.
```javascript
import {atom, selector} from "recoil";

// 원천 state
export const originState = atom({
  key: "origin",
  default: []
})

// selector, derived state
export const derivedState = selector({
  key: "derived",
  get: ({get}) => {
    const originStateArray = get(originState);
    return [
      originStateArray.filter((item) => item.name === "ONE"),
      originStateArray.filter((item) => item.name === "TWO"),
      originStateArray.filter((item) => item.name === "THREE"),
    ]
  }
})
```

originState로부터 selector가 사용되어 derivedState가 생겼다. **selector로 생긴 상태값은 원천 state를 watch, 즉 지켜보고 있다.** `derivedState`에서 get 프로퍼티를 등록하게 되면 **get 대상인 원천 state에 종속되게 된다.** 원천 state의 값이 변하면 그에 따라 derivedState의  상태값도 동일하게 변하게 된다.

get프로퍼티는 함수를 받는데, 함수의 인자로 options객체를 받는다. options객체중 get이라는 함수가 있으며 이 함수는 원천 state를 받아온다.

위 코드는 배열 filter 메서드를 통해 세 부분으로 원천 state를 나누었다.

이후 저 나뉜 배열 요소들을 테마에 맞게 컴포넌트에서 출력하기 위해서는 다음과 같이 `useRecoilValue` 훅으로 셀렉터를 호출하면 된다. (셀렉터라고 해서 함수 느낌이 나지만, 실제로는 derived state, 아톰 단위 하나로 구분되기 때문에 useRecoilValue 등 Recoil 훅에 전달될 수 있다.)

```javascript
import derivedState from "./atoms"
function Component(){
  const [one, two, three] = useRecoilValue(derivedState);
  
  return (
    // ......
  )
}
```

셀렉터를 사용했을 때의 코드 구조적인 이점은 바로 **한 곳에 모아둔 state들을 직접 변경하지 않고 안전하게 관리할 수 있다는 것이다.** 자바스크립트의 immutability를 만족하는 강력한 기능이다.

## recoil set 프로퍼티
`useRecoilState`훅으로 반환되는 배열 첫 번째 원소는 위에서 이해하기로 **해당 atom이 갖고 있는 값을 나타냈었다.** recoil 셀렉터로 생성된 아톰을 다음 코드에 전달해보자.
```javascript
function Components(){
  const [value, setValue] = useRecoilState(myAtom);
}
```
위 코드에서 value는 `myAtom`이라는 아톰이 여기 저기 컴포넌트로부터 호출되며 쌓인 값들을 얻어낸 결과물이다.

selector로 유도된 상태값에서(derived state) `useRecoilState`의 0번째 인덱스 원소값은 **`myAtom`의 get프로퍼티 실행 함수를 나타낸다..** 

마찬가지로 Setter함수의 경우 위 코드에서 `useRecoilState`의 1번째 인덱스 요소인 `setValue`, 이는 훅에 전달된 인자 `myAtom`에서 정의된 `set`프로퍼티 실행함수이다.