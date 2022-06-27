---
title: 자바스크립트와 빅오 표기법
---

Udemy 자바스크립트 알고리즘 강의 정리본입니다.

## 코드 시간 측정하기

자바스크립트에서는 `performance` 객체를 제공합니다. 내부에는 여러 메서드 및 프로퍼티들이 존재하는데, 코드 성능 측정을 위해 `now` 메서드를 사용하게 됩니다.

1~N까지 모두 더한 값을 출력하는 코드 둘을 비교해봅시다.

```javascript
function addUpTo(n) {
    let total = 0;
    for (let i = 0; i <= n; i++) {
        total += i;
    }
    return total;
}

// performance.now => 코드 수행 후의 시간
let t1 = performance.now();
console.log(addUpTo(1000000000));
let t2 = performance.now();

// 성능 측정
console.log(`Time elapsed: ${(t2 - t1) / 1000} seconds`);
```

```javascript
// 등차수열
function addUpTo(n) {
    return n(n + 1) / 2;
}

// performance.now => 코드 수행 후의 시간
let t1 = performance.now();
console.log(addUpTo(1000000000));
let t2 = performance.now();

// 성능 측정
console.log(`Time elapsed: ${(t2 - t1) / 1000} seconds`);
```

매번 수동으로 코드 러닝 타임을 측정할 수는 없습니다. 측정 방식이 기기마다 차이가 있을 뿐더러 환경에 따라 달라지기 때문입니다. 측정에 대한 절대값으로 성능을 비교함에 있어서는 한계점이 존재합니다.

이때 성능 측정을 위한 방법론으로 **연산 개수의 측정이 있습니다.**

`addUpTo` 첫 번째 코드의 경우 덧셈 및 대입연산자가 for 반복문 내에서 N번만큼 사용됩니다.

반면 두 번째 코드의 경우 각각 한 번만 사용됩니다.

입력의 크기가 얼마나 커지냐에 따라 함수 내부에서 실행되는 연산 개수가 분명하게 달라지게 됩니다. 이때 대두되는 개념이 **추세인데,** 빅-오 표기법 개념이 여기서부터 출발하게 됩니다.

빅-오를 한 마디로 정리하면 **입력의 크기와 실행시간의 관계라고 할 수 있습니다.** 실행의 최악의 경우를 생각하여 그 관계를 빅오 표기법으로 정리할 수 있게 됩니다.

1. O(1) -> 입력 크기에 상관 없이 연산 개수가 고정일때
2. O(n), O(n²), O(n³logn)...

## 자바스크립트 공간복잡도

공간복잡도는 실행시간을 제외하고 알고리즘 자체가 차지하는 공간에 대해 주목합니다.

자바스크립트에서 `boolean`, `Number`, `null`은 모두 불변 공간입니다.(constant space) 입력 크기에 상관 없이 모두 같은 공간을 차지하게 됩니다.

1. boolean, numbers, null은 O(1) 공간을 차지합니다.
2. 문자열의 경우 O(n) 공간을 차지합니다.
3. 배열 역시 O(n)공간을 차지합니다.

## 객체와 빅오

자바스크립트 객체의 특성은 **정렬될 필요가 없다는 것입니다.** (해시맵 자료구조처럼 동작) 따라서 내부 메서드의 시간복잡도는 다음과 같게 됩니다.

1. 삽입 - O(1)
2. 삭제 - O(1)
3. 탐색 - O(n) (key값에 대한 원하는 value를 찾기 위한 순회)
4. 접근 - O(1) (key값 대입과 동시에 value가 나옴)

다음은 자바스크립트 객체 메서드들에 대한 시간복잡도입니다.

1. `Object.keys(객체)` - O(n), 모든 키 값을 순회
2. `Object.values(객체)` - O(n), 모든 value를 순회
3. `Object.entries(객체)` - O(n), 모든 key,value쌍을 순회
4. `객체.hasOwnProperty(key값 이름)` - O(1), 인자로 전달된 키값이 있는지 검사(해시 자료구조이므로 상수시간)

## 배열과 빅오

배열은 선형적으로 인덱스라는 개념과 함께 원소가 정렬되어 있는 형태이기 때문에 삽입 / 삭제에 시간복잡도를 희생해야합니다. (n은 배열 원소의 개수)

1. 삽입 - O(n) (배열 끝에 원소를 추가할때는 O(1)) unshift / push
2. 삭제 - O(n) (배열 끝의 원소를 삭제할때는 O(1)) shift / pop
3. 접근 - O(1), 등록된 인덱스가 객체 키값처럼 사용됨
4. 탐색 - O(n), 인덱스에 따른 값 검색

다음은 자바스크립트 배열 내장 메서드에 대한 시간복잡도입니다.

1. push - O(1)
2. pop - O(1)
3. shift - O(N)
4. unshift - O(N)
5. concat - O(N)
6. slice - O(N), 배열 복사
7. splice - O(N), 특정 원소 및 부분 배열 대체 또는 삭제. 최악의 경우 unshift 또는 shift 연산을 하게됨
8. sort - O(NlogN)
9. forEach map, filter, reduce... - O(N)
