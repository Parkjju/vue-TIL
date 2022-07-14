---
title: Recursion
---

## 재귀란?

재귀함수는 자기 자신을 호출하는 함수를 의미합니다.

```text
(1234,3214,5234,63546) 이 숫자 목록 중 홀수를 찾아보세요.
```

위 문제에 대해 재귀적 사고를 적용하면 선형적으로 모든 숫자 하나하나 홀/짝 판단을 하지 않습니다. 모든 목록 중 첫 번째 숫자가 홀수인지 판단하고, 그 다음엔 1234를 제외한 나머지 세개중 첫 번째 숫자가 홀수인지 판단하며 최종적으로 텅 빈 값이 전달되면 재귀적 사고를 멈추게 되는 형태입니다.

재귀를 끝마치는 순간의 케이스를 **탈출조건 (base case)라고 하며** 해당 조건이 재귀에서는 핵심이 됩니다.

:::tip JavaScript 내장 메서드
자바스크립트의 내장 메서드 중 몇가지는 재귀적 호출을 기반으로 이루어집니다.

1. `JSON.parse` / `JSON.stringify`
2. DOM 순회 메서드들 (`document.getElementById` ..)

:::

:::tip 크롬 JavaScript 디버거
구글 크롬 개발자도구의 `Source`탭에 코드 작성을 한 뒤 코드 왼쪽편의 라인넘버를 클릭하면 중단점(break point)을 지정할 수 있습니다. 이후 함수를 실행하면 중단점부터 디버깅을 시작하며 F9를 통해 크롬 내부 동작 코드는 건너뛸 수 있습니다.
:::

재귀함수 정의 시 주의할 점은 다음과 같습니다.

1. 재귀함수는 반드시 탈출조건을 먼저 생각하고 정의해야합니다.
2. 값에 대한 연산 시 탈출조건에 올바른값을 리턴해야합니다.

## 헬퍼 메서드 재귀

헬퍼 메서드는 함수 내에서 호출되는 재귀함수입니다. 주어진 배열 내에서 홀수 값들을 수집하는 함수를 정의한다고 가정해봅시다.

```javascript
function collectOdds(arr) {
    let result = [];

    // 재귀함수를 함수 내부에서 정의
    function helper(helperInput) {
        if (helperInput.length !== 0) {
            const checkValue = helperInput.pop();
            checkValue % 2 === 0 ? null : result.push(checkValue);

            return helper(helperInput);
            // return helper(helperInput.slice(1)); -> [0]인덱스 값을 제외하고
            // 나머지 모든 원소들을 subArray로 반환
        } else {
            return;
        }
    }
    // 정의한 재귀함수를 함수 내부에서 호출
    helper(arr);

    console.log(result);
}
```

`helper`함수 내에서는 자신보다 한 단계 밖의 `collectOdds` 함수 블록의 `result`에 접근하여 값을 변경할 수 있습니다.

재귀함수를 헬퍼 메서드로 정의하여 사용하게 되면 헬퍼메서드 외부에서 재귀함수의 결과값에 대한 데이터를 저장하여 활용할 수 있다는 점이 편리합니다.

위 코드를 순수 재귀함수로 구현하려면 홀수값 판별 후에 해당 홀수값을 어딘가에 저장해야하는데 그러한 부분이 직관적으로 생각나지 않습니다.

```javascript
function collectOdds(arr) {
    let newArr = [];

    if (arr.length === 0) {
        return newArr;
    }

    if (arr[0] % 2 !== 0) {
        newArr.push(arr[0]);
    }

    newArr = newArr.concat(collectOdds(arr.slice(1)));
    return newArr;
}
```

1. `[1,2,3,4,5]`배열이 전달됩니다.
2. `arr[0]`이 1로 홀수이므로 newArr에 1값이 푸시됩니다.
3. `newArr`에 1이 있는 상태로 배열 하나를 더 붙이는데, 이 배열은 `collectOdds(arr.slice(1))`입니다.
4. 재귀적으로 호출되어 `[2,3,4,5]`에 대해 홀수를 다시 판별합니다.
5. `arr[0]`인 2값이 짝수이므로 푸시하지 않고 빈 배열에 `collectOdds([3,4,5])`를 concat합니다.
6. 재귀적으로 쭉 이어지다가 탈출조건을 만납니다.
7. 다시 역으로 배열들을 리턴해가며 newArr에 `[5]`가 있던 상황에 탈출조건으로 반환된 빈 배열을 concat합니다.
8. 재귀 호출 단계에 있던 `[3]`에서 `[5]`를 concat하여 `[3,5]`가 됩니다.
9. 마지막에 `[1]`로만 있던 newArr에 `[3,5]`를 concat하며 `[1,3,5]`가 리턴됩니다.

헬퍼 메서드 사용 없이 순수재귀에 데이터 변경 및 저장이 필요할때 `spread`, `slice`, `concat` 등의 연산자를 활용하면 좋습니다.
