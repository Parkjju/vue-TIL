---
title: Swift - 열거형
tags: ['Swift', 'UIKit']
---

## 개념

열거형, 클래스, 구조체는 스위프트의 커스텀 타입이다. (Number, String 등은 베이직 타입)

그중 열거형은 타입 자체를 한정된 사례 안에서 정의할 수 있는 타입이다.

`enum`키워드로 선언하며 생성하는 대상은 **타입이기 때문에** 대문자로 시작한다.

```swift
enum Weekday {
    case monday
    case tuesday
    // ...
}

// 변수에 열거형 할당하기
var today: Weekday = Weekday.monday;
```

명시적 열거형 타입 선언이 이루어진 뒤에는 다음과 같이 코드를 작성할 수 있다.

```swift
// Weekday 생략
var today: Weekday = .monday;
today = .tuesday;
```

## 열거형 원시값

열거형에 해셔블한 타입을 매칭시키면 자동으로 각 케이스에 타입에 맞는 값들이 자동으로 할당된다.

```swift
enum Alignment: Int {
    case zero // 0
    case one // 1
    case num = 3 // 3
}

enum Alignment: String{
    case zero
    case one = "ABC"
}
```

각 열거형 케이스에는 원시값을 나타내는 `rawValue`속성이 있다.

```swift
var align: Alignment = .zero;
print(align.rawValue)
```

:::warning 열거형 생성자 함수
원시값을 가지고 생성자함수와 함께 열거형 인스턴스를 생성하면 옵셔널 타입으로 리턴된다.

```swift
var align = Alignment(rawValue: 0);// rawValue가 0인 케이스 할당
print(align!); // zero
```

:::

## 연관값

열거형 각 케이스에 대해 추가 정보를 제공하기 위해 연관값을 사용할 수 있다.

```swift
enum Computer{
    // 연관값에 레이블 할당 가능
    case cpu(core: Int, ghz: Double)

    // 타입만 선언하는 것도 가능
    case ram(Int, String)
    case hardDisk(gb: Int)
}

Computer.cpu(core: 4, ghz: 3.5);
Computer.ram(3, "SAMSUNG");
```

원시값은 각 케이스에 대해 고정된 형태로 값이 할당되지만 연관값은 케이스 생성이 무한대로 가능하다.

:::tip 옵셔널 타입과 열거형
옵셔널 타입은 열거형으로 구현되어 있고, 두 가지 케이스 `some`과 `none` 케이스로 나뉜다.

```swift
enum Optional<Wrapped>{
    case some(Wrapped) // 연관값이 Wrapped타입으로 선언되어 있음
    case none
}
```

:::

```swift
// switch문 케이스 패턴으로 꺼내기
switch chip {
case .cpu(core: 8, ghz: 3.1):
    print("CPU 8코어 3.1GHz입니다.")
case .cpu(core: 8, ghz: 2.6):
    print("CPU 8코어 2.6GHz입니다.")
case .ram(32, _):
    print("32기가램 입니다.")
default:
    print("그 이외의 칩에는 관심이 없습니다.")
}



// 연관값을 가진 케이스를 패턴 매칭시키기

switch chip {
case let .cpu(a, b):    // let a = 연관값, let b = 연관값
    print("CPU \(a)코어 \(b)GHz입니다.")
case let .ram(a, _):
    print("램 \(a)기가램 입니다.")
case let .hardDisk(a) :
    print("하드디스크 \(a)기가 용량입니다.")
}
```

```swift
// 실제 옵셔널 타입 동작방식
var num: Int? = 7

switch num {
case .some(let a):  // 열거형 case 패턴을 활용해서, 내부 연관값을 꺼냄
    print(a)
case .none:
    print("nil")
    //print(num!)
}
```

## switch문 활용

열거형 타입으로 객체 하나 생성 후 스위치문에 전달하는 방식

```swift
enum LoginProvider{
    case email
    case sns
}

let user = LoginProvider.sns;

switch user{
case .email:
    print("이메일");
case .sns:
    print("SNS");
}
```

열거형은 케이스가 한정적이므로 스위치문과 함께 사용하는 것이 일반적이다.

## 옵셔널 열거형

열거형도 타입이다. 따라서 옵셔널 열거형도 존재하게 된다.

```swift
let x: SomeEnum? = .myCase;

switch x{
case .some(let value):
    switch value{
    case .myCase:
        print("case 1");
    case .etc:
        print("etc..");
    }
case .none:
    print("NONE");
}

// or
switch x{
    case .some(.myCase):
        print("case 1");
    case .some(.etc):
        print("etc...");
    case .none:
        print("NONE");
}
```

`.none`과 `nil`은 동일하다.

위 코드를 편의적 사용으로 작성하면 아래와 같다.

```swift
// 연관값이 없을때만 아래 코드로 작성할 수 있다.
switch x{
    case .myCase:
        print("case 1");
    case .etc:
        print("etc...")
    case nil:
        print("NONE")
}
```

## 연관값이 있는 경우

연관값을 사용한다는 것은 특정 케이스만 다루게 되는 상황이 발생할 수도 있다는 것이다.

이때 연관값 한 가지 상황에 대해서만 처리하기 위해 switch문을 쓰는 것은 비효율적이다.

```swift
enum Computer {                         // 3가지로 정의
    case cpu(core: Int, ghz: Double)
    case ram(Int, String)
    case hardDisk(gb: Int)
}

switch chip{
case Computer.hardDisk(gb: let gB):
    print("\(gB)기가");
default:
    break
}

if case Computer.hardDisk(gb: let gB) = chip{
    print("\(gB)기가")
}
```

`Computer.hardDisk(gb: let gB)`를 통해 gB라는 변수에 Computer 열거형의 hardDisk 케이스에 대한 연관값 gb에 전달된 값을 할당하게 되는 것이다.

for문에서도 사용 가능하다.

```swift
let chiplists: [Computer] = [
    .cpu(core: 4, ghz: 3.0),
    .cpu(core: 8, ghz: 3.5),
    .ram(16, "SRAM"),
    .ram(32, "DRAM"),
    .cpu(core: 8, ghz: 3.5),
    .hardDisk(gb: 500),
    .hardDisk(gb: 256)
]

for case let .cpu(core: c, ghz: h) in chiplists {    // 배열중에서 특정 케이스만 뽑아서 활용 가능 ⭐️
    print("CPU칩: \(c)코어, \(h)헤르츠")
}
```

`for case`에서 할당되는 반복상수들은 연관값 케이스와 맞아 떨어질때만 사용하게 된다.

:::tip for case 열거형 케이스 패턴

```swift
// 배열이 열거형이 아니라 옵셔널 타입일때도 for-case 사용 가능
let arrays: [Int?] = [nil, 2, 3, nil, 5]


for case .some(let number) in arrays {
    print("Found a \(number)")
}
```

:::

## 옵셔널 패턴

위의 `.some`, `.none`으로 접근하는 것을 열거형 패턴이라고 한다.

```swift
// 열거형 패턴
let a: Int? = 1

switch a {
case .some(let z):
    print(z)
case .none:  // nil이라고 써도됨
    print("nil")
}

switch a {
case let z?:      // .some을 조금 더 간소화하는 문법
    print(z)
case nil:         // .none 이라고 써도됨
    print("nil")
}

// for case
let arrays: [Int?] = [nil, 2, 3, nil, 5]



// 1) 열거형 케이스 패턴

for case .some(let number) in arrays {
    print("Found a \(number)")
}



// 2) 옵셔널 패턴

for case let number? in arrays {
    print("Found a \(number)")
}
```

## unknown 키워드

열거형 케이스 모두에 대해 분기하지 않았을때 경고를 주기 위해 사용하게 된다.

```swift
switch userLogin {
case .email:
    print("이메일 로그인")
case .facebook:
    print("페이스북 로그인")
case .google:
    print("구글 로그인")
@unknown default:
    print("그 외의 모든 경우")
}
```

switch의 default는 모든 케이스가 처리되었음을 나타낸다.

여기에 `unknown` 키워드를 추가해두면 컴파일 시점에 Warning만 발생시켜 개발자에게 주의를 준다.

열거형 내의 케이스보다 분기 처리하는 케이스가 적으면 모든 케이스에 처리하라는 경고를 발생시키는 것이다.

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
