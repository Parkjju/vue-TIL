---
title: React drag-and-drop

---
리액트에서는 DND(Drag-and-Drop) 애니메이션 구현을 해주는 라이브러리가 있다.

```sh
npm install react-beautiful-dnd
```

리액트 버전 18로 업그레이드 되면서 위 명령어로는 작동하지 않는데, 다음 옵션을 붙여 실행해야한다.

```sh
npm install react-beautiful-dnd --legacy-peer-deps
```

뒤에 붙은 `peer-deps`는 peer dependencies 패키지들에 대해 버전이 맞지 않아도 그냥 무시하고 설치하라는 옵션이다. devDependencies와는 다르게 패키지 내에서 **필수적으로 요구하지 않는 수준이기 때문에** 무시하고 설치해도 된다고 한다. 자세한 내용은 [다음 아티클을](https://blog.bitsrc.io/understanding-peer-dependencies-in-javascript-dbdb4ab5a7be) 참조하자.

