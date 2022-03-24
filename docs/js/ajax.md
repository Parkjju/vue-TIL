---
title: Ajax

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


### 2. GET
GET요청은 조리된 음식에 대해 손님에게 포장 및 전달하는 과정과 유사하다.




## Reference 
1. [Medium - AJAX Basic explained by working at a fast food restaurant](https://medium.com/free-code-camp/ajax-basics-explained-by-working-at-a-fast-food-restaurant-88d95f5fcb7a)
2. [Poimeweb - 비동기 처리 모델과 Ajax](https://poiemaweb.com/js-ajax)
3. [stackoverflow - Ajax without JavaScript](https://stackoverflow.com/q/2386602)
4. [Medium - Getting Started With Axios](https://medium.com/codingthesmartway-com-blog/getting-started-with-axios-166cb0035237)