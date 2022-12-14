---
title: Swift - 고급 연산자
---

## 숫자 리터럴

```swift
var num: Int = 25 // 10진법 리터럴
num = 0b00011001 // 2진법 리터럴
num = 0o31 // 8진법
num = 0x19 // 16진법

num = 1_000_000 // 1,000,000
num = 10_000_000 // 10,000,000
```

정수 타입의 범위는 아래와 같다.

```swift
// 0. Int, UInt - 플랫폼에 따라 자동 할당
// 1. 8비트 - Int8, UInt8
// 2. 16비트 - Int16, UInt16
// 3. 32비트 - Int32, UInt32
// 4, 64비트 - Int64, UInt64
MemoryLayout<Int8>.size // 1바이트
Int8.max // 127 (2^7-1)
Int8.min // -128 (-2^7)

MemoryLayout<UInt8>.size // 1바이트
UInt8.max // 255
UInt8.min // 0
```

## 오버플로우 연산자

C나 Objective-C에서는 오버플로우가 허용되었다. 데이터타입 내의 범위를 넘어서면 양끝단 값으로 순환하는 방식으로 동작했다. 스위프트에서는 이를 허락하지 않지만 특정 상황에서 오버플로우 개념이 필요할 때가 있다. 이때 스위프트에서는 오버플로우 연산자라는 것을 제공한다.

1. `&+` : 오버플로우 더하기 연산자
2. `&-` : 오버플로우 빼기 연산자
3. `&*` : 오버플로우 곱하기 연산자

```swift
var num1 = UInt8.max
num1 = num1 &+ 1 // 0으로 이동

var num2 = Int8.max
num2 = num2 &+ 1 // -128로 이동
```

## 단락평가(Short-circuit Evaluation)

논리연산자 `&&`에서 왼쪽 표현식이 `false`이면 굳이 뒤의 표현식을 확인할 필요 없이 결과값이 false라는 것이 확실하다. 마찬가지로 `||`연산자의 경우 앞의 표현식이 `true`일 경우 뒤의 표현식을 확인할 필요 없이 결과값을 true로 반환한다.

```swift
var num = 0

func checking() -> Bool {
    print(#function)
    num += 1
    return true
}

if checking() || checking() {    // &&으로 바꿔보기
    print("checking...")
}

print(num) // num값은 몇이 될까?
```

단락평가 규칙에 따라 checking()함수는 if문 조건 내에서 한번만 호출되기 때문에 num값이 1이된다.

:::tip 사이드이펙트
위의 `checking`함수에서 외부 변수 `num`을 참조하여 값을 변화시키는 상황을 사이드이펙트라고 한다.
:::

위와 같은 사이드이펙트 발생 가능성이 있는 코드에 대해 처리하는 방법은 함수를 조건 표현식 내에서 실행하지 않고 미리 실행한 뒤 결과값을 변수에 저장하고 나서 해당 변수를 조건문에 전달한다.

```swift
// 고치기 전
doorCheck = 0
passwordCheck = 0

if doorCodeChecking() || passwordCodeChecking() && doorCodeChecking() || false && passwordCodeChecking() {
    // door 1
}
print("Door: \(doorCheck), Password: \(passwordCheck)")
```

```swift
// 고치고 나서
doorCheck = 0
passwordCheck = 0


let doorResult1 = doorCodeChecking()
let passwordResult1 = passwordCodeChecking()
let doorResult2 = doorCodeChecking()
let passwordResult2 = passwordCodeChecking()


if doorResult1 || passwordResult1 && doorResult1 || false && passwordResult2 {

}
print("Door: \(doorCheck), Password: \(passwordCheck)")
```

## 비트연산자

1. `~` : Bitwise NOT 연산자
2. `&` : Bitwise AND 연산자
3. `|` : Bitwise OR 연산자
4. `^` : Bitwise XOR 연산자 -> 같으면 0 다르면 1 반환
5. `<<` : Bitwise left shift 연산자 (마이너스 부호가 있어도 상관 없음. 오버플로우만 신경쓰면 됨)
6. `>>` : Bitwise right shift 연산자 (마이너스 부호 / 플러스 부호를 유지해줘야 함 )

## 연산자 메서드의 직접구현

우리가 사용하는 `+` 연산같은 경우 실제 내부는 타입 메서드 형태로 정의되어 있다. `@inlinable public static func + (lhs: String, rhs: String) -> String`

`+`가 메서드라면 호출할때 `T.+()`형태로 호출해야 하지 않는 것일까? **연산자는 일반적인 타입 메서드 형태로 실행하지 않는 특별한 형태의 타입 메서드이다.** 실제 예시 코드를 살펴보자.

```swift
struct Vector2D{
    var x = 0.0
    var y = 0.0
}

extension Vector2D{
    static func + (lhs: Vector2D, rhs: Vector2D) -> Vector2D{
        return Vector2D(x: lhs.x + rhs.x, y: lhs.y + rhs.y)
    }
}

let point1 = Vector2D(x: 3.0, y: 2.0)
let point2 = Vector2D(x: 1.0, y: 1.0)
let combined = point1 + point2 // Vector2D(x: 4.0, y:3.0)
```

위와 같이 `+`연산에 대해 타입 메서드를 구현하는 방법이 있다.

`prefix`키워드를 붙여서 단항 연산자 메서드를 구현할 수 있다.

```swift
extension Vector2D{
    static prefix func - (vector: Vector2D) -> Vector2D{
        return Vector2D(x: -vector.x, y: -vector.y)
    }
}

let positive = Vector2D(x: 1.0, y:2.0)
let negative = -positive // Vector2D(x: -1.0, -2.0)
```

```swift
// 복합 할당 연산자
extension Vector2D {
    static func += (left: inout Vector2D, right: Vector2D) {
        left = left + right
    }
}
```

커스텀 타입에 대한 동일성 검사 `==`, `!=`를 진행하기 위해서는 `Equatable` 프로토콜을 채택해야 한다. `Equatable` 프로토콜을 채택한 구조체가 저장속성만 갖고 저장속성 타입이 `Equatable` 프로토콜을 준수하는 경우에 직접적인 연산자 메서드 구현이 필요없이 구현 내용을 자동으로 추가해준다.

```swift
extension Vector2D: Equatable {
    // 직접 구현하지 않아도 됨
    // static func ==(lhs: Vector2D, rhs: Vector2D) -> Bool {
    //    return (lhs.x == rhs.x) && (lhs.y == rhs.y)
    // }
}

vector1 == vector2 // false
vector1 != vector2 // true
```

동일성 비교를 위해 `Equatable`프로토콜을 채택했다면, 순서 및 크기 비교를 위해서는 `Comparable` 프로토콜을 채택한다. 이 프로토콜은 `<`,`>`, `>=`, `<=` 전체를 꼭 구현할 필요 없이 넷 중 하나만 구현해도 나머지는 스위프트 자체적으로 논리에 따라 구현해준다.

:::tip 열거형 동일성 비교
열거형은 연관값이 없으면 동일성 비교가 가능하다.

```swift
enum Weekday{
    case monday
    case tuesday
}

Weekday.monday == Weekday.tuesday
```

```swift
// Weekday 열거형이 Equatable 프로토콜을 채택하지 않으면
// 연관값이 동일하더라도 동일성 비교를 할 수 없다. -> 에러 발생
enum Weekday{
    case mon
    case tues(String)
}
Weekday.tues("하이") == Weekday.tues("하이")
```

```swift
enum Weekday: Equatable{
    case mon
    case tues(String)
}
print(Weekday.tues("하이") == Weekday.tues("하이")) // true
```

:::

## 사용자 정의 연산자 구현

`++`과 같은 연산자는 C언어 상에서 지원하지만 스위프트에는 지원하지 않는다. 이를 직접 정의하여 사용해볼 수 있다.

Int 타입에서 사용한다고 가정하면 아래와 같이 코드를 작성하면 된다.

```swift
postfix operator ++

extension Int{
    static func ++(num: inout Int){
        num = num + 1
    }
}
```

먼저 연산자에 대한 선언을 하고 난 이후에 메서드를 정의한다. (`postfix operator ++`)

별다른 키워드 없이 연산자 메서드를 구현하면 중위 연산자로써 역할을 하게 된다. `prefix`, `postfix` 키워드를 붙여야 단항연산자로 사용 가능하다.

연산자로 사용 가능한 문자는 아스키문자 몇가지만 가능하다. (나중에 구글링)

:::warning 우선순위 그룹
중위연산자 정의 시에는 반드시 **우선순위 그룹을 지정해야 한다.** 곱하기, 더하기 사이의 우선순위가 있는 것을 생각해보면 된다.

연산자 우선순위 그룹의 우선순위는 직접 확인이 필요하다.

```swift
precedenceGroup MyPrecedence{
    higherThan: AdditionPrecedence // 더하기 빼기 그룹
    lowerThan: MultiplicationPrecedence // 곱하기 그룹
    associativity: left // 결합성
}
infix operator +=: MyPrecedence
```

`associativity`는 결합 방향을 지정하는 속성이다. `10 - 5 - 5`는 왼쪽에서 오른쪽으로 결합하는 속성을 기본적으로 갖는다. (대부분 왼쪽에서 오른쪽)

left로 지정하면 왼쪽에서 오른쪽, right로 지정하면 오른쪽에서 왼쪽으로 결합한다.

:::

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
