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

## 함수 표기법

문서를 읽거나 함수를 변수에 담는 등의 작업을 할때 함수를 지칭하는 방법이다. `doSomething`함수를 기준으로 분류한다.

1. 파라미터가 없는 경우 - 함수명만 표기 : `doSomeThing`
2. 파라미터가 하나만 있는 경우 - 함수명과 아규먼트 레이블까지 표기 : `doSomething(myLabel:)`
3. 파라미터가 여러개 있는 경우 - 함수명과 아규먼트 레이블들을 콤마구분 없이 표기 : `doSomething(labelOne:labelTwo:)`
4. 아규먼트 레이블이 없는 경우 - 함수명과 와일드카드 패턴으로 표기 : `doSomething(_:_:)`

함수는 파라미터가 있고 없고, 리턴값이 있고 없고에 따라 타입이 네 가지로 달라진다.

1. 파라미터와 리턴값 모두 없는 함수 - `() -> ()`, `() -> Void`
2. 파라미터와 리턴값 모두 있는 함수 - `(String) -> String
3. 파라미터는 있고 리턴값은 없는 함수 - `(String) -> ()`, `(String) -> Void`
4. 파라미터는 없고 리턴값은 있는 함수 - `() -> Int`

실제로 각 타입에 맞게 함수를 생성한 후 `type(of: myFunction)`을 출력해보면 위와 같은 형태로 타입이 출력된다.

## 함수 오버로딩

스위프트는 함수 오버로딩을 지원한다. 동일한 함수 이름에 대해 다른 타입의 함수를 정의할 수 있다.

```swift
func doSomething(value: Int) {
    print(value)
}


func doSomething(value: Double) {
    print(value)
}


func doSomething(value: String) {
    print(value)
}


func doSomething(_ value: String) {
    print(value)
}


func doSomethging(value1: String, value2: Int) {
    print(value1, value2)
}
```

## 함수 메모리 구조

[자바스크립트 실행 컨텍스트](https://parkjju.github.io/vue-TIL/js/execution.html#%E1%84%89%E1%85%B5%E1%86%AF%E1%84%92%E1%85%A2%E1%86%BC-%E1%84%8F%E1%85%A5%E1%86%AB%E1%84%90%E1%85%A6%E1%86%A8%E1%84%89%E1%85%B3%E1%84%90%E1%85%B3) 구조와 매우 비슷한 형태임!

1. 함수 선언과 동시에 코드-데이터-힙-스택 네 가지 영역 중 스택 영역에 함수 프레임이 하나 생성된다.
2. 함수 정의부의 내용들은 모두 스택영역에 쌓이게 되고 함수 실행을 모두 마치면 스택에서 pop out 된다.
3. 데이터 영역과 힙 영역은 모든 곳에서 접근 가능한 영역이고, 스택은 각 프레임별로 구분되어 데이터가 움직인다.
4. 전역변수로 생성된 데이터들은 데이터 영역에 들어간다.

## inout 파라미터

함수 파라미터에 전달되는 변수는 복사되어 값만 아규먼트로 사용된다.

```swift
func swap(a: Int, b: Int){
    var temp = a;
    // ???
}
var num1 = 1;
var num2 = 2;

swap(num1, num2);

print("num1: \(num1), num2: \(num2)");
```

스왑 함수를 구현할때 call-by-value형태의 함수로 정의하게 되면 함수 외부에서 선언된 변수는 값이 변하지 않는다.

주소값에 직접 참조하는 call-by-reference 형태로 함수를 구현해야한다.

이때 함수 파라미터 타입 앞에 `inout` 키워드를 추가하면 함수 호출 시 변수를 전달했을때 변수 원본에 참조하게 된다.

```swift
func swapNumbers(a: inout Int, b: inout Int){
    let temp = a;
    a = b;
    b = temp;
}
var num1 = 1;
var num2 = 2;
swapNumbers(a: &num1, b: &num2)
print(num1, num2); // 2, 1
```

`inout` 키워드로 선언된 파라미터는 변수 전달 시 **앰퍼샌드 기호를 붙여야 한다.**

## 가드문 (guard)

중첩 if문의 불편함으로 인해 나오게 된 문법이다.

`guard`문의 중심 기능은 조건에 대해 조기종료(early exit)를 위한 것이다.

```swift
func checkPassword(_ password:  Int){
    guard password.count > 5 else {
        return false;
    }

    // 조건이 참일때의 나머지 코드
}
```

`guard`문을 통해 조건문 중첩 뎁스가 한 뎁스로 평탄하게 바뀔 수 있게 된다.

```swift
func useGuard(_ a: Int ){
    if(a > 0){
        print("a가 양수입니다.");

        if(a < 10){
            print("a가 10보다 작습니다.");

            if(a > 5){
                print("a가 5보다 큽니다.");
            }
        }
    }else{
        print("a는 음수입니다.");

        if(a > -10){
            print("a는 -10보다 큽니다.");

            if(a < -5){
                print("a는 -5보다 작습니다.");
            }
        }
    }
}
```

위와 같은 중첩 조건문이 있을때 guard문으로 바꾸게 되면 다음과 같다.

```swift
func useGuard(_ a: Int){
    guard a>0 else{
        print("a는 음수입니다.");

        guard a > -10 else {return}
        print("a는 -10보다 큽니다.");

        guard a < 5 else {return}
        print("a는 -5보다 작습니다.")
        return;
    }
    print("a는 양수입니다.")

    guard a < 10 else {return}

    print("a는 10보다 작습니다.");

    guard a > 5 else {return}

    print("a는 5보다 큽니다.");
}
useGuard(6);
```

guard의 else에 해당하는 부분은 반드시 `return` 등의 조기 종료가 되어야 한다. `fallthrough`가 되어 아래 나머지 코드들이 실행되도록 두면 안된다.

## discardableResult

스위프트에는 어트리뷰트 키워드들이 있다. 어트리뷰트 키워드들은 앞에 골뱅이표시가 붙는다.

어트리뷰트 키워드는 선언에 추가적인 정보를 제공하거나 타입에 추가적인 정보를 제공한다.

`@discardableResult` 어트리뷰트 키워드는 함수 결과값이 사용되지 않아도 된다는 속성을 함수에 부여한다.

```swift
func doSomething() -> String{
    return "HI";
}
// doSomething() -  // 리턴값이 사용되지 않았다고 경고 표시
_ = doSomething(); // 와일드카드 패턴으로 결과값을 사용했다고 의미 부여 가능

// discardableResult 활용
@discardableResult
func doSomething() -> String{
    return "HI";
}
doSomething(); // 경고창이 뜨지 않음.
```

## 연습문제 관련

```swift
func printRandomChr(_ str: String) -> Character{
    let index = Int.random(in: 0 ..< str.count);

    return str[str.index(str.startIndex, offsetBy: index)];
}

print(printRandomChr("박경준"));
```

스위프트에서 문자열 인덱싱을 하는 방식이 다른 언어와 차이가 큰 것 같다.

```swift
// 예제 코드
func randomString(_ chars: String) -> String{
    return String(chars.randomElement()!)
}
```

문자열의 `randomElement` 메서드는 랜덤으로 추출된 문자열 하나를 옵셔널 형태로 반환하며 옵셔널 뒤에 느낌표를 붙이면 값이 제대로 출력된다. (추후 나옴)

## print함수

print함수 선언부를 보면 `func print(_ items: Any..., seperator: String = " ", terminator: String = "\n")`로 작성되어 있다.

1. 출력 대상이 Any타입의 가변 파라미터로 선언되어 있고
2. 구분자가 디폴트 공백으로 설정되어 있고 (seperator 아규먼트 레이블)
3. 출력 맨 마지막에는 개행을 진행하고 있다. (terminator 아규먼트 레이블)

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
