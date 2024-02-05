---
title: Swift - 심화 내용
tags: ['Swift', 'UIKit']
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

### 2. Comparable 프로토콜

Comparable 프로토콜은 Equatable을 상속한다. 따라서 Comparable 프로토콜을 채택한 타입에서 `==` 연산자를 구현해야 하는 경우가 발생한다. 구조체는 저장속성들이 Equatable 프로토콜을 채택하는 타입들이면 구현하지 않아줘도 된다. 클래스는 `==`, `<` 둘다 구현해야함.

Comparable 프로토콜의 요구사항은 `static func < (lhs: Self, rhs: Self) -> Bool` 메서드의 구현이다.

구조체, 클래스 모든 저장 속성이 Comparable 프로토콜을 채택한 경우에도 `<` 연산자는 구현해야한다. Equatable의 경우 구조체에서는 굳이 구현할 필요가 없었다.

열거형의 경우에는 **원시값이 없으면 연관값이 있더라도** Comparable 프로토콜을 채택하면 `<` 연산자를 자동으로 제공한다.

```swift
// Direction: Int를 통해 원시값 타입을 지정하였음
enum Direction: Int {
    case east
    case west
    case south
    case north
}

// 원시값을 지정한 순간 Comparable 채택 시 rawValue에 대한 연산자 메서드 구현해야됨
extension Direction: Comparable {   //Type 'Direction' does not conform to protocol 'Comparable'
    static func < (lhs: Direction, rhs: Direction) -> Bool {
        return lhs.rawValue < rhs.rawValue
    }
}
```

### 3. Hashable 프로토콜

스위프트 기본 타입들은 이미 `Hashable` 프로토콜을 채택하고 있다. 해셔블 프로토콜은 유일한 값을 갖도록 하여 딕셔너리 키값 또는 Set의 요소로써 사용될 수 있게 해준다.

```swift
let num1: Int = 123
let num2: Int = 456

let set: Set = [num1, num2]
```

```swift
struct Dog {
    var name: String
    var age: Int
}

extension Dog: Hashable {}

// or

extension Dog: Hashable {
    func hash(into hasher: inout Hasher) {
        hasher.combine(name)
        hasher.combine(age)
    }
}
```

구조체에 대해서는 저장속성이 `Hashable` 프로토콜을 채택한 타입들이면 `hash`함수를 구현하지 않아도 되고, 열거형은 원시값과 상관 없이 연관값의 타입들이 `Hashable` 프로토콜을 채택한 타입들이면 `hash` 함수를 구현하지 않아도 된다.

클래스는 `hash`함수를 구현해야 한다. `Hashable` 프로토콜 역시 `Equatable` 프로토콜을 채택하므로 `==`연산자 메서드까지 구현해야한다.

### 4. CaseIterable 프로토콜

`CaseIterable` 프로토콜을 채택한 **열거형의 경우** `.allCases`라는 타입속성을 갖게 된다.

```swift
enum Color: CaseIterable{
    case red, green, blue
}

print(Color.allCases) // [Color.red, Color.green, Color.blue]
```

`.allCases`속성은 전체 열거형 케이스를 담은 배열을 리턴해준다.

`CaseIterable`은 프로토콜 이름 뜻 그대로 열거형 케이스를 이터러블 한 객체로 반환해주는 속성을 제공한다.

```swift
for color in Color.allCases {
    print("\(color)")
}
```

각 케이스를 순회 가능하게 되는 것도 장점이고, 배열에 전체 케이스를 담아 넘겨주기 때문에 **배열 자체 count 속성을 통해 열거형 전체 케이스 수를 빠르게 파악할 수 있다.**

이 외에도 배열이기 때문에 사용할 수 있는 것들을 (map과 같은 고차함수 등) 열거형 케이스에 대해 사용할 수 있다.

:::warning
연관값이 있는 열거형에 대해서는 `CaseIterable` 프로토콜을 따르지 않기 때문에 구현 불가능하다. 원시값을 상관 없음

연관값은 케이스에 대해 수 많은 형태가 파생된다는 점을 생각해보면 그 이유가 납득이 된다.
:::

## Never타입과 검증함수

함수에서의 `return`이 갖는 의미는 값의 리턴과 **함수 내부로 전달했던 CPU 제어권을 반납한다는 의미가 있다.**

`Never`타입의 함수는 CPU제어권을 리턴하지 않는다. 앱이 강제종료됨

```swift
func crashAndBurn() -> Never {
    fatalError("앱의 해킹이 발견됨")
}

print("1")
crashAndBurn()
print("2")
```

`Never`타입은 내부가 빈 열거형이고 인스턴스 생성도 불가능한 임시 타입일 뿐이다.

`Never`는 런타임에서 발생할 수 있는 에러를 미리 발견하여 검증할때에 사용한다.

디버깅 함수에는 아래와 같은 것들이 있다. 이들은 앱을 일부러 종료시킨 후 버그를 발견할 때 사용한다. assert함수는 프로덕션 환경에서는 작동하지 않는다. FatalError는 프로덕션, 디벨롭 단계 모두에서 앱을 종료시킨다.

-   assert()
-   assertionFailure()
-   precondition()
-   preconditionFailure()
-   fatalError()

assert함수의 첫 번째 파라미터는 참과 거짓을 판별할 수 있는 조건이 들어가고, 두 번째 파라미터는 에러 메세지가 들어간다.

`assertionFailure`는 실패인 경우에 대해서만 처리할때 사용한다.

```swift
func enterWrongValue1() {
    let someWrongInput = -1
    assert(someWrongInput > 0, "유저가 값을 잘못 입력")
}

enterWrongValue1()
```

```swift
func enterWrongValue2() {
    let someWrongInput = -1

    if someWrongInput > 0 {
        // 정상적으로 처리하는 코드

    } else {
        // 실패 경우
        assertionFailure("유저가 값을 잘못 입력")
    }
}
```

`precondition`은 `assert`와 사용법이 완전히 동일하지만 앱이 구동되는 환경이 프로덕션일 때에만 작동한다는 점에서 차이가 있다.

## 키패스(keyPath)와 셀렉터(selector)

키패스는 인스턴스 속성 또는 메서드에 대해 직접 접근하는 것이 아닌 문자열로 접근하는 방법이다. 직접 접근이라 함은 `person.name`과 같이 인스턴스에 `.` 연산자를 통한 접근을 의미한다. `#keyPath(Person.name)`

셀렉터는 메서드가 구현된 곳의 메모리 주소를 뽑아내는 기술이다. `#selector(Person.walk)`

### 1. 키패스

키패스의 경우 자바스크립트 객체 각 키값을 순회할 때에 사용하는 방식과 유사하다. 자바스크립트에서는 `obj["Hello"]`로도 객체 밸류에 접근할 수 있다.

서브스크립트를 통한 속성 접근이 키패스를 통해 이루어지는 것이다.

클래스 내에서 뎁스가 자꾸 깊어지게 되는 다음 예시를 살펴보자.

```swift
class School {
    var name: String
    var affiliate: SmallSchool

    init(name: String, affiliate: SmallSchool) {
        self.name = name
        self.affiliate = affiliate
    }
}

class SmallSchool {
    var classMember: Person
    init(classMember: Person) {
        self.classMember = classMember
    }
}

class Person {
    var name: String
    init(name: String) {
        self.name = name
    }
}

let person1 = Person(name: "홍길동")
let smallSchool1 = SmallSchool(classMember: person1)
let school1 = School(name: "슈퍼고", affiliate: smallSchool1)

// 접근이 복잡해진다
let gildogsName = school1.affiliate.classMember.name

// 미리 경로를 지정 (keyPath)
let namePath = \School.affiliate.classMember.name

// 딕셔너리방식(서브스크립트)로 접근
school1[keyPath: namePath] // 홍길동
```

한번 키패스로 정의된 타입의 값은 `appending(path: \.경로)` 메서드를 사용할 수 있고, 경로를 추가할 수 있다.

### 2. 셀렉터

```swift
class Dog {
    var num = 1.0

    @objc var doubleNum: Double {
        get {
            return num * 2.0
        }
        set {
            num = newValue / 2.0
        }
    }

    @objc func run() {
        print("강아지가 달립니다.")
    }
}

let runSelector = #selector(Dog.run)
```

셀렉터는 오브젝티브C 기반의 기술이기 때문에 메서드에 `@objc`어트리뷰트를 붙여주어야 한다.

셀렉터는 코드로 UI를 제작할때 사용하게 되는데, 이때 UI 인스턴스의 `addTarget`메서드의 `action`에 대한 아규먼트로 특정 동작(함수)를 전달하게 된다. (자바스크립트 addEventListener라고 생각하면 될듯)

## 메타타입

인스턴스를 찍어내는 커스텀 타입은 데이터 영역에 저장되어 있다. 데이터 영역에 저장되어 있는 이들도 결국 어떠한 타입으로부터 찍어나온 인스턴스이다.

Dog타입이 있을때, 타입에 대한 타입 인스턴스는 `Dog.self`이다. 타입 인스턴스의 타입은 `Dog.Type`이다. 이를 메타타입이라고 한다. 타입의 타입이라고 이해하면 됨.

클래스, 구조체, 열거형은 `이름.Type`으로 메타타입을 사용하고 프로토콜의 경우 `프로토콜이름.protocol`로 사용한다.

## @available / #available 키워드

`@available`은 타입, 속성, 메서드 앞에 사용하고 `#available`은 if/guard/while문에서 사용한다.

```swift
@available(iOS 11.0, *)
class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

    }

    @available(iOS 11.0, *)
    func doSomething() {
        // (if, while, guard문으로도 사용 가능)
        if #available(iOS 11.0, *) {
            // iOS 11버전이상인 경우 적용 시킬 코드를 작성
        } else {
            // iOS 11버전미만인 경우 적용 시킬 코드를 작성
        }
    }
}
```

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
