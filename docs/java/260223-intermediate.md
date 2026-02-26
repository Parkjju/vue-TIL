---
title: 자바 중급
tags: ['Java']
---

## Object 클래스

-   자바에서 모드 클래스의 최상위 부모 클래스는 Object 클래스이다.
-   Object 클래스에서 제공하는 기능들은 다음과 같다.
    1. `toString()`: 객체의 정보 제공 (해시 형태로 객체의 참조값을 제공)
        - `System.out.println(object.toString());`과 `System.out.println(object);`는 동일하게 동작한다.
        - 일반적으로 `toString()` 메서드를 오버라이딩하여 객체 참조값 외에 프로퍼티 값들을 적절히 섞어 출력하는 형태로 사용한다.
        - toString, hashCode 오버라이딩 이후에도 참조값을 출력하려면 `Integer.toHexString(System.identityHashCode(객체));` 코드를 사용한다.
    2. `equals()`: 객체의 같음을 비교
    3. `getClass()`: 객체의 클래스 정보를 제공
    4. et cetera
-   자바가 `extends Object` 코드를 내부적으로 넣어준다.
-   상속 받을 부모 클래스를 명시적으로 지정하면 `Object`를 상속받지 않는다.
-   모든 클래스가 Object를 상속받기 때문에, 타입이 다른 객체를 다른 곳에 보관해야 한다면 `Object`에 보관하면 된다.
    -   모든 객체를 대상으로 다형적 참조가 가능하지만 실제 메서드 호출이 필요한 경우 **타입 다운캐스팅을 해야한다.**

:::tip Object 활용

다형적 참조를 활용하여 모든 타입의 객체를 담을 수 있는 배열을 만들 수 있다.

```java
Dog dog = new Dog();
Car car = new Car();
Object object = new Object(); //Object 인스턴스도 만들 수 있다.

Object[] objects = {dog, car, object};
```

:::

-   toString 외에도 자바 언어가 기본으로 제공하는 다양한 메서드들은 필요에 따라 오버라이딩하여 사용 가능하다.
-   의존 관계에는 동적 의존관계, 정적 의존관계가 있다.
    -   정적 의존관계: 컴파일 시간에 결정, 클래스 간의 관계를 주로 의미
    -   동적 의존관계: 런타임에 확인 가능한 의존관계, 함수 인자로 어떤 객체가 전달될지는 프로그램을 실제 실행해봐야 알 수 있음.

## equals

-   Object 타입은 동등성 비교를 위해 `equals` 메서드를 제공한다.
-   동일성과 동등성은 구분하여 알아두자.
    -   동일성(Identity): `==` 연산자를 사용하여 두 객체의 참조가 동일한 객체를 가리키고 있는지 확인
    -   동등성(Equality): `equals()` 메서드를 사용하여 두 객체가 논리적으로 동등한지 확인
-   동일은 완전히 같음을 의미하고, 동등은 같은 가치나 수준이지만 그 형태나 외관 등이 완전히 같지는 않은 것이다.

```java
// 동등성 예시
User a = new User("id-100"); // 0x011
User b = new User("id-100"); // 0x012
```

-   `equals` 메서드는 기본적으로 동일성 비교가 기본이고, 동등성 비교를 정의하고 싶은 경우 메서드 오버라이딩이 필요하다.
-   엄밀한 의미에서 `equals`를 구현하기 위해서는 부수적인 코드들이 더 필요하다.
    -   해당 코드는 인텔리제이 IDE에서 자동 생성이 가능하다.

## 불변 객체

-   참조 타입을 갖는 서로 다른 변수에 대해 대입연산을 하게 되면 참조값이 복사되어 대입된다.
-   참조값 공유로 인해 값 변경 시 기존 변수가 참조하던 객체의 값도 변경되게 된다.
    -   참조는 공유하여 메모리 상 이점은 가져가되, 내부 멤버, 필드 값이 변하지 않는 객체를 불변 객체(Immutable Object)라고 한다.
    -   불변 클래스를 만드는 법은 필드 값을 변경할 수 없도록 클래스를 설계하면 된다. (필드에 final 키워드를 사용)
-   참조 타입 객체의 개발 레벨의 자체 규약 수준으로는 사이드 이펙트를 막을 수 없기 때문에, 컴파일 레벨에서 필드 변경을 감지하도록 클래스를 설계하면 된다.

:::tip 불변 객체의 값 변경이 필요한 경우

엄밀한 의미에서 값 변경은 불가능하지만, 마치 필드가 변경된 것처럼 사용하려면 새로운 불변 객체를 리턴하도록 메서드를 작성하면 된다.

```java
public class ImmutableObj {
    private final int value;

    public ImmutableObj(int value) {
        this.value = value;
    }

    // 필드 변경 후 새로운 불변 객체를 반환
    public ImmutableObj add(int addValue) {
        int result = value + addValue;
        return new ImmutableObj(result);
    }

    public int getValue() {
        return value;
    }
}
```

:::

-   자바에서 `String` 클래스, `Integer`, `LocalDate`등 수 많은 클래스가 불변으로 설계된 클래스이다.

## String 클래스

-   String은 클래스이다. 문자열은 자주 사용되기 때문에 클래스여도 `new` 키워드 없이 쌍따옴표로만 감싸도 인스턴스로 생성된다.
    -   만약 문자열 풀에 동일한 문자열 리터럴 값이 존재하면 기존 참조값을 재사용한다. 이를 문자열 인터닝 기법이라고 한다.
-   String 클래스 구조는 대략 아래와 같다.

```java
public final class String {
    private final char[] value; // 자바 9 이전
    private final byte[] value; // 자바 9 이후

    public String concat(String str) { ... }
    public int length() { ... }
}
```

-   영문/숫자 등은 1바이트인데 코딩 과정에서 대부분 영문/숫자만 사용한다.
-   자바 char는 기본적으로 플랫폼 독립성 유지를 위해 UTF-16을 기본 인코딩 타입으로 사용하기 때문에 2바이트를 차지한다.
-   String 내부 문자열 데이터를 `char[]`로 저장하는 경우 대부분 1바이트짜리 문자열을 굳이 2바이트 공간 내에 저장하게 되어 메모리 효율성이 떨어진다.
-   따라서 내부를 `byte[]` 타입으로 변경하여 영여/숫자로만 표현된 `Latin-1` 인코딩 문자열의 경우 1byte 배열로 표현하고, 나머지의 경우 `UTF-16` 인코딩을 그대로 사용한다.

:::tip String 클래스 equals

`equals` 메서드는 기본적으로 동일성을 검증하지만, `String` 객체는 내부적으로 메서드를 오버라이딩 해두어 문자열 값이 같으면 `equals`메서드에서 `true`를 반환한다.

:::

:::tip 자바 문자열 풀

자바에서 문자열 리터럴은 문자열 풀에서 관리된다. 문자열 풀 내에 문자열 인스턴스들이 존재하고, 런타임에 문자열 리터럴을 사용하는 경우 문자열 풀 내에서 동일한 값을 갖는 문자열 인스턴스를 찾아 참조를 반환한다.

문자열 풀에서의 조회는 해시 알고리즘을 통해 이루어지기 때문에 빠른 속도로 인스턴스를 찾을 수 있다.

:::

:::warning 문자열 풀 메모리 구조

문자열 풀은 힙 내에 존재한다. `new String` 생성자를 통해 문자열 인스턴스를 생성하는 경우 독립 참조로 문자열 풀 밖에서 관리되지만 힙 내에서 관리되는 것은 동일하다.

:::

-   자바 문자열은 불변 객체이다. 속성값을 직접 변경하지 않고 새로운 String을 반환하는 구조이다.
    -   문자열 풀에 있는 String 인스턴스의 값이 변경되면 같은 곳을 참조하는 모든 변수의 값이 변경되는 사이드 이펙트가 발생하기 때문이다.
-   문자열 리터럴을 사용하지 않고 `new String("...");`와 같이 new 키워드와 문자열을 생성하는 경우 매번 독립적인 새 인스턴스로 문자열 풀에 생성된다.
-   자바 문자열은 문자열을 더하거나 변경할때마다 새로운 객체를 계속해서 생성한다.

```java
String str = "A" + "B" + "C" + "D";
// 1. String str = String("A") + String("B") + String("C") + String("D");
// 2. String str = new String("AB") + String("C") + String("D")
// ...
```

-   위 코드에서 징검다리처럼 부분 문자열이 계속 만들어지며 새로운 인스턴스를 만들고 더 이상 참조하지 않는 문자열에 대해 GC를 수행하게 된다.
    -   이 과정에서 CPU / 메모리 부하가 추가적으로 발생하게 된다. 이를 해결하기 위해 자바가 내부에서 문자열 처리를 위한 최적화를 수행한다.

:::tip StringBuilder 활용

-   문자열이 불변 객체로 관리되기 때문에 잦은 문자열 수정 과정에서 메모리 CPU 부하가 발생하는데, 이를 해결하기 이해서는 문자열을 가변 객체로 관리하면 된다.
-   이를 해결하기 위해 `StringBuilder`라는 가변 String 타입을 사용한다.
    -   `StringBuilder`는 내부에 `final`이 아닌 변경 가능한 `byte[]`를 가지고 있다.
-   String은 불변 객체이기 때문에 애시당초 해당 인스턴스에 `append`같은 메서드를 지원하지 않는다는 점을 기억하면 된다.

```java
public static void main(String[] args) {
    StringBuilder sb = new StringBuilder();
    sb.append("A");
    sb.append("B");
    System.out.println("sb = " + sb);

    String str = "";
    str.concat("B");
}
```

:::

-   자바는 여러 방법을 활용하여 String 최적화를 진행한다.
-   아래 예시들은 자바 내부적으로 알아서 처리해주는 부분

```java
// 1. 문자열 리터럴 최적화
// - 컴파일 전
String helloWorld = "Hello, " + "World!";

// - 컴파일 후
// - 결합 연산 생략하여 성능향상
String helloWorld = "Hello, World!";


// 2. String 변수 최적화
// - 최적화 전: 컴파일 시점에 str1, str2에 어떤 값이 들어갈지 확정이 불가능
// - 단순 합치기 연산이 어렵다
String result = str1 + str2;

// - 최적화 후
// - 문자열을 가변 객체로 처리하여 문자열 인스턴스 생성 및 GC 부하 감소
String result = new StringBuilder().append(str1).append(str2).toString();
```

## 래퍼 클래스

-   int, double과 같은 원시 타입, 기본형 타입들은 객체가 아니다.
    -   메서드, 제네릭 등을 사용할 수 없다.
    -   null값을 가질 수 없다.
-   자바에서는 기본형을 객체로 감싸 더 편리하게 사용하도록 도와준다. 래퍼 클래스는 기본형의 객체 버전이다.
    -   `byte` -> `Byte`
    -   `short` -> `Short`
    -   `int` -> `Integer` ...
-   래퍼 클래스는 다음과 같은 특징을 갖는다.
    -   불변이다.
    -   `equals`로 비교해야 한다. 객체이기 때문에 `==`연산자를 사용하면 참조값끼리 비교하게 된다.
-   기본형을 래퍼 클래스로 변경하는 것을 박싱(Boxing)이라고 한다.
    -   래퍼 클래스에 있는 기본형 값을 다시 꺼내는 것을 언박싱(Unboxing)이라 한다.
-   래퍼 클래스를 통한 객체 생성은 `.valueOf()` 메서드를 사용한다.
-   자바는 래퍼클래스 - 기본형 사이 변환을 간소화 하기 위해 오토 박싱(Auto-Boxing), 오토 언박싱(Auto-Unboxing)을 지원한다.

```java
Integer boxedValue = value; // 오토 박싱

int unboxedValue = boxedValue; // 오토 언박싱
```

-   `.valueOf()` 메서드는 래퍼 타입을 반환하지만, `parseInt()`와 같은 메서드는 기본형을 반환한다.

## Class 클래스

-   Class 클래스는 클래스의 메타데이터를 다루는데 사용된다.
-   Class 주요 기능은 다음과 같다.
    1. 타입 정보 획득: 클래스 이름, 상위 클래스, 인터페이스, 접근 제한자 등의 정보 조회
    2. 리플렉션: 클래스에 정의된 메서드, 필드, 생성자 등을 조회하여 이들을 통해 객체 인스턴스를 생성하거나 메서드를 호출할 수 있다.
    3. 동적 로딩 및 생성: `Class.forName()`을 사용하여 클래스를 동적으로 로드하고 `newInstance()`메서드를 통해 새 인스턴스 생성이 가능하다.
        - `Class strClass = Class.forName("java.lang.String");`
        - `.getDeclaredConstructor().newInstance();`를 통해 인스턴스 생성도 가능하다.
    4. 어노테이션 처리: 클래스에 적용된 어노테이션을 조회하고 처리한다.

```java
// 자바에서 자체적으로 Field, Method 타입을 보유
import java.lang.reflect.Field;
import java.lang.reflect.Method;

//...
Field[] fields = String.class.getDeclaredFields();
Method[] methods = String.class.getDeclaredMethods();
```

:::tip 각종 클래스들

-   System 클래스
    -   시스템 API에 해당한다.
    -   `System.currentTimeMillis()`, `System.getenv()`등의 메서드를 통해 시스템 시각, 환경변수 등을 얻을 수 있다.
    -   표준 입출력: System.in, System.out
    -   시간 측정: `System.currentTimeMillis()`, `System.nanoTime()` 등
        -   나노타임 API의 시작지점은 JVM에 의해 임의로 결정된다. 각 시간 지점의 경과 시간을 측정할때만 사용해야 한다.
    -   환경 변수
    -   시스템 속성(자바에서 사용하는 설정값)
    -   시스템 종료: System.exit(int status)
        -   0이 정상
    -   배열 고속 복사: `System.arraycopy`는 시스템 레벨에서 최적화된 배열 복사 연산을 수행한다.
-   Math 클래스
    -   절댓값 연산, 최대 최소값, 로그 계산, 지수함수, 올림 반올림, 삼각함수, 제곱근 등 다양한 함수를 제공한다.
-   Random 클래스 - 랜덤값 생성

:::

## 열거형 - ENUM

```java
public enum Grade {
    BASIC, GOLD, DIAMOND
}
```

-   열거형 정의 시 `enum` 키워드를 사용한다.
-   상수 이름은 단순히 나열하면 된다.
-   **열거형도 클래스이다.**
    -   상수만 관리하는 특별한 클래스이다.
-   열거형은 자동으로 `java.lang.Enum`을 상속받는다.
-   열거형은 내부적으로 `toString`을 재정의 하기 때문에 참조값을 직접 확인할 수 없다.
    -   직접 `System.identityHashCode()`를 통해 참조값을 반환받은 뒤 `toHexString()`을 통해 참조값을 출력해볼 수 있다.
-   다양한 내부 메서드를 제공한다.
    -   `values()`: 모든 ENUM 상수를 포함하는 배열을 반환한다.
    -   `valueOf(String name)`: 주어진 이름과 일치하는 ENUM 상수를 반환한다.
    -   `name()`: ENUM 상수 이름을 문자열로 반환한다.
    -   `ordinal()`: ENUM 상수 선언 순서를 반환한다.
        -   중간에 상수를 선언하는 위치가 변경되면 전체 상수 위치가 변경되기 때문에 주의해야 한다.
    -   `toString()`: ENUM 상수 이름을 문자열로 반환한다. name과 유사하지만 toString은 오버라이딩이 가능하다.

```java
public enum NAME {
    B,C,D;

    @Override
    public String toString() {
        return "Overrided " + this.name();
    }
}
```

-   열거형 상수 선언시 생성자에 맞는 인수를 전달하면 적절한 생성자가 자동으로 호출된다. (연관값과 같은 구조)

```java
public enum Grade {
    BASIC(10), GOLD(20), DIAMOND(30);

    private final int discountPercent;

    Grade(int discountPercent) {
        this.discountPercent = discountPercent;
    }
}
```

-   switch문, for each문에서도 사용 가능하다.

## 날짜와 시간

-   `java.time` 라이브러리를 사용하면 된다.
-   LocalDateTime, LocalDate, LocalTime, ZonedDateTime, Period, Duration 여러 타입이 존재한다.
-   각 타입의 인스턴스들의 메서드들을 필요에 따라 사용하면 된다.
    -   `now()`: 현재 시각 기준으로 인스턴스 생성
    -   `of()`: 특정 날짜를 기준으로 인스턴스 생성
    -   `plusDays()`, `plusSeconds()`..: 특정 시간값을 더해준다
    -   Period, Duration을 가지고 원하는 날짜값만큼 `plus()` 해줄 수도 있다.
-   `ZoneId.systemDefault()`: 시스템이 사용중인 기본 타임존 아이디값을 반환한다.
    -   각 PC 환경마다 다를 수 있다.
-   `ZoneId.of("Asia/Seoul")`: 타임존을 직접 제공하여 ID값을 반환받는다.
-   `Instant`: UNIX 타임을 나노초 정밀도로 표현한다.
-   `Period`: 두 날짜 사이 간격을 년,월,일로 나타낸다.
    -   `getYears()`...
-   `Duration`: 두 날짜 사이 간격을 시, 분, 초(나노초) 단위로 나타낸다.
    -   `toHours()`...
-   날짜와 시간 표현을 위한 인터페이스가 존재한다.
    -   `TemporalAccessor`
        -   날짜와 시간을 읽기 위한 기본 인터페이스.
        -   해당 인터페이스는 **특정 시점 날짜와 시간 정보를** 읽을 수 있는 최소한의 기능을 제공한다.
    -   `Temporal`
        -   TemporalAccessor의 하위 인터페이스로, 날짜와 시간을 조작하기 위한 기능을 제공한다.
        -   Temporal Accessor -> Temporal -> (LocalDateTime, ZonedDateTime, Instant)로 정리할 수 있다.
    -   `TemporalAmount`
        -   **시간의 간격을** 나타내며 날짜와 시간 객체에 적용하여 조정할 수 있다.
        -   TemporalAmount -> (Period, Duration)
-   날짜와 시간 측정 단위를 나타내는 타입이 존재한다.
    -   `TemporalUnit`: 이 인터페이스는 날짜와 시간을 측정하는 단위를 나타낸다. `ChronoUnit` 열거형에 구현되어 있다.
    -   NANOS, MICROS, HOURS..
    -   DAYS, YEARS...
    -   ERAS, FOREVER..
    -   ChronoUnit에는 다양한 메서드도 존재한다.
        -   `isDateBased()`: 현재 ChronoUnit이 날짜 기반인지 (ChronoUnit.DAYS.isDateBased())
        -   `isTimeBased()`: 현재 ChronoUnit이 유닛이 시간 기반인지
        -   ...
-   `ChronoField`는 날짜 및 시간을 나타내는 데에 사용되는 열거형이다.
    -   날짜와 시간 중에 있는 특정 필드들을 뜻한다. `YEAR`, `MONTH_OF_YEAR`, `DAY_OF_MONTH`처럼, 단순 시간 단위가 아닌 의미를 갖는 특정 필드를 의미한다.
    -   `ChronoField.MONTH_OF_YEAR.range()`..
    -   `TemporalAccessor` 인터페이스 구현 인스턴스는 get 메서드를 제공하는데, 이 인수로 `ChronoField`를 지정하면 특정 시각에 대해 원하는 필드로 출력 가능하다.
        -   굳이 사용하지 않고 일반적인 경우 `getDayOfMonth`와 같은 편의 메서드를 사용하면 된다.
-   `TemoporalAdjusters`를 통해 복잡한 날짜를 사용할 수 있다.
    -   `TemporalAdjusters.lastInMonth(DayOfWeek.SUNDAY)`
    -   다양한 메서드들이 존재한다.
-   `DateTimeFormatter.ofPattern`을 사용하면 포맷팅이 가능하다.
-   `LocalDate.parse(input, formatter)`를 통해 파싱도 된다.

## 중첩 클래스

-   중첩 클래스는 총 4가지가 있고, 2종류로 분류 가능하다.
    -   정적 중첩 클래스
    -   내부 클래스 종류 3가지
        -   내부 클래스(inner class): 바깥 클래스의 인스턴스 멤버에 접근
        -   지역 클래스(local class): 내부 클래스의 특징 + 지역 변수에 접근
        -   익명 클래스(anonymous class): 지역 클래스의 특징 + 클래스의 이름이 없는 특별한 클래스
-   중첩 클래스 정의 위치는 변수 선언 위치와 동일하다.
    -   정적 중첩 클래스: 정적 변수와 같은 위치
    -   인스턴스 변수: 인스턴스 변수와 같은 위치
    -   지역 변수: 지역 변수와 같은 위치

```java
class Outer {
    // 정적 중첩 클래스
    static class StaticNested { .. }

    // 내부 클래스
    class Inner { .. }

    public void process() {
        // 지역 클래스
        class Local { .. }

        Local local = new Local();
    }
}
```

-   정적 중첩 클래스는 바깥 클래스와 전혀 다른 클래스이다. 위치만 특정 클래스 내부인 것이다.
    -   static이 붙는다.
-   내부 클래스는 바깥 클래스를 요소이다. **따라서 바깥 클래스의 인스턴스에 소속된다.**
    -   static이 붙지 않는다.
    -   바깥 클래스의 private 접근 제어자에 접근할 수 있다.
    -   내부 클래스 인스턴스는 `outerInstance.new Inner()`로 생성할 수 있다.
        -   내부 클래스는 개념상 바깥 클래스의 인스턴스 내부에 생성된다.
        -   **따라서 바깥 클래스의 인스턴스를 먼저 생성해야 내부 클래스 인스턴스를 생성할 수 있다.**
        -   **개념 구조 상 내부라는 단어가 쓰인 것이지, 실제로는 내부 클래스가 외부 클래스 인스턴스를 향해 참조를 하고 있는 형태이다.**
-   중첩 클래스는 특정 클래스가 하나의 클래스 안에서만 사용되거나 둘이 긴밀히 연결된 특별한 경우에만 사용해야 한다.
    -   논리적 그룹화: 특정 클래스가 다른 하나의 클래스 안에서만 사용되는 경우
    -   캡슐화: 중첩 클래스는 바깥 클래스의 private 멤버에 접근 가능하여, 불필요한 public 메서드를 제거하고자 할때 사용한다.
-   자동차 <-> 엔진 관계를 보면 이해가 쉽다.
    -   엔진을 구성하는 프로퍼티들은 외부에서 사용되지 않는다.
    -   엔진 자체도 외부에서 사용되지 않는다.
    -   엔진을 구성하는 프로퍼티 및 메서드가 자동차의 메서드는 아니다.
    -   자동차의 내부 클래스로 엔진을 정의하는 것이 자연스럽다.
-   내부 클래스에서 외부 클래스 인스턴스를 참조하려면 `OuterClassName.this.property` 형태로 참조하면 된다.

## Reference

-   [F-lab 자바의 스트링 풀(String Pool) 이해하기](https://f-lab.kr/insight/understanding-java-string-pool)
