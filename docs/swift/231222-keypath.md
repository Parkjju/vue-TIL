---
title: Swift - KeyPath
---

## KeyPath 문법

스위프트에서는 키패스 문법을 제공한다. 키패스는 프로퍼티의 참조를 저장한다. 이렇게 생성된 참조를 가지고 서브스크립트를 하게 된다. 키패스는 `\타입명.속성명`으로 얻어낼 수 있다.

```swift
struct Greet {
    var say: String = "HELLO"
}

let greet1 = Greet()
let greet2 = Greet(say: "HI")

let somePath = \Greet.say

print(greet1[keyPath: somePath]) // HELLO
print(greet2[keyPath: somePath]) // HI
```

타입 추론이 가능한 경우 타입명을 생략할 수 있다.

시퀀스 타입에서 제공하는 `map` 함수의 경우 키패스를 사용하여 서브스크립트 할 수 있도록 Swift 5.2 버전 이상에서 업데이트 되었다.

```swift
struct Article {
    let title: String
    let body: String
}

let articles: [Article] = [Article(title: "title1", body: "body1"), Article(title: "title2", body: "body2"), Article(title: "title3", body: "body3")]
```

위의 `articles` 객체가 있을때 `title`값들을 추출하여 새로운 배열로 얻어내려면 아래와 같은 코드를 작성해야 했다.

```swift
let titles = articles.map { $0.title }
```

키패스를 사용하면 다음과 같이 코드를 작성할 수 있다.

```swift
let titles = articles.map(\.title)
```

Swift 5.2 버전 이하에서는 시퀀스 익스텐션에 다음과 같은 구현이 필요했다.

```swift
extension Sequence {
    func map<T>(_ keyPath: KeyPath<Element, T>) -> [T] {
        return map { $0[keyPath: keyPath] }
    }
}
```

`map`이라는 메서드는 시퀀스 객체의 요소 순회 로직을 클로저 내에서 정의하는 것인데, 키패스를 통한 서브스크립트는 속성 접근 로직 그 자체이기 때문에 클로저 내에서 호출하는 것이 아닌 map 함수 파라미터에 직접 아규먼트로 전달하게 된다.

## Reference

1. [권지수님 - 공부 그리고 기록 (Swift 키패스)](https://sweetfood-dev.github.io/swift/keypath/)
2. [Swift by Sundell - The power of key paths in Swift](https://www.swiftbysundell.com/articles/the-power-of-key-paths-in-swift/)
3. [Swift by Sundell - Passing key paths as functions](https://www.swiftbysundell.com/tips/passing-key-paths-as-functions/)
4. [Medium - woozoobro Swift에서 Key-Path 표현식 쉽게 이해하기](https://woozoobro.medium.com/swift%EC%97%90%EC%84%9C-key-path-%ED%91%9C%ED%98%84%EC%8B%9D-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-5956923a8976)
