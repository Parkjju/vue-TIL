---
title: React 상태관리

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
import { atom } from "recoil";

export const myAtom = atom({
  key: "myAtom",
  default: true,
})
```

```js
// Component.js
import { useRecoilValue } from "recoil";

function Component(){
  const myAtom = useRecoilValue(myAtom);
  
  return (
    <Child myProp={myAtom}/>
  );
}
```

