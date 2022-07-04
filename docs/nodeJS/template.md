---
title: 템플릿 제작
---

# HTML 리턴

라우팅의 결과물로 html문서를 보내기 위해서는 컨트롤러의 `res.send("<h1>Hello!</h1>");`메서드를 통해 HTML 요소를 직접 리턴해주는 방법을 사용한다.

규모가 큰 HTML 문서 자체를 보내기 위해서 `res.send()` 메서드 내에 모든 내용을 작성하기는 너무 비효율적이기에, **pug**라는 템플릿 엔진을 활용한다.

## Setting pug

1. `npm i pug`
2. 익스프레스로 생성한 앱에 템플릿 엔진을 퍼그로 사용하겠다고 알려준다.

```js
const app = express();
app.set('view engine', 'pug'); // here!
```

퍼그가 실행되면 기본적으로 뷰를 `/views`라는 폴더에서 찾는다.

```js
process.cwd() + '/views';
```

`process.cwd()` 는 **current working directory**의 약자이다.

## Using pug

디렉토리 위치를 고려하여 `name.pug` 파일을 생성한다. [pug syntax](https://pugjs.org/api/getting-started.html)

```pug
doctype html
html(lang = "ko")
    head
        title wetube
    body
        h1 Welcome to Wetube
        footer &copy; 2021 Wetube
```

:::details pug 규칙 몇가지

1. 자식 요소는 부모 요소로부터 다음 라인에 작성하고, 탭으로 간격을 둔다.
2. 닫는 태그는 작성하지 않는다.
3. 태그에 적용되는 어트리뷰트는 괄호 사이에 작성한다.
   :::

퍼그 작성 후 `res.render("home")` 메서드에 퍼그로 생성한 템플릿 엔진을 전달한다. **렌더 메서드를 활용해야한다.**
**템플릿 엔진은 따로 설정해주지 않으면 위에서도 언급했듯 익스프레스가 /view 디렉토리에서 뷰를 찾는다.**

현재 디렉토리 구조가 다음과 같으면서 뷰 디렉토리에 대한 설정을 따로 해주지 않은 상태라면,

```text
root
    |--src
        |-- controllers..
        |-- routers..
        |-- views
...
```

`console.log(process.cwd());` - `/Users/parkgyeongjun/Desktop/youtubeClone`

src폴더 하위의 views를 찾아보는 것이 아닌 상태이다. 따라서 해당 위치에 뷰 엔진이 있지 않으면 `Error: No default engine was specified and no extension was provided` 에러가 발생하게 된다.

:::tip
`process.cwd()`는 서버를 기동하는 파일의 위치에 따라서 달라진다. 서버를 가동하는 파일이란, `package.json`파일이다.
:::

퍼그 사용법을 정리해보면 다음과 같다.

1. 퍼그를 설치한다.
2. 익스프레스로 앱을 생성한다.
3. 생성한 앱에 `.set()` 메서드로 퍼그의 옵션들을 전달한다.
    - 익스프레스가 서치할 뷰의 디렉토리
    - 템플릿 엔진이 퍼그라는 것을 알리기
4. 퍼그 파일 생성 및 코드작성
5. 컨트롤러에서 퍼그를 `.render()`메서드로 불러온다.

## functioning of pug

pug는 크게 세 가지 장점을 내세울 수 있다.

1. 작성이 쉽다.
2. 자바스크립트 코드를 그대로 사용할 수 있다.
3. **Partial**이라는 기능을 통해 코드의 반복을 줄일 수 있다.

다음과 같은 디렉토리 구조를 가정해본다.

```text
views
    |--home.pug
    |--partials
        |-- footer.pug
```

```js
//home.pug
doctype html
html(lang = "ko")
    head
        title wetube
    body
        h1 Welcome to Wetube
        include partials/footer.pug // 주목
```

```js
//footer.pug
footer &copy; #{new Date().getFullYear()} Wetube
```

퍼그는 `include` 문법을 통해 특정 퍼그 파일을 가져올 수 있다.

:::details pug코드 반복 줄이기
edit, video 등등 여러 페이지에서 footer를 공통적으로 사용하는데 각 페이지마다 특정 명칭을 변경시켜줘야 하는 상황을 가정해보자.
각 페이지에 맞는 퍼그 파일을 생성하고 전체 코드를 복사해야하는 지에 대해서는 고민해보아야 할 문제이다!

따라서 퍼그의 상속을 이용한다.
:::

## inheritance of pug

```text
views
    |--base.pug
    |--watch.pug
    |--partials
            |--footer.pug
```

상속 이전에는 뷰 디렉토리 구조가 위와 같을 때 watch 이외에 다른 페이지가 추가됨에 따라 각각 footer퍼그를 인클루드 해줘야 한다. 상속을 위해 `base.pug`를 생성한 후에는 `extends base.pug`라는 코드만 다른 페이지에 추가해주면 된다. **장고의 상속 문법과 동일하다!**

```pug
// base.pug
doctype html
html(lang = "ko")
    head
        title wetube
    body
        block content
        include partials/footer.pug
```

```pug
extends base.pug

block content
    h1 Hello!
```

장고의 `block content` 템플릿 문법과 동일하게 작동한다.

:::tip
`block content`의 content는 블록의 명칭일 뿐이므로 자유롭게 정의해도 문제없다.
:::

## 템플릿 변수

활용 시나리오로 `base.pug`를 상속받는 여러 퍼그들을 새로 정의하고 퍼그마다 서로 다른 네이밍을 전달한다고 가정하자.

```pug
//base.pug
doctype html
html(lang = "ko")
    head
        title Hello! #{CustomVar}
    body
        block content
        include partials/footer.pug
```

위처럼 html `title`요소에 `#{}` 문법을 적용하면 머스태시 괄호 내에 전달하는 변수를 상속받는 퍼그가 렌더링할 **컨트롤러에 전달하게 된다**

따라서 템플릿 변수의 사용은 해당 컨트롤러의 인자를 통해 처리해야한다. `render메서드의 두 번째 인자로 전달. 객체형태로!`

```js
doctype html
html(lang = "ko")
    head
        title #{PageTitle} | Wetube
    body
        block content
        include partials/footer.pug
```

```js
export const trending = (req, res) => res.render('home', { PageTitle: 'Home' });
// ...
```

변수 전달 방식의 두 번째 방법으로 다음과 같은 방법이 있다.

```pug
body
    header
        h1=pageTitle
```

`h1`태그에 pageTitle이라는 변수 값만 넣을 때에는 `=`를 이용할 수 있고 다른 문자열과 섞어 쓸 때 `#{..}` 형태를 사용한다.

## pug 제어문

퍼그의 조건문은 다음과 같다.

```pug
if user.loggedIn
    small Hello #{user.username}
else
    a(href="/login") login
```

퍼그의 반복문은 다음과 같다.

```pug
each value in values
    li=value

each value in values
    li #{value}
```

위 예시의 `values`는 컨트롤러로부터 전달받는 변수명과 동일해야한다. 퍼그의 반복문 형태는 다양하므로 도큐먼트를 참고해보아야 한다.

## 퍼그 mixin

믹싱은 `partial`인데, **데이터를 받는 partial**이다. partial의 예시로 footer 컴포넌트 재사용이 있었는데 믹싱도 동일한 아이디어에서 출발한다.

반복문에 단순 데이터의 전달 뿐만 아니라 복잡한 객체에 대해서도 전달이 이루어지고 전체 변수에 대한 입출력이 이루어지므로 코드의 반복이 불가피하다. 이러한 문제점을 해결하기 위해 데이터를 받는 컴포넌트를 partial 처리 한 것이 믹싱이다.

믹싱의 예시는 다음과 같다.

```pug
extends base.pug
include mixins/video

block content
    h2 Welcome here you will see the trending videos.
    each video in videos
        +video(video)
```

```pug
mixin video(video)
    div
        h4=video.title
        ul
            li #{video.rating}/5
            li #{video.comments} comments,
            li Posted #{video.createdAt},
            li #{video.views} views.
```

1. views 디렉토리 하위에 믹싱 폴더 생성 및 믹싱 코드 작성
2. 믹싱 가져올 파일에 include

## URL

퍼그 상에서 URL 지정시 상대경로 및 절대경로 중에 하나를 고를 수 있다.

```pug
// 절대경로 이용시 url 앞에 슬래시를 붙인다.
a(href=`/${video.id}/edit`) Edit video &rarr;

// 상대경로 이용시 슬래시를 붙이지 않으면 현재 속한 라우터의 url기준 상대경로로 지정한다.
a(href=`${video.id}/edit`) Edit video &rarr;
```
