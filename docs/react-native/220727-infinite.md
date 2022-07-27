---
title: React Native Infinite Scroll
---

## FlatList

리액트 네이티브에서 무한스크롤은 플랫리스트 컴포넌트와 `react-query`의 조합으로 이루어집니다.

플랫리스트의 프롭스 중 하나로 `onEndReached`가 있습니다. 이 프롭스와 함께 사용하는 프롭스로 `onEndReachedThreshold`가 있습니다.

`onEndReached`는 스크롤이 끝에 위치했다는 이벤트를 트리거 조건으로 받아 함수를 실행해주고, `onEndReachedThreshold`는 **스크롤 끝의 위치를 조정해줍니다.**

무한스크롤을 사용할때 반드시 스크롤이 끝에 위치해야 나머지 데이터들을 로드할 필요는 없습니다. 적정 시점에서 선제적으로 데이터를 로드하면 나머지 데이터들에 대한 로딩 시간을 직접 겪을 필요 없이 무한한 스크롤을 활용할 수 있게 되는 것입니다.

## react query

리액트 쿼리에서 데이터 fetch를 위해 필요한 훅으로 `useQuery`가 있었습니다. 무한스크롤 구현을 위해서 필요한 훅은 `useInfiniteQuery`가 따로 있으며 이를 활용해야 합니다.

일반 `useQuery`를 통한 데이터 fetch와는 다르게 `useInfiniteQuery`훅은 JSON 반환 객체가 `pageParams`와 `pages`로 나뉘어집니다.

`useInfiniteQuery` 훅의 결과물로 반환된 데이터를 출력하면 페이지 프로퍼티를 갖는다는 것을 확인할 수 있습니다.

```javascript
const { isLoading, data } = useInfiniteQuery(['key'], fetcher);
```

훅을 호출해서 데이터를 받아왔으면 이를 정제하여 `FlatList`의 `data`프롭스로 데이터를 넘겨줘야 합니다.

기본적으로 페이지네이션이 적용된 객체의 경우 `data` - `pages`로 이루어져 있고 수 많은 데이터들을 페이지 별로 분리한 객체가 배열 내에 들어가 있게 됩니다.

```javascript
<FlatList
    onEndReached={loadMore}
    onEndReachedThreshold={0.5}
    data={data?.pages.map((page) => page.results).flat()}
    // ....
/>
```

pages 밑에 얻고자 하는 데이터가 각 객체 내부의 `results` 프로퍼티며, 이에 대한 값이 배열로 이루어져 있다라고 하면 `data.pages.map((page) => page.results)`까지의 결과는 `[Array, Array, ...]`와 같은 형태를 띠게 됩니다.

배열 평탄화를 통해 각 배열 데이터들을 전달하기 위해서는 `flat` 메서드를 사용하면 됩니다.

## 페이지 호출

`useInfiniteQuery` 훅의 세 번째 파라미터에는 객체를 받습니다. 객체 프로퍼티로 `getNextPageParam`을 정의하며 여기에는 함수를 전달하게 됩니다. 이 함수는 API에서 정의한 JSON객체 형태에 따라 현재 페이지를 조회하고 다음 페이지로 접근하기 위해 페이지 넘버를 하나 증가시켜주는 로직을 구현하게 됩니다.

```javascript
const { isLoading, data } = useInfiniteQuery(['key'], getData, {
    getNextPageParam: (currentPage) => {
        const nextPage = currentPage.page + 1;
        return nextPage > currentPage.total_pages ? null : nextPage;
    },
});
```

:::warning 주의할 점
위의 예시 코드에서 `page` 프로퍼티에 접근하고, `total_pages` 프로퍼티에 접근하는 등의 코드는 모두 **이미 다른 곳에서 정해놓은 API 문서를 가져다가 사용한 것 뿐입니다.** 모든 무한스크롤 로직 구현에 위와 같은 페이지 프로퍼티 접근 방식이 이루어지는 것이 아닙니다.

백엔드에서 작성한 페이지 파라미터 관련 API문서를 가지고 활용해야 하는 것입니다.
:::

쿼리가 다 작성되었으면 fetcher함수로 이동하여 페이지 파라미터를 URL에 포함시킵니다.

이때 `useInfiniteQuery`로 페이지 파라미터를 갖도록 로직을 구현하였으면 fetcher함수에 자동으로 `pageParam`이라는 fetcher함수 파라미터가 등록됩니다. 이를 URL에 포함시키면 됩니다.

```javascript
const api = {
    getUpcoming: ({ pageParam }) =>
        fetch(`${BASE_URL}?&page=${pageParam}&region=KR`).then((response) =>
            response.json()
        ),
};
```

fetcher함수까지 정의가 모두 되었으면 `useInfiniteQuery` 훅에서 제공하는 `hasNextPage`, `fetchNextPage`를 활용합니다.

`hasNextPage`는 다음 페이지가 있는지 여부를 불리언값으로 반환받고 `fetchNextPage`는 다음 페이지에 대해 `fetch`를 진행합니다.

```javascript
function Component() {
    const {
        isLoading: upcomingLoading,
        data: upcomingData,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery(['key'], getData, {
        getNextPageParam: (currentPage) => {
            const nextPage = currentPage.page + 1;
            return nextPage > currentPage.total_pages ? null : nextPage;
        },
    });
    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    return <FlatList onReachEnd={loadMore} />;
}
```

:::tip isFetchingNextPage
무한스크롤 로딩 바를 보여주기 위해서는 useInfiniteQuery 훅의 결과물인 `isFetchingNextPage`불리언값과 로딩 인디케이터 컴포넌트를 조합하여 화면을 그리면 됩니다.
:::
