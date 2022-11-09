---
title: Swift - 클래스 상속
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

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
