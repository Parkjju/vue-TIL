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