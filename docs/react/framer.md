---
title: React with Framer Motion
---

## 설치 및 사용

```sh
npm install framer-motion
```

설치 후 프레이머 모션을 사용하는 방법은 `motion`을 임포트한 뒤에 일반 HTML 태그 앞에 `motion.태그명` 형식으로 motion을 붙여주면 됩니다.

```javascript
import { motion } from 'framer-motion';

function App() {
    return (
        <Wrapper>
            <Box />
            <motion.div>Hello</motion.div>
        </Wrapper>
    );
}
```

`npm start` 명령어 입력 후 아래의 오류가 발생할 수도 있습니다.

```text
...
Can't import the named export 'Children' from non EcmaScripts module (only default export is available)
...
```

CRA 버전 4에서는 EcmaScripts의 module 문법을 받아들이지 못하는데, framer motion이 버전 5 (현재는 6)로 업데이트 되면서 모듈 문법을 적용하였기 때문입니다.

따라서 CRA에 대한 업데이트를 진행해줘야 하는데, 다음과 같이 진행하면 됩니다.

먼저 CRA를 처음 설치할때 처럼 `-g` 옵션을 붙여 재 설치하는 방법이 있습니다.

```sh
npm install -g create-react-app

create-react-app --version
# 5.0.1
```

또는 프로젝트 단위에서만 CRA 버전 업데이트를 하고 싶으면 CRA 버전 4가 설치된 프로젝트로 이동하여 다음 명령어를 실행합니다.

```sh
npm install react-scripts@latest
```

이때 `react-scripts`는 CRA에서 관리하는 `package.json`의 dependencies에 적혀 있는데, CRA의 버전을 의미하는 것이니 참고하면 좋습니다.

또 다른 해결 방법으로는 CRACO(Create React App Configuration Override) 패키지를 활용하는 것도 있습니다. 현재 기준 버전으로 CRA버전 4까지만 지원하므로 추후에 다루도록 하겠습니다.

## Reference

1. [Create React App 공식문서](https://create-react-app.dev/)
2. [How do I check the create-react-app version that my app used?](https://www.reddit.com/r/reactjs/comments/hm6fum/how_do_i_check_the_createreactapp_version_that_my/)
