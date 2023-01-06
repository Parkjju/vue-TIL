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
    func random() -> Int{
        return 0
    }
    static func reset(){

    }

    // 구조체에서도 채택하여 저장속성을 변경 가능하도록 하게 함
    mutating func doSomething(){
        id = "안녕!!"
    }
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

구조체는 상속이라는 개념이 없기 때문에 `required` 키워드는 사용하지 않는다.

:::tip 생성자 상속과 요구사항 구현이 겹칠때
상위 클래스의 생성자 상속을 받아 `override`로 구현을 하고, 프로토콜 요구사항 구현을 위해 `required`로 선언을 한다. `required override init()`
:::

실패가능 생성자의 경우 범위가 더 넓어지게 구현하면 안됨.

1. init?() -> init() 가능

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

## 프로토콜의 상속

프로토콜의 상속은 여러가지 요구사항의 나열일 뿐이다.

```swift
protocol Remote {
    func turnOn()
    func turnOff()
}


protocol AirConRemote {
    func Up()
    func Down()
}


protocol SuperRemoteProtocol: Remote, AirConRemote {   // 프로토콜 다중채택
    // func turnOn()
    // func turnOff()
    // func Up()
    // func Down()

    func doSomething()
}
```

실제 프로토콜 상속 내용까지 구현할 경우는 거의 없지만 애플이 만들어놓은 체계 내에 사용되는 경우가 있음.

:::tip AnyObject
AnyObject는 클래스 전용 프로토콜이다. 따라서 구조체에서는 해당 프로토콜을 채택할 수 없다.

AnyObject는 프로토콜이지만 프로토콜은 타입으로 사용할 수 있기 때문에 인스턴스 타입에 상관 없이 담을 수 있었다.
:::

:::tip 프로토콜 합성
일반적인 프로토콜 다중채택의 형태는 아래와 같다.

```swift
protocol Named {
    var name: String { get }
}

protocol Aged {
    var age: Int { get }
}

struct Person: Named, Aged {
    var name: String
    var age: Int
}
```

둘을 다중채택하는 새로운 프로토콜을 작성한다거나 구조체 및 클래스를 정의할 필요 없이 임시적인 타입으로 활용할 수도 있다.

```swift
// Named & Aged로 프로토콜 합성
func greet(_ person: Named & Aged){
    print("HI \(person.name), \(person.age)")
}

let me = Person(name: "Jun", age: 25)
greet(me)

// Named & Aged로 프로토콜 합성
let you: Named & Aged = me
```

두 프로토콜을 `&`연산자로 묶어 프로토콜 합성이라는 문법을 사용할 수 있다.
:::

## 프로토콜 선택적 요구사항 구현

:::tip 어트리뷰트 키워드

1. 선언에 대한 추가정보를 제공하는 키워드
2. 타입에 대한 추가정보를 제공하는 키워드

```swift
@Attr
@Attr(args)

// 선언에 추가정보 제공
@available(iOS 10.0, macOS 10.12 *)
class SomeType{
    // 해당 클래스는 iOS버전 이상에서만....
    // macOS버전 10.12이상에서만...
}

// 타입에 추가정보 제공
func doSomething(completion: @escaping() -> ()){
    // ...
}
```

:::

선택적인 멤버를 선언하기 위한 키워드는 `@objc`를 붙여 프로토콜을 선언한다. 이후 선택적 속성 및 메서드는 `@objc optional 속성 또는 메서드`으로 선언한다.

```swift
@objc protocol Remote {
    @objc optional var isOn: Bool { get set }
    func turnOn()
    func turnOff()
    @objc optional func doNetflix()
}

class TV: Remote{
    // 선택적 멤버로 선언되었기 때문에 구현해도, 안해도 됨
    var isOn = false

    // 선택적 구현이 아니기 때문에 필수 구현
    func turnOn(){
        // ..
    }
    func turnOff(){
        // ..
    }
    // func doNetflix(){} - 구현해도되고 안해도됨
}
```

선택적 멤버 구현은 오브젝티브C에서 **클래스 전용 프로토콜이기 때문에** 구조체 및 열거형에서는 사용 불가능하다.

## 프로토콜 확장

프로토콜을 채택하여 구현하는 입장에서 동일한 구현 내용을 다시 재사용하는 것이 불편하다. 이때 프로토콜은 기본 구현을 제공한다.

```swift
protocol Remote {
    func turnOn()
    func turnOff()
}

extension Remote {                         // (요구사항의 메서드 우선순위 적용 - 프로토콜 메서드 테이블 만듦)
    func turnOn() { print("리모콘 켜기") }    // 1. (채택)구현시 해당 메서드 2. 기본 메서드
    func turnOff() { print("리모콘 끄기") }   // 1. (채택)구현시 해당 메서드 2. 기본 메서드

    func doAnotherAction() {               // (요구사항 메서드 X - 테이블 만들지 않음)
        print("Remote Type")            // 타입에 따른 선택 (Direct Dispatch)
    }
}

class TV: Remote{
    // 요구사항을 구현하지 않아도 기본 구현 내용을 그대로 사용함
    // func turnOn(){ print(...) }
    // func turnOff(){ print(...) }
    func doAnotherAction(){
        print("TV Type")
    }
}
```

프로토콜 메서드 구현 시 우선순위가 적용된다.

1. 프로토콜을 채택하여 구현한 메서드가 우선적으로 적용된다.
2. 프로토콜 채택 후에 구현하지 않은 메서드는 프로토콜 확장의 기본 메서드를 가져와서 사용한다.
3. 요구사항 목록에 없지만 확장에만 추가된 내용에 대해서는 **타입 선언에 맞춰 사용된다.**

```swift
var tv: TV = TV()
tv.doAnotherAction() // TV Type

var tv2: Remote = TV()
tv2.doAnotherAction() // Remote Type
```

**프로토콜 타입으로 선언된 변수는** 구현된 함수에 대하여 해당 함수를 호출하지만 프로토콜 요구사항에 없는 함수는 클래스에 함수가 구현 되어있더라도 프로토콜 확장 내에 구현된 기본 함수를 가져다가 사용한다. 반대로 프로토콜을 채택한 클래스로 선언된 변수는 구현된 함수 호출과 더불어 클래스 내부 메서드들을 그대로 호출하게 된다.

:::tip 테이블
클래스는 생성과 함께 메서드 묶음이 테이블 형태로 만들어지는데, 이때 테이블을 `Virtual Table`이라고 한다.

`Virtual Table`과 유사한 형태로 프로토콜에서도 생성시 메서드 묶음을 `Witness Table`이라고 한다. 프로토콜 채택시 `Witness Table`상에 등록된 메서드들은 사용자가 커스텀 타입에 채택하여 구현하였으면 해당 구현 내용들을 사용하고 프로토콜 채택 후 따로 구현하지 않았으면 프로토콜 `Witness Table`의 구현 내용을 사용하게 된다.

채택 여부에 따른 경우의 수를 정리하면 다음과 같다.

1. 클래스가 프로토콜을 채택하여 프로토콜 메서드를 전부 구현하는 경우 - 프로토콜 확장 메서드를 호출하더라도 클래스 구현 메서드가 사용됨
2. 클래스가 프로토콜 채택을 했지만 Witness Table에 등록된 메서드 목록 이외에 프로토콜 확장에 추가 구현된 함수가 있을때 - 타입 캐스팅에 따라 다이렉트 디스패치로 프로토콜 확장 메서드를 호출할지, 인스턴스 내부 메서드를 호출할지 달라짐.

```swift
protocol Remote {
    func turnOn()
    func turnOff()
}

extension Remote {                         // (요구사항의 메서드 우선순위 적용 - 프로토콜 메서드 테이블 만듦)
    func turnOn() { print("리모콘 켜기") }    // 1. (채택)구현시 해당 메서드 2. 기본 메서드
    func turnOff() { print("리모콘 끄기") }   // 1. (채택)구현시 해당 메서드 2. 기본 메서드

    func doAnotherAction() {               // (요구사항 메서드 X - 테이블 만들지 않음)
        print("Remote Type")            // 타입에 따른 선택 (Direct Dispatch)
    }
}

class Ipad: Remote {
    func turnOn() { print("아이패드 켜기") }
    // Remote 프로토콜을 채택했지만 turnOff 메서드는 구현을 하지 않음
    // 따라서 WitnessTable의 turnOff 기본 구현이 사용된다.
    // func turnOff() {}
    func doAnotherAction() { print("아이패드 다른 동작") }
}

let ipad: Ipad = Ipad()
ipad.turnOn()           // 클래스 - V테이블
// Remote의 Witness Table - turnOff가 실행됨
// witness table상의 turnOff 함수이더라도 클래스로 코드영역의 메서드 주소를 가져온 뒤 V-Table에 등록한다.
ipad.turnOff()          // 클래스 - V테이블
ipad.doAnotherAction()  // 클래스 - V테이블

let ipad2: Remote = Ipad()
ipad2.turnOn()           // 프로토콜 - W테이블
ipad2.turnOff()          // 프로토콜 - W테이블
// doAnotherAction은 Ipad 클래스에 구현되어 있지만
// 타입 지정을 Remote 프로토콜로 했음
// 따라서 Remote 프로토콜의 doAnotherAction이 실행된다
// 이는 프로토콜 확장으로 doAnotherAction이 구현되어 있기 때문이다.

ipad2.doAnotherAction()  // 프로토콜 - Direct (직접 메서드 주소 삽입)
```

위의 예시는 클래스이고, 프로토콜을 채택한 구조체에서 어떻게 동작하는 지에 대한 예시는 조금 다르다. 아래 코드를 보자.

```swift
struct SmartPhone: Remote {
    func turnOn() { print("스마트폰 켜기") }

    func doAnotherAction() { print("스마트폰 다른 동작") }
}

var iphone: SmartPhone = SmartPhone()
iphone.turnOn()             // 구조체 - Direct (직접 메서드 주소 삽입)
iphone.turnOff()            // 구조체 - Direct (직접 메서드 주소 삽입)
iphone.doAnotherAction()    // 구조체 - Direct (직접 메서드 주소 삽입)
```

**구조체는 Virtual Table같은 개념이 존재하지 않는다.** 구조체 인스턴스가 스택에 쌓인 뒤 메서드 호출이 이루어지면 **다이렉트 디스패치 형태로 코드 영역의 함수 코드들을 직접적으로 참조하게 된다.**

타입 인식을 본래 타입이 아닌 채택 프로토콜로 타입을 인식하게 되면 어떻게 될까? 기본적으로 `Remote`라는 프로토콜은 확장 내에서 기본 함수가 구현되어 있고 이들은 `Witness Table`상에 등록되어 있다.

```swift
var iphone2: Remote = SmartPhone()
iphone.turnOn() // Witness Table 메서드 호출
iphone.turnOff() // Witness Table 메서드 호출
iphone.doAnotherAction() // Direct Dispatch로 Witness Table 메서드 호출
```

프로토콜 채택 후 프로토콜의 메서드들을 구현하게 되면 **Witness Table**상에 추가적으로 함수 구현 내용들을 올려놓는다. iphone2 인스턴스의 doAnotherAction은

Witness Table에 등록되는 대상은 **프로토콜 내에 선언된 대상들이며,** 확장에 추가 구현된 메서드는 **변수 타입 선언에 따라 다이렉트 디스패치 될지 인스턴스 메서드를 호출할지 선택하게 된다.**

:::

## 프로토콜 지향 프로그래밍

스위프트는 객체지향 프로그래밍, 프로토콜 지향 프로그래밍, 함수형 프로그래밍 모두를 채택한 언어이다.

객체지향 프로그래밍에서 클래스 상속의 단점은 아래와 같다.

1. 다중 상속이 불가능하다
2. 클래스에서만 사용 가능하다
3. 상위클래스 메모리 구조를 반드시 따라야 한다. (불필요 메서드 상속, 불필요 저장속성의 상속)

프로토콜 기반 프로그래밍을 지향함으로써 발생하는 장점들은 아래와 같다.

1. 다중상속과 유사하게 여러 프로토콜을 채택 가능하다
2. 선택적 구현 가능
3. 타입으로써 사용 가능하다
4. 기본기능 제공, 기능 커스터마이징 등이 가능 (확장성 up)
5. 애플이 제공하는 기능에 대해 소급적 적용 가능 (프로토콜 확장)

## 프로토콜 확장 제한

```swift
protocol Bluetooth {
    func blueOn()
    func blueOff()
}

extension Bluetooth where Self: Remote {   // 본 확장의 적용을 제한시키는 것 가능 (구체적 구현의 적용범위를 제한)
    func blueOn() { print("블루투스 켜기") }
    func blueOff() { print("블루투스 끄기") }
}

class SmartPhone: Remote, Bluetooth{
    // ...
}

class Ipad: Bluetooth{
    // ...
}
```

위 코드를 보면 `Bluetooth` 프로토콜은 확장으로 `blueOn`과 `blueOff` 메서드 둘을 구현하였다. 이때 `where`절을 통해 채택한 타입을 제한하고 있음을 알 수 있다.

`self`는 인스턴스 내에서 자기 자신을 나타낼 때 사용하는 키워드이고 `Self`는 타입 자기 자신을 나타낸다.

위의 `where Self: Remote`는 결국 타입 자기 자신이 `Remote`라는 프로토콜을 채택하고 있는지를 묻는 구문인 것이다.

`SmartPhone` 클래스는 `Remote` 프로토콜을 채택하고 있으므로 `Bluetooth` 프로토콜 확장을 사용할 수 있고 `Ipad` 프로토콜은 `Remote` 프로토콜을 채택하지 않고 있기 때문에 `blueOn`, `blueOff` 메서드를 사용할 수 없다.

:::tip self vs Self
self 사용처는 다음과 같다.

1. 인스턴스 자기 자신을 가리킬때 사용 (생성자에서 self.props = 파라미터 형태로 활용)
2. 참조 타입이 아닌 값 타입(구조체, 열거형)에서 자기 자신의 객체 인스턴스를 다른 객체로 치환할때
3. 타입 멤버에서는 인스턴스가 아닌 타입 자체를 가리킨다.
4. 외부에서 타입 인스턴스를 참조하는 경우에 사용 (힙에 생성되는 클래스의 인스턴스가 아닌 클래스 자체에 기본적으로 `static`으로 선언되어 사용되는 인스턴스를 타입 인스턴스라고 함)

```swift
// self 2번 예시
struct Calculator{
    var number: Int = 0

    mutating func reset(){
        self = Calculator()
        // 새로운 Calculator 인스턴스를 생성하여
        // self 인스턴스에 할당
    }
}
```

**위의 패턴은 클래스에서는 사용 불가능한 패턴이다.**

```swift
// 3번 예시
struct SomeStruct{
    static let club = "웹개발 부서"

    // 타입 멤버 club을 가리키기 위함
    static func doSomething(){
        print("\(self.club)")
    }

    // func doSomething(){
    //      print("\(self.club)")
    // }
    // -> SomeStruct의 인스턴스 속성 중에는 club 속성이 없으므로 에러
    // 따라서 기본 메서드에서는 SomeStruct.club으로 접근해야함.
}
```

```swift
// 4번 예시
class SomeClass {
    static let name = "SomeClass"
}

// SomeClass.Type => 메타타입이라는 새로운 개념 등장
let myClass: SomeClass.Type = SomeClass.self

Someclass.name
SomeClass.self.name // SomeClass.name과 동일한 코드이다.
```

self가 아닌 `Self`의 사용처는 다음과 같다.

1. 타입 선언 위치에서 사용한다.
2. 타입 속성 및 타입 메서드에서 타입을 지칭할때 사용
3. 프로토콜에서의 Self 사용 - 프로토콜은 타입 상관없이 채택 가능하다는 점에서 착안

```swift
extension Int{
    static let zero: Self = 0
    // static let zero: Int = 0

    var zero: Self{
        return 0
    }

    // 현재 toZero 메서드가 선언될때 Self가 Int타입이라는 것을
    // 명확하게 인지 가능하기 때문에 사용 가능하다.
    static func toZero() -> Self{
        return Self.zero
    }
}
```

```swift
// 프로토콜의 확장
// 이때 Self는 프로토콜을 채택한 타입 자체를 가리키게 된다.
// 확장성 있는 설계 가능
extension BinaryInteger{
    func squared() -> Self {
        return self * self
    }
}
```

:::

:::tip 메서드 디스패치

스위프트가 함수를 실행시키는 방법에는 세 가지가 있다.

1. Direct dispatch(컴파일 타임)
    - 메서드 메모리 주소를(코드 영역의 함수가 실행되는 주소) 코드에 삽입 / 함수 내부코드 자체를 호출 위치에 인라인 형식으로 심어버림.
    - 가장 빠르다
    - 참조타입이 아닌 구조체 및 열거형과 같은 밸류타입에서 사용됨
    - 밸류타입에서 사용되기 때문에 상속 및 다형성의 장점을 누릴 수 없다
2. Table Dispatch (런타임 - 동적), 동적 디스패치, Dynamic 디스패치
    - 함수 포인터(함수의 메모리 주소)를 배열 형태로 보관 뒤 실행
    - 클래스 / 프로토콜에서 사용
    - `Virtual Table`, `Witness Table`
    - 중간정도의 속도
3. Message Dispatch (런타임 - 동적) - 상속구조 전체를 훑어 실행 메서드가 없으면 상위 메서드로 올라가 다시 찾는 형태로 실행 - 가장 느림 - 주로 오브젝티브-C 클래스 사용

:::

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
