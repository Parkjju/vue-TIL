---
title: PS 모음집
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

## readline 모듈

입출력 시나리오 중 정해진 입력에 대해서 한 번에 데이터를 정제하여 다루는 것도 있지만, 매 입력 줄마다 원하는 값을 그때 그때 출력해야 하는 경우도 존재합니다. [BOJ 2490](https://www.acmicpc.net/problem/2490)의 경우가 위의 경우입니다.

예제 입력 데이터 전체를 readFileSync 메서드로 한 번에 읽어서 각각을 처리하는 것이 아니라, 각 줄이 입력될 때마다 특정 값을 출력해야 하는 것입니다. 동적인 프로그램 작성 시에 readline 모듈을 활용하게 됩니다.

1. readline 모듈을 불러와 변수에 저장합니다.
2. readline에 대한 입출력 인터페이스를 정의합니다. 프로세스의 stdin, stdout으로 등록하면 됩니다.
3. readline을 저장한 변수에 이벤트 리스너와 유사한 것을 등록하게 되는데, `line`과 `close`에 대한 콜백 함수를 등록합니다.
4. javascript 파일 실행 시 터미널에 입력 커서가 활성화 되고 엔터키 입력에 따라 한 라인이 정의됩니다.
5. 정의된 line 문자열은 콜백 함수의 인자로 전달됩니다.

```javascript
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', (line) => {
    console.log(line);
}).on('close', () => {
    console.log('입력 끝!');
    process.exit();
});
```

:::tip 코드 실행하기
js 파일 실행을 위해서는 `node 실행할파일.js` 명령어를 터미널에 입력해주면 됩니다. 물론 node가 환경변수로 등록되어 있어야 합니다.
:::

:::warning trim()
반드시 toString()메서드 호출 이후에 trim()작업을 진행해줘야 합니다.

[BOJ 2577](./ps/array/2577.md) 문제의 경우 trim으로 양쪽 공백제거를 하지 않으면 에러가 발생합니다.
:::

## PS 아카이빙

### 입출력

-   [10951 A+B - 4](./ps/input/10951.md) - EOF 에러 처리
-   [10871 X보다 작은 수](./ps/input/10871.md) - node.js 입출력
-   [10171 고양이](./ps/input/10171.md) - 고양이 출력
-   [1000 A+B](./ps/input/1000.md)
-   [2752 세수정렬](./ps/input/2752.md) - 세 수 정렬
-   [2480 주사위 세개](./ps/input/2480.md) - 주사위 세개
-   [2490 윷놀이](./ps/input/2490.md) - readline 모듈 연습 1 (중요)
-   [2587 대표값2](./ps/input/2587.md) - readline 모듈 연습 2 `rl.close()` 활용
-   [2576 홀수](./ps/input/2576.md) - filter 메서드
-   [2309 일곱난쟁이](./ps/input/2309.md) - 일곱난쟁이
-   [10093 숫자](./ps/input/10093.md) - 반례찾기
-   [1267 핸드폰요금](./ps/input/1267.md)
-   [10804 카드 역배치](./ps/input/10804.md)
-   [15552 빠른 A+B](./ps/input/15552.md) - 입출력 시간초과 관련 문제
-   [2438 별찍기 1](./ps/input/2438.md)
-   [2439 별찍기 2](./ps/input/2439.md)
-   [2440 별찍기 3](./ps/input/2440.md)
-   [2441 별찍기 4](./ps/input/2441.md)
-   [2442 별찍기 5](./ps/input/2442.md)
-   [2443 별찍기 6](./ps/input/2443.md)
-   [2444 별찍기 7](./ps/input/2444.md) - reverse활용 1
-   [2445 별찍기 8](./ps/input/2445.md) - reverse활용 2
-   [2446 별찍기 9](./ps/input/2446.md) - reverse활용 3
-   [2562 최댓값](./ps/input/2562.md)

### 배열

-   [10808 알파벳 개수](./ps/array/10808.md)
-   [2577 숫자의 개수](./ps/array/2577.md) - fs모듈 trim 메서드의 중요성
-   [1475 방 번호](./ps/array/1475.md) - 6과 9 카드 뒤집는 로직 (어려웠음)
-   [3273 두 수의 합](./ps/array/3273.md) - O(n²) -> O(nlogn)으로 개선
-   [10807 개수 세기](./ps/array/10807.md)
-   [13300 방 배정](./ps/array/13300.md)
-   [11328 Strfry](./ps/array/11328.md) - 애너그램 판단
-   [1919 애너그램 만들기](./ps/array/1919.md) - 애너그램 판단 + 애너그램 만들기 로직
-   [udemy coding exercise3 - sameFrequency](./ps/array/cx3.md)
-   [udemy coding exercise6 - Multiple pointer, isSubsequence](./ps/array/cx6.md)
-   [udemy coding exercise8 - minSubArrayLen](./ps/array/cx8.md) - 풀이참조 (sliding window)
-   [udemy coding exercise9 - findLongestSubstring](./ps/array/cx9.md) - sliding window

### 구현

-   [14467 소가 길을 건넌 이유 1](./ps/implementation/14467.js)
-   [2578 빙고](./ps/implementation/2578.md)

## 자바스크립트 코테 준비 관련 문서들

1. [Medium - 자바스크립트 코딩 테스트에서 가장 많이 하는 실수들](https://medium.com/%EC%98%A4%EB%8A%98%EC%9D%98-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%BD%94%EB%94%A9-%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%97%90%EC%84%9C-%EA%B0%80%EC%9E%A5-%EB%A7%8E%EC%9D%B4%ED%95%98%EB%8A%94-%EC%8B%A4%EC%88%98%EB%93%A4-a10df2c884c)
2. [자바스크립트로 코딩테스트 준비하기 - 입출력 관련 이야기](https://velog.io/@bigsaigon333/Javascript%EB%A1%9C-%EC%BD%94%EB%94%A9%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%A4%80%EB%B9%84%ED%95%98%EA%B8%B01)
3. [Top 10 Algorithms to improve your javascript skills](https://medium.com/javascript-in-plain-english/top-10-algorithms-improve-your-javascript-skills-21507c25ff7)
4. [BOJ node.js 입력받기](https://velog.io/@exploit017/%EB%B0%B1%EC%A4%80Node.js-Node.js-%EC%9E%85%EB%A0%A5-%EB%B0%9B%EA%B8%B0)
