---
title: AJAX

---
## 시작하며

AJAX는 `Asynchronous JavaScript and XML`의 약자로, 서버사이드 렌더링과 관련된 개념이 명확하지 않으면 이해하기 어려울 수 있다.

프론트엔드 개발자로서 HTML, CSS, JavaScript, jQuery등 정적 페이지 제작에 대한 역량은 어느 정도 갖추었더라도 서버와 통신을 어떻게 해야하는지, 자기만의 GET POST 처리 방식을 명확히 정의 해두는 것은 매우 중요하다.

AJAX학습을 통해 백엔드와 소통하는 데에 어려움이 없는 프론트엔드 개발자가 되어보자.

## AJAX의 필요성

SNS에 댓글을 달 때 **전체 페이지가 리로딩 되지 않는 것을 본 적이 있을 것이다.** 댓글 뿐만 아니라 좋아요와 같은 단순 기능들에 대해서도 리로딩 되지 않는다. AJAX 덕분에 이러한 일들이 이루어질 수 있었던 것이다.

AJAX가 적용되지 않은 UX를 햄버거집 예시를 통해 알아보자. 프론트엔드 개발자가 카운터 직원이고 손님이 클라이언트, 서버가 주방이라고 가정한다.

1. 3가지 주문이 들어온다. (햄버거, 감자튀김, 햄버거 세트)
2. 첫 번째 햄버거 주문을 받는다.
3. 주방에서 햄버거를 만든다.
4. 포장 후 손님에게 준다.
5. 감자튀김 주문을 받는다.
6. 주방에서 감자튀김을 만든다.
7. 포장 후 손님에게 준다 ....

아무래도 손님 입장에서는 나중에 주문할 수록 오래 기다려야한다는 문제가 있다. 웹 서비스 사용자 입장에서 UX가 최악이라고 느끼게 되는 것이다.

AJAX는 비동기 처리 모델(Asynchronous processing model)을 허용한다. 햄버거 주문을 받는 것(**Request**), 주문을 처리 하는 것(**Response**)을 종속적으로 두지 않고 주문을 받아 주방에 넘긴 뒤 다음 주문을 받을 준비하게 된다.

:::warning AJAX without JavaScript
AJAX는 자바스크립트 없이 구현될 수 없다. 브라우저 HTTP통신 라이브러리가 많이 있지만 `axios`만 봐도 바닐라 자바스크립트의 `XMLHttpRequest` 객체 생성을 기반으로 만들어진 코드이다. 브라우저의 AJAX 요청은 **자바스크립트 XMLHttpRequest를** 기반으로 이루어진다. (axios 깃헙 dist/axios.js 157번 라인을 보면 `new XMLHttpRequest()`코드가 작성되어 있다.)

AJAX 약자를 풀면 `Asynchronous JavaScript and XML`이라는 것만 봐도 자바스크립트 없이 구현이 안된다는 것은 알 수 있을 것 같다.
:::

## Create Request

JSON 데이터 포맷에 대한 설명은 [json 문서를 참조하자.](./json.md)

### 1. POST

POST요청은 주문을 접수 받은 뒤 주방에 음식 조리를 오더하는 것과 유사하다.

POST 요청을 이루는 주요 요소로 세 가지가 존재한다.

1. URL : request 라우트에 필요한 주소
2. Data : 서버에 보낼 추가 파라미터. (URL params)
3. Callback : 요청을 보낸 뒤 실행되는 함수. 프라미스의 `then`, `catch`와 같은 것들이라고 보면 된다.

햄버거와 감자튀김을 서버에 요청하는 URL은 주방 기능에 따라 완전히 달라진다. 다음 코드는 서로 다른 유저가 포스팅한 글 정보를 받아오는 코드이다. 다음 코드에 대한 자세한 설명은 [axios 글을](./axios.md) 참조하자.

```javascript
xhr.open('POST', "https://jsonplaceholder.typicode.com/users/1/posts");
xhr.setRequestHeader('Content-type', 'application/json');

xhr.send(JSON.stringify(data))

xhr.onload = function(){
    console.log(xhr.response);
}
```

```javascript
xhr.open('POST',  "https://jsonplaceholder.typicode.com/users/2/posts")
xhr.setRequestHeader('Content-type', 'application/json');

xhr.send(JSON.stringify(data))

xhr.onload = function(){
    console.log(xhr.response);
}
```

위 코드는 모두 POST 메서드로, 내부 구성 요소가 `URL`, `Data`, `Params`, `callback`으로 동일하다.

1. URL - `"https://jsonplaceholder.typicode.com/users/1/posts"`
2. Data - `JSON.stringify(data)`의 `data`
3. callback - `xhr.onload`, 요청 보낸 뒤에 실행되는 콜백 함수

주방에 음식 조리를 의뢰하기 위해 단순히 **버거 제작만을** 오더로 전달해도 될까? 그렇지 않다. **어떤 버거 메뉴인지, 세트인지, 라지 세트인지 등** 오더로 전달할 **데이터 객체의 속성들을 함께 전달해야한다.**

```javascript
const order = {
  menu: "cheeseBurger",
  size: "large",
  price: 6
}

xhr.open("POST", "https://mcdonald/burger");
xhr.send(JSON.stringify(order));
```

다음은 콜백에 대한 이야기이다. 버거 속성 정의와 함께 오더를 주방에 전달이 **잘 완료되었는지 고객에게 알려야한다.** 주문 요청 후에 **결과물을 받는 것이 아니라, 오더가 잘 제출되었는지에 대한 이야기이다.**

잘 제출되었을 때에 알려주는 것이 콜백이며, 현재의 예시에서는 `console.log` 또는 `alert`를 콜백으로 등록함으로써 사용자에게 인식을 줄 수 있다.

`XMLHttpRequest`객체는 `onreadystatechange` 메서드를 등록함으로써 콜백함수를 트리거할 수 있다.

```javascript
const xhr = new XMLHttpRequest()

const data = { // 전달 데이터 정의
    title: "Title",
    body: "Hello!",
}

// Request 오픈
xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts'); 

// stateChange 이벤트 리스닝
xhr.onreadystatechange = function(){
    // Request 제출 완료되었을 때
    if(xhr.readyState == 4){
        console.log("Request Completed!");
        callback(xhr.responseText); // 다음 손님 오세요! 와 같은 이치
    } else {
        console.log("Processing...")
    }
}
xhr.setRequestHeader("Content-type", "application/json")

xhr.send(JSON.stringify(data));

function callback(responseText){
    console.log(JSON.parse(responseText));
}
```

주문 접수가 완료되고, 다음 손님에게 주문을 받는 프로세싱을 생각하면 이해하기 쉬울 것이다.

### 2. GET

GET요청은 조리된 음식에 대해 손님에게 포장 및 전달하는 과정과 유사하다. HTTP GET 요청시 **Query string, Path value** 방식으로 특정 URL 데이터를 요청할 수 있는데, 레스토랑 비유에 적용해보자면 **자신이 요청한 주문에 따른 음식을 받는 것이다.** 

POST가 음식 제작을 요청하는 것이라면, GET은 POST로 제작된 음식을 딜리버리 받는다 라고 생각하자.

또한 GET에는 두 가지 방식으로 파라미터를 전달하여 더 구체화된 데이터를 받아올 수 있다.
1. **Query String** 방식 : `/burger?menu=cheeseBurger`
2. **Path value** 방식 : `/mcdonald/fries`

`Node.js`에서는 쿼리 스트링 방식을 요청 객체인 `req`의 `query`프로퍼티 (`req.query`)를 통해 처리할 수 있고, `Path value`의 경우 `req`의 `params` (`req.params`)를 통해 처리할 수 있다.

쿼리스트링은 **특정 리소스를 식별할 때 사용하며** Path value는 리소스들을 더 큰 범위로 필터링할때 사용한다.

Jsonplaceholer 투두 리스트 유저 아이디가 1값인 리소스를 쿼리 스트링으로 불러오는 코드를 작성해보자. 리터럴 문법을 통해 URL을 작성하면 된다.

```javascript
const xhr = new XMLHttpRequest();
const id = 1;

xhr.open('GET',`https://jsonplaceholder.typicode.com/todos?userId=${id}`);

xhr.onreadystatechange = function(){
  if(xhr.readyState == 4){
    console.log("Completed!");
    console.log("This is Todo Data with User 1 : ",JSON.parse(xhr.response));
  } else {
    console.log("Current state: ", xhr.readyState);
    console.log("Processing....");
  }
}

xhr.send();
```

## Reference

1. [Medium - AJAX Basic explained by working at a fast food restaurant](https://medium.com/free-code-camp/ajax-basics-explained-by-working-at-a-fast-food-restaurant-88d95f5fcb7a)
2. [Poimeweb - 비동기 처리 모델과 Ajax](https://poiemaweb.com/js-ajax)
3. [stackoverflow - Ajax without JavaScript](https://stackoverflow.com/q/2386602)
4. [stackoverflow - How are parameters sent in an HTTP POST request?](https://stackoverflow.com/questions/14551194/how-are-parameters-sent-in-an-http-post-request)
5. [Development: Difference between the http requests POST and GET](https://lazaroibanez.com/difference-between-the-http-requests-post-and-get-3b4ed40164c1)
6. [Get 방식의 Query string 방식과 Path value 방식](https://ooeunz.tistory.com/43)
7. [REST API Response Body 형식에 대한 경험적 구조](http://blog.storyg.co/rest-api-response-body-best-pratics)