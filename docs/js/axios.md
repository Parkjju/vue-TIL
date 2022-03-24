---
title: HTTP 통신

---
## 개요
프론트엔드 개발 중에는 서버와 데이터를 주고 받는 작업을 처리할 경우가 생긴다. 비동기적으로 처리한다는 이야기는 이후의 AJAX문서에서 서술할 예정이며, 이 문서에서는 실제 코드를 먼저 보며 바닐라 자바스크립트와 HTTP 통신 라이브러리 `axios`를 이용한 AJAX요청이 어떻게 이루어지는 지 먼저 살펴볼 예정이다.

## XMLHttpRequest
바닐라 자바스크립트에서는 `XMLHttpRequest` 객체를 이용하여 AJAX 요청을 생성 및 전송한다. 서버로부터 처리된 후의 결과물을 다시 이 객체가 반환받은 뒤 다시 작업을 진행하게 된다.

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos');
xhr.send();
```


## Reference
1. [Medium - Getting Started With Axios](https://medium.com/codingthesmartway-com-blog/getting-started-with-axios-166cb0035237)
2. [Poimeweb - 비동기식 처리 모델과 Ajax](https://poiemaweb.com/js-ajax)
