---
title: HTTP 통신

---
## 개요
프론트엔드 개발 중에는 서버와 데이터를 주고 받는 작업을 처리할 경우가 생긴다. 비동기적으로 처리한다는 이야기는 이후의 AJAX문서에서 서술할 예정이며, 이 문서에서는 실제 코드를 먼저 보며 바닐라 자바스크립트의 `XMLHttpRequest`, `fetch API`를 살펴본 후 HTTP 통신 라이브러리 `axios`를 이용한 AJAX요청이 어떻게 이루어지는 지 먼저 살펴볼 예정이다.

실습 코드는 [JSON placeholder](https://jsonplaceholder.typicode.com/) 사이트에서 이루어진다.

## fetch
fetch 메서드는 자바스크립트 빌트인 객체인 `XMLHttpRequest`의 최근 버전으로 구식 브라우저에서는 지원하지 않지만 대부분의 모던 브라우저에서는 작동한다. `fetch()` 기본 문법은 다음과 같다.
```javascript
let promise = fetch(url, [options])
```
`url`은 접근하고자 하는 URL이고, `options`는 메서드 및 헤더를 지정할 수 있다. 호출 후에 `promise`가 반환된다. 프라미스 반환 성공 여부에 따라 이행(`fullfilled`)상태 또는 거부(`rejected`)상태가 된다. `[[PromiseResult]]`의 `Response` 인스턴스를 보면 성공, 실패 여부를 `status` 코드 값을 통해 확인할 수 있다.

프라미스가 반환상태가 되면 `.then()`메서드를 통해 응답의 `body`를 확인할 수 있다.
```javascript
let promise = fetch('https://jsonplaceholder.typicode.com/todos');
promise.then( (response) => console.log(response) );
```

프라미스 대신 `async`, `await`을 사용해도 된다.
```javascript
let response = await('https://jsonplaceholder.typicode.com/todos');
```
결과값은 프라미스의 `Response`인스턴스 형태와 동일하다.

프라미스의 내장 인스턴스 메서드는 다양하다. [Javascript info - fetch](https://ko.javascript.info/fetch)를 참조하자.


## XMLHttpRequest
바닐라 자바스크립트에서는 `XMLHttpRequest` 객체를 이용하여 AJAX 요청을 생성 및 전송한다.(빌트인 객체이다.) 서버로부터 처리된 후의 결과물을 다시 이 객체가 반환받은 뒤 다시 작업을 진행하게 된다. XML이라는 용어가 객체 명에 포함되어 있지만 꼭 XML 포맷만 취급하는 것은 아니다.

### 1. xhr.open()
`XMLHttpRequest`는 동기적, 비동기적 처리 두 가지 형태를 갖는다. 비동기적 처리 케이스를 먼저 보자.
```javascript
let xhr = new XMLHttpRequest(); // no arguments
xhr.open(method, URL, [async, user, password]);
```
XHR 객체의 `.open()` 메서드는 다음 인자들을 갖는다.
1. 요청 메서드
2. 요청 URL
3. `async` - 동기/비동기 모드 선택 (default는 true, 비동기적 처리)
4. HTTP auth를 위한 계정과 비밀번호 (필수 X)

### 2. xhr.send()

`open` 메서드를 실행하면 요청을 보낼 준비가 된 것이고, `send` 메서드를 통해 요청을 보낸다.

```javascript
xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/1');
xhr.send();

console.log(JSON.parse(xhr.responseText));
// JSON placeholder todos/1 데이터가 객체로 출력된다.
```

`POST` 요청 시에는 `send` 메서드의 인자로 전달할 데이터를 담아 보낸다. `POST`에 대한 예시 코드는 이후에 살펴본다.

### 3. xhr.onload, onerror, onprogress
XHR 객체는 응답에 대한 이벤트를 리스닝한다.
1. `load` - 요청이 완료되고 응답이 돌아왔을 때(fully downloaded)의 이벤트이다. (상태 코드가 400이나 500이 떠도 상관없음)
2. `error` - 유효하지 않은 URL접근이나 요청이 올바르지 않을때
3. `progress` - 응답이 오고있을때.(being downloaded)

```javascript
let xhr = new XMLHttpRequest();
xhr.onload = () => {
  if(xhr.status === 201){
    console.log(JSON.parse(xhr.responseText));
  } else {
    console.log("Server response: ", xhr.status);
  }
};

xhr.onerror = () => {
	console.log('An error occurred, not able to process the request.');
};
```

### 4. xhr properties
1. `xhr.status` : 상태 코드
2. `xhr.statusText` : 상태 메세지 (OK, Not Found, Forbidden.. etc)
3. `response` : 응답 `body`를 반환. 구식 브라우저에서는 `responseText`를 사용한다.

### 5. xhr.responseType
리스폰스 타입을 지정한다. `arraybuffer`, `blob` 타입도 있지만, 아직 명확한 이해가 되지 않아 자세한 설명은 [Javascript info - XMLHttpRequest](https://ko.javascript.info/xmlhttprequest)를 참조하자.

1. default - 문자열 형태로 반환받는다.
2. "text" - 문자열 형태로 반환받는다.
3. "document" - XML형태로 반환받는다. 
4. "json" - JSON형태로 반환받는다.

`responseText`는 반환 타입이 텍스트일때만 값이 존재하며 `document`, `json` 등일 때에는 `response`에만 결과가 존재한다.

```javascript
let xhr = new XMLHttpRequest();

xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/1');
xhr.responseType = "json";

xhr.send();
console.log(xhr.response); // 비동기 처리가 되지 않았으므로 코드를 한번에 실행하면 null이 출력된다. 
// 텀을 두고 콘솔에 찍어보자.
```

```javascript
let xhr = new XMLHttpRequest();

// 현재 블로그의 사이트맵 xml을 요청한다.
xhr.open('GET', "https://parkjju.github.io/vue-TIL/sitemap.xml");
xhr.responseType = "document";

xhr.send();
console.log(xhr.response); // xml이 출력된다.
```

### 6. Ready states
`XMLHttpRequest` 객체는 진행에 따라 상태가 달라진다. 현재 상태에 대해 접근하고 싶으면 `readyState`프로퍼티를 확인해보자.

1. `UNSENT = 0` : initial state
2. `OPENED = 1` : open called
3. `HEADERS_RECEIVED = 2`: response headers received
4. `LOADING = 3`: response is loading (data packed is received)
5. `DONE = 4` : request complete

상태 변화 감지를 위한 이벤트는 `readystatechange`이다.
```javascript
xhr.onreadystatechange = () => {
	if(xhr.readyState == 2){
        console.log("HEADERS_REACEIVED!");
    } else if(xhr.readyState == 3){
        console.log("LOADING!");
    } else if(xhr.readyState == 4){
        console.log("DONE!");
    }
};
xhr.send();
```
`readystatechange` 이벤트는 `load`, `error`, `progress`이벤트가 존재하지 않았을 때의 이벤트이다. 최근에는 `deprecated`되어 사용되지 않는다.



### 7. HTTP-headers
`XMLHttpRequest.setRequestHeader` 메서드는 HTTP Request Header의 값을 설정한다. **반드시 open메서드 호출 이후에 호출해야한다.**

자주 사용되는 요청 헤더의 `Content-type`, `Accept`를 알아보자.

1. Content-type : 요청 바디에 담아 전송할 데이터의 `MIME-type` 정보를 표현한다. MIME-type은 전송될 문서의 종류를 명시한다고 생각하면 된다. 슬래시를 기준으로 타입(type, multipart, 개별타입)과 subtype으로 나뉜다. [다음의 링크](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types)를 참조하자.
2. Accept : 클라이언트가 이해할 수 있는 MIME-type에 대한 정보이다.

자주 사용되는 `MIME-type`은 다음과 같다.
1. text/subtype : text/plain, text/html, text/css, text/javascript
2. Application/subtype : application/json, application/x-www-form-urlencode
3. file 업로드를 위한 타입, multipart/formed-data. POST메서드 요청 시 사용된다.

```javascript
let xhr = new XMLHttpRequest();
const data = {
  title: "foo",
  body: "bar",
  userId: 1
};

xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts');
xhr.setRequestHeader('Content-type', 'application/json');


xhr.send(JSON.stringify(data)); // JSON data를 POST요청으로 보낸다.
console.log(JSON.parse(xhr.response)); // POST 응답 데이터를 받는다.
```

### 응답 처리 예제
```javascript
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/1');
xhr.send();

xhr.onload = (e) => {
    if(xhr.status == 200){
        console.log(xhr.response);
    } else {
        console.log("Error!");
    }
};
```

## axios


## Reference
1. [Medium - Getting Started With Axios](https://medium.com/codingthesmartway-com-blog/getting-started-with-axios-166cb0035237)
2. [Poimeweb - 비동기식 처리 모델과 Ajax](https://poiemaweb.com/js-ajax)
3. [Javascript info - fetch](https://ko.javascript.info/fetch)
4. [Javascript info - XMLHttpRequest](https://ko.javascript.info/xmlhttprequest)
5. [JavaScript XHR using JSON placeholder API](https://codeomelet.com/posts/javascript-xhr-using-jsonplaceholder-api)