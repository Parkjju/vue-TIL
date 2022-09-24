---
title: Frontend - prettier
---

본 내용은 인프런 김정환님의 [프론트엔드 개발환경의 이해와 실습](https://www.inflearn.com/course/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD/dashboard)강의의 요약본입니다.

## Prettier

프리티어는 코드 포맷팅 자동화 도구입니다. ESLint와 Prettier는 둘다 코드 포맷팅을 지원하기 때문에 포맷팅 규칙 충돌이 발생하곤 합니다.

이때 사용하는 것이 `eslint-config-prettier`입니다. 프리티어와 ESlint 포맷팅 규칙을 통합합니다. (중복되는 ESLint 규칙을 꺼버림)

```sh
yarn add -D eslint-config-prettier
```

또한 `eslint-plugin-prettier`를 설치하면 프리티어 규칙을 eslint안에 통합시켜 eslint만 돌리더라도 프리티어까지 돌아가는 것처럼 보이게 됩니다.

```sh
yarn add -D eslint-plugin-prettier
```

설치 후 `.eslintrc.js`에 `plugins`속성과 `rules`속성을 추가해야합니다.

```javascript
module.exports={
    // ....
    "plugins":[
        "prettier"
    ],
    "rules":{
        "prettier/prettier"
    }
}
```
