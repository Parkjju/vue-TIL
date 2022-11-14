---
title: Swift - 프로토콜
---

## 프로토콜 개념

클래스 상속은 아래와 같은 단점들이 있다.

1. 다중 상속이 불가능하다
2. 상위클래스 메모리구조를 따라갈 수 밖에 없다 (불필요한 속성 및 메서드들이 상속됨)
3. 클래스에서만 상속이 가능하다

```swift
class Bird {

    var isFemale = true

    func layEgg() {
        if isFemale {
            print("새가 알을 낳는다.")
        }
    }

    func fly() {
        print("새가 하늘로 날아간다.")
    }
}


class Eagle: Bird {

    // isFamale
    // layEgg()
    // fly()

    func soar() {
        print("공중으로 치솟아 난다.")
    }
}


class Penguin: Bird {

    // isFamale
    // layEgg()

    // fly()       // 상속 구조에서는 펭귄이 어쩔 수 없이 날개됨 ⭐️

    func swim() {
        print("헤엄친다.")
    }
}

class Airplane: Bird {

    // isFamale
    // layEgg()         // 상속 구조에서는 비행기가 알을 낳게됨 ⭐️

    override func fly() {
        print("비행기가 엔진을 사용해서 날아간다")
    }
}
```

원하지 않는 메서드 상속 문제가 생각보다 크게 다가오는 경우가 많다. 프로젝트 규모가 커질 수록 상속이 필연적인데 이때 불필요 메서드 및 속성을 모두 상속 받아 오는것은 불편하다.

프로토콜은 위에 문제를 해결하여

1. 불필요 메서드를 따로 분리해내어 상속하지 않고도 사용하게 해준다.
2. 구조체에서도 상속받는 것처럼 상위 클래스의 메서드를 사용하게 해준다.

**프로토콜은 함수의 구현부를 프로토콜을 채택한 곳에서 직접 작성하도록 책임을 전가한다.**

```swift
protocol CanFly {
    func fly()
}

struct MyStruct: CanFly{
    func fly(){
        // 구현
    }
}

// 상속도 받고 프로토콜 채택도 해야한다면
// 클래스 상속 표기를 먼저 진행
class MyClass: AClass, CanFly{
    func fly(){
        // 구현
    }
}
```

`CanFly`라는 프로토콜을 채택한 곳에서는 반드시 `fly`라는 함수를 구현해야한다.

## 프로토콜 문법

```swift
protocol RemoteMouse {
    var id: String { get }

    var name: String { get set }

    static var type: String { get set }
}

struct TV: RemoteMouse{
    // let id: String = "안녕" - 이렇게 구현해도 됨
    var id: String {
        get{
            return "HI"
        }
        set {
            // 빈 상태로 놓아도 됨
        }
    }

    var name: String = "티비"

    static var type: String = "리모콘"
    // class var type: String = "??"

    // 프로토콜 함수 정의
    func random() -> Int
    static func reset()

    // 구조체에서도 채택하여 저장속성을 변경 가능하도록 하게 함
    mutating func doSomething()
}
```

프로토콜에서는 최소한의 요구사항만 정의한다. 이러한 대전제에 따라 아래의 규칙들이 생긴다.

1. `var`로 선언해야함 - 채택한 곳에서 `let`으로 재선언 가능
2. `get`, `set`키워드를 통해 읽기 쓰기 여부를 선택
3. 저장속성 및 계산속성에 대해 모두 구현 가능

채택 시 `static`선언 후 `class`로 재정의 가능

메서드 요구사항을 `mutating`키워드로 선언했을때 이를 클래스에서 채택하면 `mutating` 키워드로 메서드를 선언할 필요가 없다. 클래스는 애초에 저장속성 수정이 가능함.

```swift
// enum 채택 예시
protocol Togglable{
    mutating func toggle()
}

enum OnOffSwitch: Togglable{
    case off, on

    mutating func toggle(){
        switch self{
        case .off:
            self = .on
        case .off:
            self = .off
        }
    }
}

var s = OnOffSwitch.off
s.toggle()
s.toggle()
```

### 생성자 요구사항 정의

```swift
protocol SomeProtocol{
    init(num: Int)
}

class SomeClass: SomeProtocol{
    required init(num: Int){
        // ..
    }
}

class SomeBClass: SomeProtocol {
    init(){
        // ....
    }
    required convenience init(num: Int){
        // ...
    }
}

class SomeSubClass: SomeClass{
    required init(num: Init){
        // ....
    }
}
```

프로토콜에 정의된 생성자 요구사항은 반드시 구현되어야 함. 클래스에서 해당 프로토콜을 채택한 경우 프로토콜의 생성자를 반드시 구현해야 하기 때문에 **`required`** 키워드로 클래스에서 구현해야한다.

요구사항을 채택한 클래스에서 생성자에 대해 `final` 키워드로 구현을 하게 되면 하위 클래스에서는 구현하지 않아도 된다.

클래스에서 반드시 지정생성자로 구현할 필요는 없다. 편의생성자로 구현해도 됨. 단 편의생성자도 `required`로 구현해야함

구조체는 상속이 필요없기 때문에 `required` 키워드는 사용하지 않는다.

:::tip 생성자 상속과 요구사항 구현이 겹칠때
상위 클래스의 생성자 상속을 받아 `override`로 구현을 하고, 프로토콜 요구사항 구현을 위해 `required`로 선언을 한다. `required override init()`
:::

실패가능 생성자의 경우 범위가 더 넓어지게 구현하면 안됨.

1. init?() -> init() 가능
2. init() -> init?() 불가능

### 서브스크립트 요구사항

```swift
protocol DataList{
    subscript(idx: Int) -> Int { get }
}

struct DataStructure: DataList{
    subscript(idx: Int) -> Int {
        return 0
    }

    // subscript(idx: Int) -> Int {
    //    get{
    //        return 0
    //    }
    //    set {
    //        // set...
    //    }
    // }
}
```

:::tip 프로토콜 채택 관습
구조체 및 클래스에서 프로토콜의 채택은 **확장에서 이루어지는게 관습적이다.**

```swift
protocol Certificate{
    func doSomething()
}

class Person{

}

extension Person: Certificate{
    func doSomething()
}
```

코드 정리가 깔끔해짐
:::

## 타입으로써 프로토콜

프로토콜은 타입이다. 스위프트는 **프로토콜을 일급 객체로** 취급한다.

1. 프로토콜을 변수에 할당 가능하다
2. 함수 호출시 프로토콜을 파라미터로 전달 가능
3. 함수에서 프로토콜을 반환 가능

프로토콜을 타입으로 취급할때의 장점은 다음과 같다.

```swift
protocol Remote {
    func turnOn()
    func turnOff()
}
class TV: Remote {
    func turnOn() {
        print("TV켜기")
    }

    func turnOff() {
        print("TV끄기")
    }
}


struct SetTopBox: Remote {
    func turnOn() {
        print("셋톱박스켜기")
    }

    func turnOff() {
        print("셋톱박스끄기")
    }

    func doNetflix() {
        print("넷플릭스 하기")
    }
}

let tv = TV()
let sbox = SetTopBox()

let electronic: [Remote] = [tv, sbox]
for item in electronic {   // 켜기, 끄기 기능만 사용하니 타입캐스팅을 쓸 필요도 없음 (다만, 프로토콜에 있는 멤버만 사용가능)
    item.turnOn()
}
```

배열 타입을 프로토콜로 설정한 뒤 이를 구현한 클래스들로 이루어진 인스턴스 배열이 있다고 할때 각 원소를 순회하게 되면 프로토콜의 요구사항에 들어있는 속성 및 메서드들에만 접근 가능하게 된다. (업캐스팅)

특정 인스턴스가 프로토콜을 채택하고 있는지 `is` 연산자를 통해 확인할 수 있고 프로토콜에 대해 업캐스팅 다운캐스팅을 적용하여 메서드 및 속성 접근 범위를 줄이거나 넓힐 수도 있다.

```swift
tv is Remote
sbox is Remote

// 프로토콜 타입으로 저장된 인스턴스가 더 구체적인 타입인지 확인 가능
// Remote타입으로 저장된 인스턴스임.
// let electronic: [Remote] = [tv, sbox]
electronic[0] is TV
electronic[1] is SetTopBox

// 2) as연산자 ==============================

// 업캐스팅(as)
// 메서드 접근 범위를 프로토콜로 좁힘
let newBox = sbox as Remote
newBox.turnOn()
newBox.turnOff()

// 다운캐스팅(as?/as!)
// 메서드 접근범위 넓히기
let sbox2: SetTopBox? = electronic[1] as? SetTopBox
sbox2?.doNetflix()
```

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
