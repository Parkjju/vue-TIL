---
title: 자바 중급 - 컬렉션 프레임워크
tags: ['Java']
---

## 제네릭

### 제네릭 타입

```java
public class StringBox {
    private String value;

    public void set(String object) {
        this.value = object;
    }

    public String get() {
        return value;
    }
}
```

-   위 클래스는 String 데이터를 넣고 빼는 역할을 한다.
-   데이터가 확장되는 경우, `Object`클래스 기반으로 다형성을 구현하거나 모든 타입별 박스 클래스를 생성할 수 있다.
    -   타입별 박스 구현: 코드 중복 과다 발생
    -   다형성: 입력 데이터에 잘못된 타입의 데이터를 넣을 가능성 존재 / 리턴 타입이 Object가 되므로 타입 다운캐스팅이 필요
-   해결되지 않는 위 두 문제를 제네릭을 활용하여 해결 가능하다.

```java
public class GenericBox<T> {
    private T value;

    public void set(T value) {
        this.value = value;
    }

    public T get() {
        return value;
    }
}

// 생성시점
public static void main(String[] args) {
    GenericBox<Integer> integerBox = new GenericBox<Integer>();
    // ..
}
```

-   제네릭 클래스 생성 시점에 타입 매개변수에 타입 인자를 전달해주면 된다.
-   제네릭 타입 관례는 다음과 같다.
    -   `E - Element`
    -   `K - Key`
    -   `V - Value`
    -   `N - Number`
    -   `T - Type`
    -   `S`, `U`, `V` - 2nd, 4rd, 4th types

```java
class Data<K, V>()
```

-   타입 매개변수에는 제한이 필요할때도 있다.

```java
public class AnimalHospitalV2<T> {
    private T animal;

    public void set(T animal) {
        this.animal = animal;
    }

    public void checkup() {
        // 컴파일 에러 발생
        // System.out.println("동물 이름: " + animal.getName());
    }
}
```

-   제네릭을 사용하면 어떤 타입이 전달될지 모르기 때문에 컴파일러가 animal 인스턴스에 대한 내부 정보를 알수없다.
-   타입에 대한 제한이 없기 때문에 의도와 다른 `Object`, `Integer`등의 타입들을 마음대로 전달할 수 있다.
-   이러한 문제들을 해결하기 위해 타입 제한을 사용한다.
    -   타입 제한은 `extends` 키워드를 사용한다.

```java
public class AnimalHospitalV2<T extends Animal> {
    // ...
}
```

-   T 타입 인자로 Animal과 그 자식들만 받을 수 있도록 제한을 둔다.
-   이러한 타입 제한을 통해 컴파일러가 T가 받을 수 있는 값 범위를 예측할 수 있다.

### 제네릭 메서드

-   메서드에도 제네릭을 사용한다.
-   메서드 시그니처에서 리턴타입 전에 제네릭을 정의한다.
-   메서드 호출 시점에 타입 인자를 전달한다.

```java
public <T> T genericMethod(T t) {
    return t;
}
//
//
instance.<Integer>genericMethod(3);
```

-   클래스의 제네릭 타입은 제네릭 static 메서드에서 사용 불가능하다.
-   클래스 제네릭 타입은 인스턴스 생성 시점에 결정되지만, `static` 메서드는 클래스 단위로 동작하기 때문이다.

```java
public class Box<T> {

    void instanceMethod(T t) { }

    static <Z> void staticMethod(Z t) {}
}
```

-   자바는 타입 추론을 지원한다.
-   제네릭 메서드가 제네릭 클래스보다 타입 매개변수 우선순위가 높다.
    -   제네릭 클래스의 타입은 타입 제한을 걸고 제네릭 메서드에서는 제한을 걸지 않으면 제네릭 메서드 기반으로 타입이 고정된다.

:::tip 타입 공변성

-   타입에 있어서 공변성이란, `T`가 `S`의 하위 타입이면 `List<T>[]`도 `List<S>[]`의 하위 타입인 성질을 의미한다.
-   제네릭은 타입 공변성이 없다. `List<Number>[]`와 `List<Integer>[]`는 별개이다.

:::

### 타입 와일드 카드

-   자바에서는 와일드 카드로 제네릭 타입을 지정할 수 있다.
-   `?` 키워드를 통해 정의한다. 모든 타입을 다 받을 수 있다는 뜻이다.
-   `? == <? extends Object>`로 해석할 수 있다.
-   `?`만 입력한 와일드 카드는 비제한 와일드카드라고 한다.
-   제네릭 타입 및 제네릭 메서드 정의가 꼭 필요하지 않으면 와일드 카드 사용을 권장한다.

```java
static <T> void printGeneric(Box<T> box) {
    // ..
}

//..

static void printWildcard(Box<?> box) {
    // ..
}
```

-   와일드카드도 extends를 통해 타입 제한을 둘 수 있다.
    -   `Box<? extends Animal>`이는 상한 와일드 카드이다.
    -   `Box<? super Animal>`은 하한 와일드 카드이다. Animal 타입의 상위 타입들만 전달 가능하다.

:::tip 타입 이레이저 (Type Erasure)

-   자바는 제네릭을 컴파일 단계에서만 사용하고 이후에는 제네릭 정보를 삭제한다.
-   타입 매개변수에 제한을 둔 경우 제한을 둔 타입으로 코드를 변경한다.

:::

## ArrayList

-   선언 코드는 아래와 같다.
-   고정된 데이터 크기를 관리할때, 인덱싱 위주로 동작할때 효율적이다.

```java
import java.util.Arrays;

public static void main(String[] args) {
    int[] arr = new int[5];
}
```

-   배열과 리스트는 구분하여 이야기한다.
    -   배열: 순서가 있고 중복을 허용하지만 크기가 정적으로 고정된다.
    -   리스트: 순서가 있고 중복을 허용하지만 크기가 동적으로 변한다.
-   ArrayList는 리스트 자료구조를 사용하되 내부 데이터는 배열에 보관하는 자료구조이다.
-   데이터 크기가 가변적이기 때문에 중간 삽입 및 삭제 등의 연산 시 `O(N)` 복잡도가 발생한다.
-   앞이나 중간에 데이터를 추가할때 성능이 좋지 않다.

## LinkedList

-   배열은 사용하지 않는 공간이 낭비된다.
-   중간 삽입 및 삭제 성능이 좋지 않다.
-   연결 리스트를 사용하면 참조만 변경하면 되므로 중간 삽입 및 삭제 연산이 `O(1)`로 수행된다.

| 연산           | ArrayList | LinkedList | 비고                                          |
| -------------- | :-------: | :--------: | --------------------------------------------- |
| 인덱스 조회    |   O(1)    |    O(n)    | ArrayList는 배열 기반으로 직접 접근 가능      |
| 검색           |   O(n)    |    O(n)    | 둘 다 순차 탐색                               |
| 앞에 추가/삭제 |   O(n)    |    O(1)    | ArrayList는 요소 전체 shift 필요              |
| 뒤에 추가/삭제 |   O(1)    |    O(n)    | ArrayList는 amortized O(1), 용량 초과 시 O(n) |
| 평균 추가/삭제 |   O(n)    |    O(n)    | LinkedList는 탐색 O(n) + 삽입 O(1)            |

-   자바 연결리스트는 양방향 이동이 가능한 이중 연결리스트이다.
-   끝노드의 tail노드가 head가 되므로, O(1)시간에 접근 가능하다.
-   자바 언어상으로는 내부 구현의 차이이지, LinkedList 객체에서 `tail`, `head` 속성을 제공하지는 않는다.

## List

-   `BatchProcessor`라는 클래스를 구현한다고 가정하자.
-   데이터 `add`, `remove`등의 메서드를 구현할때, `ArrayList`기반으로 삽입 추가 메서드가 구현되어 있다.
-   이때 내부 성능이 크게 저하되어 삽입 추가 메서드를 `LinkedList`기반으로 구현하려고 한다.
-   만약 `BatchProcessor`클래스가 ArrayList클래스에 직접 의존하고 있었다면 내부 모든 코드와 구현을 LinkedList기반으로 전환해야 한다.
-   이러한 번거로움을 줄이기 위해 `ArrayList`와 `LinkedList`의 공통 함수를 추출하여 인터페이스로 빼두고, 다형성 기반으로 BachProcessor 내부 데이터 보관소 타입을 자유롭게 변경할 수 있다.
    -   리스트 기반 동작을 자바에서는 `List` 인터페이스로 추출해두었다.
-   이러한 구조를 외부에서 의존관계가 결정되어 인스턴스에 주입하는 것 같다고 하여, **의존관계 주입이라고 표현한다.**

:::tip 컴파일 타임 의존관계 vs 런타임 의존관계

-   컴파일 타임 의존관계: 자바 컴파일러가 보는 의존관계이다.
    -   클래스에 바로 보이는 의존관계
    -   실행하지 않은 소스 코드에 정적으로 나타나는 의존관계
-   런타임 의존관계: 실제 프로그램이 작동할 때 보이는 의존관계
    -   인스턴스 간의 의존관계
    -   실행 중 계속 변할 수 있다.

:::

## Hash

-   Set은 유일한 요소들의 컬렉션이다.
    -   유일성을 보장한다.
    -   순서는 보장하지 않는다.
    -   조회가 빠르다.
-   Set 내부 구현을 배열로 할 경우, `contains`, `add`, `remove` 구현을 할때 모든 동작에 대해 `O(n)` 복잡도를 갖는다. 이렇게 되면 성능이 매우 떨어진다.
    -   동적 배열이더라도 사용되지 않는 공간 최적화가 이루어지지 않으면 메모리가 낭비되기 쉽다.
-   해시 알고리즘을 사용하면 조회 성능이 `O(1)`으로 크게 개선된다.
    -   내부 데이터가 배열이라고 가정할때 int 데이터를 10으로 나머지 연산을 한 결과가 인덱스라고 가정해보자.
    -   이 경우 값을 보고 인덱스를 즉시 알 수 있기 때문에 조회를 즉시 할수있다.
    -   **그러나 나머지 연산 시 동일한 값이 산출되면 해시의 충돌이 발생하게 된다.**
-   해시 충돌 해결을 위해 2차원 배열을 활용할 수 있다.
    -   이렇게 구현했을때 최악의 경우 `O(n)`의 조회 성능이 발생할 수 있다.
    -   해시 충돌은 발생 가능하지만 확률은 낮은 현상으로 본다.
-   **통계학적으로 입력 데이터 수가 배열 크기의 75%를 넘지 않으면 해시 충돌 확률은 낮다고 본다.**
-   해시의 시간복잡도는 다음과 같다.
    -   데이터 저장
        -   평균: O(1)
        -   최악: O(N) / 해시충돌
    -   데이터 조회
        -   평균: O(1)
        -   최악: O(N) / 해시 충돌
-   조회를 위한 키값이 문자열인 경우 `hashCode`메서드와 같이 문자열 값을 특정 해시값으로 변경하여 조회한다.

:::tip 해시 함수

-   해시 함수는 임의 길이의 데이터를 입력받아 고정 길이의 해시값을 출력하는 함수이다. (int의 경우 4byte를 의미하는 고정 길이)
-   해시 함수는 같은 데이터 입력시 항상 같은 해시 코드가 출력된다.
-   다른 데이터를 입력해도 같은 해시 코드가 출력될 수 있다. (해시 충돌)

:::

-   클래스타입을 비롯한 수많은 타입들에 대해 해시 코드는 `Object.hashCode()` 함수에서 얻을 수 있다.
-   객체 참조값을 기반으로 해시 코드를 생성하는데, 인스턴스가 다르면 해시코드도 다르다.
-   해시 자료구조는 `equals`를 반드시 오버라이딩 해야한다.
    -   해시 충돌 시 동일 인덱스 내의 모든 데이터를 조회해보아야 하기 때문이다.
-   `hashCode`를 오버라이딩 하지 않은 클래스 인스턴스는 기본 Object타입의 hashCode 메서드를 사용하게 된다.
    -   참조 기반으로 동작하기 때문에, 프로퍼티에 id값이 있다고 가정할때 해당값이 동일해도 다른 해싱을 할 여지가 존재한다.
-   자바에서 제공하는 해시함수는 충돌 확률이 적고, 균일하게 분포한다.

## Set

-   자바에서의 `Collection` 인터페이스는 `java.util` 패키지의 컬렉션 프레임워크의 핵심 인터페이스 중 하나이다. 해당 인터페이스는 `List`, `Set`, `Queue`와 같은 다양한 하위 인터페이스와 함께 사용된다.
-   Set 인터페이스는 `Collection`의 하위 인터페이스 중 하나이다.
    -   중복을 허용하지 않는 수학적 집합 개념을 구현한 것이다.
    -   `HashSet`, `LinkedHashSet`, `TreeSet`등의 여러 구현 클래스를 가지고 있다.

### HashSet

-   구현: 해시 자료구조를 사용해서 요소를 저장한다.
-   순서: 없음
-   시간 복잡도: 추가, 삭제, 검색은 평균적으로 O(1) 시간 복잡도를 가진다.
-   용도: 데이터 유일성만 중요한 경우 사용

### LinkedHashSet

-   구현: `HashSet`을 상속받는다. 연결리스트를 추가하여 요소들의 순서를 유지한다.
-   순서: 추가된 순서대로 유지된다.
-   시간 복잡도: 추가, 삭제, 검색에 대해 O(1) 시간 복잡도를 갖는다.
-   용도: 데이터 유일성과 함께 삽입 순서를 유지할때 적합하다.
-   참고: 연결 정보를 유지해야 하기 때문에 `HashSet`보다 무겁다.
    -   양방향 연결리스트이다.
-   나중에 중복된 데이터가 push되면 해당 데이터만 무시된다.

### TreeSet

-   구현: 레드-블랙 트래를 내부에서 사용한다.
-   순서: 정렬된 순서로 저장된다.
    -   순서의 기준은 `Comparator`를 기준으로 변경 가능하다.
-   시간 복잡도: O(logN), HashSet보다 느리다.
-   용도: 정렬된 순서로 유지하면서 집합의 특성을 유지해야 할때 사용한다.

:::tip 레드-블랙 트리

-   이진 탐색 트리를 개선한 트리이다.
-   자식이 두개까지 올 수 있는 트리를 이진트리라 한다.
-   왼쪽 자손이 오른쪽 자손보다 작은 값을 갖는 이진 트리를 **이진 탐색 트리라고** 한다.
-   이진 탐색 트리는 **데이터 입력 시점에 정렬된다.**
    -   탐색 1번의 트라이에 절반을 날리는 것에 의미가 있다.
-   평균 검색, 삽입, 삭제 성능은 O(logN)이다.
    -   트리 입력시 모든 데이터가 오른쪽으로 치우치게 되면 시간 복잡도가 O(N)으로 늘어난다. (최악의 경우)
-   트리의 균형을 지속적으로 맞추는 알고리즘을 적용해야 한다.
    -   AVL 트리, 레드-블랙 트리와 같은 것들이 존재한다.

:::

-   `iterator()` 메서드를 통해 이터레이터 객체를 얻고 순회하는 것이 가능하다.

```java
TreeSet<String> set = new TreeSet<>();

set.add("C");
set.add("B");
set.add("A");
set.add("1");
set.add("2");

Iterator<String> iterator = set.iterator();
while (iterator.hasNext()) {
    System.out.print(iterator.next() + " ");
}
// 1 2 A B C - 정렬
```

-   커스텀 타입 객체의 경우 `Comparable`, `Comparator` 인터페이스를 구현해야 한다.

### HashSet 최적화

-   자바 `HashSet` 기본 크기는 16이다.
-   데이터 크기가 75% 이상 증가하면 충돌 확률이 높아져 시간 복잡도가 늘어난다.
-   데이터량이 75% 이상이면 배열 크기를 2배로 증가시키고 모든 데이터를 커진 배열에 맞춰 다시 해싱한다.
    -   이 과정을 리해싱(rehashing)이라고 한다.

## Map

-   자바는 Map 인터페이스를 제공한다. 이를 구현하는 다양한 구현체가 존재한다.
    -   `HashMap`, 이를 상속하는 `LinkedHashMap`
    -   `TreeMap`
-   `put(K key, V value)`: 키와 값을 맵에 저장
-   `putAll(Map<>)`: 지정된 맵의 모든 매핑을 현재 맵에 복사
-   `putIfAbsent(K key, V value)`: 지정된 키가 없는 경우 키와 값을 맵에 저장한다.
-   이 외에 다양한 메서드들을 제공한다.
-   `HashMap`을 가장 많이 사용한다.
-   `Map`의 각 키와 값쌍은 하나로 묶여 `Entry` 타입으로 표현된다.
    -   키는 중복을 허용하지 않기 때문에 `keySet` 메서드 호출시 Set을 반환한다.
    -   값은 중복을 허용하기 때문에 `values` 호출시 `Collection`으로 반환한다.
-   `HashMap`
    -   해시를 사용하여 요소를 저장한다. 키값은 해시코드로 변환되고 데이터 저장 및 검색을 위해 사용한다.
    -   삽입 삭제 검색작업은 해시 기반이므로 평균 O(1) 복잡도를 갖는다.
    -   순서를 보장하지 않는다.
-   `LinkedHashMap`
    -   키 기준 삽입 순서를 유지한다.
-   `TreeMap`
    -   `Comparator`에 의해 **모든 키가** 정렬된다.
    -   평균 O(logN) 복잡도를 갖는다.
    -   키는 정렬된 순서를 갖는다.

## Stack

-   LIFO 자료구조이다.
-   stack, push외에 peek 호출시 마지막 요소 조회만 한다.

```java
Stack<Integer> stack = new Stack<>();
stack.push(1);
stack.peek(); // 조회만
stack.pop();
```

:::warning Stack 클래스는 사용하지 말것

-   자바 스택은 내부적으로 Vector 자료 구조를 사용한다.
-   이는 자바 1.0에서 개발된 자료 구조로, 현재는 사용되지 않고 하위호환을 위해 존재한다.
-   `Deque`자료 구조를 사용하는 것이 좋다.

:::

## Queue

-   FIFO 자료구조이다.
    -   큐에 값을 넣는 것을 `offer`라 하고, 값을 꺼내는 것을 `poll`이라 한다.
    -   큐 또한 peek 메서드를 제공한다.
-   Collection <- Queue <- Deque 관계를 갖는다.
-   큐, 덱은 인터페이스이다.
-   `ArrayDeque`과 `LinkedList`는 Deque 인터페이스를 구현한 클래스이다.

## Deque

-   덱은 `Double Ended Queue`의 준말이다. 큐와 스택 기능을 모두 포함한다.
-   `offerFirst`, `offerLast`: 앞에, 뒤에 요소를 추가한다.
-   `pollFirst`, `pollLast`: 앞에, 뒤에 요소를 꺼낸다.
-   `ArrayDeque`이 모든 면에서 `LinkedList`보다 성능이 좋다.
    -   연결 리스트는 동적 노드 링크를 사용하기 때문이다.
    -   삽입 삭제가 더 자주 발생하는 경우, 이론적으로 연결 리스트의 성능이 더 좋을 수 있지만 현대 시스템 컴퓨터 메모리 접근 패턴과 CPU 캐시 최적화 등을 고려하면 `ArrayDeque`이 성능이 더 좋은 경우가 많다.

## Iterable, Iterator

-   각 자료구조마다 순회의 방법은 다르다. 연결 리스트의 경우 `next` 기반으로 끝 요소가 null일때까지 순회한다.
-   자료구조 구현 형태와 상관없이 모든 자료구조를 동일한 방법으로 순회할 수 있는 방법으로 `Iterable`, `Iterator`를 제공하는 것이다.

```java
public interface Iterable<T> {
    Iterator<T> iterator();
}

public interface Iterator<E> {
    boolean hasNext();
    E next();
}
```

-   Iterable: `Iterator` 반복자를 반환한다.
-   Iterator: 다음 요소가 있는지 확인 / 다음 요소를 반환하는 반복자이다.
-   특정 자료구조와 Iterable, Iterator 사이의 관계는 다음과 같다.
    -   자료구조가 Iterable을 구현한다. `iterator()` 메서드를 구현해야 한다.
    -   커스텀 자료구조를 어떻게 순회시킬지 정의한 커스텀 이터레이터를 정의한다.
    -   커스텀 이터레이터가 `Iterator`를 구현한다.
    -   `iterator` 메서드에서는 커스텀 이터레이터 객체를 반환한다.
-   **Iterable을 구현한 커스텀 객체는 for-each문을 사용할 수 있다.**
-   자바 Collection 인터페이스는 `Iterable`을 상속받는다.
    -   각 자료구조에 맞는 Iterator 구현체도 이미 존재한다.

## Comparable, Comparator

-   `Comparator` 인터페이스를 구현하여 정렬 기준을 직접 정의할 수 있다.
-   `Comparable` 인터페이스를 구현하여 커스텀 객체 타입에 대해서도 정렬 로직을 정의할 수 있다.
    -   `compareTo(T o)` 메서드 구현체를 정의한다.
    -   this 멤버와 o 객체 멤버사이의 비교 기준을 정의하면 된다.
-   sort 메서드 호출 시 Comparator 객체를 파라미터로 전달할 수 있다.
    -   별도 정의한 Comparator 우선순위가 더 높다.
-   트리 기반 자료구조는 런타임에 정렬이 계속 이루어지므로 객체 생성 시 `Comparator`를 인자로 전달해야 한다.
    -   전달하지 않은 경우 객체가 구현한 `Comparable`을 사용한다.

:::tip 컬렉션 관련 유틸 함수

-   `Collections` 관련 유틸
    -   `Collections.max(Collection c)`
    -   `Collections.min(Collection c)`
    -   `Collections.shuffle(Collection c)`
    -   `Collections.sort(Collection c)`
    -   `Collections.reverse(Collection c)`
    -   `Collections.unmodifiableList(mutableList)`: 가변 리스트를 불변 리스트로 변환해준다.
    -   `Collections.emptyList()`: 빈 불변리스트 생성
    -   `Collections.synchronizedList(list)`: 멀티스레드 상황에서 동기화 문제가 발생하지 않는 리스트
-   `of` 메서드: 컬렉션을 편리하게 생성 가능
    -   `List<Integer> list = List.of(1,2,3);`
    -   List, Set, Map 모두 지원한다.
    -   위 메서드를 호출하면 불변 컬렉션이 생성된다.
    -   불변 컬렉션은 변경 불가능하다.
    -   `List.of`: 빈 불변리스트 생성, 자바 9부터 제공되는 최신 기능 (간결하여 더 권장)
-   `new ArrayList<>()`: 불변 리스트를 가변 리스트로 변환해준다.
    -   `new ArrayList<>(list);`

:::
