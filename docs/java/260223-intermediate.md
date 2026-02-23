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

문자열 풀ㅇ
