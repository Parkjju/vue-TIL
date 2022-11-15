---
title: Swift - 옵셔널 타입
---

## 개념

옵셔널은 특정 값이 존재하는지 여부가 확실하지 않을 때 사용하는 타입이다.

`Int`타입으로 선언된 변수를 초기화 하지 않고 접근하면 에러가 발생하면서 앱이 꺼지게 된다.

에러가 발생하지 않도록 임시 타입을 메모리에 담 아두는 개념이 옵셔널이다. (`Int?`로 표기)

옵셔널은 각 타입에 `nil`값이 더해져 있는 타입이다. 예를 들어 정수형 옵셔널은 정수형에서 표현될 수 있는 값들에 더해 `nil`값이 추가적으로 있는 것이다.

임시 타입에 들어간 옵셔널 정수형의 경우 `Optional(10)`이라는 형태로 감싸져 있고 실제 10값을 사용하기 위해서는 옵셔널 벗기기를 해야한다.

`nil`값 역시 옵셔널 타입이며 이를 벗기게 되면 임시로 차지하는 공간조차 없게 되어 값이 물리적으로 없어지게 된다. 이때는 해당 변수 공간으로 접근을 시도하게 되면 에러가 발생한다.

```swift
var num: Int? = 3;
var name: String? = "Park";
var age: Int = 25;

num = nil; // nil 할당 가능
name = nil;  // nil 할당 가능

age = nil; // !!!ERROR!!!
```

:::warning nil 타입추론
nil을 활용한 옵셔널 타입의 변수 선언시에는 반드시 명시적 선언을 해야한다.

```swift
var num = nil;
```

위와 같이 `nil`만 할당하면 어떤 타입의 옵셔널인지 알 수 없기 때문이다. (정수만 넣으면 정수형 옵셔널이 아닌 정수형 그 자체 타입으로 적용되기 때문에 의미가 없음)
:::

옵셔널 타입은 특정 값으로 초기화하지 않아도 자동으로 `nil`로 초기화된다.

타입뒤에 `?`를 붙이는 것이 아닌 정식 문법의 표기는 `Optional<Type>`이다. (`Optional<Int>`)

```swift
var num: Int = 5;
var b: Int? = 3;

b = num;
print(b); // Optional(5)
```

위 코드를 보면 옵셔널 타입 변수에 기본 타입 변수를 바인딩 시키게 되면 기존 타입이 옵셔널 타입으로 바뀌게 된다.

**옵셔널 타입끼리의 계산은 불가능하다.**

## 옵셔널 추출

### 1. 강제추출(Forced Unwrapping)

값이 있다는 것을 확신할때 사용한다.

```swift
var name: String? = "박경준";
print(name!); // 박경준

var isNil: Int?;
print(isNil!); // FATAL ERROR!
```

일반적인 상황에서는 강제추출을 사용하지 않는다.

### 2. if문 분기 후 강제추출

```swift
var name: String? = "박경준";

if(name != nil){
    print(name!);
}
```

### 3. 옵셔널 바인딩 (if let 바인딩)

```swift
// 우아하게 unwrapping하는 방식
var name: String? = "박경준";

if let myName = name {
    print(myName);
}
```

`if let` 우항에 전달되는 옵셔널 타입 변수의 값이 `nil`이라면 좌항 변수에는 값이 할당되지 못하도록 하는 것이 `if let` 바인딩이다.

if뿐만 아니라 `guard let` 바인딩도 가능하다.

```swift
func doSomething(name: String?){
    guard let myName = name else {return}
    print(myName);
}

print(name: "박경준"); // 박경준 출력
print(name: nil); // 출력 없음
```

`if let`으로 할당된 변수는 if문 스코프 내에서 사용 가능한 변수라는 것에 주의해야한다.

`guard let`을 통해 가독성 있는 코드를 작성하자.

`let` 키워드가 아니더라도 `var`키워드도 사용 가능하지만 `let`으로 옵셔널 벗기기를 하는 것이 일반적이다.

### 4. 닐 코얼레싱(Nil-Coalescing) 연산자 사용

자바스크립트에서도 지원하는 문법이다.

```swift
var name: String? = "박경준";

var yourName = name ?? "name value is NIL!!!";
```

옵셔널 변수에 대해 디폴트값을 할당하여 사용할 때에 사용하게 된다.

`guard let`을 통해 벗겨진 변수에 대해 추가 작업을 하기 때문에 닐 코얼레싱과는 용도가 살짝 다르다.

## 옵셔널 체이닝

```swift
class Dog {
    var name: String?
    var weight: Int

    init(name: String, weight: Int) {
        self.name = name
        self.weight = weight
    }

    func sit() {
        print("\(self.name)가 앉았습니다.")
    }

    func layDown() {
        print("누웠습니다.")
    }
}

var choco = Dog(name:"초코", weight: 15)
// Dog클래스의 name속성은 옵셔널 타입으로 선언되어 있음
print(choco.name) // Optional("초코")
```

`choco` 인스턴스 선언 시 타입 지정을 옵셔널 Dog타입으로 생성하게 되면 옵셔널 체이닝 문법 적용이 필요하다.

```swift
var choco: Dog? = Dog(name: "초코", weight: 15)
print(choco?.name) // Optional("초코")
```

choco인스턴스의 타입이 옵셔널 Dog이므로 옵셔널 체이닝으로 속성에 접근해야 한다.

**옵셔널 체이닝의 결과값은 항상 옵셔널이다.**

내부 메서드 및 속성이 존재하는지가 확실하지 않을 때 사용하는 것이 아니라, 현재 접근을 위해 사용하는 인스턴스의 타입이 옵셔널 타입일때 옵셔널 체이닝 문법을 사용하는 것이다.

옵셔널 체이닝 결과값으로 나온 데이터들은 언래핑하여 사용해야한다.

```swift
if let name = human2?.dog?.name {
    print(name)
}
```

1. 함수 옵셔널 체이닝 - `인스턴스?.메서드?()?.props`
    - 함수도 타입이므로 `옵셔널 함수 타입`이라는 타입도 존재한다
    - 따라서 옵셔널 함수 여부를 `메서드?()`로 한번 분기한다.
    - 이후 함수 호출 결과가 또 다시 옵셔널 타입이라면 `메서드?()?.리턴값의_속성`으로 분기를 한번 더 해줘야 함
2. 딕셔너리 옵셔널 체이닝 - `딕셔너리?["키값"]?.values`
    - `옵셔널 딕셔너리 타입` 여부에 따라 옵셔널 체이닝을 적용하면 `딕셔너리?["키값"]`으로 분기한다.
    - `books["키값"]`의 결과값이 있는지 없는지 확실하지 않다는 것은 결과값 자체가 옵셔널 타입이기 때문에 `books["키값"]?.결과값속성`으로 분기해준다

옵셔널 체이닝으로 접근한 메서드가 리턴형이 없는 경우에는 앞의 인스턴스가 nil인지 여부에 따라 그대로 호출되거나 `nil`이 그 자리에 반환되는 것으로 끝난다.

옵셔널 체이닝으로 접근한 메서드가 리턴형이 있는 경우에는 앞의 인스턴스가 nil이면 그 자리에 nil이 반환되고 nil이 아니면 함수를 실행한 뒤 값을 **옵셔널 타입으로 리턴한다.**

`me?.greet()`의 경우 `me`가 `nil`이 아닐때 `greet()`의 호출 결과가 `Hello`라는 문자열이라면 `Optional("Hello")`가 리턴되는 것이다.

## 함수 옵셔널

```swift
func doSomething(name: String, age: Int? = nil){
    print("\(name), \(age)");
}

doSomething(name: "박경준", age: 5); // 박경준, 5
doSomething(name: "박경준"); // 박경준
```

함수 파라미터가 옵셔널 타입을 가질때 `nil`로 디폴트값 선언을 해두지 않게 되면 반드시 아규먼트로 `nil`또는 특정 값을 전달해야한다.

옵셔널타입 파라미터에 `nil`로 디폴트값 설정을 해두면 해당 옵셔널 파라미터 자리에는 굳이 아규먼트 전달을 하지 않아도 된다.

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
