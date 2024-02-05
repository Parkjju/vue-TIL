---
title: Swift - 컬렉션
tags: ['Swift', 'UIKit']
---

## 배열

스위프트 컬렉션 타입에 해당하는 자료형들은 배열, 딕셔너리, `Set`가 있다.

```swift
let numsArray1: Array<Int> = [1,2,3];

let numsArray2: [Int] = [1,2,3];
```

배열에는 한 가지 타입의 값들만 담을 수 있다.

```swift
// 빈 배열 생성법
let arr: [Int] = [];
let arr = Array<Int>(); // 배열 생성자 함수
let arr = [Int](); // 배열 생성자 함수
```

### 배열 메서드

`let arr: [Int] = [1,2,3]` 기준으로 예시를 든다.

1. `arr.count` : 배열요소 개수
2. `arr.isEmpty` : 배열이 빈 배열인지 확인
3. `arr.contains(값)` : 전달된 값이 배열에 존재하는지
4. `arr.randomElement()` : 배열 중 랜덤요소 반환
5. `arr.first` : 첫 번째 배열 요소에 대한 옵셔널 리턴
6. `arr.last` : 마지막 배열 요소에 대한 옵셔널 리턴
7. `arr.startIndex`: 배열 시작 인덱스값 반환
8. `arr.endIndex` : 메모리 위치상 가장 마지막을 반환 (인덱싱을 위해서는 endIndex-1에 접근해야됨)
9. `arr.firstIndex(of: 값)`: 전달된 값이 배열에 있는 가장 첫번째 인덱스값
10. `arr.lastIndex(of: 값)`: 전달된 값이 배열에 있는 가장 마지막 인덱스값
11. `arr.insert(값, at: 인덱스)`: 인덱스에 값 삽입
12. `arr.insert(contentsOf: [요소들], at: 인덱스)`: contentsOf에 전달된 배열들 삽입
13. `arr[0..1] = [0,1]`: 0~1까지의 요소를 우항에 전달된 값으로 교체
14. `arr.replaceSubrange(인덱스Range, with: [요소들])`: Range인덱스 범위에 있는 컬렉션 요소들을 with에 전달된 요소들로 교체
15. `arr.remove(at: 인덱스)`
16. `arr.removeSubrange(인덱스 Range)`
17. `arr.removeFirst(개수)`: 0번째부터 전달된 개수만큼 지우기
18. `arr.removeLast(개수)`: 마지막인덱스부터 전달된 개수만큼
19. `arr.removeAll()`: 전체 지우기
20. `arr.removeAll(keepingCapacity: true)`: 메모리 공간은 유지하고 값만 날림 (재할당시 성능을 위함)
21. `arr.sort()`: 오름차순 정렬, mutable함.
22. `arr.sorted()`: 값을 복사하여 오름차순 정렬된 새 배열을 리턴
23. `arr.reverse()`, `arr.reversed()` - 배열 역순정렬
24. `arr.shuffle()`, `arr.shuffled()` - 배열 섞기

:::tip enumerated()

```swift
for tuple in nums.enumerated(){
    print(tuple); // 네임드 튜플이 출력된다.
    // 각 튜플은 (offset: 인덱스, element: 요소값)의 형태를 갖는다.
}
```

```swift
for (index, value) in nums.enumerated(){
    print("\(index), \(value)"); // 구조분해
}
```

:::

## 딕셔너리

```swift
let dict: Dictionary<String, String> = ["Name":"Jun", "Age": "25"];
// or
let dict: [String: String] = ["Name":"Jun", "Age": "25"]
```

딕셔너리의 모든 키값들은 서로 같은 타입이어야하고, 밸류도 마찬가지이다.

딕셔너리의 키값은 해셔블(Hashable)해야한다. 타입이 해셔블하다는 의미는 해당 타입을 해시 함수에 대한 인풋값으로 사용 가능하다는 의미이다.

스위프트의 기본 타입들은 모두 해셔블하다.

```swift
let emptyDict1: Dictionary<Int, String> = [:];
let emptyDict2 = Dictionary<Int, String>();
let emptyDict3 = [Int: String]()
```

### 딕셔너리 메서드

1. `dict.count` : 딕셔너리 원소 개수
2. `dict.isEmpty`: 딕셔너리가 비어있는지
3. `dict.randomElement()`: 랜덤 요소를 **옵셔널 네임드 튜플로** 반환
4. `dict.keys`, `dict.values` : 딕셔너리 키 및 밸류들을 배열로 반환
5. `dict.updateValue(값, forKey:키값)`
    - forKey에 전달된 키값에 대해 밸류가 존재하면 해당 밸류를 삭제하고 업데이트
    - updateValue 함수의 리턴값으로 수정 전 값이 반환된다.
    - forKey에 전달된 키값에 대해 밸류가 없었다면 값을 추가하고 함수의 리턴값으로는 nil을 리턴
6. `dict[키] = nil` 키값에 대한 요소 삭제, 존재하지 않는 키값에 대해 삭제를 시도해도 에러는 나지 않는다.
7. `dict.removeValue(forKey: 키)`: 키값에 대해 밸류를 지우고 지워진 값을 반환, 밸류가 없는 키값이었다면 `nil` 반환

딕셔너리간의 비교연산이 가능하다.

## 집합(Set)

대괄호로 관리하며 배열과 구분이 되지 않기 때문에 명시적 타입 선언을 해야한다.

```swift
let set: Set<Int> = [1,1,1,2];
```

집합 자료구조이므로 산술에서 사용하는 집합간 연산을 동일하게 지원한다. (차집합 등)

:::tip copy-on-write 최적화
컬렉션을 서브스크립트 또는 Range를 통해 부분의 값을 뽑아왔을때 해당 값을 변수에 바인딩 하더라도 값의 변화가 없다면 이는 새로운 메모리를 할당받는 것이 아니라 기존 컬렉션의 메모리를 공유하며 사용한다.

스위프트 자체적으로 최적화하고 있음.
:::

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
