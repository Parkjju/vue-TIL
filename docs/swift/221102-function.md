---
title: Swift - 함수
---

## 함수 문법

`func` 키워드로 함수를 선언한다.

```swift
// 1. 기본 함수
func greet(){
    print("Hello World!");
}
greet();

// 2. 파라미터가 있는 경우
// ## 파라미터에 대한 타입을 지정해야한다. ##
func greet(name: String){
    print("HI! \(name)");
}
greet(name: "박경준"); // 파라미터가 있는 함수의 호출

// 3. 리턴값이 있는 경우
func name() -> String{
    return "박경준";
}
print("HI! \(name())");

// 4. 리턴값과 파라미터 둘다 있는경우
func add(a: Int, b: Int) -> Int{
    return a+b;
}
print("a + b = \(add(a:1, b:2))");
```

:::tip parameter vs argument
파라미터가 있는 함수 형태가 있고, 파라미터에 실질적으로 전달되는 값을 아규먼트라고 한다.
:::

## 응용 - 아규먼트 레이블

스위프트 함수에는 아규먼트 레이블을 붙일 수 있다.

```swift
func add(firstNumber a: Int, secondNumber b: Int) -> Int{
    return a+b;
}

print("a + b = \(add(firstNumber: 1, secondNumber:2))"); // 3
```

아규먼트는 함수 호출시 파라미터에 실제 들어가는 값을 의미한다고 했는데, 이 아규먼트에 레이블을 붙인다는 것은 결국 **함수 호출단계에서 사용되는 기능이라는 것이라고 할 수 있겠다.**

아규먼트 값을 실제 변수명에 지정하는 것이 아니라 레이블로 하게 되면 함수 호출단계에서 변수가 어떤 역할을 하는지 확인하기 쉽다.

함수 작성단계에서 레이블처럼 자세하고 기능에 대한 서술이 들어간 변수명을 작성하면 개발 생산성이 떨어짐!

아규먼트 레이블을 따로 지정하지 않고 함수 파라미터로 변수명만 설정하면 해당 변수명과 아규먼트 레이블은 동일하게 사용된다.

:::tip 아규먼트 레이블 생략 - 와일드카드 패턴
별다른 아규먼트 레이블 지정 없이 변수명으로 사용하면 해당 변수명이 아규먼트 레이블이 되는데, 이때 아규먼트 레이블로 언더바를 사용하게 되면 아예 아규먼트 레이블을 생략할 수가 있다.

```swift
func add(_ a: Int, _ b: Int) -> Int{
    return a+b;
}
print("a + b = \(add(1,2))");
```

:::

## 응용 - 가변 파라미터

파라미터의 개수가 정해지지 않은 함수에 사용한다.

```swift
// Double...에 주목!
func average(_ numbers: Double...) -> Double{
    var sum: Double = 0;

    for i in numbers{
        sum += i;
    }
    return sum / Double(numbers.count);
}
print(average(1,2,3,5));
```

파라미터 타입 뒤에 `...`을 붙여서 가변 파라미터 사용에 대해 선언한다.

가변 파라미터의 아규먼트는 배열형태로 전달되고 함수당 하나씩만 선언 가능하다. 가변파라미터 외에 다른 파라미터 선언은 여전히 가능하다.

## 응용 3 - 디폴트값

함수 아규먼트 전달 없이 디폴트값을 설정할 수도 있다.

```swift
func add(_ a:Int = 1, _ b:Int = 1){
    print(a + b);
}
add(); // 2
```

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
