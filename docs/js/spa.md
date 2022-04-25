---
title: SPA

---
## SPA vs MPA
모던 웹 개발의 패러다임으로 SPA가 최근 부각되고 있습니다. SPA는 `Single Page Application`의 약자로 말 그대로 한 페이지 내에서 다양한 UI들을 그려나가는 방식이라고 생각하시면 됩니다.

[React Router문서](https://parkjju.github.io/vue-TIL/react/router.html#movie-api)를 참조하시면 리액트를 통해 SPA가 어떻게 구현되는지 예제와 함께 있으니 참고해보시면 좋을 것 같습니다. 이 문서에서는 바닐라 자바스크립트를 통해 SPA를 직접 구현해보도록 하겠습니다.

구현에 앞서 SPA와 MPA(Multi-Page Application)의 차이를 더 깊게 알아봅시다.

## CSR과 SSR 

SPA는 한 페이지 내에서 UI 관리가 이루어집니다. 특정 컴포넌트 속에서 Ajax 요청으로 계속해서 자식 컴포넌트가 추가된다거나 데이터가 추가되는 등의 작업부터 시작하여 전체 페이지의 UI가 변경되도록 라우팅을 설정하는 작업까지도 가능합니다. (다른 URL로 이동하여 페이지 전체가 리로딩되는 듯한 경험을 제공) 

페이지 전체가 리로딩되는 것처럼 느끼게 한다면 기존 웹 개발 방식이었던 MPA와 어떤 차이가 있을까요? **SPA는 페이지 접속과 동시에 서버로부터 정적 리소스 전체를 받아오는 반면 MPA는 각 페이지마다 리소스를 매번 서버에 요청하는 방식으로 이루어집니다.** 이때 CSR(Client-Side-Rendering)과 SSR(Server-Side-Rendering) 개념이 함께 등장하게 됩니다.

SPA 개념에 따라 다양한 어플리케이션 흐름을 창조하기 위해서는 한 페이지 내에서 비동기적으로 데이터를 끊임없이 요청하게 됩니다. 하지만 서버와의 통신이 첫 페이지 렌더링에서 사실상 끝난 것이고 이후로는 클라이언트 측에서 계속해서 렌더링을 진행한다고 하여 SPA에서는 CSR 방식만 채택되어 사용되는 것입니다. 

MPA는 반대로 여러 페이지가 있고 다양한 페이지를 URL 접속에 따라 보여줘야 하므로 매번 서버에 정적 리소스 요청이 필요합니다. 따라서 서버로부터 렌더링 요소들을 불러오기 때문에 SSR이라는 방식이 채택되는 것입니다.

SSR 기반의 SPA가 사용자 친화적이라는 장점이 있지만, [NAVER D2 어서 와, SSR은 처음이지?](https://d2.naver.com/helloworld/7804182) 문서를 참조하면 특정 컨텐츠에 자주 접근하게 될 때 해당 페이지 첫 렌더링 시간이 매번 느리기 때문에 오히려 UX를 해치는 경우도 발생하며 특히나 주요한 단점이 **SEO 적용이 까다롭다는 것입니다.** 리액트 기반 프로젝트는 구글이 크롤링할 때에 `index`페이지만 인식을 하게 되기 때문입니다. 최근에는 `meta`태그를 직접 설정한다던가 각종 SSR 프레임워크를 적용하면 해결되는 문제입니다. 

## SPA 예제 - 환경 구축

`node.js`의 익스프레스로 서버 구축 후 SPA를 직접 구현해보도록 하겠습니다. 기본 환경 구축은 다음 순서로 진행됩니다.
1. SPA 작업 폴더 생성 후 루트 위치에 프론트엔드 작업용 폴더를 하나 생성합니다.
2. 프론트엔드 폴더에 `static`, `static`폴더 아래에 `js`라는 폴더를 생성해줍니다. 
3. 프론트엔드 바로 아래에 `index.html`파일을 생성해줍니다.
4. 루트 위치에서 `npm init -y`로 node.js 프로젝트 기본 세팅을 진행합니다. (package.json생성)
5. `npm install express`
6. 루트 위치에서 `server.js`를 생성합니다.

위의 순서대로 작업을 진행하면 폴더 구조는 다음과 같아집니다.
```text
├── frontend
│   ├── index.html
│   └── static
│       └── js
│           └── index.js
├── package-lock.json
├── package.json
└── server.js
```

이후 `server.js`에 다음 코드를 작성합니다.
```javascript
const express = require('express');
const path = require('path');

const app = express();

app.use(
    '/static',
    express.static(path.resolve(__dirname, 'frontend', 'static'))
);

// 어떤 경로든지
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

app.listen(8080, () => console.log('Server running at http://localhost:8080'));
```

기본적으로 익스프레스 기반 웹 서버를 제작하는 코드라고 생각하면 됩니다. `path`를 통해 로컬 파일들을 요청에 대한 응답으로 보내주는 코드들도 포함되어 있습니다. (`res.sendFile`)

환경 구축이 모두 마무리 되었으면 터미널에서 `node server.js`를 입력합니다. 


## SPA 예제 - 정적 리소스 제작
프론트엔드 폴더 바로 아래에 `index.html`을 생성합니다.
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SPA App</title>
    </head>
    <body>
        <nav class="nav">
            <a href="/" class="nav__link" data-link>Dashboard</a>
            <a href="/posts" class="nav__link" data-link>Posts</a>
            <a href="/users" class="nav__link" data-link>Users</a>
        </nav>
        <script type="module" src="/static/js/index.js"></script>
    </body>
</html>
```
코드는 위와 같습니다. 현재까지만 보면 MPA방식과 다름이 없습니다만 html `a` 태그의 `href` 속성이 특정 파일을 가리키는 것이 아니라 어딘가로 라우팅하고 있는 것을 확인할 수 있습니다.

:::warning 
위 코드에서 스크립트 태그를 보면 타입 속성으로 `module`을 지정해둔 것을 확인할 수 있습니다. 위 속성을 지정해주지 않으면 ES6 import 문법을 사용할 수 없습니다.
:::

html 생성 후, 컴포넌트 렌더링을 위한 자바스크립트 코드를 작성합니다.
```javascript
// frontend/static/js/index.js
const router = async () => {
    const routes = [
        { path: '/', component: () => console.log('Home Component Loaded') },
        {
            path: '/users',
            component: () => console.log('User Component Loaded'),
        },
        {
            path: '/posts',
            component: () => console.log('Posts Component Loaded'),
        },
    ];

    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            isMatch: location.pathname === route.path,
        };
    });

    console.log(potentialMatches);
};

document.addEventListener('DOMContentLoaded', () => {
    router();
});
```
위 자바스크립트 코드에 대한 흐름은 다음과 같습니다.
1. `router` 비동기 함수를 생성합니다.
2. 위 함수 내에서 `routes` 배열울 생성합니다. 배열 각 원소는 객체로 이루어지며 프로퍼티는 `path`, `component`입니다. `path`는 SPA 라우팅을 위한 `pathname`처리 로직에 이용되고 `component`프로퍼티는 이후 함수형 컴포넌트 호출에 사용됩니다.
3. 전역객체의 `DOMContentLoaded`이벤트 핸들러를 부착하고, 이벤트 감지 시 `router` 함수를 실행합니다.
4. 익스프레스 서버 가동 후 index.html에서 각 앵커 태그로 접속 시 `potentialMatches` 객체의 `isMatch` 값이 계산되어 콘솔창에 나타나게 됩니다.

## SPA 예제 - CSR 기틀 마련
SPA 기반인 CSR 구현을 위해서는 HTML의 history API를 활용해야합니다. 여러 메서드가 있는데, 그 중 `pushState` 메서드를 활용하면 **페이지 새로고침 없이 새로운 UI가 렌더링 된 것처럼 브라우저 뒤로가기 버튼이 활성화되게 됩니다.** 

```javascript
const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: '/', component: () => console.log('Home Component Loaded') },
        {
            path: '/users',
            component: () => console.log('User Component Loaded'),
        },
        {
            path: '/posts',
            component: () => console.log('Posts Component Loaded'),
        },
    ];

    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            isMatch: location.pathname === route.path,
        };
    });

    let match = potentialMatches.find(
        (potentialMatch) => potentialMatch.isMatch
    );

    // 404 접속 시 처리 로직
    if (!match) {
        match = {
            route: routes[0],
            isMatch: true,
        };
    }

    console.log(match.route.component());
};

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if (event.target.matches('[data-link]')) {
            event.preventDefault();
            navigateTo(event.target.href);
        }
    });
    router();
});
```

1. `navigateTo` 함수에서 html history API를 활용합니다.
2. 위에서 `DOMContentLoaded` 이벤트 핸들러를 document객체에 등록해두었는데 이 핸들러 안에서 `navigateTo` 함수를 호출하게 됩니다.
3. 각 앵커 태그에 클릭 이벤트 핸들러를 부착합니다. `Element.matches` 메서드를 통해 `event.target`인 앵커 태그에 프로퍼티 셀렉터가 (`[data-link]`) 존재하는지 검사하여 페이지 리로딩을 하지 않도록 막습니다. (event.preventDefault 호출, `data-link`로직처리는 클릭을 통한 정상적 접근이 이루어졌는지에 대해 검사하는 것으로 생각하시면 됩니다.)

:::warning 뒤로가기 - popstate
위의 코드까지 작성한 뒤 서버를 돌리면 앵커 태그를 통한 페이지 전환 시 새로고침이 이루어지지 않은 채로 페이지가 작동하게 됩니다. 하지만 페이지를 예를 들어 `'/'`에서 `'/posts'`로 이동한 뒤 새로고침을 하고, 활성화된 뒤로가기 버튼을 클릭하면 이때 `DOMContentLoaded` 이벤트 발생에 따른 `router`함수는 실행되지 않습니다. 

뒤로가기 버튼을 클릭한다고 해서 **DOMContentLoaded** 이벤트가 발생한 것이 아니기 때문입니다. 따라서, 또 다른 이벤트 핸들러를 이번에는 `window`전역 객체에 등록해주어야 하는데 이때의 이벤트가 (뒤로가기 이벤트) 바로 **popstate입니다.**

```javascript
// 이 코드를 index.js 파일에 작성해주세요.
window.addEventListener('popstate', router);
```
:::

## SPA 예제 - DOM 부착
앵커태그 이동에 따라 페이지 리로딩 되는 것을 제한해두었으므로 CSR의 기틀이 마련되었습니다. 이후에는 함수 컴포넌트를 정의 후 동적으로 부착해주면 됩니다.

다음은 index.js파일 코드입니다. 나머지 코드는 위에서 작성한 코드와 모두 동일한 상태입니다.

```javascript
// index.js
// 함수형 컴포넌트 import
import Home from '../components/Home.js';
import Post from '../components/Post.js';
import Users from '../components/Users.js';

const router = async () => {
    const root = document.querySelector('#root');
    const routes = [
      // route에서 프로퍼티로 함수형 컴포넌트 등록
        { path: '/', component: Home },
        {
            path: '/posts',
            component: Post,
        },
        {
            path: '/users',
            component: Users,
        },
    ];

    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            isMatch: location.pathname === route.path,
        };
    });

    let match = potentialMatches.find(
        (potentialMatch) => potentialMatch.isMatch
    );

    // 404 접속 시 처리 로직
    if (!match) {
        match = {
            route: routes[0],
            isMatch: true,
        };
    }
  
  // 함수형 컴포넌트를 비동기적으로 부착
    const component = await match.route.component();
    if (root.firstElementChild) {
        root.replaceChild(component, root.firstElementChild);
    } else {
        root.appendChild(component);
    }
};
```

static 폴더 밑에 `components`폴더를 하나 생성합니다. 이후 페이지 요청에 따라 동적으로 바뀔 UI 컴포넌트를 정의하게 됩니다. 예제의 경우 `Home`, `Post`, `Users`컴포넌트 세개를 정의하였습니다. 
1. Home - jsonplaceholder의 `todos` API에 요청하여 `title`과 완료 여부 체크박스를 UI에 부착하였습니다.
2. Post - jsonplaceholder의 `posts` API에 요청하여 `title` 내용을 부착하였습니다.
3. Users - jsonplaceholder의 `users` API에 요청하여 `username`내용을 부착하였습니다.

```javascript
// Home.js
const Home = async () => {
    const div = document.createElement('div');
    const posts = await await (
        await fetch('https://jsonplaceholder.typicode.com/todos')
    ).json();

    posts.map((item) => {
        const p = document.createElement('p');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = item.completed;
        p.innerText = `${item.title}`;
        p.appendChild(input);
        div.appendChild(p);
    });

    return div;
};

export default Home;
```

```javascript
// Post.js
const Post = async () => {
    const div = document.createElement('div');
    const posts = await await (
        await fetch('https://jsonplaceholder.typicode.com/posts')
    ).json();

    posts.map((item) => {
        const p = document.createElement('p');
        p.innerText = `${item.title}`;
        div.appendChild(p);
    });

    return div;
};

export default Post;
```

```javascript
const Users = async () => {
    const div = document.createElement('div');
    const users = await (
        await fetch('https://jsonplaceholder.typicode.com/users')
    ).json();

    users.map((item) => {
        const user = document.createElement('p');
        user.innerText = `${item.username}`;
        div.appendChild(user);
    });

    return div;
};

export default Users;
```

각 컴포넌트에서도 비동기적으로 데이터를 요청하여 데이터를 동적으로 그려주기 때문에 CSR이 구현될 수 있었습니다.

## 정리

지금까지 SPA를 리액트나 뷰 같은 프론트엔드 라이브러리,프레임워크 없이 구현해보았습니다. 라우팅 로직도 직접 처리하며 어떠한 원리 아래에서 동작하는 것인지 직접 코드도 작성해보았습니다. 

작업했던 내용을 정리해보면 다음과 같습니다.

1. 익스프레스 서버 구축 시 res 파라미터에 한 파일만 보내주도록 URL을 고정해두는 것
2. HTML5의 history API 의 pushstate, popstate 이벤트핸들링
3. 등록한 라우터와 URL `pathname`속성 비교를 통해 라우터 접근 로직 처리와 컴포넌트 비동기 호출




## Reference

1. [Poimeweb - SPA & Routing](https://poiemaweb.com/js-spa)
2. [Medium - Single page application vs multi-page application](https://medium.com/@NeotericEU/single-page-application-vs-multiple-page-application-2591588efe58)
3. [SPA 그리고 SSR과 CSR](https://velog.io/@ru_bryunak/SPA-%EC%82%AC%EC%9A%A9%EC%97%90%EC%84%9C%EC%9D%98-SSR%EA%B3%BC-CSR)
4. [NAVER D2 어서 와, SSR은 처음이지?](https://d2.naver.com/helloworld/7804182)
5. [Build a Single Page Application with JavaScript (No Frameworks)](https://youtu.be/6BozpmSjk-Y)