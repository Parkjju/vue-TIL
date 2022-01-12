---
title: 익스포트(export)
---

# export

## export 1 - default

모든 라우터를 한 파일에서 관리하기란 쉽지 않은 일이다. 따라서 각 기능별로 라우터를 모듈화 하여 작업을 처리해야한다.

자바스크립트는 단순 파일에 대해서만 임포트 해오는 것이 아니라 파일 내부의 특정 변수나 함수 같은 것들을 따로 가져올 수 있다.
임포트 전에는 익스포트(export)를 해야하는데 이와 관련된 자바스크립트 문법이 `default exports`이다.

:::warning
자바스크립트의 각 모듈은 엄격히 다르게 관리되기 때문에 각 모듈에서 필요한 패키지나 모듈을 각각 임포트 해야한다. 관련된 모듈 끼리 중복되는 모듈이 있더라도 각각 임포트 해주어야 한다.
:::

다음은 `globalRouter.js` 파일 내부이다.

```js
// globalRouter.js
import express from "express";

const globalRouter = express.Router();

const handleHome = (req, res) => res.send("Home");
globalRouter.get("/", handleHome);

export default globalRouter;
```

`globalRouter.js` 파일에서는 라우터를 생성한 뒤 해당 라우터를 익스포트 해주고 있다.

해당 라우터를 다른 파일에서 임포트 하기 위해서는 다음과 같이 처리하면 된다.

```js
// server.js
import globalRouter from "./routers/globalRouter";
```

`globalRouter`라는 이름으로 임포트 해오는데 경로는 위와 같은 상대경로로 지정하였다.

:::warning
라우터와 컨트롤러(함수)도 따로 분리하는 것이 옳다.
라우터는 컨트롤러를 활용하는 입장이다.
:::

:::tip
글로벌 컨트롤러가 필요할까?

답은 아니다. 위에서 언급했듯 글로벌 라우터도 사실은 기능별로 묶어서 관리하는 것이 논리적으로는 옳다. URL을 깔끔하게 관리하기 위해서 글로벌 라우터로 관리를 하는 것이지, 글로벌 라우터에서 빠져나온 컨트롤러는 기능별로 묶어서 관리할 수 있는 것이다.
:::

## export 2

자바스크립트의 익스포트 디폴트는 한 가지 대상에 대해서만 익스포트 할 수 있다. 여러 대상을 각각 익스포트 하기 위해서는 각 변수 앞에 `export` 키워드를 붙여준다.

위와 같은 방식으로 익스포트 했을 때에는 임포트하는 방식이 달라진다.

```js
import trending from "상대경로"; //디폴트 익스포트 방식에 대한 임포트
import { trending } from "상대경로"; //변수 익스포트 방식에 대한 임포트 - 객체를 임포트
```

노드 JS는 티폴트 방식의 익스포트에 대해서 **한 파일에는 디폴트 익스포트가 하나뿐이기 때문에** 해당 파일을 인식하여 임포트 명칭을 자유롭게 바꿀 수 있지만, 변수에 대한 익스포트는 **객체 자체의 이름을 임포트해야한다.**
