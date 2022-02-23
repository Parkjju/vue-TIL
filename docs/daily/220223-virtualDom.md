---
title: DailyTech - Virtul DOM이란

---
## About DOM

DOM에 대한 이야기는 [이전에 문서로](https://parkjju.github.io/vue-TIL/daily/220208-DOM.html#dom%E1%84%8B%E1%85%B5%E1%84%85%E1%85%A1%E1%86%AB) 정리해두었으니 참고하면 가상 돔 이야기를 이야기하는 데에 도움이 많이 될 것 같습니다.

간단히 정리해보자면 DOM은 크로스 플랫폼, 언어 독립적(language-independent)한 웹 API입니다. 구축 과정 및 상세 내용에 대해서는 문서 및 각종 자료를 참조해주시면 좋습니다. (이하 평어체로 작성)

DOM은 HTML로 파싱된 객체를 동적으로 조작하기 위해서 존재한다. 동적이라는 단어가 포함되기 때문에 DOM의 근본적인 문제가 발생한다. 바로 **성능 문제이다.** 개발자 도구를 통해 눈에 보이는 요소만 간략히 처리하는 것으로는 성능의 문제를 체감하기 어렵다. 더 극단적인 예시를 생각해보면 모던 웹의 가장 대표적인 주자로 Facebook, Instagram 등 각종 SNS가 있다. 이들 앱 내에서 게시물을 이루는 UI 요소 10000개를 왼쪽으로 1픽셀 옮긴다고 가정해보자. DOM 구조 재구축은 고사하고 각 요소가 실제로 옮겨질 수 있게끔 브라우저 렌더링 단에서 큰 오버헤드가 발생할 것이다.

## Shadow DOM
위와 같은 문제를 해결하기 위해 W3C에서 `Shadow DOM`이라는 기능을 명세에 추가하였다. 돔 트리를 
## Reference

1. [Medium - What is Virtual DOM?](https://tonyfreed.medium.com/what-is-virtual-dom-c0ec6d6a925c)
2. [Medium - The Inner Workings Of Virutal DOM](https://medium.com/@rajaraodv/the-inner-workings-of-virtual-dom-666ee7ad47cf)
3. [What exactly is the DOM?](https://bitsofco.de/what-exactly-is-the-dom/?utm_source=CSS-Weekly&utm_campaign=Issue-341&utm_medium=email)