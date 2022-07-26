---
title: React Query
---

## React query 초기 설치

리액트 쿼리를 왜 써야할까요? [노경환님의 기억보다 기록을 - react query](https://kyounghwan01.github.io/blog/React/react-query/basic/) 글을 보면 서버에 요청한 데이터를 `state`로써 관리를 하게 되는데 서버 패치 이후 업데이트 된 데이터가 클라이언트에 뿌려지지 않고 예전 데이터가 뿌려지는 문제가 발생하게 된다고 합니다. 이러한 문제 해결을 위해 서버-클라이언트간 분리가 이루어진다고 합니다.

설치를 진행해봅시다.

```sh
npm install react-query
```

리액트 쿼리 처리를 위해서는 프로바이더 구조를 따르면 됩니다. 이전에 `styled-components`로 테마를 적용해봤었죠. 프로바이더 안에 있는 모든 요소들은 프로바이더가 제공하는 특정 프롭스를 사용할 수 있는 구조입니다.

쿼리클라이언트 프로바이더에는 `client`프로퍼티가 반드시 있어야합니다.

```javascript
// index.tsx
import { QueryClient, QueryClientProvider } from "react-query"; // 추가

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}> // 추가
            <App />
        </QueryClientProvider>
    </React.StrictMode>
);
```

프로바이더 생성 후 컴포넌트에서 리액트 쿼리 훅을 사용하기 전 **fetcher함수를 정의해야 합니다.** 기존 컴포넌트에서 데이터를 비동기 요청하기 위해 사용했던 `useEffect` 속 비동기 코드들을 모두 컴포넌트로부터 분리해야합니다.

API 관리를 위한 타입스크립트 파일 `api.ts`를 먼저 생성합니다. 이곳에는 프라미스 객체에 대한 응답의 `json` 데이터를 리턴하는 함수를 생성하여 익스포트 합니다.

```javascript
// api.ts
export function fetchData() {
    return fetch('https:// ... ').then((response) => response.json());
}
```

이후 위의 데이터 요청 함수를 사용할 컴포넌트로 이동하여 `useQuery` 훅을 사용합니다. `useQuery`는 객체를 리턴하며 비동기 요청 처리 여부(로딩중인지)와 fetcher로부터 리턴받은 json 데이터를 프로퍼티로 갖습니다.

또한 `useQuery`의 파라미터로는 `queryKey`, 다른 곳에서 정의해둔 fetcher함수를 전달합니다. 쿼리 키는 쿼리에 대해 유일한 구분값을 사용합니다. (컴포넌트 로직에 따라 판단)

```javascript
function Component() {
    const { isLoading, data } = useQuery('queryKey값', fetcherFunction);
}
```

`useQuery`는 제네릭을 지원합니다. `useQuery<Type>('key', fetcher)`형태로 사용합니다.

:::tip
fetch데이터 전체를 표시하는 화면으로부터 특정 데이터를 선택하여 URL이동이 이루어졌을때 리액트 라우터를 통해 SPA임에도 뒤로가기 버튼이 활성화 되게 됩니다. 뒤로가기 버튼을 클릭하면 컴포넌트 렌더링이 다시 이루어지고 `useEffect` 재 실행에 따른 fetch가 불필요하게 이루어집니다.

`useQuery`를 사용하게 되면 `fetch`해온 데이터가 캐싱되어 성능적인 개선이 이루어지게 됩니다.
:::

리액트 쿼리를 활용한 개발 진행 시 캐시에 대한 통제가 필요합니다. 자동 캐싱이 분명 좋은 기능이지만 **특정 시점에 캐시를 비워줘야할 경우도 존재합니다.** 현재 캐시에 저장된 쿼리를 확인하기 위해 `react-query/devtools`에 위치한 `ReactQueryDevtools` 컴포넌트를 App.tsx에 부착합니다.

이때 프로퍼티에는 `initialIsOpen={true}` 로 불리언값 옵션을 줄 수 있습니다.

```javascript
function App() {
    return (
        <>
            <Router></Router>
            <ReactQueryDevtools initialIsOpen={true} />
        </>
    );
}
```

컴포넌트 속 `fetch` 로직들을 `useQuery`로 수정하려고 하는데 다음과 같은 상황입니다.

1. 컴포넌트 로직에 따른 쿼리 키가 동일합니다.
2. fetch를 두번 하는 동안 `useQuery` 구조 분해 프로퍼티가 const로 인해 겹칩니다.
3. fetcher 함수에 인자를 전달해야합니다.

먼저 첫 번째 상황은 쿼리 키가 배열 형태로 저장되므로 `useQuery(["myId", 유일값], fetcher)` 형태로 배열 원소를 하나 겹치지 않게 추가하면 됩니다.

두 번째 상황은 `isLoading`, `data` 프로퍼티에 데이터 이름을 명시해줍니다.

```javascript
const { isLoading: myLoading, data: myData } = useQuery(key, fetcherFunction);
```

세 번째 상황은 함수를 **호출하면서 인자를 전달하는 것이 아니라, 인자를 받는 함수 자체를 리턴합니다.**

```javascript
const { isLoading, data } = useQuery(key, () => fetcher(myArgument));
```

:::tip 3번째 인자
`useQuery`훅은 세 번째 인자를 전달할 수 있다. 바로 `refetch` 주기를 밀리초 단위로 설정하는 것이다. 객체를 전달하면 되고 `refetchInterval` 프로퍼티에 대한 값을 지정한다.

```javascript
const { isLoading, data } = useQuery('queryKey', fetcher, {
    refetchInterval: 5000,
});
```

:::

:::warning 리액트 네이티브 useQuery
현재 리액트 쿼리 버전 `4.0.0`으로 업데이트 되면서 `useQuery`훅의 키값을 문자열로 지정하면 API를 불러오지 못하는 이슈가 있습니다. 배열 데이터 안에 키를 설정하여 활용합시다.

```sh
[Unhandled promise rejection: TypeError: undefined is not an object (evaluating '_this.state.children[_this.state.index]')]
```

:::

## React Query로 리액트 네이티브 앱 새로고침 구현하기

[다음의 문서](https://react-query-v3.tanstack.com/reference/useQuery)를 보면 `useQuery` 훅의 세 번째 파라미터 대한 데이터들을 확인할 수 있습니다.

새로고침의 주요 로직은 데이터들을 `refetch` 해온다는 것입니다. 따라서 `useQuery` 훅의 반환 객체 프로퍼티에 `refetch`를 설정하면 해당 API로의 `refetch`함수를 받을 수 있습니다.

또한 현재 `refetch`중인지 여부를 불리언 값으로 받을 수 있는 `isRefetching` 프로퍼티도 존재합니다.

```javascript
const { isLoading, data, refetch, isRefetching } = useQuery(['key'], getData);
```

:::tip queryKey 활용하기
`useQuery` 훅의 쿼리 키는 배열 또는 문자열 데이터를 사용할 수 있습니다. 이때 쿼리키를 배열 데이터로 선언하게 되면 내부 데이터에 대한 형식은 상관이 없습니다.

쿼리키는 특정 동작을 갖는 것이 아니라 단순히 캐싱 데이터 접근을 위한 열쇠 역할만 하기 때문입니다.

```javascript
 // An individual todo
 useQuery(['todo', 5], ...)
 // queryKey === ['todo', 5]

 // An individual todo in a "preview" format
 useQuery(['todo', 5, { preview: true }], ...)
 // queryKey === ['todo', 5, { preview: true }]

 // A list of todos that are "done"
 useQuery(['todos', { type: 'done' }], ...)
 // queryKey === ['todos', { type: 'done' }]

```

위와 같이 배열 내에 객체를 선언하더라도 이는 쿼리한 데이터 접근을 위한 열쇠 생김새롤 표현하는 것입니다.
:::

쿼리키는 카테고리화 할 수가 있습니다. 배열 데이터 선언 후 위의 코드에서처럼 첫 번째 인덱스에 동일한 원소 데이터를 삽입해두는 것입니다.

부분적으로 쿼리 키와 일치하는 모든 API fetcher 함수로 요청을 보낼 수 있는 함수가 바로 `queryClient.refetchQueries(["키값"])` 입니다.

앱의 첫 시작에서 `QueryClientProvider`의 프롭스로 `provider`를 전달하였습니다. 이때 전달된 `queryClient` 객체를 하위 컴포넌트에서 불러와 활용할 수 있게 되는겁니다.

`queryClient` 객체의 함수로 `refetchQueries`가 있고, 이 함수의 파라미터로 전달된 키값을 부분적으로 갖는 모든 API에 요청을 보내는 것입니다.

## 쿼리 파라미터 전달하기

API에는 쿼리 파타미터를 함께 전달해야 하는 경우가 많습니다. 단순히 API 키값과 같은 쿼리 파라미터에 대해서만 전달하면 되는 것이 아니라 사용자로부터 입력받은 데이터를 정제하여 쿼리 파라미터로 전달해야되는 경우도 많습니다.

검색기능에 대해 사용자로부터 입력받은 데이터를 검색하고자 한다면 입력 값을 쿼리 파라미터로 담아 보내야 하는 것입니다.

`useQuery` 훅을 호출하는 컴포넌트에 접속할 경우 캐싱된 데이터를 불러오는 등 자동으로 해당 훅에 대해 기능을 사용하게 되는데 검색기능의 경우 `submit` 이벤트가 감지 된 이후에야 쿼리를 실행해야 합니다.

이를 위해 `useQuery` 훅은 세 번째 파라미터로 각종 옵션들을 담을 수 있는 객체를 전달받습니다.

```javascript
const {
    isdLoading: moviesLoading,
    data: moviesData,
    refetch: searchMovies,
} = useQuery(['searchMovies', query], moviesAPI.search, {
    enabled: false,
});
```

`enabled` 프로퍼티 값을 `false`로 설정하면 초기 컴포넌트 렌더링 시 쿼리를 사용하지 않게 됩니다.

리액트 네이티브 상에서 쿼리 파라미터 전달 작업을 한다고 가정하면 `TextInput` 컴포넌트에 `onChangeText` 프롭스에 대한 함수와 `onSubmitEditing` 프롭스에 대한 함수를 각각 등록하여 데이터 입력 및 정제 작업을 진행해야 합니다.

이때의 입력값을 리액트 상태값으로 관리하여 해당 텍스트를 쿼리 파라미터로 보내게 되는 것입니다.

이때 쿼리 파라미터는 **`useQuery` 훅의 queryKey에 해당하는 배열 데이터 두 번째 원소가 됩니다.**

쿼리를 위한 `fetcher` 함수는 쿼리키를 파라미터로 받습니다.

```javascript
export const API = {
    search: ({ queryKey }) => {
        const [_, query] = queryKey;
        return fetch(`${BASE_URL}/query=${query}`).then((response) =>
            response.json()
        );
    },
};
```

`useQuery`훅에서 설정한 쿼리키값을 fetcher 함수의 파라미터에서 받은 후 배열 구조분해를 통해 쿼리 파라미터 값을 빼옵니다.

`[_,query] = queryKey` 코드는 위의 예시 코드를 기준으로 쿼리키에 전달 된 `searchMovies`, `query`값에서 `query`값을 변수 `query`에 저장하게 되는 것입니다.

이후 정의한 API에서 `fetcher`함수에 템플릿 리터럴 문법으로 쿼리 파라미터를 전달합니다.

## Reference

1. [노경환님의 기억보다 기록을](https://kyounghwan01.github.io/blog/React/react-query/basic/)
2. [React Query 키 관리](https://www.zigae.com/react-query-key/)
