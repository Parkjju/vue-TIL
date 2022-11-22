---
title: Swift - 제네릭
---

## 제네릭 필요성

제네릭이 없다면 함수의 타입마다 (Double, Int, String..) 새로 정의해야하므로 유지 보수에 어려움이 생긴다.

```swift
// 타입 케이스별 새로운 함수의 작성이 불편한 상황
func printIntArray(array: [Int]) {
    for number in array {
        print(number)
    }
}

func printDoubleArray(array: [Double]) {
    for number in array {
        print(number)
    }
}

func printStringArray(array: [String]) {
    for number in array {
        print(number)
    }
}

// 제네릭을 통해 하나의 함수로 통일이 가능하다.
func printArray<T>(array: [T]){
    for data in array {
        print(data)
    }
}

printArray([1,2,3])
```

제네릭의 `<T>`를 타입 파라미터라고 부른다. 플레이스 홀더의 역할을 갖는다.

## 제네릭 정의 - 구조체/클래스

```swift
// 기존 방식
struct Member {
    var members: [String] = []
}

// 제네릭을 활용하여 확장성이 있는 구조체 설계
struct Member<T> {
    var members: [T] = []
}

Member(members: [1,2,3]) // [Int]
Member(members: ["A","B","C"]) // [String]
```

클래스, 열거형도 위의 예시와 동일하게 클래스명/열거형 옆에 타입 파라미터를 꺾쇠 안에 넣어 작성해주면 된다. 특별히 열거형은 연관값 확장 사용을 위해 제네릭을 사용한다.

```swift
enum Pet<T>{
    case dog
    case cat
    case etc<T>
}

// 열거형 제네릭
let animal1 = Pet.etc("연관값")
let animal2 = Pet.etc(123)
```

:::tip 제네릭 구조체 확장
구조체 확장시 제네릭으로 함수를 새로 작성할 수 있따.

```swift
struct Coordinates<T> {
    var x: T
    var y: T
}

extension Coordinates {     // Coordinates<T> (X)
    func getPlace() -> (T, T) {
        return (x, y)
    }
}

extension Coordinates where T == Int {
    // ...
}
```

구조체 확장 시 확장에는 타입 파라미터 표기를 하지 않는다. `where`절을 통해 타입 분기처리가 가능하다.

:::

:::tip 타입 제약
제네릭에서 타입 제약을 하는 방법으로 특정 프로토콜을 채택한 타입에 대해서만 타입 대체를 가능하게 하거나 특정 클래스 타입으로 한정시킬 수 있다.

```swift
func someFunction<T: SomeProtocol>(){
    // ...
}
// =====

func someFunction<T: SomeClass>(array: [T]){
    // ...
}
class SomeChildClass: SomeClass {}
let obj1 = SomeClass()
let obj2 = SomeChildClass()

someFunction(array: [obj1, obj1])
someFunction(array: [obj2, obj2])
```

:::

제네릭으로 함수 및 클래스/객체 각종 타입에 대해 작성했더라도 타입을 직접 지정하여 재정의를 하게 되면 **제네릭을 통한 새로운 확장도 그대로 가능하면서, 따로 구체적으로 명시했던 타입에 맞춰 함수가 호출되면 해당 함수가 자동으로 호출된다.**

## 프로토콜에서 제네릭 사용

프로토콜에서 제네릭 사용은 `associatedtype` 키워드를 사용한다. 이를 연관타입이라고 부른다.

```swift
protocol RemoteControl {
    associatedType T
    func changeChannel(to: T)
    func alert() -> T?
}

struct TV: RemoteControl{
    typealias T = Int // 생략 가능

    // ...
    func changeChannel(to: Int){
        // ...구현
    }
}
```

프로토콜에서 제네릭은 연관타입으로 선언하고 이를 채택하는 곳에서 `typealias`로 타입을 지정해야 한다. (생략은 가능, 프로토콜 채택한 곳에서 함수 구현할때 직접 타입 지정하면 됨)

함수 구현시 타입을 지정하면 연관타입이 자동으로 추론된다. 관습적으로 프로토콜의 연관타입은 `Element`로 많이 사용된다.

타입 제약도 동일하게 사용 가능하다.

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
