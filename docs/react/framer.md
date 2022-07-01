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

## 애니메이션 제작

`framer developer` 사이트에 들어가보시면 모션 관련된 다양한 API들이 정의되어 있습니다. 해당 API를 활용하기 위해서는 `motion.div` 등의 모션 프로퍼티의 html객체를 활용하거나 `styled-components` 객체를 `motion`으로부터 상속시켜 활용할 수 있습니다.

```javascript
import styled from "styled-components";
import {motion} from "framer-motion";

// styled components 상속시키기
const Box = styled(motion.div)`
	height:100px;
	width:100px;
`;

function App(){
  return (
    <div>
    	<Box/>
    	<motion.div>Hello!</div>
    </div>
  )
}
```

위 코드를 통해 motion 객체 활용을 위한 세팅을 하였고 실제 애니메이션을 구현하기 위해서는 API문서에 나와있는 각종 프로퍼티들을 사용하면 됩니다. framer-motion 메인 페이지에 나와있는 데모 애니메이션 구현 코드를 보면 다음과 같이 나와있습니다.

```javascript
<motion.div
    initial={{ scale: 0 }}
    animate={{ rotate: 180, scale: 1 }}
    transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
    }}
/>
```

1. `initial` - 애니메이션 시작 전 초기상태
2. `animate` - 애니메이션 동작
3. `transition` - 애니메이션 동작의 디테일 (속도, 타입, 무게 등)

위의 기본적인 프로퍼티 외에 다양한 것들이 존재합니다.

## Variants

위에서는 프레이머 애니메이션 정의를 인라인 형식으로 작성하였는데, Vaiants를 활용하면 프레이머 모션 프로퍼티들을 외부 자바스크립트 객체로 추출하여 관리할 수 있어서 코드가 한결 간결해집니다.

```javascript
import {motion} from "framer-motion";

const myVariants = {
    start: { scale: 0 },
    end: { scale: 1, rotateZ: 360, transition: { type: 'spring', delay: 1 } },
};

function App(){
  return (
    <div>
    	<motion.div variants={myVariants} initial="start" animate="end">Hello!</div>
    </div>
  )
}
```

1. `myVariants`라는 이름으로 프레이머 모션 프로퍼티를 객체에 저장합니다.
2. motion.div 요소의 `variants`라는 프로퍼티에 위에 정의한 `myVariants` 객체를 전달합니다.
3. 이때 myVariants는 각각 시작시점과 끝 시점의 애니메이션 상태를 프로퍼티로 갖는데, `start`와 `end` 상태로 정의합니다. (이름은 상관없습니다.)
4. `variants`에 전달했으면 `initial` 프로퍼티에 myVariants의 시작상태 프로퍼티를 전달하고 `animate` 프로퍼티에는 myVariants의 끝 상태 프로퍼티를 전달합니다. 위에서는 각각 `start`, `end`로 정의하였습니다.

Variants는 위처럼 단순 코드 미감에도 장점이 있지만 기능적으로 더 빛을 발한다. 프레이머 모션 페이지 데모 애니메이션 중 2번째 Variants를 보면 네모박스 안에 원 네개가 들어가 있는 것을 볼 수 있습니다.

먼저 확인할 수 있는 장점은 **원들을 감싸고 있는 부모 요소인 박스에만 variants를 적용해도 해당 variants의 프로퍼티들이 자식에도 적용된다는 점입니다.**

```javascript
function App() {
    return (
        <Wrapper>
            <Box variants={boxVariants} initial='start' animate='end'>
                <Circle />
                <Circle />
                <Circle />
                <Circle />
            </Box>
        </Wrapper>
    );
}
```

위와 같은 구조일 때에 Box variants의 initial과 animate가 자식 요소에 자동으로 등록되어 애니메이션이 같이 적용된다는 것입니다.

자식에게 다른 애니메이션을 부여하고 싶다면 위의 코드의 경우에 `circleVariants`와 같이 따로 객체를 생성한 후 initial, animate에 전달하면 될 것이다. 다만, 주의할 점은 부모의 variants 프로퍼티 이름인 start, end와 동일한 이름으로 circleVariants도 작성해야 한다는 것입니다.

두 번째 장점은 Orchestration에 있습니다.

위의 애니메이션을 보면 원 각각이 박스 애니메이션이 끝난 후 하나씩 차례로 나타나는 것을 볼 수 있는데 이를 구현하기 위해 각 원에 variants를 각각 객체 생성 후 할당해야 한다는 문제가 있습니다.

프레이머에서는 이를 당연히 지원하며, **부모 요소의 variants의 transition에 애니메이션에 맞는 children 관련 옵션을 등록하면 됩니다.**

1. `delayChildren` : 자식 요소 전체를 딜레이시킵니다.
2. `staggerChildren` : 자식 요소 각각에 대해 차례로 딜레이 값을 증가시킵니다.

```javascript
const boxVariants = {
    start: { opacity: 0, scale: 0.5 },
    end: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            duration: 0.5,
            bounce: 0.5,
            // here!
            staggerChildren: 0.3,
        },
    },
};
```

위와 같이 부모 요소의 boxVariants에 `staggerChildren` 프로퍼티를 주게 되면 자식이 각각 0.3초씩 딜레이가 증가되며 차례로 나타나게 됩니다.

:::tip variants autocomplete
기본적으로 variants 구현을 위한 각종 속성은 CSS 애니메이션과 동일하지만 매번 찾아보기가 어렵다. 프레이머 모션에서 제공하는 `Variants` 타입을 통해 타입스크립트의 자동완성 기능을 활용하면 생산성이 한결 높아질 수 있다.

```javascript
import { motion, Variants } from 'framer-motion';

const myVariants: Variants = {
    // scale의 s만 입력해도 자동완성 후보로 나타나게 된다.
    start: { scale: 0 },
    end: { scale: 1 },
};
```

:::

## Reference

1. [Create React App 공식문서](https://create-react-app.dev/)
2. [How do I check the create-react-app version that my app used?](https://www.reddit.com/r/reactjs/comments/hm6fum/how_do_i_check_the_createreactapp_version_that_my/)
