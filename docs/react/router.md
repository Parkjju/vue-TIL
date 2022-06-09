---
title: React Router

---
## Movie API

[다음 링크에는](https://yts.torrentbay.to/api) 각종 영화들에 대한 정보에 접근할 수 있게 API DOCS가 작성되어 있습니다.

`https://yts.torrentbay.to/api/v2/list_movies.json`에 GET요청을 보내면 되는데, 파라미터로 `minimum_rating`을 전달하면 최저 평점 이상의 영화 정보들만 모아서 가져올 수 있습니다. 기본적인 네트워크 요청 방식에 대해 알고싶으시면 [AJAX TODO 문서의 Axios 투두리스트 만들기](https://parkjju.github.io/vue-TIL/js/axios.html#xmlhttprequest) 문서를 참조해주세요.

데이터 요청 후 받아온 영화 정보들을 렌더링해줍니다.

```javascript
import { useState, useEffect } from 'react';
import Movie from './Movie';

function App() {
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const getMovies = async () => {
        const response = await (
            await fetch(
                'https://yts.mx/api/v2/list_movies.json?minimum_rating=9&sort_by=year'
            )
        ).json();
        setMovies(response.data.movies);
        setLoading(false);
    };

    useEffect(() => {
        getMovies();
    }, []);

    return (
        <div>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <div>
                    {movies.map((movie) => (
                        <div key={movie.id}>
                            <img src={movie.medium_cover_image} alt='' />
                            <h2>{movie.title}</h2>
                            <p>{movie.summary}</p>
                            <ul>
                                {movie.genres.map((g) => {
                                    return <li key={g}>{g}</li>;
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default App;
```

리액트 라우팅 기능 이용에 앞서 기본적인 애셋을 제작하였습니다.

## Routing

본격적으로 리액트 라우팅을 알아보게 될텐데, 우선 필요성에 대해 알아야 할 것 같습니다.

당장 위의 영화 정보 서비스만 하더라도 각 영화에 대한 디테일한 정보가 담겨져있을텐데 이를 한 페이지에서 모두 표기하기에는 너무나 많은 리소스를 요청하게 됩니다. 따라서 메인 페이지에서는 **최소한의 것들, 즉 영화 데이터만 제공을 한 상황에서** 특정 영화를 클릭했을때 해당 영화 정보를 디테일하게 보여주는 로직의 구현이 필요합니다.

이때 바로 리액트의 라우팅 기법이 사용되는 것입니다. 스크린 단위로 라우터를 설계한 후 진행합니다.

먼저 리액트 프로젝트가 CRA 기반이라는 것을 가정하고, `react-router-dom`을 설치해줍니다. (현 문서 작성 시점에서 버전은 6.3.0입니다.)

```sh
npm install react-router-dom
```

리액트 프로젝트를 CRA로 생성했으면 주로 작업하게될 `src` 폴더가 있을겁니다. 해당 폴더 아래에 `routes` 폴더를 생성하고 `App.js`에서 작업했던 홈스크린 렌더링 코드들을 모두 이동시켜줍니다. (앞으로 화면을 그리는 작업들은 App.js에서 하지 않게 됩니다.)

리액트 라우터 6.X버전의 경우 `Switch`가 `Routes`로 변경되었습니다. 또한, 컴포넌트를 표기해주는 라우터 프로퍼티 이름이 `component`에서 `element`로 바뀌었습니다. 기존의 홈 스크린 라우팅 코드와 6.X 버전 코드를 비교하면 다음과 같습니다.

```javascript
import { BrowserRouter as Router, Switch , Route } from 'react-router-dom';
import Home from './routes/Home';

function App() {
    return (
        <Router>
            <Switch>
                <Route path='/' component={<Home />} />
            </Switch>
        </Router>
    );
}
```

```javascript
// 6.X 버전
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
            </Routes>
        </Router>
    );
}
```

사용된 라우팅 컴포넌트 몇 가지 역할에 대해 정리하면 다음과 같습니다.

1. `BrowseRouter` - 라우트 `path`에 따라 UI를 동기화 시켜주는 컴포넌트입니다. (라이브러리 자체적으로 HTML5 API를 활용합니다.) 쉽게 말해, 입력되는 URL에 따라 UI 렌더링 로직을 처리해주는 최상위 컴포넌트라고 보시면 됩니다.
2. `Routes` - `BrowseRouter` 내에서는 여러 `Route` 컴포넌트들을 동시에 렌더링할 수 있지만, `Routes`에 감싸진 라우트 컴포넌트들은 URL에 따라 하나씩만 렌더링되게 됩니다.
3. `Route` - `path`와 일치하는 URL에서 전달된 컴포넌트 UI를 렌더링합니다.

`Routes`로 감싸지지 않은 `Route`에서 URL파라미터 활용을 위해 `path`를 `path="/:users"` 라고 정의한다면, 실제 URL 구성에서 `https://...../:users`라는 URL이 없다면 404페이지를 띄우게 되는 겁니다.

여기까지 보면 리액트 라우터를 굳이 사용해나 싶기는 합니다. 컴포넌트를 `path`에 등록된 URL에 따라 렌더링 한다는 것이죠. HTML에서 `anchor`의 `href` 속성을 통해 라우트 설정된 컴포넌트 링크로 이동하면 되는 것 아닌가요?

**이때 SPA의 위력이 발휘됩니다.** HTML `anchor`태그를 통해 설정된 라우터에 접근이 분명 가능합니다. 하지만 **페이지 전체가 리로딩된다는 단점이 있는 것이죠.** 이에 따라 SPA기반의 라우트 컴포넌트 설정이 사실상 의미가 없게 되는 것입니다.

리액트 라우터는 **페이지 전체가 리로딩되는 것처럼 보이게 하지만, 사실은 한 페이지 내에서 컴포넌트의 교체만 동적으로 이루어지게 되는 것입니다.** 이때 사용되는 컴포넌트가 바로 `react-router-dom`의 `<Link></Link>` 컴포넌트입니다. `Link` 컴포넌트의 `to` 프로퍼티를 사용하면 이동하고 싶은 링크를 설정할 수 있습니다.

```javascript
import { Link } from 'react-router-dom';

function Movie({ title }) {
    return (
        <div>
            <h2>
                <Link to='/movie'>{title}</Link> 
            </h2>
        </div>
    );
}
```

:::tip Link에 styled-components로 스타일링하기
Link태그에 styled-components를 적용하여 스타일링할 수 있습니다. CSS 프로퍼티인 `text-decoration:none`과 같은 스타일들을 `<Link style={{text-decoration:none}}`처럼 인라인 형태로 처리해도 되지만, 좀 더 많은 스타일링을 하고자 한다면 styled-components의 상속을 활용합니다.

```javascript
import styled from "styled-components";

const MyLink = styled(Link)`
  text-decoration:none;
  &:hover{
    background-color:black;
  }
`

function Component(){
  return(
    <MyLink to="/"/>
  )
}
```

`Link`컴포넌트를 다른 컴포넌트에서 상속 받아 스타일링을 진행했으면 `Link` 컴포넌트에서 필수적으로 요구하는 프로퍼티들에 대해 값을 각각 설정해야합니다. 예를 들어 `Link`는 `to`라는 프로퍼티 값을 반드시 설정해줘야 하므로 `MyLink`로 커스텀 컴포넌트 스타일링을 진행했더라도 위 코드처럼`to` 값을 부여해야 합니다.
:::

## URL parameter
URL의 구성 요소에는 정적인 파라미터만 있는 것이 아닙니다. 라우트 컴포넌트를 통해 URL 구성이 모듈화되어 있다고 해도, 그 동일한 모듈이 재사용되는 서비스의 경우 고유한 값에 따라 페이지 URL을 다르게 구성해야 하는 것이죠. 

쉽게 말해 우리가 컴포넌트 생성 시 `map()` 메서드로 여러 HTML 엘리먼트들을 생성하였고, 그 엘리먼트를 클릭했을때 이동하는 `Link` 컴포넌트를 생성하는 상황에서 몇 개가 될지 모르는 HTML 엘리먼트에 대해 각각 이름을 다르게 붙여줄 수 있을까요? 

이럴 때에 URL 동적 파라미터를 사용하게 되는 것입니다. `Link` 컴포넌트의 `path`에 상위 컴포넌트로부터 넘어온 고유값 프롭스를 `to` 프로퍼티에 전달하면 됩니다.

```javascript
<Link to={`/movie/${id}`}>{title}</Link>
```
링크 컴포넌트 `to` 프로퍼티에 콧수염 괄호를 열어주고, 상위 컴포넌트로부터 받아온 프롭스 `id`를 전달합니다. 상위 컴포넌트는 현재 map을 통해 `Movie` 컴포넌트를 여러개 생성해주고 있죠. 

```javascript
{movies.map((movie) => (
    <Movie
        key={movie.id}
        id={movie.id}
        medium_cover_image={movie.medium_cover_image}
        genres={movie.genres}
        title={movie.title}
        summary={movie.summary}
    />
))}
```

`Link` 컴포넌트를 활용하여 여러 개의 컴포넌트들을 무사히 렌더링할 수 있었습니다. 그렇다면 이번엔 `App.js`, 즉 전체 라우트 컴포넌트들을 관리하는 최상위 컴포넌트로 이동해봅시다.

```javascript
function App() {
    return (
        <Router>
            <Routes>
                <Route path='/movie' element={<Detail />} />
                <Route path='/' element={<Home />} />
            </Routes>
        </Router>
    );
}
```
현재 `Route` 컴포넌트 중 영화 디테일 페이지를 렌더링하는 `path`는 `/movie` 라고 되어있습니다. 이곳에 동적 파라미터를 등록하고 싶다면 URL파라미터 이름 앞에 콜론만 붙여주면 됩니다.


```javascript
<Route path='/movie/:myid' element={<Detail />} />
```

이후 만약 디테일 컴포넌트 내에서 `myid`라는 URL파라미터와 또는 그 외의 파라미터 값들을 모두 알아야하는 상황이 있습니다. YTS로부터 영화 디테일 정보들을 받아온다고 했을때 URL 파라미터에 전달된 `myid`값을 가지고 이에 해당하는 영화를 찾아 디테일 정보를 요청한다고 가정해봅시다. 이러한 상황에서 사용되는 리액트 훅이 바로 `useParams` 입니다.

```javascript
import { useParams } from 'react-router-dom';

function Detail() {
    const x = useParams();
    console.log(x);
    return <h1>Detail</h1>;
}

export default Detail;
```
`Detail` 컴포넌트를 렌더링하면 `x`에 URL 파라미터 값들이 객체 형태로 전달됩니다.
```javascript
x = {myid: '31234'};
```

현재까지의 흐름을 정리하면 다음과 같습니다.
1. `react-router-dom`의 Link 컴포넌트를 통해 HTML `href` 대신 컴포넌트 렌더링 로직으로 대체한다. 정적 리소스 재요청을 막기 위함입니다. 이때 `to` 프로퍼티에는 `to={프롭스값}`과 같은 형태, 즉 동적인 값을 전달해야겠죠.
2. `Route` 컴포넌트에서 `path`에 콜론을 붙인 URL파라미터 이름을 전달합니다. `<Route path="/movie/:id" element={<Detail/}`과 같은 형태입니다.
3. 라우트 컴포넌트를 통해 새롭게 렌더링된 `Detail` 컴포넌트에서 다양한 로직 처리를 위해 URL 파라미터의 값들을 받아와야 합니다. 이때 `useParams` 훅을 사용합니다. URL파라미터 전체 값이 객체 형태로 반환됩니다.

다음은 디테일 컴포넌트에서 URL파라미터 값을 추출하여 API요청을 보내는 코드입니다.
```javascript
function Detail() {
    const { id } = useParams(); // Params 추출

    const getMovie = async () => {
        const json = await (
          // Params로 API요청
            await fetch(
                `https://yts.mx/api/v2/movie_details.json?movie_id=${id}` 
            )
        ).json();
        console.log(json);
    };
    useEffect(() => {
        getMovie();
    }, []);
    return <h1>Detail</h1>;
}
```

:::warning Typescript useParams
React Router Dom 사용시 v6 이상이면 useParams 훅 사용시 타입을 특정짓지 않아도 됩니다. `useParams`훅을 사용한 이상 타입이 `string` 또는 `undefined`로 지정됩니다.
:::

## useLocation
`react-router-dom`의 훅 중에서는 `useLocation`이 있다. 자바스크립트에서의 `location` 객체가 간소화된 형태로 제공된다고 보면 됩니다.
`useLocation`훅이 `location` 객체를 다룬다는 것 자체에도 의미가 있지만 **이전 페이지 라우터 컴포넌트로부터 프롭스를 받아올 수 있다는 점에서 유용하게 사용되고는 합니다.** 

코드를 보자.
```javascript
import { Link } from "react-router-dom";

// ....
<Link to={`/${myfile.id}`} state={myfile.name}>
    <Img
        src={`${endpoint}/myFile.txt}`}
        alt='coin'
    />
    {coin.name} &rarr;
</Link>
```
`Link` 컴포넌트를 통해 특정 API에 요청을 보냅니다. 이때 이 컴포넌트에는 `state` 프로퍼티를 전달할 수 있습니다.

**중요한건 프롭스로 `state`를 받는 컴포넌트에서 인터페이스를 정의해야한다는 것입니다.** 위의 코드에서 만약 `myFile.name`이 `string`타입이었다면 하위 컴포넌트에서의 인터페이스는 다음과 같이 정의되어야 할 것입니다.
```javascript
interface FileState{
  state: string;
}

function Child(){
  const { state } = useLocation() as FileState;
}
```

`useLocation`으로부터 구조 분해 되어 `state`에는 상위 컴포넌트의 프롭스로부터 전달받은 `myFile.name` 문자열 값이 저장되게 됩니다.

:::warning 
위 코드의 하위 컴포넌트가 `state`을 사용하기 위해서는 상위 컴포넌트의 프롭스로부터 `state` 값을 전달받아야 합니다. 
`Link`를 통해 순서가 있는 접근이 아닌 하위 컴포넌트 URL로 직접 접근하게 되면 `undefined` 값이 저장되게 됩니다. 이는 분명 논리적 오류이며 이를 예외적으로 처리해야합니다.
 
널 병합 연산자 `??`를 통해 처리하도록 해봅시다.
```javascript
function Child(){
  const { state } = useLocation() as FileState;
  
  return (
    <div>
      <span>{state ?? "UNDEFINED!!"}</span>
    </div>
  )
}
```

`state`가 객체 형태로 프롭스에 전달되었다면 옵셔널 체이닝으로 깔끔한 코딩을 할 수도 있습니다. `state` 객체의 `name` 프로퍼티가 있다고 가정해봅시다.
```javascript
function Child(){
  const { state } = useLocation() as FileState;
  
  return (
    <div>
      <span>{state?.name ?? "UNDEFINED!!"}</span>
    </div>
  )
}
```
`state`객체가 undefined가 아니면 해당 객체의 `name` 프로퍼티 값을 출력하고 이 또한 `undefined`면 후에 작성된 `UNDEFINED!!`를 부착합니다.
:::

## Nested Router
라우터가 중첩된 형태를 가지면 `Nested Router`이다. 유용하게 사용될텐데, 바로 **탭 기능 구현에 사용된다.** 

react-router-dom의 `Outelet` 컴포넌트를 사용하면 `Router.tsx`에 정의된 중첩 라우트가 자동으로 삽입된다. 컴포넌트의 구조가 Todos가 있고 완료 여부를 route path에 넘기는 형식이라고 가정하자. 

이때 Todo 컴포넌트 안에 중첩 라우트를 사용하는 상황이다.
```javascript
// Router.tsx
function Router(){
  return(
    //...
    <Routes>
      <Route path="/todos" element={<Todos/>}>
        <Route path="completed" element={<Completed/>}/>
        <Route path="incompleted" element={<Incompleted/>}/>
      </Route>
    </Routes>
  )
}
```
위와 같이 한 투두 리스트 안에 완료된 투두 / 완료되지 않은 투두를 고를 수 있도록 중첩 라우트를 구성한 상태에서 URL "/todos/completed"에 접근할 때 중첩 라우트를 분리하여 코드 작성할 필요없이 `Outlet` 컴포넌트를 사용하면 URL 검사와 함께 부모 / 자식 컴포넌트를 비교하여 자동으로 위 구조 컴포넌트를 렌더링해준다.

```javascript
// In Router.tsx

<Route path="/:todoId/*" element={<Todo/>} />

// In Coin.tsx

<Routes>
  <Route path="completed" element={<Completed />} />
  <Route path="incompleted" element={<Incompleted />} />
</Routes>
```
위 처럼 분리하는 것이 아니라,

```javascript
// In Router.tsx
<Route path="/:coinId" element={<Coin />} >
  <Route path="chart" element={<Chart />} />
  <Route path="price" element={<Price />} />
</Route>
```
위 처럼 라우터 파일에 중첩 라우트를 구성하고 위의 Coin/Chart&Price 구조의 컴포넌트를 부착할 위치에 `Outlet` 컴포넌트를 부착하면 된다는 것이다.

## Reference

1. [nomad coders - React로 영화 웹 서비스 만들기](https://nomadcoders.co/react-for-beginners/lobby)
2. [YTS movie API docs](https://yts.torrentbay.to/api)
3. [React Router v6 튜토리얼](https://velog.io/@velopert/react-router-v6-tutorial)