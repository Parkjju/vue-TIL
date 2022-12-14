---
title: Swift - 심화 내용
---

## 주요 프로토콜 소개

### 1. Equatable 프로토콜

구조체, 열거형의 경우 `Equatable` 프로토콜 채택 시 모든 저장 속성이 `Equatable`을 채택한 타입이라면 비교연산자 메서드가 자동으로 구현된다. 스위프트 기본 타입들은 모두 `Equatable` 프로토콜을 채택하고 있다.

단, 열거형은 연관값이 없을때 `Equatable` 프로토콜을 채택하지 않더라도 비교연산이 서로 가능하다.

```swift
enum Direction {
    case east
    case west
    case south
    case north
}

Direction.north == Direction.east // 에러 안남.
```

```swift
// 원래라면 아래와 같이 작성해야 하지만
// 굳이 그럴 필요가 없도록 애플 자체적으로 조치해놓았음
enum Direction: Equatable {
    case east
    case west
    case south
    case north

    static func == (lhs: Direction, rhs: Direction){
        //....
    }
}

Direction.north == Direction.east
```

열거형 뿐만 아니라 구조체도 유사하게 동작한다.

```swift
struct Dog {
    var name: String
    var age: Int
}

extension Dog: Equatable {}
// Equatable을 채택한 이상 굳이 연산자 메서드를 구현할 필요 없음
```

:::warning 클래스와 Equatable

클래스는 비교연산 시 `===` 연산자를 사용한다. 원칙적으로 동일성 구현이 안되기 때문에 `Equatable` 프로토콜을 채택하더라도 내부 동작을 구현해야한다. (같다고 결론내리는 기준을 구현하면 된다는 것!)

:::

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
