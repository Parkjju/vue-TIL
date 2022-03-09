---
title: 바닐라 JS로 인터랙션 구현하기
---

리액트는 인터랙티브한 UI를 만들기 위해 제작된 오픈소스 라이브러리이다. 인터랙티브라는 것에 대한 의미가 사전적으로는 알겠지만 실제 체감을 하기 위해서는 직접 코드를 작성해봐야 한다. 리액트 인터랙티브 구현에 앞서 바닐라 자바스트립트만 사용하여 클릭 시 카운터가 올라가는 코드를 작성해보자.

```javascript
let counter = document.querySelector('#counter');
const button = document.querySelector('#btn');

function handleClick() {
  let count = parseInt(counter.textContent);
  count += 1;

  let newCount = document.createTextNode(count);
  counter.removeChild(counter.firstChild);
  counter.appendChild(newCount);
}
button.addEventListener('click', handleClick);
```
