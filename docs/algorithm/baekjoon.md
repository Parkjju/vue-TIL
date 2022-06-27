---
title: 백준 PS 모음
---

## 알고리즘 공부

알고리즘 문제 풀이를 시작하게 되면서 풀이한 문제들을 정리할 공간을 마련하였습니다! [알고리즘 학습과 관련된 좋은 글](https://plzrun.tistory.com/entry/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-%EB%AC%B8%EC%A0%9C%ED%92%80%EC%9D%B4PS-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0)을 참조하여 학습합니다. 학습 룰은 다음과 같습니다.

1. 입출력과 관련된 문제는 10분 이상 투자하지 않는다. 반드시 모르는 어떤가가 있기 때문이다.
2. 그 외의 알고리즘 문제는 1시간 이상 투자하지 않는다.

사용 언어는 자바스크립트입니다.

## node.js 입출력

nodejs는 입출력 스트림을 마련해주는 함수를 통해 입력 및 출력을 진행해야 합니다. 이를 위해 `fs`모듈을 사용하면 됩니다.

입출력 흐름을 정리하면 다음과 같습니다.

1. `fs` 모듈을 임포트한다.
2. fs모듈의 `readFileSync` 함수를 호출한다. 이때 인자로는 읽어올 입력 테스트 케이스 파일의 경로를 지정한다. 불러온 입력 테스트 케이스는 `toString`메서드를 통해 스트링 형태로 다시 한 번 파싱해야한다.
3. readFileSync로 불러온 테스트케이스 문자열을 변수에 저장한다.
4. 알고리즘 솔루션에 따라 해당 테스트케이스를 처리한다. 이때 map 메서드를 활용하면 유용하다.

```text
입력 예시
=======
10 3
1 10 4 9 2 3 8 5 7 6
```

코드를 보겠습니다.

```javascript
const fs = require('fs');
let input = fs.readFileSync('./input.txt').toString();
input = input.split('\n');

for (let i = 0; i < input.length; i++) {
    console.log(input[i].split(' ').map((item) => +item));
}
//
//[ 10, 5 ]
//[
//  1, 10, 4, 9, 2,
//  3,  8, 5, 7, 6
//]
```

`input`이라는 변수에 입력 데이터를 모두 저장하고, 정제하는 작업을 split으로 진행해줍니다. 입력데이터 모두를 순회해야 하므로 알고리즘이 최악의 경우 O(n)의 시간복잡도를 갖게 되는데, 이에 따라 알고리즘 자체는 O(n)시간보다 적게 작성했더라도 BOJ에서는 시간초과가 나타나는 경우도 있다고 합니다.

:::warning
위 코드에서 `fs.readFileSync()`의 인자로 전달되는 파일 경로는 vscode상에서 상대 경로로 지정하면 되지만 BOJ에서는 dev/stdin이라는 위치로 지정해야합니다.
:::

## PS 아카이빙

### 입출력

-   [10951](./ps/input/10951.md) - EOF 에러 처리
-   [10871](./ps/input/10871.md) - node.js 입출력

## 자바스크립트 코테 준비 관련 문서들

1. [Medium - 자바스크립트 코딩 테스트에서 가장 많이 하는 실수들](https://medium.com/%EC%98%A4%EB%8A%98%EC%9D%98-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%BD%94%EB%94%A9-%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%97%90%EC%84%9C-%EA%B0%80%EC%9E%A5-%EB%A7%8E%EC%9D%B4%ED%95%98%EB%8A%94-%EC%8B%A4%EC%88%98%EB%93%A4-a10df2c884c)
2. [자바스크립트로 코딩테스트 준비하기 - 입출력 관련 이야기](https://velog.io/@bigsaigon333/Javascript%EB%A1%9C-%EC%BD%94%EB%94%A9%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%A4%80%EB%B9%84%ED%95%98%EA%B8%B01)
3. [Top 10 Algorithms to improve your javascript skills](https://medium.com/javascript-in-plain-english/top-10-algorithms-improve-your-javascript-skills-21507c25ff7)
