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





## Reference

1. [nomad coders - React로 영화 웹 서비스 만들기](https://nomadcoders.co/react-for-beginners/lobby)
2. [YTS movie API docs](https://yts.torrentbay.to/api)
3. [React Router v6 튜토리얼](https://velog.io/@velopert/react-router-v6-tutorial)