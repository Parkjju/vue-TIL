---
title: Swift - 확장
---

## 타입의 확장

상속은 **수직 확장이고** 확장은 **수평 확장이다.** 현재 타입에 메서드를 추가하여 사용하는 것을 확장이라고 한다. **저장속성을 추가하는 것은 불가능하다.** 기존 타입에 `extension` 키워드를 추가하여 사용한다. 클래스, 구조체, 열거형 등 타입에 구애받지 않고 사용 가능하다.

```swift
// 본체
class SomeType{
    // ...
}

extension SomeType{
    // 새로운 메서드
}
```

확장을 정의하게 되면 확장 정의 이전에 생성된 인스턴스도 추가된 메서드들을 사용할 수 있다.

**부모클래스의 확장에 구현된 메서드는 자식클래스에서 재정의가 불가능하다.**

인스턴스 내에서 메서드들은 배열 형태로 저장하게 되는데 확장은 **해당 배열과 독립적으로 만들어진다.**

익스텐션 내에서 메서드 앞에 `@objc`키워드를 붙이면 오브젝티브-C 기준으로 메서드가 구현되어 하위 클래스에서 확장 메서드를 재정의 할 수 있게 된다.

새로운 생성자를 확장에 구현하는 것도 가능하다. 클래스에서는 편의생성자만 확장 가능하다.(`convenience`)

:::tip 확장의 장점

```swift
// 계산속성도 메서드이다
extension Int {
    var sqaured: Int{
        return self * self
    }
}
```

위와 같이 자체제공 API에 대해서도 확장이 가능하다. 이를 소급-모델링 (retroactive modeling)이라고 한다.
:::

## 확장가능 멤버

확장 가능한 멤버는 아래와 같다.

1. 타입 및 인스턴스의 계산속성
2. 타입 메서드 및 인스턴스 메서드
3. 새로운 생성자
4. 서브스크립트
5. 중첩타입 정의
6. 프로토콜 관련 메서드

### 1. 타입 및 인스턴스 계산속성

```swift
// 타입 자체의 계산속성
extension Double {
    static var zero: Double { return 0.0 }
}

Double.zero
```

```swift
// 생성된 인스턴스의 계산 속성
// Double형 리터럴로 접근
extension Double{
    var km: Double{
        return self * 1000.0
    }

    var m: Double{
        return self
    }
}
2.0.km // 2000미터
2.0.m // 2미터
```

### 2. 타입 및 인스턴스 메서드의 확장

메서드의 확장은 별다른 제약이 없다. 타입메서드(static 키워드 선언 메서드), 인스턴스 메서드로 모두 확장 가능하다.

```swift
// 타입메서드
extension Int {
    static func printNumbersFrom1to5() {
        for i in 1...5 {
            print(i)
        }
    }
}
Int.printNumbersFrom1To5() // 1,2,3,4,5

// 인스턴스 메서드
extension String {
    func printHelloRepetitions(of times: Int) {
        for _ in 0..<times {
            print("Hello \(self)!")
        }
    }
}
"Jun".printHelloRepetitions(of: 3)
```

:::warning 구조체 확장
구조체 및 열거형에서 저장속성의 값을 바꾸기 위해서는 `mutating` 키워드를 붙여야 한다.

```swift
extension Int {
    mutating func square() {    // 기존 메서드와 동일하게, mutating 키워드 필요
        self = self * self
    }
}

var someInt = 3
someInt.square()    // 9
```

[참고](https://parkjju.github.io/vue-TIL/swift/221108-class.html#_1-%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%89%E1%85%B3%E1%84%90%E1%85%A5%E1%86%AB%E1%84%89%E1%85%B3-%E1%84%86%E1%85%A6%E1%84%89%E1%85%A5%E1%84%83%E1%85%B3)
:::

### 3. 생성자 확장

기존 타입에서 확장할때 새로운 생성자를 만드는 것으로 확장을 하게 되면 반드시 **편의생성자로 작성해야한다.** 편의생성자는 결국 지정생성자 호출을 진행해야한다.

```swift
var color = UIColor(red: 0.3, green: 0.5, blue: 0.4, alpha: 1)

extension UIColor {      // 익스텐션 + 편의생성자 조합
    convenience init(color: CGFloat) {   // Float   / Double
        self.init(red: color/255, green: color/255, blue: color/255, alpha: 1)
    }
}
```

`color: CGFloat`를 파라미터로 받는 편의생성자를 구현하고 `UIColor`타입의 지정생성자를 호출한다.

### 4. 구조체 생성자 확장

구조체는 상속이 불가능하기 때문에 편의생성자가 존재하지 않는다.

편의생성자와 유사한 형태로 내부의 다른 지정생성자를 호출하는 형태로 작성할 수 있다.

```swift
struct Point {
    var x = 0.0, y = 0.0

    init(x: Double, y: Double){
        self.x = x
        self.y = y
    }
}
extension Point{
    // 편의생성자와 유사한 형태의 생성자
    init(){
        self.init(x: 0.0, y: 0.0)
    }
}
```

아래 코드는 Point 구조체에 생성자를 하나도 구현하지 않고 확장을 통해 생성자를 만드는 예시이다. 구조체 확장에서 `init()`으로 파라미터를 하나도 받지 않는 생성자를 작성하게 되면 구조체에서 지원되지 않는 함수 오버라이딩으로 인해 오류가 발생한다.

따라서 확장 생성자에 파라미터를 하나 이상 받는 생성자를 따로 호출해야 한다.

구조체의 확장에서도 역시나 본체의 지정 생성자를 다시 호출하는 방식으로 작성해야한다.

```swift
struct Point {
    var x = 0.0, y = 0.0
}
extension Point{
    // 편의생성자와 유사한 형태의 생성자
    init(num: Double){
        // 본체에 해당 타입으로 생성자 구현이 안되어있음
        // 멤버와이즈 생성자가 호출
        self.init(x: num, y: num)

        // self.init() -> ERROR
        // -> 아무 생성자가 본체에 정의되지 않았기때문에
        // -> 기본 생성자가 제공되고 있음
    }
}
```

:::warning 구조체 생성자 확장 예외

1. 구조체 본체의 저장속성 모두가 기본값을 가지고
2. 지정생성자가 정의되지 않았을때 (기본생성자와 멤버와이즈 생성자만 자동 제공)

확장에서 본체의 지정생성자를 호출하지 않아도 된다.

이때 해당 구조체로부터의 인스턴스 생성자는 기본생성자와 멤버와이즈 생성자 모두를 호출할 수도 있다.

확장이 아닌 본체에 생성자를 구현하면 기본생성자와 멤버와이즈 생성자는 자동 제공되지 않는다.
:::

### 5. 중첩 타입의 확장

먼저 중첩 타입의 예시를 알아보자.

```swift
class Day{
    enum Weekday{
        case mon
        case tue
        case wed
    }

    var day: Weekday = .mon
}

var myDay: Day.Weekday = Day.Weekday.mon
```

```swift
// Int 타입 확장
extension Int {

    enum Kind {       // 음수인지, 0인지, 양수인지
        case negative, zero, positive
    }

    var kind: Kind {    // 계산 속성으로 구현
        switch self {
        case 0:                   // 0인 경우
            return Kind.zero
        case let x where x > 0:   // 0보다 큰경우
            return Kind.positive
        default:                  // 나머지 (0보다 작은 경우)
            return Kind.negative
        }
    }
}
let d: Int.Kind = Int.Kind.negative

let b = 0
b.kind // zero
```

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
