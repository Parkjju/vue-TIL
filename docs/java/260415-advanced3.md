---
title: 자바 고급 - 람다, 함수형 프로그래밍
tags: ['Java']
---

## 람다 필요성

-   값 매개변수화, 동작 매개변수화를 통해 코드 중복을 개선할 수 있다.
    -   값 매개변수화: 값(숫자, 문자열 등)을 바꿔가며 메서드 동작을 달리 함.
    -   동작 매개변수화: 어떤 동작을 수행할지를 메서드에 전달. (인스턴스 참조, 람다 등)
-   익명 클래스를 정의하여 코드 조각을 전달하는 방식도 가능했지만, 람다를 활용하면 더 간단히 코드 블럭을 인수로 전달할 수 있다.

```java
// 매개변수 없이
Procedure procedure = () -> {
    System.out.println("Hello lambda");
};

// 매개변수 포함
Procedure procedure = (int a, int b) -> {
    // ..
}
```

-   익명클래스 구현체 작성 방식과 마찬가지로 인터페이스 기반으로 하되 `() -> {}` 구문을 통해 간단히 표현 가능하다.

## 람다 정의

-   람다는 익명 함수이다. 따라서 이름이 없다.
-   람다 vs 람다식(Lambda Expression)
    -   람다: 익명 함수를 지칭하는 용어
    -   람다식: `() -> {}` 형태로 람다를 구현하는 구체적인 문법 표현 지칭
-   **람다도 익명 클래스처럼 클래스가 만들어지고 인스턴스가 생성된다.**

## 함수형 인터페이스

-   함수형 인터페이스는 정확히 하나의 추상 메서드를 가지는 인터페이스를 말한다.
-   람다는 추상 메서드가 하나인 함수형 인터페이스에만 할당 가능하다.
-   단일 추상 메서드를 줄여 SAM(Single Abstract Method)라고 한다.
    -   클래스 및 추상 클래스에는 할당 불가능하다.
-   `@FunctionalInterface` 애노테이션을 함수형 인터페이스 정의 시 포함해주면 단 하나의 추상 메서드만을 포함하는 인터페이스임을 컴파일 레벨에서 보장할 수 있다.
-   람다 구현시 인터페이스와 구현부 사이에 메서드 시그니처와 반환타입 모두 일치해야 한다.
-   단일 표현식의 경우 return 키워드를 생략할 수 있다.

```java
// 리턴 생략
(int a, int b) -> a + b;

// int 타입추론하여 생략 가능
(a, b) -> a + b;

// 매개변수가 하나인 경우 소괄호 생략 가능
a -> a + 1;
```

-   매개변수를 통해 메서드에 람다를 전달할 수 있다. 람다를 반환하는 것도 가능하다.

## 고차 함수

-   람다 역시 익명 클래스 인스턴스와 같은 개념이다.
-   람다를 변수에 대입하는 것은 **람다 인스턴스의 참조값을 대입하는 것이다.**
-   람다를 반환값으로 넘긴다는 것은 **람다 인스턴스의 참조값을 전달 및 반환하는 것이다.**
-   고차 함수는 함수를 값처럼 다루는 함수를 뜻한다.

:::tip 고차 함수 이름의 유래

-   보통의 함수는 데이터를 입력으로 받고 값을 반환한다.
-   고차 함수는 함수를 인자로 받거나 함수를 반환한다.
-   값을 다루는 것을 넘어 함수라는 개념을 값처럼 다룬다는 점에서 추상화 수준이 한 단계 높은 것을 나타낸다.

:::

## 함수형 인터페이스

-   함수형 인터페이스도 인터페이스이기 때문에 제네릭 도입이 가능하다.

```java
interface GenericFunction<T, R> {
    R apply(T s);
}

// 구현부
GenericFunction<Integer, Integer> square = n -> n * n;
Integer result = square.apply(3);
```

## 타겟 타입

-   람다는 람다식 그 자체만으로 구체적 타입이 정해져있는 것이 아닌, 대입되는 함수형 인터페이스에 의해 타입이 결정된다.
-   타입 결정 이후에는 다른 타입에 대입하는 것이 불가능하다.
    -   메서드 시그니처가 동일해도 상관없다.
-   자바에서는 필요한 함수형 인터페이스 대부분을 기본으로 제공한다.
    -   `java.util.function` 패키지에 다양한 기본 함수형 인터페이스들이 제공된다.

```java
public interface Function<T, R> {
    R apply(T t);
}
```

## 기본 함수형 인터페이스

-   자바가 제공하는 대표적 함수형 인터페이스들이다.
    -   `Function`: 입력 O, 반환 O
    -   `Consumer`: 입력 O, 반환 X
    -   `Supplier`: 입력 X, 반환 O
    -   `Runnable`: 입력 X, 반환 X
-   Function
    -   하나의 매개변수를 받고, 결과를 반환하는 함수형 인터페이스이다.
    -   일반적인 함수 개념에 가장 가깝다.
-   Consumer
    -   입력값만 받고 결과를 반환하지 않는 함수형 인터페이스이다.
    -   입력데이터를 기반으로 내부 처리만 하는 경우 유용하다.
    -   로그 작성, DB 저장, 콘솔 출력 등
-   Supplier
    -   데이터 입력 없이 어떤 데이터를 공급해주는 함수형 인터페이스이다.
    -   객체, 값생성, 지연 초기화 등에 주로 사용한다.
-   Runnable
    -   주로 멀티스레딩에서 스레드 작업을 정의할때 사용한다.
    -   Thread에 정의된 태스크를 전달하면 된다.
    -   자바 8 이후로 람다식으로도 많이 표현한다.

```java
Runnable task = () -> System.out.println("hello");
Thread thread = new Thread(task); // 여기서 스레드 생성
thread.start();
```

-   `Bi`라는 prefix가 붙은 함수형 인터페이스는 인자를 두개 받을 수 있다.

## 명령형 vs 선언적 프로그래밍

-   명령형 프로그래밍: 프로그램이 어떻게 수행되어야 하는지 수행 절차를 명시하는 방식
    -   어떻게 결과에 도달하는지를 명시
-   선언적 프로그래밍: 프로그램이 무엇을 수행해야 하는지, 원하는 결과를 명시하는 방식
    -   결과를 얻기 위한 내부 처리 방식은 추상화
    -   람다를 활용하면 선언적 스타일로 문제 해결이 가능하다.

:::tip 정적 팩토리 메서드

-   정적 팩토리 메서드는 객체 생성을 담당하는 static 메서드이다.
-   생성자 대신 인스턴스를 생성하고 반환하는 역할을 한다.
    -   메서드에 인스턴스 생성 없이 접근 가능하다.
    -   생성한 객체 또는 내부에 이미 존재하는 객체를 반환한다.
    -   생성자와 달리 메서드에 이름을 별도로 지정 가능하다.
    -   객체 생성 과정에서 객체 재활용, 캐싱, 하위 타입 객체 반환 등의 로직을 적용할 수 있다.

:::

:::tip 스트림(Stream)

-   필터와 맵을 포함한 여러 연산을 연속적으로 적용하기 위해 하나의 스트림으로 표현한 것을 의미한다.
-   스트림을 사용하여 메서드 체이닝을 구현할 수 있다.

:::

## 람다 vs 익명 클래스

-   문법 차이
-   람다가 익명 클래스에 코드가 더 간결하다
-   상속 관계
    -   익명 클래스는 다양한 인터페이스와 클래스를 구현하거나 상속할 수 있다.
    -   람다는 클래스 상속이 불가능하다. 필드나 멤버, 추가적인 메서드 오버라이딩도 불가능하다.
-   호환성: 람다는 자바 8부터 사용 가능하다.
-   this
    -   익명클래스: 익명클래스 자신을 가리킨다. 외부와 격리된 컨텍스트를 갖는다.
    -   람다: 람다를 선언한 외부 클래스의 컨텍스트를 갖는다.
-   캡처링
    -   둘다 캡처링을 지원하고, 지역변수는 반드시 final이거나 final 키워드 없이 값변경이 되지 않은 지역변수여야만 한다.
-   상태 관리
    -   익명 클래스: 인스턴스 내부에 상태(필드, 멤버)를 가질 수 있다.
    -   람다: 필드가 없으므로 스스로 상태를 유지하지 않는다.
-   용도
    -   익명 클래스: 상태를 유지하거나 다중 메서드 구현이 필요한 경우, 복잡한 인터페이스 구현, 기존 클래스 및 인터페이스 상속이 필요할때
    -   람다: 상태 유지가 필요없고 간결함이 중요할때

## 메서드 참조

```java
BinaryOperator<Integer> add1 = (x, y) -> x + y;
BinaryOperator<Integer> add2 = (x, y) -> x + y;
```

-   위와 같은 코드를 고려해보면, 같은 동작을 하는 람다임에도 각각 정의하고 있는 것을 볼 수 있다.
-   이 경우 코드 중복은 물론 람다 자체에 수정사항이 생긴 경우 두 코드 모두 수정을 해줘야 한다.
-   이때 메서드 참조 문법을 사용하면 간편하게 코드 작성이 가능하다.

```java
BinaryOperator<Integer> add1 = (x, y) -> x + y;
BinaryOperator<Integer> add1 = MethodRefStartV3::add;
```

-   람다에서만 쓰이는 것이 아닌, 특정 메서드 호출 시 이를 축약해주는 문법이라고 보면 된다.
-   `클래스명::메서드명` 형태로 **정적 메서드 참조가** 가능하다.
    -   `Math::max`, `Integer::parseInt`
    -   파라미터가 있는 경우에도 메서드 호출이 아닌 참조를 하는 것이기 때문에 아규먼트 전달 코드가 아님에 주의하자.
-   `객체명::인스턴스메서드명` 형태로 특정 객체의 메서드 참조도 가능하다.
-   `클래스명::new`로 생성자 참조가 가능하다.
-   `클래스명::인스턴스메서드명`으로 첫번째 매개변수가 참조하는 메서드를 호출하는 객체가 된다.
    -   `Person::introduce`,
    -   `(Person p) -> p.introduce()` 위와 같은 람다이다.

```java
// 람다
Person person1 = new Person("Kim");
Function<Person, String> fun1 = (Person person) -> person.introduce();
fun1.apply(person1);

// 메서드 참조
Person person2 = new Person("Park");
Function<Person, String> fun2 = Person::introduce;
fun2.apply(person2);
```

-   특정 타입의 임의 객체의 인스턴스 메서드를 참조한다.
-   Person 인스턴스가 몇백개 선언되더라도 하나의 메서드 참조 기반으로 쉬운 호출이 가능하다.
    -   인터페이스 메서드 내에서 해당 객체의 참조 메서드를 호출한다.

```java
// 람다
List<String> result = mapPersonToString(personList, (Person p) -> p.introduce());

// 메서드 참조
List<String> result = mapPersonToString(personList, Person::introduce);
```

-   매개변수가 여러개인 경우 순서대로 함수 호출 시 매개변수에 전달하면 된다.

## 스트림 API

-   스트림은 자바 8부터 추가된 기능으로, **데이터의 흐름을 추상화하여 다루는 도구이다.**
    -   스트림은 컬렉션 또는 배열 등의 요소들을 연산 파이프라인을 통해 연속적인 형태로 처리할 수 있게 해준다.
-   람다 기반으로 내부 동작을 정의하면 된다.

:::tip 파이프라인

-   데이터가 흘러가는 처리 단계들의 연결

:::

```java
List<String> result = stream
    .filter(name -> name.startsWith("B"))
    .map(s -> s.toUpperCase())
    .toList()
```

-   스트림은 여러 특징이 있다.
    1. 데이터 소스를 변경하지 않는다. 결과만 새로 생성한다.
    2. 일회성 (1회 소비)
        - 한번 사용된 스트림은 재사용이 불가능하다.
    3. 파이프라인 구성
        - 중간연산이 이어지다가 최종 연산을 만나면 연산 수행 후 종료된다.
    4. 지연 연산
        - 중간 연산은 필요시까지 실제로 동작하지 않으며 최종연산이 실행될때 한번에 처리된다.
        - `map`, `filter`등은 중간연산으로 최종연산을 만나기 전까지 실행되지 않고 대기하게 된다.
    5. 병렬처리 용이
        - 스트림으로부터 병렬 스트림을 쉽게 만들 수 있어서 멀티코어 환경에서 병렬연산을 단순한 코드로 작성 가능하다.

```java
Stream<Integer> stream = Stream.of(1,2,3);
stream.forEach(System.out::println); // 스트림 1회 실행
stream.forEach(System.out::println); // 런타임 예외 발생
```

-   자바 스트림 API는 최종 연산을 만났을때 조건을 만족하는 **요소를 찾은 순간 연산을 멈추고 곧바로 결과를 반환한다.**
    -   이를 단축평가(short-circuit)라고 한다.
    -   최종연산을 만나기 전까지 lazy 형태로 대기하기 때문에 가능한 최적화이다.

:::tip Collectors

-   collect 메서드와 Collectors를 사용하면 최종 반환값을 원하는 형태로 만들어낼 수 있다.

```java
list.stream()
    .map(...)
    .collect(Collectors.toList());  // 여기서 Collectors 등장
```

-   위와 같은 구조로 사용하며, Collectors에서 자체적으로 제공하는 변환 전략을 그대로 사용하면 된다.
-   reducing, joining과 같은 전략도 포함된다.
-   groupingBy를 쓰면 Map객체로 만들어 Key-Value쌍의 자료구조를 반환해준다.
-   이때 다운스트림 컬렉터를 쓰면 다음과같은 형태가 된다.
    -   **각 그룹 내부 요소들을 다시 한번 어떻게 처리할지 정의하는 역할을 한다.**

```java
orders.stream()
    .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));

// {
//   "PENDING" -> 2,
//   "DONE"    -> 1
// }
```

-   Order별로 value에 객체들이 들어가는게 기존 구조였다면, 다운스트림 컬렉터에 추가 연산을 전달하여 카운팅을 한 결과가 들어가도록 만들 수 있다.

:::

## Optional

-   자바 null은 값이 없음을 표현하는 기본적 방법이다.
-   null 참조 및 오용시 `NullPointerException`이 발생한다.
-   메서드에서 `null`을 반환하거나 직접 사용하게 되면 코드 가독성이 떨어진다.
    -   메서드 시그니처 `String findNameById(Long id)` 이 구문만으로는 리턴값에 널이 포함되는지 알 수 없다.

```java
static void findAndPrint(Long id) {
    Optional<String> optName = findNameById(id);
    String name = optName.orElse("UNKNOWN");
    System.out.println(id + ": " + name.toUpperCase());
}
```

-   위와 같이 간단한 코드로 표현이 가능해진다.
-   다음은 옵셔널 관련 메서드들이다.
    -   `Optional.of(T value)`: 내부 값이 확실히 null이 아닐때 사용
    -   `Optional.ofNullable(T value)`: 내부 값이 null일 수도 있을때 사용
        -   출력시 `Optional[value]`형태로 감싸져 보인다.
    -   `Optional.empty()`: 값이 없음을 표현할때 사용
        -   Optional.empty로 표현된다.
-   아래는 옵셔널 값을 조회하거나 획득하는 메서드이다.
    1. `isPresent()`, `isEmpty()`
        - 값이 있으면 true, 없으면 false
        - 단순 조회용이다.
    2. `get()`
        - 값이 있는 경우 해당 값을 반환한다.
        - 값이 없으면 `NosuchElementException`이 발생한다.
        - 권장되지는 않는다.
    3. `orElse(T other)`
        - 값이 있으면 해당 값을 반환한다.
        - 값이 없으면 other를 반환한다.
    4. `orElseGet(Supplier<? extends T> supplier)`
        - 값이 있으면 반환
        - 값이 없으면 supplier를 호출하여 생성된 값 반환
    5. `orElseThrow(예외)`
        - 값이 있으면 해당 값 반환
        - 값이 없으면 지정한 예외 전달
    6. `or(Supplier<? extends Optional<? extends T>> supplier)`
        - 값이 있으면 해당 값의 옵셔널을 그대로 반환
        - 값이 없으면 supplier가 제공하는 다른 옵셔널 반환
        - 옵셔널로 래핑된 값을 반환한다는 특징 존재

:::tip orElse vs orElseGet

-   값이 있으면 반환하고 없으면 supplier를 통해 값을 생성하여 반환하거나 other를 즉시 반환한다는 점에 차이가 있다.
-   실제 내부 동작의 차이는 즉시 평가, 지연 평가 여부에 차이에 있다.
-   자바 `+`와 같은 연산은 기본적으로 즉시 평가이다.
    -   해당 연산값을 사용하지 않는 경우, 연산 리소스만 사용하고 결과는 사용하지 않는 비효율이 발생한다.
    -   **이를 해결하기 위해 연산 정의 시점과 해당 연산을 실행하는 시점을 분리해야 한다.**
-   orElse를 사용하면 other 인자값 연산이 수행되지만 값이 있는 경우 버려지게 된다.
-   suppler를 사용하면 옵셔널 값이 없으면 람다 수행 후 연산결과를 리턴한다.

```java
// 값이 있어도 createData 호출 후 버려짐
Integer empty1 = optEmpty.orElse(createData());

// 값이 있으면 해당 값 리턴, 없으면 람다 수행
Integer empty2 = optEmpty.orElseGet(() -> createData());
```

-   orElse에 넘기는 객체 생성 비용이 크지 않는 경우 사용해도 좋다.
-   orElse에 넘기는 객체 생성비용이 큰 경우 orElseGet을 사용한다.
    -   String과 같이 객체 생성 비용보다 람다 생성 비용이 더 크면 orElse를 쓰면 된다.

:::

:::tip Supplier

-   Supplier는 함수형 인터페이스로, 옵셔널에서 사용하게 되면 람다에서 리턴하는 값을 사용하겠다는 의미이다.

```java
@FunctionalInterface
public interface Supplier<T> {
    T get();
}
```

-   다음은 람다를 실행하여 옵셔널 값을 받는 실제 코드이다.

```java
Optional<String> optValue = Optional.of("Hello");
String value = optValue.orElseGet(() -> {
    return "new value";
})

```

:::

-   아래는 Optional 값이 존재할때, 존재하지 않을때 구분하여 처리하는 메서드들이다.
    1. `ifPresent(Consumer<? super T> action)`
        - 값이 없으면 action 실행
        - Consumer는 별도의 리턴값 없이 void로 사이드 이펙트 처리만 한다.
        - `<? super T>`는 T의 상위 타입들로 제한하는 제네릭 문법이다.
        - `<? extends T>`는 T의 하위 타입들로 제한하는 제네릭 문법이다.
    2. `ifPresentOrElse(Consumer<? super T> action, Runnable emptyAction)`
        - 값이 존재하면 action을, 존재하지 않으면 emptyAction을 실행한다.
        - 컨슈머는 입력을 받지만 Runnable은 입력도 받지 않는 함수형 인터페이스이다.
    3. `map(Function<? super T, ? extends U> mapper)`
        - Function은 T 입력을 U로 출력하는 인터페이스이다.
        - 값이 있으면 mapper를 적용한 결과로 `Optional<U>`를 반환한다.
        - 값이 없으면 Optional.empty를 반환한다.
    4. `flatMap`
        - 값이 존재했다면 Optional을 반환할때 중첩되지 않고 옵셔널을 벗겨 반환한다.
    5. `filter(Predicate<? super T> predicate)`
        - 값이 있고 조건을 만족하면 그대로 반환한다.
        - 조건 불만족 또는 비어있으면 empty를 반환한다.
    6. `stream()`
        - List같은 컬렉션은 기본적으로 for문 등으로 값 처리를 해야한다.
        - 값 처리의 용이성을 위해 스트림으로 타입 변경이 필요하다.
        - `List<Optional<String>>` 타입을 `Stream<Optional<String>>`으로 변경해주는 역할을 한다.

```java
/// map
Optional<Integer> length = optValue.map(String::length);

/// flatMap
Optional<String> userId = Optional.of("123");
Optional<String> email = userId
    .flatMap(id -> findUser(id))      // Optional<User> 반환
    .flatMap(user -> findEmail(user)); // Optional<String> 반환

// stream
List<Optional<String>> list = List.of(
    Optional.of("apple"),
    Optional.empty(),
    Optional.of("banana")
);

List<String> result = list.stream()
    .flatMap(Optional::stream) // empty는 버리고, 값 있는 것만 꺼냄
    .collect(Collectors.toList());

// ["apple", "banana"]
```

-   옵셔널 Best Practice는 다음과 같다.
    1. 함수 반환 타입으로만 사용하고 필드에는 가급적 사용 말것
    2. 메서드 매개변수로 Optional을 사용 말것
    3. 컬렉션이나 배열 타입을 Optional로 감싸지 말것
    4. `isPresent()`, `get()` 조합을 직접 사용하지 말것
        - 강제 언래핑으로 인한 예외 발생 가능성이 높다.
    5. `orElseGet()`, `orElse()` 차이에 대한 이해
    6. `Optional이 무조건 좋은 것은 아니다.
        - 값이 있음이 보장되거나 대다수의 경우 값이 있는 케이스
        - 값이 없으면 예외를 던져 처리하는 것이 자연스러운 케이스
        - 성능이 극도로 중요한 로우레벨 코드

## 디폴트 메서드

-   자바 디폴트 메서드는 인터페이스에서 메서드 본문을 가질 수 있도록 허용하여 기존 코드를 깨뜨리지 않고 새 기능을 추가할 수 있게 해준다.
    -   인터페이스에 메서드 시그니처를 하나 추가했을때 이를 구현하지 않은 대상이 있는 경우 컴파일 에러가 발생한다.
-   `default` 키워드를 붙이면 인터페이스 내에 메서드를 기본 구현으로 제공할 수 있다.

```java
public interface Notifier {
    void notify(String message);

    default void scheduleNotification(String message, LocalDateTime scheduleTime) {
        // ..기본구현 작성
    }
}

// 기본구현 사용
public class SMSNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("...");
    }

    // scheduleNotification은 기본구현 사용
}

// 재정의
public class EmailNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("...");

    @Override
    public void scheduleNotification(String message, LocalDateTime scheduleTime) {
        // 함수 구현
    }
}
```

-   인터페이스의 필요성을 넘어 디폴트 메서드가 필요하게 된 배경은 자바 자체적으로 제공하는 `Collection`, `List`와 같은 인터페이스들의 기능 추가에 있다.
    -   기능이 추가된 경우 전 세계 자바 개발자들의 코드에서 에러가 발생할 것이다.
    -   자바 인터페이스 하위호환성이 떨어지게 된다.
-   디폴트 메서드 사용시 주의점은 다음과 같다.
    1.  반드시 하위호환성을 위해 최소한으로 사용해야 한다.
    2.  인터페이스는 추상화의 역할로 계속 사용해야 한다.
    3.  서로 다른 인터페이스에서 같은 시그니처의 디폴트 메서드가 구현되어 있는 경우, 이를 구현하는 클래스에서는 반드시 오버라이딩을 해야 한다.
        -   그렇지 않으면 충돌이 발생한다.
    4.  디폴트 메서드는 단순 구현을 제공할뿐 특정 state값을 관리하면 안된다.

## 병렬 스트림

-   단일 스트림에서 무거운 작업들을 연속적으로 처리한다고 가정해보자.
    -   각 작업이 1초 소요된다면, 작업이 8개인 경우 총 8초가 소요된다.
-   이번에는 8개의 작업을 4개씩 분할하여 독립 스레드에서 실행 후 join을 한다고 가정해보자.
    -   총 4초의 소요시간으로 단축시킬 수 있다.
    -   스데르 수가 늘어나면 코드 복잡성이 커지고, 예외처리, 스레드 풀 관리 등에 문제가 발생한다.
-   ExecutorService를 사용하여 병렬 처리를 해보자.
    -   총 소요 시간은 4초로 동일하다.
    -   Future 기반으로 get으로 값을 받아오는 것은 편해졌지만, 작업 분할 및 병합 로직은 직접 짜야한다. 스레드 풀 관리도 직접 해야한다.
-   위와 같이 큰 작업을 여러 스레드가 처리할 수 있는 작은 단위 작업으로 분할(Fork)하고, 이 작업을 각 스레드가 처리한다. (Execute) 작업이 모두 마무리 되면 분할된 결과를 하나로 모아야 한다.(Join)
    -   이러한 패턴을 Fork -> Execute -> Join 패턴이라고 한다.
-   자바는 이러한 구조의 작업 처리를 쉽게 할 수 있도록 `java.util.concurrent` 패키지 내에 `Fork/Join`프레임워크를 제공한다.
    -   Divide and Conquer 전략을 채택한다.
    -   작업 훔치기(Work stealing) 알고리즘을 사용한다.
        -   각 스레드는 자신의 작업 큐를 가진다.
        -   작업이 없는 스레드가 바쁜 스레드의 큐에서 작업을 훔쳐와 대신 처리한다.
        -   **부하 균형을 자동으로 조절하여 효율성이 향상된다.**
-   주요 클래스는 다음과 같다.
    -   `ForkJoinPool`
        -   Fork/Join 착업을 처리하는 특수한 ExecutorService 스레드 풀
        -   작업 스케줄링 및 스레드 관리를 담당한다.
        -   분할 정복 및 작업 훔치기에 특화된 스레드 풀이다.
    -   `ForkJoinTask`: Fork/Join 작업의 기본 추상 클래스이다. Future를 구현한다. 아래 하위 클래스를 구현하여 사용한다.
        -   `RecursiveTask<V>`: 결과를 반환하는 작업
        -   `RecursiveAction`: 결과를 반환하지 않는 작업 (void)
        -   위의 두 하위 클래스는 `compute()`메서드를 재정의하여 작업 로직을 작성한다.
        -   작업 범위가 작으면 직접 처리하고, 크면 작업을 둘로 분할하여 병렬로 처리하도록 구현한다.
    -   fork(): 현재 스레드에서 다른 스레드로 작업을 분할하여 보내는 동작
    -   join(): 분할된 작업이 끝날때까지 기다린 뒤 결과를 가져오는 동작
-   fork / join 프레임워크를 실무에서 다룰 일은 드물다.

```java
public class SumTask extends RecursiveTask<Integer> {
    //private static final int THRESHOLD = 4; // 임계값
    private static final int THRESHOLD = 2; // 임계값 변경

    private final List<Integer> list;

    public SumTask(List<Integer> list) {
        this.list = list;
    }

    @Override
    protected Integer compute() {
        // 작업 범위가 작으면 직접 계산
        if (list.size() <= THRESHOLD) {
            log("[처리 시작] " + list);
            int sum = list.stream()
                    .mapToInt(HeavyJob::heavyTask)
                    .sum();
            log("[처리 완료] " + list + " -> sum: " + sum);
            return sum;
        } else {
            // 작업 범위가 크면 반으로 나누어 병렬 처리
            int mid = list.size() / 2;
            List<Integer> leftList = list.subList(0, mid);
            List<Integer> rightList = list.subList(mid, list.size());
            log("[분할] " + list + " -> LEFT" + leftList + ", RIGHT" + rightList);

            SumTask leftTask = new SumTask(leftList);
            SumTask rightTask = new SumTask(rightList);

            // 왼쪽 작업은 다른 스레드에서 처리
            leftTask.fork();
            // 오른쪽 작업은 현재 스레드에서 처리
            Integer rightResult = rightTask.compute();//[5 ~ 8] -> 260

            // 왼쪽 작업 결과를 기다림
            Integer leftResult = leftTask.join();
            int joinSum = leftResult + rightResult;
            log("LEFT[ + " + leftResult + "] + RIGHT[" + rightResult + "] -> sum:" + joinSum);
            return joinSum;
        }
    }
}

/// 호출부
ForkJoinPool pool = new ForkJoinPool(10);
SumTask task = new SumTask(data); // [1 ~ 8]

// 병렬로 합을 구한 후 결과 출력
Integer result = pool.invoke(task);
pool.close();
```

-   `ForkJoinPool(활용할 스레드 갯수)`
    -   기본값은 시스템 프로레서 수
-   `invoke(태스크)`: 태스크를 스레드 풀에 전달
-   `pool.close()` 더 이상 작업이 없을때 풀 종료

:::tip Fork/Join 공용 풀

-   자바 8에서는 Fork / Join용으로 기본 스레드 풀 개념이 도입되었다.
-   별도의 스레드 풀 인스턴스 생성 없이 `ForkJoinPool.commonPool()`을 통해 접근 가능하다.
-   자바8 병렬 스트림은 내부적으로 이 공융풀을 사용한다.
-   별도 풀 생성 대신 공용 풀을 사용하여 시스템 자원 관리가 효율적이다.
-   명시적으로 close를 해줄 필요가 없다.
-   기본 설정은 시스템 설정을 따라가므로 변경할 필요가 없다.
-   parallelism 수준은 프로세서 수 -1만큼으로 설정된다.
    -   parallelism 수준은 스레드 수를 의미한다.
    -   메인 스레드의 참여를 위한 목적이다.

:::

-   병렬 스트림 처리를 위해서는 `parallel` 함수만 호출해주면 된다.

```java
Instream.rangeClosed(1, 8)
    .parallel() // 병렬 스트림화
    .map(HeavyJob::heavyTask)
    .reduce(0, (a,b) -> a+b);
```

:::warning 병렬 스트림 사용 시 주의점

-   병렬 스트림은 I/O바운드 작업이 아닌 CPU 바운드 작업에만 사용해야 한다. (계산 집약적 작업)
    -   스레드가 대기하는 I/O 작업에는 사용하면 안된다.
    -   외부 API 호출 / 데이터베이스 조회 등
-   위 경우에는 ExecutorService를 통해 별도의 스레드풀을 사용해야 한다.
-   여러 스레드가 공용풀에 요청을 하려는 경우 제한된 스레드 환경으로 인해 요청 응답이 밀리게 된다.

:::

## 함수형 프로그래밍

-   프로그래밍 패러다임이란 프로그램을 구성하고 구현하는 사상 또는 접근법을 말한다.
-   명령형 프로그래밍 (ex 절차지향 프로그래밍, 객체지향 프로그램)
    -   프로그램이 어떻게 동작해야 하는지 세세한 제어 흐름을 통해 기술
        -   절차지향: 프로시저 / 함수 기반으로 로직을 절차적으로 구성
        -   객체지향: 데이터(필드)와 함수(메서드)를 하나로 묶은 객체 중심으로 설계
-   선언형 프로그래밍 (ex 함수형 프로그래밍)
    -   무엇을 해야 하는지에 초점을 맞춰 목적만 선언하고, 구현 방식은 추상화
    -   함수형 프로그래밍, SQL, HTML등이 존재
-   함수형 프로그래밍의 핵심 개념 및 특징은 다음과 같다.
    -   순수 함수(Pure Function)
        -   같은 인자를 주면 항상 같은 결과를 반환
        -   외부 상태에 의존하지 않고 사이드 이펙트가 없는 함수
    -   사이드 이펙트 최소화
        -   상태변화 최소화를 위해 변수 / 객체 변경을 지양
        -   버그가 줄고, 테스트, 병렬처리, 동시성 지원이 용이
    -   불변성 지향
        -   변경이 필요한 경우 새로운 값을 생성하여 사용
        -   프로그램 예측 가능성 증대
    -   일급 시민 함수
        -   함수가 일반 값과(숫자, 문자열 객체 등) 동일한 지위를 가짐
        -   함수를 변수에 대입, 인자로 전달, 함수를 반환하는 등 고차 함수를 자유롭게 사용 가능
    -   선언형 접근
        -   어떻게가 아닌 무엇을 계산할지 기술
    -   함수 합성 (Composition)
        -   간단한 함수를 조합하여 더 복잡한 함수를 만드는 것을 권장
        -   체이닝 / 파이프라이닝 적극 활용
    -   지연평가
