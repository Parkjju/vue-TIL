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
export function fetchData(){
  return fetch('https:// ... ').then((response) => response.json());
}
```

이후 위의 데이터 요청 함수를 사용할 컴포넌트로 이동하여 `useQuery` 훅을 사용합니다. `useQuery`는 객체를 리턴하며 비동기 요청 처리 여부(로딩중인지)와 fetcher로부터 리턴받은 json 데이터를 프로퍼티로 갖습니다.

또한 `useQuery`의 파라미터로는 `queryKey`, 다른 곳에서 정의해둔 fetcher함수를 전달합니다. 쿼리 키는 쿼리에 대해 유일한 구분값을 사용합니다. (컴포넌트 로직에 따라 판단)
```javascript
function Component(){
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
const {isLoading: myLoading, data: myData} = useQuery(key, fetcherFunction);
```

세 번째 상황은 함수를 **호출하면서 인자를 전달하는 것이 아니라, 인자를 받는 함수 자체를 리턴합니다.**
```javascript
const {isLoading, data} = useQuery(key, () => fetcher(myArgument));
```
## Reference
1. [노경환님의 기억보다 기록을](https://kyounghwan01.github.io/blog/React/react-query/basic/)