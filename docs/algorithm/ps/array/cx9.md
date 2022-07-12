---
title: Udemy JavaScript CodingExercise9 - findLongestSubstring
---

## findLongestSubstring

```text
Write a function called findLongestSubstring,
which accepts a string and returns the length of the longest substring
with all distinct characters.
```

```text
주어진 문자열의 부분문자열 중 모든 문자가 고유하게 구성된 것을 찾아
최대 길이값을 반환하세요.
```

## Solution

```javascript
// findLongestSubstring
// 고유문자로 이루어진 가장 긴 부분문자열 리턴

const findLongestSubstring = (str) => {
  if (str.length === 0) {
    return 0;
  }

  // while문 끝까지 순회하기 위한 cnt변수 선언
  let cnt = 0;
  let max = -Infinity;

  // 가장 긴 문자열 찾아야 하므로 while문으로 전체 문자 순회
  while (cnt < str.length) {
    // 부분 문자열 빈도수 세기 패턴 적용
    let substrFreq = {};

    // 문자열 세다가 멈춘 부분부터 다시 시작
    for (let i = cnt; i < str.length; i++) {
      if (substrFreq[str[i]] === undefined) {
        substrFreq[str[i]] = i;
        // 고유문자로 이루어지지 않았을 때
      } else {
        // 고유문자 아닌 인덱스로 cnt 초기화
        cnt = substrFreq[str[i]] + 1;

        max = Math.max(Object.keys(substrFreq).length, max);
        break;
      }

      // 마지막 인덱스에서 순회하지 못하는 문제
      if (i === str.length - 1) {
        max = Math.max(Object.keys(substrFreq).length, max);
        cnt = str.length;
      }
    }
  }

  return max;
};
```

## Description

슬라이딩 윈도우로 전체 원소를 순회해야하므로 while문으로 카운트 변수를 증가시키며 순회합니다.

while문 내에서 for문을 두어 부분 문자열을 순회합니다. 부분 문자열 순회에 빈도수 세기 패턴을 적용하여 순회 도중 고유한 문자가 아니라고 판단될 경우 cnt변수를 고유하지 않은 첫 번째 문자 바로 다음 인덱스로 초기화시킵니다.

최종 순회 후 마지막 인덱스의 문자에 대해 고유한 문자라고 판단되었을 경우 cnt값이 초기화되지 않고 for문을 빠져나오므로 while문 탈출을 위해 초기화를 한번 더 해줘야 합니다.

부분 문자열이 고유하다는 가정 하에 `Object.keys(부분문자열 빈도수).length` 메서드를 적용하면 객체 키값이 배열로 바뀐 뒤 해당 배열의 길이값을 반환받게 됩니다. `Math.max`에 전달하여 부분 문자열 중 최대값인지 검사한 후 함수를 리턴합니다.
