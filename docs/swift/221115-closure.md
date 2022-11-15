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

**함수 실행시 파라미터로 전달하는 함수를 콜백함수라고 한다.**

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
