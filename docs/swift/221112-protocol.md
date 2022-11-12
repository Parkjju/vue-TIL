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

class MyClass: AClass, CanFly{
    func fly(){
        // 구현
    }
}
```

`CanFly`라는 프로토콜을 채택한 곳에서는 반드시 `fly`라는 함수를 구현해야한다.
