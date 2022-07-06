---
title: Problem Solving Pattern
---

Udemy 자바스크립트 알고리즘 강의 정리본입니다.

## 문제 해결 접근법

문제 해결 패턴과 접근법은 다르다. 접근법은 주어진 문제에 대해 이해하는 과정이고 패턴은 실제 풀이에 필요한 몇 가지 패턴들이다.

접근법은 다음과 같은 과정으로 이루어진다.

1. 문제에 대한 이해
2. 구체적 예시
3. 세부 분석
4. 해결 및 단순화
5. 리팩토링

문제에 대한 이해에서는 말 그대로 문제를 읽고 문제를 나의 말로 재정의 한 뒤 입출력 타입 및 형태에 대한 정의 등의 사고 과정이 이루어진다.

구체적 예시에서는 생각한 입출력 타입에 따라 어떤 결과가 도출되는지 예시를 들어본다.

세부 분석 단계에서는 슈도 코드 및 실제 코드 작성 전에 코드의 틀을 잡는다.

```javascript
// 입력된 문자열에 대해 각 문자가 몇 번 작성되었는지 출력하는 함수를 작성해보자.
charCount('input string!');

// 세부 분석단계 1. 주석으로 함수 틀 잡기
function charCount(str) {
    // 반환할 결과물 객체 선언
    // str을 루프에 전달
    // 객체 반환
}

// 세부 분석단계 2. 잡힌 틀을 기반으로 더 자세한 로직 구성
function charCount(str) {
    // 반환할 결과물 객체 선언
    // str을 루프에 전달
    // 루프 내부로직
    // 0. 문자가 숫자/영문자 외의 타입이라면?
    // 1. 문자가 key값으로 객체에 있다면?
    // 2. 문자가 key값으로 객체에 없다면?
    // 객체 반환
}
```

해결 또는 단순화 단계에서는 문제 전체를 한번에 해결하려고 하는 것이 아니라 구현 가능한 부분부터 처리한 뒤에 로직 구현을 진행한다.

```javascript
function charCount(str) {
    // 반환할 결과물 객체 선언
    let result = {};

    // str을 루프에 전달
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (result[char] > 0) {
            result[char]++;
        } else {
            result[char] = 1;
        }
    }

    return result;
}
```

마지막으로 되돌아보기 및 리팩토링 단계에서는 해결한 알고리즘 코드에 대해 다시 한번 코드 형태 및 해석에 대한 방법, 이해하기 얼마나 좋은 코드인지 반성하는 것이다.

1. 코드가 정상적으로 동작하는가?
2. 다른 접근방식이 있는가?
3. 이해하기 쉬운가?
4. 해결책이 직관적인가?
5. 또 다른 문제를 해결하는 데에 사용할 수 있는 풀이인가? - 다른 문제와의 유사점
6. 해결책에 대한 성능을 향상시킬 수 있는가?
7. **다른 사람의 구현 코드 살펴보기**

위의 코드를 리팩토링 하면 아래와 같은 형태도 가능하다.

```javascript
function charCount(str) {
    let obj = {};
    for (var char of str) {
        char = char.toLowerCase();
        if (/[a-z0-9]/.test(char)) {
            obj[char] = ++obj[char] || 1;
        }
    }
    return obj;
}
```

심지어 위의 코드도 ASCII코드를 확인하는 로직으로 구현하게 되면 성능이 더 향상된다. `charCodeAt` 메서드를 활용한다.

## 문제풀이 패턴

알고리즘 문제풀이 패턴에는 다음과 같은 것들이 있습니다.

1. 빈도수 세기
2. 다중 포인터
3. DP
4. 그리디
5. 백트래킹
6. etc..

### 1. 빈도수 세기

빈도수 세기 패턴이 사용되는 문제는 주로 중첩 루프나 O(n²)시간을 사용하는 알고리즘에 사용됩니다.

```text
두 배열을 인자로 받는 함수를 정의합니다.
이 함수는 첫 번째 배열의 모든 요소에 대해
두 번째 배열이 제곱값을 가지고 있으면
True를 반환하고, 그렇지 않으면 False를 반환합니다.
같은 값의 원소가 있더라도 제곱에 대한 빈도수는 동일해야합니다.
```

직접 작성해본 코드입니다.

```javascript
const same = (arr1, arr2) => {
    for (let i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i] ** 2) !== -1) {
            arr2.splice(arr2.indexOf(arr1[i] ** 2), 1);
        } else {
            return false;
        }
    }
    return true;
};

same([1, 2, 3], [4, 1, 9]); // true
same([1, 2, 3], [1, 9]);
same([1, 2, 1], [4, 4, 1]); // false - 빈도수
```

위 코드는 O(n²)시간으로 동작하게 됩니다. 배열 내에서 O(n)시간이 소요되는 `indexOf`와 `splice`를 사용하고 있기 때문입니다.

이때 자료구조를 선형적인 배열을 활용하는 것이 아니라 자바스크립트 **객체를 활용하여** 빈도수를 계산하면 O(n)시간에 확인이 가능하게 됩니다.

:::tip for of vs for in 간단정리
for of는 선형적인 구조를 갖는 데이터 (배열, 문자열 등)에 대해 인덱스에 해당하는 값을 변수에 할당해줍니다.

for in은 순회 대상에 대해 인덱스 및 키값을 변수에 할당해줍니다.

```javascript
const x = 'ABC';

for (let i in x) {
    console.log(i); // x 문자열 각각에 해당하는 인덱스
}

for (let i of x) {
    console.log(i); // x 문자열 각각에 해당하는 문자
}
```

:::

다음은 빈도수 세기 패턴의 주요 문제인 애너그램 판단 문제입니다.

```text
두 문자열을 받는 함수를 정의합니다.
두 번째 문자열이 첫 번째 문자열에 대한 애너그램이면 True를 반환합니다.
애너그램은 특정 문자열이 순서만 뒤바뀐 것을 의미합니다.
```

```javascript
// 직접 작성한 코드
const validAnagram = (str1, str2) => {
    if (str1.length !== str2.length) {
        return false;
    }
    let frequencyStr1 = {};
    let frequencyStr2 = {};

    for (let i of str1) {
        if (frequencyStr1[i] === undefined) {
            frequencyStr1[i] = 1;
        } else {
            frequencyStr1[i] += 1;
        }
    }

    for (let i of str2) {
        if (frequencyStr2[i] === undefined) {
            frequencyStr2[i] = 1;
        } else {
            frequencyStr2[i] += 1;
        }
    }

    for (let i in frequencyStr1) {
        if (frequencyStr1[i] !== frequencyStr2[i]) {
            return false;
        }
    }
    return true;
};
```

:::tip 리팩토링

1. 함수 내부에서 변수 선언시 `const`, `let`등의 키워드를 반드시 붙이자.
2. if문은 삼항연산자로 줄이자.
   :::

### 2. 다중 포인터

배열이나 문자열, 단일 연결리스트에 대해 적용되는 패턴입니다. 내부 요소 순회 시 여러 포인터가 함께 순회를 하게 된다.

```text
인자로 전달된 배열이 오름차순으로 정렬되어 있다.
배열 내에서 두 원소를 더했을 때
0이 되는 쌍을 찾는 함수를 작성해보자.
```

아래 코드는 O(n²)시간이 소요됩니다.

```javascript
const sumZero = (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] === 0) {
                return [arr[i], arr[j]];
            }
        }
    }
    return undefined;
};
```

위의 코드에 다중포인터 개념을 적용하게 되면 0번째 인덱스로부터 시작되는 포인터 하나와 마지막에 위치한 포인터의 배열 값을 더했을 때 0이 되는지 계속해서 검사하게 됩니다.

0보다 클 경우 오른쪽의 포인터를 하나 옮기고 0보다 작을 경우 왼쪽의 포인터를 하나 옮깁니다.

이렇게 되면 전체 요소를 1번씩만 훑게 되기 때문에 O(n)시간이 소요되게 됩니다. (정렬되어 있다는 걸 가정해야됩니다.)

```javascript
const sumZeroRe = (arr) => {
    let left = 0;
    let right = arr.length - 1;
    while (left < right) {
        if (arr[left] + arr[right] === 0) {
            return [arr[left], arr[right]];
        }

        if (arr[left] + arr[right] > 0) {
            right -= 1;
            continue;
        }
        if (arr[left] + arr[right] < 0) {
            left += 1;
            continue;
        }
    }
    return undefined;
};
```

다중포인터 두 번째 예제입니다.

```text
오름차순으로 정렬된 배열을 인자로 받아
고유값이 몇개인지 리턴하는 함수를 작성하세요.

예1) [1,2,3,3] - 1,2,3 세개
예2) [-1,-1,0,1] - -1,0,1 세개
```

```javascript
const countUniqueValues = (arr) => {
    if (arr.length === 0) {
        return 0;
    }
    let unique = {};

    let slideToLeft = parseInt(arr.length / 2);
    let slideToRight = parseInt(arr.length / 2);

    while (slideToLeft >= 0) {
        if (unique[arr[slideToLeft]] === undefined) {
            unique[arr[slideToLeft]] = false;
        }
        slideToLeft -= 1;
    }

    while (slideToRight < arr.length) {
        if (unique[arr[slideToRight]] === undefined) {
            unique[arr[slideToRight]] = false;
        }
        slideToRight += 1;
    }

    return Object.keys(unique).length;
};
```

위 코드는 직접 작성한 코드이며 Object.keys() 메서드가 `O(n)`이 소요되고 while문 두개가 O(n)시간이 소요되므로 최종적으로 O(n)시간이 소요됩니다.

또 다른 풀이로는 배열이 오름차순 정렬되어 있으므로 투 포인터를 인덱스 0,1에 두고 시작하여 두번째 포인터와 첫 번째 포인터의 값을 비교했을때 서로 다르다면 첫 번째 포인터를 마지막 포인터 인덱스로 이동시킵니다.

최종적으로 첫번째 포인터가 위치한 마지막 순간 인덱스가 고유값의 개수로 결정됩니다.

### 3. 슬라이딩 윈도우

슬라이딩 윈도우 패턴이 적용되는 예제를 먼저 보겠습니다.

```text
주어진 문자열에 대해 고유문자로 이루어진 문자열이
가장 긴 부분을 출력하세요.

예) hello -> hel
예) glass -> glas
```

두 번째 예제입니다.

```text
함수는 정수로 이루어진 배열과 숫자 둘을 인자로 받습니다.
두 번째 인자 숫자값만큼의 배열 원소의 합 중
최댓값을 구하세요.

단 부분배열은 요소끼리 떨어져 있지 않습니다.
```

위 예제의 경우 부분배열의 합을 구하기 위해 중첩루프를 사용해야 한다는 점에서 시간복잡도가 늘어나게 됩니다.

이때 윈도우가 이동할때마다 **매번 부분배열 합을 처음부터 계산하는 것이 아니라** 윈도우에서 빠진 부분은 합에서 빼고 윈도우에 추가된 값은 합에서 추가하면 됩니다.

```javascript
const maxSubarraySum = (arr, num) => {
    if (arr.length < num) {
        return 0;
    }

    let maxSum = 0;
    let tempSum = 0;

    for (let i = 0; i < num; i++) {
        maxSum += arr[i];
    }

    tempSum = maxSum;

    for (let i = num; i < arr.length; i++) {
        tempSum = maxSum - arr[i - num] + arr[i];
        maxSum = tempSum > maxSum ? tempSum : maxSum;
    }
    return maxSum;
};
```

### 4. 분할정복

정렬된 배열에 대해 특정 값을 찾아내는 알고리즘을 선형적으로 다루지 않고 반씩 쪼개어 각 부분 배열 중 최댓값을 구하는 로직을 재귀적으로 호출하여 다룹니다.
