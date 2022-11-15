---
title: Swift - 클로저
---

## 클로저 개념

클로저는 이름이 없는 익명함수를 의미한다. 일반 함수는 이름을 가지고 호출하지만 클로저는 이름이 없어도 호출 가능한 형태이어야 한다.

```swift
// 일반 함수 형태
func myFunction() -> Int{
    // 함수..
    return // ..
}

// 클로저 형태
let _ = {(str: String) -> String in
    return "Hello \(str)"
}
```

스위프트는 함수를 일급객체로 취급한다. 즉 함수를 타입으로 취급 가능하다.

1. 함수를 변수에 할당가능
2. 함수 호출시 함수를 파라미터로 전달 가능
3. 함수에서 함수를 리턴 가능

```swift
// 함수에 타입을 지정
let functionA: (String) -> String
let functionB: (Int) -> Void // functionB: (Int) -> ()

let someClosure = { print("HI") }
someClosure() // HI
```

:::tip 함수 호출시 파라미터 지정
정의된 함수를 직접적으로 호출할 때 파라미터 이름을 지정해줘야 했다. 하지만 함수를 변수에 할당하게 되면 파라미터 지정을 하면 안된다. (에러남)

```swift
func aFunction(_ param: String) -> String {
    return param + "!"
}

aFunction("hi") // hi!
var a: (String) -> String = aFunction
a("hi") // hi!
```

:::

리턴 타입에 대해서는 결정되어 있는 경우가 많기 때문에 리턴 타입 표기는 생략하는 경우가 많음

```swift
{(a: Int, b: Int) in
    let result = a + b
    return result
}

// 타입 추론이 가능한 경우 파라미터 타입 생략도 함
{(a, b) in
    let result = a + b
    return result
}
```

:::tip 클로저 형태 정리

```swift
// 1. 변수 타이핑 생략
// let aClosure1: (String) -> String 타입 생략
let aClosure1 = { (str: String) in
    return "Hello \(str)"
}

// 2. 클로저 타이핑 생략
// 클로저 파라미터에 타입 생략
// 클로저 리턴 타입 생략 (str: String) -> String in ....
let aClosure2: (String) -> String = { (str) in
    return "Hello, \(str)"
}

// 3. 파라미터와 리턴값이 Void타입일때
// ~~ in ~~ 도 생략 가능
let aClosure3 = {
    print("Hello!")
}

// 4. 타입 추론이 가능할때
// 파라미터 타입, 리턴 타입 생략
// 리턴문을 보고 param이 String 타입인 것을 추론할 수 있다.
let aClosure4 = { param in
    return param + "!"
}

```

:::

## 클로저 사용 이유

클로저 사용 이유는 아래와 같다.

1. 클로저를 파라미터로 받는 함수를 정의할때
2. 함수를 실행할때 클로저 형태로 전달하기 위함

```swift
func closureParamFunction(closure: () -> Void){
    print("print....")
    closure()
}

closureParamFunction(closure: {
    // 클로저 내부 함수의 정의...
})

// ===== closureParamFunction 실행 이후 =====
// print...
// 클로저 내부 함수 정의...

let printSwift = { () -> () in      // 클로저를 정의
    print("프린트 종료")
}

// () -> ()타입의 함수라면 전달 가능
// 이 예시는 클로저 사용의 의미가 없음
closureParamFunction(closure: printSwift)

// 익명함수 정의와 함께 파라미터에 해당 함수 전달을 위해 클로저를 사용
closureParamFunction(closure: { () -> () in
    print("프린트 종료")
})
```

**함수 실행시 파라미터로 전달하는 함수를 콜백함수라고 한다.** 클로저는 **사후적 정의 역할을 할때 의미가 크다.** 미리 정해놓은 함수를 매번 따르는 것이 아니라 때마다 맞춰 원하는 함수를 파라미터로 전달하면 되기 때문이다.

## 클로저 문법 최적화

### 1. 트레일링 클로저 - 후행 클로저

```swift
func closureParamFunction(closure: () -> Void){
    closure()
    print("printing...")
}

// 원래 호출 형태
// closureParamFunction(closure:{
//     print("콜백 실행!")
// })

// 트레일링 클로저 형태
closureParamFunction{
    print("콜백 실행!")
}

// 파라미터가 여러개일때
func closureParamFunction2(a: Int, b: Int, closure: (Int) -> Void){
    let c = a + b
    closure(c)
}

closureParamFunction2(a: 1, b: 2){ param in
    print(param)
} // c에 1+2가 저장된 후 closure 아규먼트로 3이 전달됨
```

후행클로저 문법을 사용하면 클로저를 파라미터로 갖는 함수를 호출할 때 클로저를 감싸는 소괄호 및 아규먼트 레이블을 생략할 수 있다.

### 2. 파라미터 생략 등 간소화

함수의 정의 단계에서 클로저에 대한 파라미터 타입 및 리턴 타입을 결정해놓은 상태에서는 클로저의 파라미터, 리턴 타입을 생략할 수 있다.

```swift
func performClosure(param: (String) -> Int) {
    param("Swift")
}

// 1. 파라미터 타입, 리턴타입 생략
// performClosure함수의 파라미터 타입이 (String) -> Int로 명시적 선언이 되어있음
performClosure(param: { str in
    return str.count
})

// 2. 함수가 한 줄로 이루어진 경우 return 생략 가능
// 3. 아규먼트의 이름을 축약 가능
// $idx -> 파라미터 순서를 지칭
performClosure(param: {
    $0.count
})
performClosure(){ $0.count } // 트레일링 클로저 적용
```

클로저에서 `$0`는 클로저 함수의 0번째 파라미터를 의미한다.

:::tip 문법 축약 연습하기

아래 함수들을 축약하여 호출해보자

```swift
// closureType1 자체로 함수이다.
let closureType1 = { (param) in
    return param % 2 == 0
}
```

:::details

```swift
let closureType1 = { $0 % 2 == 0 }
```

:::

```swift
let closureType2 = { (a: Int, b: Int) -> Int in
    return a * b
}
```

:::details

```swift
let closureType2: (Int, Int) -> Int = {(a, b) in
    return a * b
}
// or

let closureType2:(Int, Int) -> Int = { $0 * $1 }
```

:::

:::

:::tip 콜백함수 파라미터 이름
애플 API에서 동작의 마무리 이후 실행하는 콜백함수에 대해 파라미터 이름을 `completion`, `completionHandler`로 쓰는 경우가 많다.
:::

### 3. 멀티플 트레일링 클로저

위의 트레일링 클로저 문법의 경우 파라미터에 함수가 하나만 전달되는 경우에 대해서였다. Swift5.3버전 이후로 여러개의 함수 파라미터에 대해 트레일링 클로저 문법을 지원한다.

```swift
func multipleClosure(first: () -> (), second: () -> (), third: () -> ()) {
    first()
    second()
    third()
}

// 기존 트레일링 클로저 방식
// 마지막 파라미터 함수에 대해서만 적용되었음
multipleClosure(first: {

}, second: {

}){

}

// 멀티플 트레일링 클로저
multipleClosure{
    // first 내부
} second:{
    // second 내부
} third: {
    // third 내부
}

// 와일드카드 패턴으로도 멀티플 트레일링 클로저 작성 가능
multipleClosure{
    // ..
} _: {
    // ...
}
```

## 클로저 메모리 구조

클로저는 **참조 타입이다.** 클로저 역시 함수이기 때문에 코드영역의 명령 묶음이 해당 묶음의 주소가 **힙 영역에 저장된다.** 클로저의 실행은 스택 프레임 내에서 이루어진다.

클로저는 캡처 현상이 발생한다.

```swift
var stored = 0

let closure = { (number: Int) -> Int in
    stored += number
    return stored
}

closure(10) // stored 변수의 값이 몇이 될까 - 10
closure(1) // stored 변수의 값이 몇이 될까 - 11
```

**클로저 내에서 사용할 필요가 있는 외부 값을 캡쳐한다.** 위의 코드에서는 `stored` 변수의 참조를 함수 내에 저장하게 되는 것이다.

(617p 그림 참조)

```swift
func calculate(number: Int) -> Int {

    var sum = 0

    func square(num: Int) -> Int {
        sum += (num * num)
        return sum
    }

    let result = square(num: number)

    return result
}


calculate(number: 10)
calculate(number: 20)
calculate(number: 30)
```

`calculate`함수 각 호출에 따라 `calculate`함수의 스택프레임이 추가되고 이후 `sqaure`함수의 스택프레임이 추가로 쌓인 후 값을 반환하고 스택프레임이 pop out 되는 형식으로 동작한다.

아래의 예시도 보자.

```swift
// calculateFunc의 리턴 타입은 함수이다.
func calculateFunc() -> ((Int) -> Int) {

    var sum = 0

    func square(num: Int) -> Int {
        sum += (num * num)
        return sum
    }

    // 함수를 리턴하고 있다.
    return square
}

let squareFunc = calculateFunc() // square함수가 squareFunc에 저장된다

squareFunc(10) // 100
squareFunc(20) // 500

let newReference = squareFunc
newReference(30) // 1400
```

위의 `squareFunc`함수 호출에 따라 값이 왜 계속 누적되는 형태가 나타나는 지에 대한 이해가 필요하다.

`let squareFunc = calculateFunc()` 문장 실행과 함께 아래의 일들이 벌어진다.

1. `calculateFunc()`함수 실행으로 인해 `square` 내부 중첩 함수의 참조값이 리턴된다.
2. `calculateFunc()`함수 종료 후 스택프레임이 사라지고, `squareFunc` 변수가 `square`함수 참조값을 저장한다
    - 이때 `square`함수 외부에 존재하는 변수 `sum`이 힙 메모리에 함께 저장된다.
    - 코드영역의 명령묶음 역시 힙 메모리에 저장된다. (sum과 한 공간에)
3. 이후 `squareFunc`함수는 호출때마다 힙 메모리에 저장된 클로저를 참조하며 호출하게 된다.

클로저 사용이 아니더라도 함수를 변수에 할당하게 되면 **변수에 전달되는 함수는 힙 메모리에 저장되어 변수가 매번 이 함수를 참조할 수 있게끔 한다.** `let squareFunc = func`에서 `func`가 함수라면, 클로저 형태를 갖지 않더라도 함수 참조값을 메모리에 저장한 뒤 `squareFunc`변수가 이 참조값을 스택상에 올려놓아야 하기 때문이다.

클로저를 사용하지 않고, 변수에 저장하지 않고 함수를 호출하게 되면 스택 프레임 소멸과 함께 내부 값이 초기화 될 것이다.

```swift
calculate()(10) // 100
calculate()(20) // 400
```

## @escaping 키워드

클로저의 단순 실행에는 @escaping 키워드가 필요하지 않았다.

```swift
func startClosure(closure: () -> ()){
    print("START")
    closure()
}
```

위의 `startClosure`이라는 함수에 전달되는 `closure`파라미터의 클로저는 `startClosure`함수가 종료된 이후 스택 프레임에서 사라진다.

```swift
var savedFunction: () -> () = { print("HI") }

func performEscaping(closure: @escaping () -> ()){
    savedFunction = closure
}

performEscaping{
    print("HELLO")
}
// -> performEscaping 함수는 콜백함수 실행을 하고 있지 않기 때문에
// -> 별다른 출력이 이루어지지 않고 있다.
// -> 하지만 전달된 클로저가 외부 변수인 savedFunction에 참조값으로 할당된다.

savedFunction() // HELLO
```

`@escaping`키워드는 파라미터에 전달되는 클로저를 외부 변수에 할당할 때에 **반드시 붙여야 하는 키워드이다.** 파라미터의 클로저를 **힙 메모리에 저장하는 것을 탈출한다고 표현한다.** (그림 589p 참조)

## @autoclosure

`@autoclosure`키워드는 파라미터가 없는 클로저에만 사용 가능하다. 파라미터가 존재하게 되면 반드시 함수 형태로 전달해야 하기 때문이다.

```swift
func someFunction(closure: @autoclosure () -> Bool){
    if closure(){
        print("TRUE!")
    }else{
        print("FALSE!")
    }
}

// someFunction(closure: Bool)
// someFunction(closure: { true })
// -> 클로저 축약 형태 중 하나
```

함수 파라미터에 `@autoclosure` 키워드를 추가하면 아규먼트에 대해 중괄호를 자동으로 붙여 함수로 만들어준다.

따라서 리턴 타입에 맞는 값만 전달하면 된다. 잘 사용하지 않음

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
