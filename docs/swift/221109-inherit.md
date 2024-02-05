---
title: Swift - 클래스 상속
tags: ['Swift', 'UIKit']
---

## 개념

클래스 상속이란 본질적으로 성격이 비슷한 타입을 새로 만들어 **데이터(저장속성)를 추가**하거나 **메서드를 변형시켜 사용**하려는 것

상속은 단방향이고 여러 클래스로부터 동시에 다중상속을 받을 수는 없다. 구조체는 상속 불가능함. (상속은 클래스만 가능)

```swift
class Parent{
    var property = 10000
}

// Child 이후로 더 이상 상속할 수 없음
final class Child: Parent{
    var money = 100
}

let me = Child()
```

class선언 시 final키워드를 추가하면 더 이상 상속할 수 없는 것을 의미한다.

`final`키워드는 멤버 앞에도 사용 가능하며 상속 시 재정의가 불가능함을 나타낸다.

재정의는 상위 클래스에 존재하는 멤버를 변형하는 것을 의미한다. 재정의 하고자 하는 멤버에는 `override` 키워드를 붙인다.

상속시 자식 클래스는 저장 속성들이 한 곳에 묶인 부모 클래스의 주소만 가지기 때문에 자식 클래스가 저장속성에 대한 재정의가 불가능하다. 메모리구조 자체를 변경할 수가 없기 때문이다. (주교재 430p 사진 참조)

반면 메서드는 클래스 선언시에도 메모리 자체적으로 불변의 구조를 갖는다기 보다 함수 코드가 묶이는 코드 영역의 메모리 주소를 갖기 때문에 상속시에도 자식클래스로 해당 메서드의 주소만 떠넘기는 것이다.

각 메서드는 클래스마다 배열형태로 저장된다. 클래스를 상속받을때마다 새로운 배열로 저장이 된다. 각 배열 요소는 코드 영역의 메모리 주소를 참조한다. 재정의가 일어나면 참조하는 코드 영역의 주소가 바뀔 뿐이다.

## 재정의

저장 속성은 재정의가 절대 불가능하다. 다른 속성(계산속성, 타입속성 등)들은 재정의 가능하다. 메서드는 언제든지 재정의 가능

부모클래스로부터 상속받는 자식클래스가 부모클래스의 메서드와 동일한 이름의 메서드를 재정의하고자 할 때 `override`키워드를 사용하여 함수를 작성하는 것이다.

```swift
class Parent{
    func doSomething(){
        // do something....
        print("PARENT!")
    }
}

class Child: Parent{
    override func doSomething(){
        // do something..
        // with extra stuff..
        super.doSomething() // PARENT!
        print("CHILD!")
    }
}

var me = Child()
me.doSomething() // PARENT!, CHILD!
```

### 속성 재정의 딥 다이브

```swift
class Superclass{
    var value = 0

    func doSomething(){
        print("SUPER")
    }
}

class Subclass: Superclass{
    override var value: Int{
        get{
            return nil
        }
        set{
            super.value = newValue
        }
    }

    override func doSomething(){
        print("SUB!")
    }
}
```

부모클래스의 저장속성은 재정의가 불가능하지만 자식클래스 내에서 **계산속성 형태로(메서드 형태) 재정의는 가능하다.**

객체 인스턴스는 **힙 메모리상에 저장되고** 각각의 저장 속성들이 참조 형식이 아닌 데이터를 할당받아 메모리를 차지하는데, 이를 **데이터 영역의 클래스가 메모리 구조 변화를 위해 오버라이딩 한다는 것은 비정상적인 동작이다.** 따라서 자식클래스가 저장속성을 오버라이딩 하는 것은 잘못된 것이다.

리액트 useState훅을 생각하면 편하다. 원본값의 immutable을 유지하려고 노력하면 됨. 값을 변경하고 싶으면 값만 복사해서 계산 후 리턴하는 함수형으로 작성하자

계산속성 형태로 재정의하는 것도 가능하고 속성 감시자도 추가 가능. 원본을 참조하여 메모리 구조를 바꾸지 않기 때문이다.

메서드 재정의시에는 **기능 확장으로의 재정의만 가능하다.** 읽기 전용의 계산속성을 읽기-쓰기 속성으로 재정의 가능하지만, 읽기-쓰기가 가능한 계산속성을 읽기만 가능한 계산속성으로 재정의 불가능하다.

:::tip 계산속성 재정의
클래스 하나 내에서는 계산속성에 대해 속성감시자 추가가 불필요했고 되지도 않는다. set블록 자체적으로 속성감시자 로직을 구현하면 되기 때문이다.

하지만 부모클래스로부터 계산속성을 상속받은 자식클래스는 속성감시자를 해당 계산 속성에 대해 추가할 수 있다.

```swift
class Vehicle {
    var currentSpeed = 0.0

    var halfSpeed: Double {
        get {
            return currentSpeed / 2
        }
        set {
            currentSpeed = newValue * 2
        }
    }
}
class Bicycle: Vehicle {
    // 저장 속성 추가는 당연히 가능
    var hasBasket = false

    override var halfSpeed: Double {
        willSet {
            print("값이 \(halfSpeed)에서 \(newValue)로 변경 예정")
        }
        didSet {
            print("값이 \(oldValue)에서 \(halfSpeed)로 변경됨!")
        }
    }
}

let b = Bicycle()
b.halfSpeed = 5
// 값이 0에서 5로 변경 예정
// 값이 0에서 5로 변경됨!
```

부모클래스의 `halfSpeed`라는 계산속성이 `Bicycle` 자식클래스 객체 생성과 함께 부모클래스의 저장속성들을 참조하여 값이 할당된다. currentSpeed할당과 함께 부모클래스 계산속성의 setter가 호출되고 `halfSpeed`는 0.0으로 초기화가 된다.

Bicycle 객체 생성 이후 이 객체의 `halfSpeed`에 접근 및 값의 변화를 주면 재정의한 속성감시자가 호출되는 형태이기 때문에 자식클래스에서는 상속받은 계산속성에 대해 속성감시자 추가가 가능한 것이다.

사실 이마저도 부모클래스의 setter에서 구현 가능한 부분이 있다.
:::

## 초기화의 과정과 생성자

초기화는 클래스, 구조체, 열거형의 인스턴스를 생성하는 과정이다. 인스턴스를 생성한다는 것은 각 저장 속성에 대해 초기값을 설정하여 인스턴스를 사용 가능한 상태로 만든다는 것이다.

저장속성에 디폴트값을 주면 기본생성자 `init()`이 자동으로 구현되어 제공된다. 생성자도 오버로딩을 지원한다. 여러 형태로 인스턴스를 찍어낼 수 있음.

모든 저장속성의 타입을 `var 옵셔널타입`으로 선언해도 기본생성자가 제공됨.(`nil`로 초기화되기 때문)

구조체는 멤버와이즈(memberwise) 이니셜라이저가 기본제공된다. 모든 멤버에 대한 생성자가 제공된다. (멤버가 세개일때 세 멤버에 대한 생성자)

멤버와이즈 생성자는 모든 멤버에 대해 디폴트값이 있어도 제공한다. 특정 몇개의 멤버만 없으면 해당 멤버들을 초기화하는 생성자를 추가적으로 제공한다. (저장속성이 3개라면 3개 모두 초기화하는 생성자 + 디폴트값이 없는 저장속성 몇개에 대한 생성자)

멤버와이즈 이니셜라이저는 직접 구현하지 않아도 자동으로 컴파일러가 제공해주는 저장 속성을 설정 가능한 생성자이다.

## 생성자 딥 다이브

### 1. 지정생성자 (구조체)

구조체 내에서는 다른 생성자를 호출하는 방식이 가능하다. **지정 생성자는 모든 저장속성을 초기화해야한다.**

```swift
struct Color1 {
    let red, green, blue: Double

    init() {
        self.init(red: 0.0, green: 0.0, blue: 0.0)
    }

    init(white: Double) {
        self.init(red: white, green: white, blue: white)
    }

    init(red: Double, green: Double, blue: Double) {
        self.red   = red
        self.green = green
        self.blue  = blue
    }
}
```

### 2. 편의 생성자 (클래스)

클래스 및 구조체에서 `init`키워드로 생성되는 일반 생성자들을 지정 생성자라고 한다.

이때 오버로딩된 생성자가 내부에서 다른 생성자를 호출하는 형태를 가질때 해당 생성자를 **편의생성자라고 한다.** 구조체도 사실은 위의 예시에서 편의생성자 형태를 갖지만 특별히 편의 생성자라는 개념이 적용되지는 않는다.

클래스에서 편의생성자를 정의하는 방법은 생성자 앞에 지정생성자 앞에 `convenience` 키워드를 붙이면 된다.

매번 생성자 오버로딩으로 저장속성을 각각 초기화하는 코드를 줄줄이 작성하는 것은 불편하므로 내부 지정생성자를 호출하는 것이다.

```swift
class Dog{
    var name: String
    var weight: Double

    init(name: String, weight: Double){
        self.name = name
        self.weight = weight
    }

    convenience init(name: String){
        self.init(name: name, weight: 10.0)
    }

    // 아예 디폴트값처럼 활용할 수도 있음
    convenience init(){
        self.init(name: "강아지", weight: 10.0)
    }

//    init(name: String){
//        self.name = name
//        self.weight = 10.0
//    }
}
```

상속 시 생성자 재정의 문제로 인해 생성자를 매번 오버로딩 하게 되면 불편함이 생긴다. 이때 편의생성자를 사용하는 것이다.

상속 시에는 부모클래스의 지정 생성자를 호출해야한다.

```swift
class Parent {
    var x: Int
    var y: Int

    init(x: Int, y: Int){
        self.x = x
        self.y = y
    }

    convenience init(){
        self.init(x:0, y:0)
    }
}

class Child{
    var z: Int

    init(x: Int, y: Int, z: Int){
        self.z = z

        // 부모클래스 지정생성자 호출
        super.init(x: x, y: y)
    }

    convenience init(z: Int){
        self.init(x: 0, y: 0, z: z)
    }

    convenience init(){
        self.init(z: 0)
    }
}
```

자식클래스 기준으로 지정생성자를 구현할때 먼저 부모클래스에서는 없던 저장속성이 추가된 부분에 대해 초기화를 **먼저** 진행해준 뒤 부모클래스의 지정생성자를 호출하여 나머지 부모클래스로부터 상속된 저장속성들을 부모클래스의 지정생성자로 초기화한다.

**편의생성자는 상속되지 않는다.**

:::tip 생성자 위임
상속관계에서 생성자 위임에는 두 가지 규칙이 있다.

1. 델리게이트 업(Delegate up)
2. 델리게이트 어크로스(Delegate across)

델리게이트업은 서브클래스의 지정생성자가 반드시 슈퍼클래스의 지정생성자를 호출해야 한다는 것이다.

델리게이트 어크로스는 동일 클래스 내에서 다른 편의생성자 또는 지정생성자를 호출해야한다는 것이고, 최종 목적지는 동일클래스 내의 지정생성자이다.

델리게이트 업에서 서브클래스의 생성자가 먼저 호출되어 자신의 저장속성들을 모두 초기화하여 힙 메모리에 저장하고, 슈퍼클래스의 생성자를 호출하여 이들을 힙 메모리에 저장한다. (메모리 그림 443p부터 참조)

최종 지정 생성자까지 호출되어 객체가 생성되면 해당 힙 메모리 주소가 스택 내의 변수에 전달되어 저장된다. (객체를 저장하는 변수)

델리게이트 업으로 상속하는 부모클래스로의 저장속성까지 모두 초기화 된 이후에는 커스텀 설정이 가능하다. (저장속성 값 커스터마이징)
:::

클래스 인스턴스의 생성은 동적할당 방식으로 이루어진다. (힙 메모리 전체 공간을 뒤진 후 빈 공간에 자동으로 삽입하는 방식)

## 생성자 상속/재정의

상속과 관련된 생성자 정의에 있어서 대원칙은 **생성자는 상속되지 않으며, 재정의가 원칙이다** 라는 것이다.

생성자 상속시에 고려할 규칙은 아래와 같다.

1. 상위클래스의 지정 생성자를 상속하여,
    1. 하위클래스에서 지정 생성자로 구현(재정의 - override 키워드 필요)
    2. 하위 클래스에서 편의 생성자로 구현 (재정의 - override 키워드 필요),
    3. 구현하지 않아도 됨
2. 상위클래스의 편의 생성자는 상속을 하지 않는게 원칙
    1. 동일한 이름의 하위클래스 편의생성자는 이름만 동일한 것이지, 상위클래스의 편의생성자와 연관이 있지는 않다.

현 위치 클래스 기준으로 생성자를 구현할때는

1. 자신의 저장속성 모두를 초기화한다.
2. 부모클래스의 지정생성자를 호출한다. (부모클래스의 저장속성을 모두 초기화한다.)
3. 편의생성자 내에서는 자신의 지정생성자를 호출해야한다. 멤버 초기화를 직접 하는것은 편의생성자를 활용하는 방법이 아님. (지정생성자를 통해 궁극적인 저장속성 모두를 초기화 가능)

:::warning 지정생성자 편의생성자 상속 예외사항
지정생성자의 경우 재정의가 필수적으로 고려된다. 하지만 부모클래스를 상속하는 **자식클래스가 새로운 저장 속성을 갖지 않거나 모든 저장 속성에 기본값이 설정되어 있다면 부모클래스 지정생성자를 모두 자동상속받는다.**

편의생성자는 상속받지 않는 것을 원칙으로 했었다. 하지만 위의 지정생성자 모두를 자동상속받는 조건이 만족되었을때 편의생성자를 자동으로 상속받는다.

또는 상위 지정생성자 모두를 재정의한다면 편의생성자를 자동 상속받는다. (부모클래스 지정생성자 모두를 상속받는다는 의미)
:::

```swift
class Food {
    var name: String

    init(name: String) {     // 지정생성자
        self.name = name
    }

    convenience init() {     // 편의생성자 ===> 지정생성자 호출
        self.init(name: "[Unnamed]")
    }
}

class RecipeIngredient: Food {
    var quantity: Int

    init(name: String, quantity: Int) {  // 모든 속성 초기화
        self.quantity = quantity
        super.init(name: name)
    }

    override convenience init(name: String) {    // 상위 지정생성자를 편의생성자로 재정의 ===> 지정생성자 호출
        self.init(name: name, quantity: 1)
    }

    // convenience init() { }      // 자동 상속 (예외 규칙)
}
```

지정생성자 모두를 상속받아 재정의한다는 것의 의미는 언젠가 자식클래스로부터 부모클래스로 델리게이트 업 되어가는 과정을 자식클래스 내부로 조금 돌린다는 의미이다. (델리게이트 업 -> 하위 클래스에서 상위 클래스 저장속성 데이터를 힙 메모리상에 할당하는 것은 불가능, 따라서 상위 클래스로 위임한다고 하여 델리게이트 업)

위의 Food클래스의 편의생성자 `init`은 지정생성자 `init(name: String)`을 호출하게 된다. 이때 Food클래스를 상속받은 RecipeIngredient 클래스는 `init(name: String)` 클래스를 재정의하고 있고 이 생성자에서 나머지 추가 저장속성인 `quantity`까지 모두 초기화하고 있다.

`quantity`까지 초기화된 이후에는 `super.init(name: name)`을 호출하여 델리게이트 업을 진행하고 있고, 최종적으로 부모클래스의 생성자까지 호출되어 내부 값들이 메모리상에 저장되게 되는 것이다.

## 필수 생성자

필수 생성자는 생성자 앞에 `required` 키워드를 붙인다. 필수 생성자는 반드시 **하위 클래스에서 재정의를 해야하며 override 키워드는 붙이지 않는다.** 상속받는 자식 클래스에서도 `required`를 붙여줘야 한다.

애플 프레임워크 상속시 API문서에 작성해둔대로 필수생성자를 구현해야하는 경우가 있다.

필수생성자는 다른 지정생성자를 구현하지 않으면 자동으로 상속된다.

```swift
class AView: UIView {
//    required init?(coder: NSCoder) {         // 구현을 안해도 자동상속
//        fatalError("init(coder:) has not been implemented")
//    }
}


class BView: UIView {
    override init(frame: CGRect) {
        super.init(frame: frame)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
```

필수 생성자는 상속과 관련된 것이므로 구조체에서 사용하지 않는다.

## 실패 가능 생성자

실패 가능 생성자는 인스턴스 생성 과정에서 심각한 에러를 발생시켜 앱을 종료시키는 것이 아니라 애초에 생성자를 실패 가능하도록 하여 에러를 따로 처리하도록 하게 하는것이다.

실패가능 생성자 정의를 위해서는 `init`키워드 바로 뒤에 `?`물음표를 붙인다.

실패 가능 여부가 오버로딩 기준이 되지는 않는다.

```swift
enum TemperatureUnit {
    case kelvin
    case celsius
    case fahrenheit

    // 열거형 생성자에 실패가능 생성자 작성
    init?(symbol: Character) {
        switch symbol {
        case "K":
            self = TemperatureUnit.kelvin
        case "C":
            self = TemperatureUnit.celsius
        case "F":
            self = TemperatureUnit.fahrenheit
        default:
            return nil
        }
    }
}

let f1: TemperatureUnit1? = TemperatureUnit1(rawValue: "F")

// 인스턴스 생성에 실패 -> nil 리턴
let u: TemperatureUnit1? = TemperatureUnit1(rawValue: "X")
```

실패에 대해서는 `nil`값을 리턴하도록 하면 된다.

:::tip 실패 가능 생성자 호출관계
실패 가능 생성자는 실패 불가능 생성자를 호출해도 된다. 반대의 경우는 불가능하다.

```swift
class Item{
    var name = ""

    // 실패 불가능 생성자
    init(){
        self.init(name: "경준") // ERROR!
    }

    // 실패 가능 생성자
    init?(name:String){
        self.name = name
    }
}
```

옵셔널 타입을 생각해보면 옵셔널 Int는 정수형 범위 + nil이라는 큰 범위를 갖는다. 마찬가지로 실패가능 생성자는 생성자로서 갖는 구현범위 + nil이 붙어있는 것이다.

`super.init()`을 호출하며 델리게이트 업을 할때도 마찬가지이다. 부모클래스의 생성자가 실패 가능한지, 자식클래스의 생성자가 실패가능한지 여부와 범위를 따져가며 호출해야한다.

실패 가능성을 델리게이트 업 할수 있다. (실패 불가능 -> 실패 불가능으로의 호출)
:::

:::tip 실패 가능 생성자 재정의 관계
실패 가능 생성자를 실패 불가능 생성자로 재정의 가능하다. 실패 가능 생성자는 실패 불가능 생성자의 모든 경우의 수를 포함한다.

반면 실패 불가능 생성자는 실패 가능 생성자의 `nil`이라는 경우를 포함하지 못하기 때문에 재정의 불가능하다.

```swift
class Document {

    var name: String?

    init() {}                // 서류 생성 (실패불가능) (이름은 nil로 초기화)

    init?(name: String) {    // 실패가능 생성자 ===> 이름이 "" 빈문자열일때, 초기화 실패(nil)
        if name.isEmpty { return nil }
        self.name = name
    }
}


// 자동으로 이름지어지는 서류

class AutomaticallyNamedDocument: Document {

    override init() {                // 재정의 (상위) 실패불가능 =====> (하위) 실패불가능
        super.init()
        self.name = "[Untitled]"
    }

    override init(name: String) {    // 재정의 (상위) 실패가능 =====> (하위) 실패불가능
        super.init()                 // 실패불가능 활용가능
        if name.isEmpty {
            self.name = "[Untitled]"
        } else {
            self.name = name
        }
    }
}

class UntitledDocument: Document {

    override init() {               // 재정의 (상위) 실패가능 =====> (하위) 실패불가능
        //super.init()
        super.init(name: "[Untitled]")!    // 강제 언래핑(!)으로 구현 ⭐️
    }
}

```

위의 클래스 중 `UntitledDocument`는 `override init()`이 실패 불가능 생성자로 선언되었음에도 `Document`클래스의 실패 가능 생성자를 호출하고 있다.

강제 언래핑을 통해 `nil`이 발생하는 경우를 원천적으로 차단하기 때문이다.

`init?` 실패 가능 생성자는 `init!` 실패 가능 생성자와 거의 유사하므로 크게 고려하지 않아도 된다.
:::

## 소멸자(Deinitializers)

소멸자는 `deinit` 키워드로 선언한다. 파라미터도 필요하지 않다.

```swift
class Item{
    var x = 0
    var y = 0

    deinit{
        print("소멸")
    }
}

var a: Item? = Item()
a = nil // 소멸
```

클래스당 최대 1개 소멸자가 존재할 수 있다.

소멸자를 사용하게 되는 경우는 아래와 같다.

1. 파일 관련 클래스를 사용하는 경우 파일을 먼저 저장하고 인스턴스를 메모리에서 지워야할때
2. 소멸자는 클래스 내의 모든 속성에 접근 가능하므로 이를 가지고 각종 동작들을 구현 가능

일반적으로는 메모리상에 올라간 인스턴스가 실제로 잘 삭제되고 있는지 확인하기 위해 print 용도로 많이 사용함

소멸자는 인스턴스가 힙 영역에 저장되는 클래스에만 존재한다. 구조체는 스택이므로 알아서 삭제됨.

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
