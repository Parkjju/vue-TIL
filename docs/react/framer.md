---
title: React with Framer Motion 1
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
기본적으로 variants 구현을 위한 각종 속성은 CSS 애니메이션과 동일하지만 매번 찾아보기가 어렵다. 프레이머 모션에서 제공하는 `Variants` 타입을 통해 타입스크립트의 자동완성 기능을 활용하면 생산성이 한결 높아질 수 있습니다.

```javascript
import { motion, Variants } from 'framer-motion';

const myVariants: Variants = {
    // scale의 s만 입력해도 자동완성 후보로 나타나게 된다.
    start: { scale: 0 },
    end: { scale: 1 },
};
```

:::

## Gesture

각종 이벤트 감지에 따른 애니메이션을 구현합니다. 제스쳐와 관련된 프로퍼티는 `while~`로 시작합니다. 프레이머 모션 데모 중 Gesture섹션을 보면 컴포넌트에 마우스 호버 시 스케일 업 & 회전이 일어나고 컴포넌트 클릭을 하게 되면 스케일 다운이 일어납니다. 해당 데모 모션을 구현하기 위해서는 `whileHover`와 `whileTap` 프로퍼티만 등록해주면 된다는 것입니다.

```javascript
function Component() {
    return (
        <div>
            <motion.div
                whileHover={{ rotateZ: 90, scale: 2 }}
                whileTap={{ scale: 1, borderRadius: '50px' }}
            />
        </div>
    );
}
```

모션과 관련된 속성들을 객체로 관리하기 위해 `variants`까지 적용하면 아래와 같게 됩니다.

```javascript
const boxVariants = {
    hover: {
        rotateZ: 90,
        scale: 2,
    },
    click: {
        scale: 1,
        borderRadius: '50px',
    },
};

function Component() {
    return (
        <div>
            <motion.div
                variants={{ boxVariants }}
                whileHover='hover'
                whileTap='click'
            />
        </div>
    );
}
```

호버나 클릭 등의 제스쳐 감지도 쉬운데, 드래그 애니메이션은 정말 어썸합니다. 프로퍼티에 `drag`만 삽입하면 해당 컴포넌트에 드래그 제스쳐가 알아서 등록 됩니다.

```javascript
function Component() {
    return (
        <div>
            <motion.div
                variants={{ boxVariants }}
                whileHover='hover'
                whileTap='click'
                // here!
                drag
            />
        </div>
    );
}
```

드래그 제스쳐 등록 후 드래그 중의 애니메이션을 감지하고 싶으면 `whileDrag` 프로퍼티를 사용하면 됩니다.

:::tip 색 변화 애니메이션
각종 색 변화를 부드러운 애니메이션으로 주고싶으면 색 명칭을 명시하는 것이 아니라 `rgb` 또는 `rgba` 값으로 표현합니다. 기존의 수치에서 애니메이션에 등록된 rgb 수치로 동적으로 이동하며 부드러운 애니메이션이 구현됩니다.
:::

드래그 애니메이션에는 제약조건 (constraints)를 부여할 수 있습니다. 화면 내에서 무한한 위치로 드래그를 하는 것이 아니라 드래그 대상이 처음 위치하는 곳을 기준으로 상-하-좌-우에 이동 가능한 좌표 한계점을 지정하는 것입니다.

위의 Component라는 이름의 컴포넌트에서 내부에 위치한 `motion.div` 컴포넌트가 드래그 대상이 됩니다. 이때 `motion.div`태그에 `dragConstraints`라는 프로퍼티를 선언하면 상-하-좌-우에 대한 좌표 제약을 부여할 수 있습니다. 프로퍼티 값으로 객체를 받으며, 프로퍼티는 `top`, `bottom`, `left`, `right`를 사용합니다. 프로퍼티 값 지정은 CSS의 `position:relative`를 기준으로 작성하면 됩니다.

```javascript
function Component() {
    return (
        <div>
            <motion.div
                variants={{ boxVariants }}
                whileHover='hover'
                whileTap='click'
                drag
                dragConstraints={{
                    top: -50,
                    bottom: 50,
                    left: -50,
                    right: 50,
                }}
            />
        </div>
    );
}
```

위의 프로퍼티를 등록하게 되면 드래그를 쭉 당기더라도 지정한 좌표 이상으로 컴포넌트가 벗어나지 못하게 됩니다.

프레이머 모션 데모를 그대로 구현하기 위해서는 큰 박스가 드래그 박스를 감싸고 있어야 합니다. 위 코드에서는 `motion.div`를 감싸는 `div`태그에 해당합니다. div대신 styled-components로 컴포넌트 하나를 생성해보겠습니다.

```javascript
// motion.div보다 크게
// overflow:hidden 효과 부여
const BiggerBox = styled.div`
    width: ..;
    height: ..;
    background-color: ..;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

function Component() {
    const biggerBoxRef = useRef < HTMLDivElement > null;
    return (
        <BiggerBox ref={biggerBoxRef}>
            <motion.div
                variants={{ boxVariants }}
                whileHover='hover'
                whileTap='click'
                drag
                dragConstraints={biggerBoxRef}
            />
        </BiggerBox>
    );
}
```

`dragConstraints`를 인라인 형태로 작성할 필요 없이 리액트의 `ref`를 사용하여 드래그 제약조건 객체를 자신의 부모 박스로 가리키도록 하면 됩니다.

:::tip 그 외의 드래그 제약 프로퍼티

1. `dragSnapToOrigin` : 드래그 하던 컴포넌트를 놓으면 기존에 있었던 위치로 되돌아갑니다. (boolean)
2. `dragElastic` : 드래그에 대한 장력을 설정합니다. 0~1사이의 숫자값이 필요하며 숫자가 높을수록 드래그에 드는 힘이 빡빡해집니다. `dragElastic={0.5}`
3. `drag="x"` or `drag="y"` : 드래그가 이루어지는 축을 설정합니다. x면 현 위치에서 x축으로만 드래그가 이루어집니다.

:::

## Motion Value

프레이머 모션에서 `Motion Value`라는 객체가 있습니다. 컴포넌트가 애니메이션에 따라 움직일때 어떤 수치를 가지고 움직이는지 나타냅니다. `useMotionValue`훅을 사용하면 해당 객체가 반환되어 저장됩니다.

```javascript
import { useMotionValue, motion } from 'framer-motion';

function Component() {
    const motionValue = useMotionValue(0);
    console.log(motionValue);
    return (
        <Wrapper>
            <Box
                style={{ motionValue }}
                drag='x'
                dragSnapToOrigin
                variants={boxVariants}
                whileHover='hover'
                whileTap='click'
                whileDrag={{ backgroundColor: 'rgb(46,204,113)' }}
            />
        </Wrapper>
    );
}
```

위 코드를 통해 모션 밸류가 변경될때마다 콘솔에 출력해보려고 합니다. 하지만 `Component`컴포넌트가 첫 렌더링 될 때에만 해당 값이 출력되고 이후에는 콘솔에 변화가 없게 됩니다.

이 말은 즉슨 **useMotionValue** 훅 호출에 따른 값이 컴포넌트 재 렌더링을 발생시키지 않는다는 것입니다. 리액트에서 상태값으로 관리되지 않는다는 것입니다. 하지만 실제로 `style` 프로퍼티를 보면 값에 대한 변화가 이루어지고 있는 것을 확인할 수 있을 것입니다.

모션 밸류를 콘솔에 출력해보고자 한다면 다음과 같이 `useEffect` 훅을 사용하면 됩니다.

```javascript
import { useMotionValue, motion } from 'framer-motion';

function Component() {
    const motionValue = useMotionValue(0);
    // motionValue에 onChange 이벤트리스너 등록
    useEffect(() => {
        motionValue.onChange(() => console.log(motionValue.get()));
    }, [motionValue]);
    return (
        <Wrapper>
            <Box
                style={{ motionValue }}
                drag='x'
                dragSnapToOrigin
                variants={boxVariants}
                whileHover='hover'
                whileTap='click'
                whileDrag={{ backgroundColor: 'rgb(46,204,113)' }}
            />
        </Wrapper>
    );
}
```

위 코드는 `style` 프로퍼티에 `useMotionValue`훅의 반환값을 모션 엘리먼트에 삽입한 것입니다. `motionValue`객체는 다양한 데이터를 포함하고 있지만 `motion.Element` 요소에 들어가게 되면 자동으로 애니메이션에 따른 프로퍼티 값으로 대체됩니다.

### useTransform

motionValue와 함께 사용되는 `useTransform` 훅 또한 유용하고 중요합니다. 모션 컴포넌트에 등록한 애니메이션에 따라 `motionValue` 값이 변하는데 이 값의 변화에 원하는 기준점을 잡고 해당 기준점에 맞춰질때 다른 값을 반환하도록 매핑시켜주는 것이 `useTransform`훅입니다.

예를 들어 위 코드처럼 x축을 따라 모션 컴포넌트가 이동을 할때 `Box`컴포넌트의 style 프로퍼티 `motionValue`값이 변하게 되는데 이때 이 값의 변화 기준점을 `-800`, `800`으로 지정합니다.

이후 `useTransform` 훅을 사용하여 `motionValue`가 -800일때 Z축 기준 회전을 위해 -360deg를 매핑시키고 800일때 360deg를 매핑시킵니다.

`useTransform`으로 관리되는 값은 `motionValue`와 동일하게 컴포넌트 리렌더링 없이 `motionValue`값 변화에 따라 부드럽게 매핑값으로 변화가 이루어집니다. 위의 예시에서는 -360~360까지 자연스러운 변화가 일어나게 됩니다.

```javascript
function App() {
    const x = useMotionValue(0);
    // motionValue와 매핑
    const rotateZ = useTransform(x, [-800, 800], [-360, 360]);

    return (
        <Wrapper>
            <Box
                // useTransform값 style에 등록
                style={{ x, rotateZ }}
                drag='x'
                dragSnapToOrigin
                variants={boxVariants}
                whileHover='hover'
                whileTap='click'
            />
        </Wrapper>
    );
}
```

### scroll

`motionValue`중에는 스크롤과 관련된 것들도 있습니다. `useViewportScroll` 함수인데, 이 함수를 호출하면 `scrollY`, `scrollX`, `scollYProgress`, `scrollXProgress`라는 네 개의 모션밸류를 반환합니다.

아래 코드는 `scrollY`와 `scrollYProgress`차이를 확인하기 위해 `useEffect`훅에 전달 후 스크롤 이벤트에 따라 두 값을 출력합니다.

```javascript
import { motion, useViewportScroll } from 'framer-motion';

function App() {
    const x = useMotionValue(0);
    const { scrollY, scrollYProgress } = useViewportScroll();

    useEffect(() => {
        scrollY.onChange(() =>
            console.log(scrollY.get(), scrollYProgress.get())
        );
    }, [scrollY, scrollYProgress]);

    return (
        <Wrapper style={{ background: gradient }}>
            <Box
                style={{ x }}
                drag='x'
                dragSnapToOrigin
                variants={boxVariants}
                whileHover='hover'
                whileTap='click'
            />
        </Wrapper>
    );
}
```

scrollY는 스크롤 맨 위를 기준으로 픽셀이며 아래로 스크롤 할때마다 그 수치가 픽셀값으로 나타납니다.

scrollYProgress는 스크롤 맨 위를 기준으로 아래까지 0~1이라는 값으로 나타내고 스크롤 진행에 대한 비율이 저장됩니다.

스크롤에 따라 모션 컴포넌트의 크기에 변화를 주고싶다면 `scrollYProgress`를 style프로퍼티의 `scale`에 전달합니다.

```javascript
function App() {
    const x = useMotionValue(0);
    const { scrollYProgress } = useViewportScroll();
    const scale = useTransform(scrollYProgress, [0, 1]);

    return (
        <Wrapper style={{ background: gradient }}>
            <Box
                // scale
                style={{ x, scale: scrollYProgress }}
                drag='x'
                dragSnapToOrigin
                variants={boxVariants}
                whileHover='hover'
                whileTap='click'
            />
        </Wrapper>
    );
}
```

## svg path

svg는 `path` 엘리먼트를 포함합니다. svg요소가 그려지는 경로를 나타내며 `motion` 엘리먼트는 `pathLength`라는 프로퍼티를 통해 `path` 엘리먼트가 자연스럽게 그려지는 애니메이션을 제공합니다.

```javascript
<Svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'>
    <motion.path
        stroke='white'
        strokeWidth={5}
        variants={svg}
        initial='start'
        animate='end'
        d='M14 95.7924C14 42.8877 56.8878 0 109.793 0H274.161C327.066 0 369.954 42.8877 369.954 95.7924C369.954 129.292 352.758 158.776 326.711 175.897C352.758 193.019 369.954 222.502 369.954 256.002C369.954 308.907 327.066 351.795 274.161 351.795H272.081C247.279 351.795 224.678 342.369 207.666 326.904V415.167C207.666 468.777 163.657 512 110.309 512C57.5361 512 14 469.243 14 416.207C14 382.709 31.1945 353.227 57.2392 336.105C31.1945 318.983 14 289.5 14 256.002C14 222.502 31.196 193.019 57.2425 175.897C31.196 158.776 14 129.292 14 95.7924ZM176.288 191.587H109.793C74.2172 191.587 45.3778 220.427 45.3778 256.002C45.3778 291.44 73.9948 320.194 109.381 320.416C109.518 320.415 109.655 320.415 109.793 320.415H176.288V191.587ZM207.666 256.002C207.666 291.577 236.505 320.417 272.081 320.417H274.161C309.737 320.417 338.576 291.577 338.576 256.002C338.576 220.427 309.737 191.587 274.161 191.587H272.081C236.505 191.587 207.666 220.427 207.666 256.002ZM109.793 351.795C109.655 351.795 109.518 351.794 109.381 351.794C73.9948 352.015 45.3778 380.769 45.3778 416.207C45.3778 451.652 74.6025 480.622 110.309 480.622C146.591 480.622 176.288 451.186 176.288 415.167V351.795H109.793ZM109.793 31.3778C74.2172 31.3778 45.3778 60.2173 45.3778 95.7924C45.3778 131.368 74.2172 160.207 109.793 160.207H176.288V31.3778H109.793ZM207.666 160.207H274.161C309.737 160.207 338.576 131.368 338.576 95.7924C338.576 60.2173 309.737 31.3778 274.161 31.3778H207.666V160.207Z'
    />
</Svg>
```

`Svg`라는 커스텀 컴포넌트를 만들고 그 안에 `path` 엘리먼트를 모션 엘리먼트로 생성해줍니다. `path` 엘리먼트는 기본적으로 `stroke`와 `strokeWidth` 프로퍼티를 제공하는데 이는 svg 그림의 가장자리 선에 대한 데이터입니다. `stroke`는 선의 색을 나타내고 `strokeWidth`는 선의 두께를 나타냅니다.

선을 따라 자연스럽게 그려지는 svg variants를 정의해보면 다음과 같습니다.

```javascript
const Svg = styled.svg`
    width: 80px;
    height: 80px;
    path {
        stroke: white;
        stroke-width: 5;
    }
`;

const svg = {
    start: {
        pathLength: 0,
        fill: 'rgba(255,255,255,0)',
    },
    end: {
        pathLength: 1,
        fill: 'rgba(255,255,255,1)',
        transition: { duration: 2 },
    },
};
```

1. `Svg` 컴포넌트 내부의 `path` 엘리먼트를 태그 셀렉터로 선택하고 `stroke`와 관련된 값을 정의합니다.
2. svg variants에서는 모션 엘리먼트 프로퍼티인 `initial`과 `animation`에 들어갈 프로퍼티를 각각 정의합니다.
3. `pathLength`는 0~1 사이의 값을 가지며 0은 아무것도 그려지지 않았을때, 1은 전체 svg가 그려졌을 때의 상태를 나타냅니다.
4. `fill`은 svg 내부를 어떤 색으로 채울 지를 결정합니다.

:::tip transition 부분적으로 지정하기
`animation`에 해당하는 프로퍼티에 `transition`을 적용하면 전체 프로퍼티에 대해 해당 효과가 적용됩니다.

모션 엘리먼트의 `transition` 프로퍼티는 객체를 받으며 첫 번째 프로퍼티로 `default`를 받습니다. `default` 프로퍼티는 모션 엘리먼트 내의 전체 프로퍼티들에 대해 동일한 트랜지션 효과를 부여합니다.

`transition`에 전달되는 객체 내부의 다른 프로퍼티는 **모션 엘리먼트 내의 원하는 프로퍼티를 선택하여 다른 트랜지션 효과를 직접적으로 부여할 수 있습니다.**

```javascript
<Svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'>
    <motion.path
        variants={svg}
        initial='start'
        animate='end'
        // here!!
        transition={{
            default: {
                duration: 2,
            },
            fill: {
                duration: 3,
            },
        }}
        d='M14 95.7924C14 42.8877 56.8878 0 109.793 0H274.161C327.066 0 369.954 42.8877 369.954 95.7924C369.954 129.292 352.758 158.776 326.711 175.897C352.758 193.019 369.954 222.502 369.954 256.002C369.954 308.907 327.066 351.795 274.161 351.795H272.081C247.279 351.795 224.678 342.369 207.666 326.904V415.167C207.666 468.777 163.657 512 110.309 512C57.5361 512 14 469.243 14 416.207C14 382.709 31.1945 353.227 57.2392 336.105C31.1945 318.983 14 289.5 14 256.002C14 222.502 31.196 193.019 57.2425 175.897C31.196 158.776 14 129.292 14 95.7924ZM176.288 191.587H109.793C74.2172 191.587 45.3778 220.427 45.3778 256.002C45.3778 291.44 73.9948 320.194 109.381 320.416C109.518 320.415 109.655 320.415 109.793 320.415H176.288V191.587ZM207.666 256.002C207.666 291.577 236.505 320.417 272.081 320.417H274.161C309.737 320.417 338.576 291.577 338.576 256.002C338.576 220.427 309.737 191.587 274.161 191.587H272.081C236.505 191.587 207.666 220.427 207.666 256.002ZM109.793 351.795C109.655 351.795 109.518 351.794 109.381 351.794C73.9948 352.015 45.3778 380.769 45.3778 416.207C45.3778 451.652 74.6025 480.622 110.309 480.622C146.591 480.622 176.288 451.186 176.288 415.167V351.795H109.793ZM109.793 31.3778C74.2172 31.3778 45.3778 60.2173 45.3778 95.7924C45.3778 131.368 74.2172 160.207 109.793 160.207H176.288V31.3778H109.793ZM207.666 160.207H274.161C309.737 160.207 338.576 131.368 338.576 95.7924C338.576 60.2173 309.737 31.3778 274.161 31.3778H207.666V160.207Z'
    />
</Svg>
```

위 코드는 위에 정의했던 svg variants 내에서 `fill`이라는 특정 프로퍼티를 선택하여 다른 트랜지션 효과를 부여하고 있습니다.

variants 내에 default와 구분하여 트랜지션을 정의해도 똑같이 돌아갑니다.

```javascript
const svg = {
    start: {
        pathLength: 0,
        fill: 'rgba(255,255,255,0)',
    },
    end: {
        pathLength: 1,
        fill: 'rgba(255,255,255,1)',
        // svg variants
        transition: {
            default: {
                duration: 4,
            },
            fill: {
                duration: 3,
            },
        },
    },
};
```

:::

## Reference

1. [Create React App 공식문서](https://create-react-app.dev/)
2. [How do I check the create-react-app version that my app used?](https://www.reddit.com/r/reactjs/comments/hm6fum/how_do_i_check_the_createreactapp_version_that_my/)
