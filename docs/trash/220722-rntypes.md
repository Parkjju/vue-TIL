---
title: Snack 5호 - React Native에 TS 적용하기
---

## 기존 프로젝트에 타입스크립트 적용하기

[공식문서](https://reactnative.dev/docs/typescript#adding-typescript-to-an-existing-project)를 참고하여 기존 RN 프로젝트에 타입스크립트 세팅하는 방법을 정리합니다.

아래 명령어를 입력하여 타입스크립트 관련 패키지들을 설치합니다.

```sh
yarn add -D typescript @types/jest @types/react @types/react-native @types/react-test-renderer
```

`tsconfig.json`을 생성합니다. 아래 코드는 공식 문서에서 그대로 가져온 것입니다. 테스트를 진행하지 않는다면 `jest.config.js`파일은 생성하지 않아도 됩니다.

```javascript
{
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "jsx": "react-native",
    "lib": ["es2017"],
    "moduleResolution": "node",
    "noEmit": true,
    "strict": true,
    "target": "esnext"
  },
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "jest.config.js"
  ]
}
```

**`index.js`는 파일명 및 확장자를 변경하지 말아야합니다.**

위와 같이 세팅을 한 뒤 타입체킹이 필요한 파일들에 한해 **선택적으로 파일을 tsx, ts로 생성하면 됩니다.** 타입 관련되어 올바르지 않게 코드가 작성되어 있다면 해당 부분을 지적만 해주며 컴파일 및 시뮬레이터를 돌리는 데에는 문제없이 실행이 됩니다.

## Reference

1. [styled-components Typescript](https://styled-components.com/docs/api#typescript)
