---
title: 자바 고급 - 프로세스와 스레드 및 동시성
tags: ['Java']
---

## 운영체제 기본

### 멀티 태스킹, 멀티 프로세싱

-   각 프로그램의 실행 시간을 분할하여 **마치 동시에 실행되는 것 처럼 하는 기법을 시분할(Time Sharing, 시간 공유) 기법**이라고 한다.
-   **하나의 컴퓨터 시스템이 동시에 여러 작업을 수행하는 능력을 멀티태스킹이라 한다.**
-   현대에는 단순 시간으로만 분할되는 방식 뿐만 아니라 CPU의 최대 활용을 위한 여러 최적화 방식들이 사용된다.
-   멀티 프로세싱은 컴퓨터 시스템에서 둘 이상의 프로세스를 사용하여 여러 작업을 동시에 처리하는 기술을 의미한다.
-   멀티 프로세싱은 하드웨어 장비의 관점이고, 멀티 태스킹은 운영체제 소프트웨어의 관점이다.
-   멀티 프로세싱
    -   여러 CPU(코어)를 사용하여 동시에 여러 작업을 수행하는 것
    -   하드웨어 기반 성능 향상
-   멀티 태스킹
    -   단일 CPU(코어)가 여러 작업을 동시에 수행하는 것처럼 보이게 하는 것
    -   소프트웨어 기반으로 CPU시간을 분할 후 각 작업에 할당

### 프로세스

-   프로그램은 실행 전까지는 단순 파일에 불과하다
-   프로그램을 실행하면 프로세스가 만들어지고 프로그램이 실행된다.
-   **운영체제 안에서 실행중인 프로그램을 프로세스라고 한다.**
-   **각 프로세스는 독립적인 메모리 공간을 갖는다.**
    -   서로의 메모리에 직접 접근이 불가능하다.
-   프로세스의 메모리 구성은 다음과 같다.
    -   코드: 실행할 프로그램 코드가 저장되는 영역
    -   데이터: 전역 변수 / 정적 변수가 저장되는 영역
    -   힙: 동적으로 할당되는 메모리 영역
    -   스택: 메서드 호출 시 생성되는 지역변수와 반환주소가 저장되는 영역

### 스레드

-   **스레드는 프로세스 내에서 실행되는 작업의 단위이다.**
-   프로세스는 하나 이상의 스레드를 반드시 포함한다.
-   프로세스가 제공하는 동일한 메모리 공간을 공유한다.
-   **각 스레드는 자신의 스택을 갖고 있다.**
-   프로세스는 실행 환경과 자원을 제공하는 컨테이너 역할을 한다.
-   스레드는 CPU를 사용해서 코드를 하나하나 실행한다.

### 컨텍스트 스위칭

-   멀티태스킹의 경우 스레드 A를 멈추는 시점에 CPU에서 사용하던 여러 값들을 메모리에 저장해두어야 한다. 이후 스레드 A를 다시 실행할때 이 값들을 CPU에 다시 불러와야 한다.
-   위 과정을 컨텍스트 스위칭(context switching)이라 한다.
-   CPU 바운드 작업(CPU-bound tasks)
    -   CPU 연산 능력을 많이 요구하는 작업
    -   계산, 데이터 처리, 알고리즘 실행 등 CPU 처리 속도가 작업 완료 시간을 결정하는 경우
    -   복잡한 수학 연산, 데이터 분석 등
-   I/O 바운드 작업
    -   디스크, 네트워크, 파일 시스템 등 입출력(I/O) 작업을 많이 요구하는 작업
    -   I/O작업이 완료될 때까지 대기시간이 많이 발생, CPU는 상대적으로 유휴 상태에 있는 경우가 많음
    -   데이터베이스 쿼리, 파일 읽기 쓰기, 네트워크 통신, 사용자 입력처리 등
-   일반적인 웹 애플리케이션 작업은 I/O 작업이 많으므로 성능 개선 시 코어를 늘리기보다 스레드 수를 늘리는 것으로 해결될 때가 많다.

## 스레드

-   자바 메모리 구조 정리
    -   메서드 영역 (코드 + 데이터): 프로그램을 실행하는데 필요한 공통 데이터 관리, 프로그램 모든 영역에서 공유
        -   클래스 정보: 클래스 실행 코드, 필드, 메서드, 생성자 코드 등 모든 실행코드 존재
        -   static 영역: static 변수들 보관
        -   런타임 상수 풀: 프로그램 실행 시 필요한 공통 리터럴 상수
    -   스택 영역: 실행 시 하나의 실행 스택 생성, 각 스택프레임은 지역변수, 중간 연산 결과, 메서드 호출 정보 등을 포함
    -   힙 영역: 객체와 배열이 생성되는 영역, GC가 이루어지는 주요 영역

## Thread 상속으로 스레드 생성

-   자바에서 스레드를 만들기 위해서는 `Thread` 클래스를 상속받거나 `Runnable` 인터페이스를 구현하는 방법이 있다.

```java
public class HelloThreads extends Thread {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " : run()");
    }
}

//...

public class HelloThreadMain {
    public static void main(String[] args) {
        HelloThread thread = new HelloThread();
        thread.start();
    }
}
```

-   Thread 상속 후 스레드가 실행할 코드를 run 메서드에 재정의한다.
-   **스레드 객체를 생성하고 start 메서드를 호출한다.**
    -   스레드 클래스에서 재정의한 run 메서드는 생성된 스레드 스택 위에서 실행된다.
    -   호출자가 run 메서드를 직접 호출하면, 현재 스레드의 스택에서 run 메서드가 실행될 뿐이다.
-   별도로 스레드 이름을 부여하지 않으면 `Thread-0`, `Thread-1`과 같이 이름이 자동으로 부여된다.

### 데몬 스레드

-   스레드는 사용자(user) 스레드와 데몬(daemon) 스레드 2가지 종류로 구분할 수 있다.
-   사용자 스레드(non-daemon) 스레드
    -   프로그램의 주요 작업을 수행
    -   작업이 완료될때까지 실행
    -   모든 user 스레드가 종료되면 JVM도 종료
-   데몬 스레드
    -   백그라운드에서 보조적인 작업 수행
    -   모든 user 스레드가 종료되면 데몬 스레드는 자동으로 종료
    -   스레드 객체의 `thread.setDaemon(true)`으로 설정하면 된다.
    -   데몬 스레드 여부는 start함수 호출 전에 결정되어야 한다. 이후에는 변경되지 않는다.

## Runnable로 스레드 생성

-   Runnable 인터페이스 구현 시에도 스레드 생성이 가능하다.

```java
public class HelloRunnable implements Runnable {
    @Override
    public void run() {
        // ...
    }
}

// ..

public class HelloRunnableMain {
    public static void main(String[] args) {
        HelloRunnable runnable = new HelloRunnable();
        Thread thread = new Thread(runnable);
        thread.start();
    }
}
```

-   Thread는 클래스 방식이고, 자바는 다중 상속 지원을 하지 않으므로 상속에 제한이 걸린다.
-   Runnable은 상속이 자유롭다.
-   원하는 경우 비동기 작업을 Runnable을 구현하는 클래스 내에 정의해둔 뒤, 객체 생성시에 전달하는 구조로 구현해도 된다.
    -   유연하고 유지보수 하기에 더 쉽다.
-   특정 작업을 하는 Runnable 하나에 여러 스레드를 생성하는 것이 가능하다.
-   중첩 클래스를 사용하면 특정 클래스 안에서만 사용되는 비동기 객체를 쉽게 구현할 수 있다.

```java
public class MainRunnable {
    public static void main(String[] args) {
        // ..
        Runnable runnable = new MyRunnable();
        Thread thread = new Thread(runnable);
        thread.start();
    }

    // 중첩 클래스로 구현
    static class MyRunnable implements Runnable {
        @Override
        public void run() {
            // ..
        }
    }
}
```

-   익명 클래스를 사용하면 메서드 안에서만 간단히 사용 가능하다.

```java
Thread thread = new Thread(new Runnable() {
    @Override
    public void run() {
        log("run()");
    }
});

thrad.start();
```

## 스레드 제어

-   자바 스레드는 디버깅을 위해 다양한 정보를 제공한다.
    -   `thread.getName()`: 스레드 이름 출력
    -   `thread.threadId()`: 스레드 아이디 출력, JVM 내에서 유일
    -   `thread.getPriority()`: 1~10, 기본값 5
        -   setPriority()를 통해 우선순위 설정 가능
    -   `thread.getThreadGroup()`: 스레드가 속한 스레드 그룹 반환
        -   여러 스레드를 하나의 그룹으로 묶어 특정 작업 수행 가능 (일괄 종료, 우선순위 설정 등)
    -   `thread.getState()`: Thread.State 열거형 내에 정의되어 있다.
        -   NEW: 스레드가 시작되기 전 상태
            -   스레드 객체 생성은 됐지만 `start` 메서드가 호출되지 않은 상태
        -   RUNNABLE: 스레드 실행 중 또는 실행될 준비가 된 상태
            -   `start`메서드 호출 이후 시점
            -   스케줄러 실행 대기열에 포함되어 있다가 차례로 CPU에서 실행
        -   BLOCKED: 스레드가 동기화 락을 기다리는 상태
            -   `synchronized(lock) { ... }` 블록에 진입하기 위해 락을 얻어야 하는 경우
        -   WAITING: 스레드가 다른 스레드 특정 작업이 완료되기를 기다리는 상태
            -   `wait`, `join`메서드가 호출될때 위 상태가 됨
            -   다른 스레드가 `notify`, `notifyAll` 메서드를 호출하거나 `join`이 완료될때까지 대기
        -   TIMED_WAITING: 일정 시간 동안 기다리는 상태
            -   `sleep(long millis)`, `wait(long timeout)`, `join(long millis)` 메서드가 호출될때 위 상태가 됨
        -   TERMINATED: 스레드가 실행을 마친 상태
            -   한번 종료된 스레드는 다시 시작할 수 없음

:::tip Runnable과 예외처리

-   Runnable 인터페이스의 run 메서드는 예외를 밖으로 던질 수 없다.
    -   자바는 부모 메서드가 체크 예외를 던지지 않는 경우 재정의된 자식 메서드도 체크 예외를 던질 수 없다.
        -   부모가 던지는 예외의 하위 예외만 던질 수 있다.
    -   언체크 예외는 예외처리를 강제하지 않으므로 부모와 상관없이 던질 수 있다.

:::

## join 메서드

-   스레드 3개를 활용하여, 1~100까지 숫자의 합을 계산한다고 가정해보자.
-   1~50을 더하고, 51~100까지 더하는 것을 별도 스레드에서 처리한다.
-   두 덧셈 결과를 총합하여 메인 스레드에서 출력한다.
-   이 경우 메인 스레드가 연산 결과를 대기하지 않게 되면 예상하는 출력결과가 나타나지 않는다.

:::tip this

-   어떤 메서드를 호출하는 것은 **특정 스레드가 해당 메서드를 호출하는 것이다.**
-   스레드는 메서드 호출을 관리하기 위해 메서드 단위로 스택 프레임을 만들고 해당 프레임을 스택위에 쌓는다.
-   **이때 인스턴스 메서드를 호출하면 어떤 인스턴스 메서드를 호출했는지 기억하기 위해 인스턴스 참조값을 스택 프레임 내부에 저장한다. 이것이 this이다.**

:::

-   `sleep`을 통해 설정한 시간 간격만큼 스레드를 대기상태로 만들 수 있다.
-   `while(thread.getState() != TERMINATED)`와 같은 반복문으로 스레드 상태가 종료로 바뀔때까지 지속적으로 확인하는 방법도 있다.
-   위 방법들은 설계가 어렵고 특별히 반복문의 경우 CPU 연산을 많이 사용하게 된다.

---

```java
Thread thread1 = new Thread(task1, "thread1");
Thread thread2 = new Thread(task2, "thread2");

thread1.start();
thread2.start();

thread1.join(); /// thread1 대기
thread2.join(); /// thread2 대기
```

-   호출자 스레드 메서드 호출 과정에서 join 메서드를 만나게 되면, 해당 스레드의 나머지 코드가 더 진행되지 않고 스레드가 대기 상태로 변경된다.
-   join 호출 메서드는 대상 스레드가 TERMINATED 상태가 될때까지 대기한다. (WAITING 상태로 변경)
-   해당 스레드가 TERMINATED 상태가 되면 호출 스레드는 다시 RUNNABLE 상태가 되어 다음 코드를 수행하게 된다.
-   `join(ms)`로 파라미터에 시간값을 전달하면 특정 시간만큼만 대기할 수 있다.

## 인터럽트

-   특정 스레드 작업을 중단하기 위해서는 다양한 방법이 존재한다.
    -   비동기 작업을 처리할 클래스에 flag 멤버를 하나 추가하여 작업 중간중간 확인하는 방법 (이때 변수 선언시 volatile 키워드를 추가해야 한다.)
    -   위의 방식을 사용하면 WAITING, TIMED_WAITING 상태의 스레드는 깨우지 못하고, 해당 스레드 제어권을 다시 획득해서 RUNNABLE 상태일때 비로소 중단할 수 있게 된다.
-   대기 상태의 스레드를 강제로 깨워 작업을 중단하기 위해서는 `interrupt()` 메서드를 사용해야 한다.

```java
Thread thread = new Thread(task, "work");
thread.interrupt();
```

-   `interrupt`메서드를 호출하면 해당 스레드에 인터럽트가 발생한다.
-   인터럽트가 발생하면 해당 스레드에 `InterruptedException`이 발생한다.
    -   인터럽트를 받은 스레드는 대기 상태에서 깨어나 `RUNNABLE`상태가 되어 코드를 수행한다.
    -   이때 `InterruptedException`을 `catch`로 잡아서 정상 흐름으로 변경하면 된다.
-   interrupt를 호출했다고 해서 즉시 `InterruptedException`이 발생하는 것은 아니다.
    -   `Thread.sleep`처럼 `InterruptedException`을 던지는 메서드를 호출하거나, 호출하며 대기중일 때 예외가 발생한다.
    -   `Thread.currentThread().isInterrupted()` 메서드를 호출하면 현재 스레드가 인터럽트 상태인지 체크할 수 있다.
-   호출자에서는 interrupt 메서드를 호출하고, 피호출자는 내부에서 isInterrupted를 통해 현재 인터럽트로 깨어났는지를 체크하면 스레드 중단에 대한 반응성을 개선할 수 있다.
-   `isInterrupted()` 메서드는 단순히 인터럽트 상태를 확인 / 조회만 한다.
-   `interuppted()`메서드는 현재 스레드가 인터럽트 상태라면 해당 스레드 인터럽트 상태를 `false`로 변경한다.
-   스레드가 인터럽트 상태가 아니라면 `false`를 반환하고 인터럽트 상태를 변경하지 않는다.
    -   `isInterrupted` 기반으로 WAITING 중이던 스레드를 깨우게 되면 반드시 Exception catch 영역으로 코드 분기처리가 이루어지게 된다.

## yield

-   스레드 sleep은 다른 스레드 모두 대기 상태로 쉬고 있어도 내 스레드까지 실행되지 않게 된다.
    -   스레드 제어권 양보를 위해 sleep을 사용하는 것은 목적에 맞지 않는다는 것이다.
-   자바의 RUNNABLE 상태를 더 자세히 구분하면 다음과 같다.
    -   실행 상태(Running): 스레드가 CPU에서 실제로 실행 중이다.
    -   실행 대기 상태(Ready): 스레드가 실행될 준비가 되었지만, CPU가 바빠서 스케줄링 큐에서 대기중인 상태.
        -   OS는 실행 상태의 스레드들을 할당된 시간만큼 잠시 실행 후 실행 대기 상태로 변경한다.
    -   자바에서는 위의 두 상태를 구분할 수 없다.
-   CPU 코어 수에 비해 스레드 수가 훨씬 많은 경우, 조금이라도 코드 흐름 상 연산의 여유가 있으면 yield를 호출하여 다른 스레드에 제어권을 주는 것이 효율적이다.
    -   yield를 호출한다고 하여 강제적으로 실행 순서를 지정한다거나 반드시 다른 스레드가 실행되는 것은 아니다.

## 메모리 가시성

-   1번 스레드와 2번 스레드가 `runFlag`라는 하나의 플래그를 공유하고 있는 상황이다.
-   두 스레드에서 해당 플래그를 직접 참조하고 있는 것으로 이해할 수 있는데, **이는 잘못된 이해이다.**
-   실제로는 각 스레드가 서로 다른 코어에 할당된 상태에서, **각 코어 내의 캐시 메모리에 업데이트 된 `runFlag`값을 참조하고 있다.**
-   캐시 메모리에 값 업데이트가 되지 않은 상태이면 각 스레드별로 서로 다른 값을 가지고 있는 채로 로직이 수행될 수 있다.
    -   메인 메모리에서 캐시 메모리로 값이 업데이트 되는 시점은 미정이다. CPU 설계 방식과 종류에 따라 다르다.
    -   메인 메모리에서 값을 새로 쓰면, 각 코어의 캐시에 값이 새로 덮어씌워지는 것은 즉시 이루어지지 않을 수 있다.
    -   내부적으로 처리하는 값 쓰기 큐에 작업이 추가된다.
-   캐시 메모리 자체를 향상 시키기보다, **여러 스레드에서 같은 시점에 정확히 같은 데이터를 보는 것이 더 중요할 수 있다.**
    -   자바에서는 `volatile`이라는 키워드로 해당 기능을 제공한다.
-   volatile과 함께 선언된 멤버는 **캐시 메모리를 사용할때보다 성능이 저하된다.**
-   자바 JIT 컴파일러는 코드 실행의 순서를 재정렬(Reordering) 함으로써 내부 성능을 개선할 수도 있다.
    -   아래 코드 실행시에도 number값이 업데이트 된 이후 ready 플래그가 덮어씌워져서 스레드 태스크를 완료하는 것을 런타임에 보장할 수 없다.

```java
public static void main(String[] args) {
    new Reader().start();
    number = 42;
    ready = true;
}
```

-   `volatile`로 선언한 멤버는 **JVM이** 런타임 및 프로세스와 통신하여 **해당 변수와 관련된 코드 순서 변경을 방지하게 된다.**
-   또한 해당 변수에 대해서는 모든 업데이트를 즉시 플러시해야 하는 것을 선언하게 된다.
    -   **플러시는 기존 캐시 값을 무효화 하고 새로 값을 덮어쓰는 것을 의미한다.**

:::tip 자바 소스코드 변환과 JIT 컴파일러

-   자바에서는 Java 소스 코드가 -> javac 컴파일러에 의해 -> 바이트 코드로 변환되는 흐름을 갖는다.
-   바이트 코드는 특정 CPU용이 아닌 JVM 가상 명령어를 말한다.
-   javac는 플랫폼 독립적인 바이트코드를 만들고, JVM 안의 JIT가 실행 중에 그걸 현재 CPU에 맞는 native code로 변환한다.
-   자바 JVM은 두 가지 방식을 병행해서 코드를 실행한다.
    -   인터프리터 방식: 한줄 한줄 바이트 코드를 읽어서 해석 후 해당 CPU 구조에 맞게 기계어로 변환한다.
    -   JIT 컴파일러 방식: 경우 자주 사용되는 바이트 코드를 감지하여 기계어로 컴파일해주고, 다음 실행부터는 해당 기계어를 직접 실행하는 구조로 수행된다.

:::

-   인터프리터 또는 JIT 방식으로 코드를 읽어들일 때 volatile 변수를 만나면 네이티브 코드상으로 FENCE 관련 명령어가 추가되어 메모리 배리어 처리가 이루어진다. 쓰기 시에는 메인 메모리로 플러시 및 다른 코어 캐시 무효화, 읽기 시에는 캐시를 무시하고 메인 메모리에서 새로 읽어온다.
-   코드 흐름상 결과만 두고 봤을 때는 멀티스레딩으로 인한 출력 결과가 보장될 수는 없다.
    -   적절히 sleep 등으로 로직상 직렬의 흐름을 구성한다면 가능할 수는 있다.
-   그러나 volatile로 선언된 변수에 한해서는 쓰기 연산이 이루어진 이후 시점에는 반드시 다른 모든 스레드에서 업데이트된 값을 즉시 관찰 가능하게끔 하는 것이 목적이다.
    -   volatile 쓰기 이후에 발생한 volatile 읽기는 반드시 해당 쓰기의 결과를 관측함을 JMM이 보장하며, 이 관계를 happens-before라 한다.

## 자바 메모리 모델 (Java Memory Model)

-   자바 메모리 모델은 자바 프로그램이 어떻게 메모리에 접근하고 수정할 수 있는지를 규정한다.
-   멀티스레드 프로그래밍에서 스레드 간의 상호작용을 정의하기도 한다.

:::tip happens-before 관계

-   해당 관계는 JMM에서 스레드 간의 작업 순서를 정의하는 개념이다.
-   A 작업이 B 작업보다 happens-before 관계에 있다면 A에서의 모든 메모리 변경사항은 B에서 볼 수 있다.

:::

## 동기화

-   여러 자원이 접근하는 자원을 공유 자원이라고 한다.
-   자바에서는 공유 자원, 임계 영역을 보호하기 위해 `synchronized`라는 키워드를 제공한다.
-   **자바에서는 모든 객체(인스턴스) 내에 자신만의 락을 가지고 있다.**
    -   이를 모니터 락(monitor lock)이라고도 부른다.
-   멀티 스레딩 환경에서 `synchronized`가 동작하는 과정은 아래와 같다. 1번 스레드가 먼저 실행된다고 가정한다.
    1. `synchronized` 키워드가 있는 메서드를 먼저 호출한다.
    2. synchronized 메서드 호출 후 인스턴스의 락을 획득한다.
    3. 2번 스레드에서 동일한 메서드를 호출한다.
    4. 인스턴스에 락이 없으므로 락 획득 전까지 해당 스레드는 `BLOKCED` 상태로 대기한다.
        - 락 획득 전까지 계속 대기하며, CPU 실행 스케줄링에 포함되지 않는다.
    5. t1 스레드 메서드 호출을 마치면 락을 반납한다.
    6. t2 스레드는 자동으로 락을 획득한다. `BLOCKED` -> `RUNNABLE` 상태로 바뀐 뒤 다시 코드를 실행한다.
-   락 획득의 순서는 보장되지 않는다. 코드 호출 순서도 상관없다.
-   락 기반으로 동시성 문제가 해결되기 때문에, `volatile`을 사용하지 않아도 된다.

```java
public synchronized boolean withdraw {
    //..
}
```

-   메서드 내에서 여러 동작을 수행하는데, 해당 메서드 내의 임계 영역은 메서드 전체가 아닐 수 있다.
-   이 경우 메서드 전체를 `synchronized`로 감싸는 것은 성능상 비효율적이다.
-   이러한 문제를 해결하기 위해 `synchronized` 키워드를 메서드 단위가 아닌 **특정 코드 블럭에 최적화하여 적용할 수 있는 기능을 제공한다.**

```java
public boolean withdraw(int amount) {
    synchronized(this) {
        // 1. 검증
        // 2. 출금
    }

    // 3. 로깅
    return true
}
```

-   `synchronized` 블럭 선언을 통해 임계 영역을 코드 블럭으로 지정할 수 있다.
-   **코드블럭의 `this`가 들어갈 파라미터는 락을 획득할 인스턴스에 대한 참조값이다.**
-   메서드 내에서 synchronized 블럭을 만나면 나머지 실행되지 않은 코드는 해당 블럭 실행을 모두 마친 뒤 실행된다.

```java
void doSomething() {
    System.out.println("A");         // 1. 먼저 실행

    synchronized (lock) {
        System.out.println("B");     // 2. 락 획득 후 실행
        System.out.println("C");     // 3. 블럭 내부
    }                                //    ← 여기서 락 해제

    System.out.println("D");         // 4. 블럭 끝난 후 실행
}
```

-   지역변수는 절대 다른 스레드와 공유되지 않으므로 동기화에 대한 걱정을 하지 않아도 된다.

## 고급 동기화

-   `synchronized`는 자바 1.0부터 제공되는 편리한 기능이지만 단점들이 존재한다.
    1. 무한 대기: `BLOKCED`상태의 스레드는 락이 풀릴 때까지 무한 대기한다.
    2. 공정성: 락이 돌아왔을때 `BLOKCED`스레드들이 여러개라면 어떤 스레드가 락을 획득할 지 알 수 없다.

### LockSupport

-   LockSupport는 스레드를 `WAITING` 상태로 변경한다.
-   WAITING 상태는 누군가 깨우기 전까지 계속 대기하며, CPU 실행 스케줄링에 들어가지 않는다.
-   LockSupport의 대표적 기능은 다음과 같다.
    1. `park()`: 스레드를 WAITING 상태로 변경한다.
    2. `parkNanos(nanos)`: 스레드를 나노초 동안만 `TIMED_WAITING`상태로 변경한다. 나노초가 지나면 RUNNABLE 상태로 변경한다.
    3. `unpark(thread)`: WAITING 상태의 대상 스레드를 `RUNNABLE` 상태로 변경한다.
-   park 메서드는 파라미터가 필요없고, unpark 메서드는 파라미터가 필요하다.
    -   WAITING중인 스레드는 자신의 코드를 실행할 수 없기 때문에 외부의 도움이 필요하다.
-   `unpark`를 통해 스레드를 깨우거나 `interrupt`를 통해서도 스레드를 깨울 수 있다. (`thread1.interrupt()`)

:::tip 밀리초 / 나노초

-   1밀리초 = 1,000,000ns
-   2초 = 2,000,000,000ns

:::

-   `BLOCKED` 상태는 인터럽트가 걸려도 대기 상태를 빠져나올 수 없다.
-   `WAITING`, `TIMED_WAITING` 상태는 인터럽트가 걸리면 대기 상태를 빠져나와 RUNNABLE 상태로 전환된다.
-   `BLOCKED`, `WAITING`, `TIMED_WAITING` 상태들은 모두 스레드가 대기하며 실행 스케줄링에 들어가지 않는다.
    -   `BLOCKED` 상태는 `synchronized`에서만 사용하는 특별한 대기 상태이다
    -   `WAITING`, `TIMED_WAITING` 상태는 범용적으로 활용 가능한 대기 상태이다.
-   `LockSupport`는 저수준 API이다.
    -   멀티 스레딩 환경에서 동시에 실행된 스레드가 여러개일때, 특정 한개의 스레드만 락을 가질 수 있도록 해야한다.
    -   나머지 9개 스레드는 대기해야 하는데, 어떤 스레드가 대기 중인지 알아야 한다.
    -   어떤 스레드를 깨울지에 대한 우선순위 결정도 필요하다.
    -   `ReentrantLock`이 위의 한계를 해결해준다.

### ReentrantLock

-   자바는 1.5부터 `syncrhonized`와 BLOCKED 상태를 통한 임계 영역 관리의 한계를 극복하기 위해 자바 1.5부터 `Lock` 인터페이스와 `ReentrantLock` 구현체를 제공한다.
    -   스레드 무한 대기
    -   스레드 락 획득 우선순위 공정성

```java
public interface Lock {
    void lock();
    void lockInterruptibly() throws InterruptedException;
    boolean tryLock();
    boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
    void unlock();
    Condition newCondition();
}
```

-   Lock 인터페이스는 위와 같다. 해당 인터페이스에 대한 대표적인 구현체로 `ReentrantLock`이 존재한다.
    -   `void lock()`: 락을 획득한다. 다른 스레드가 이미 락을 획득했다면 락이 풀릴때까지 스레드는 대기한다(**WAITING**). **해당 메서드는 인터럽트에 응답하지 않는다.**
        -   WAITING 상태이기때문에 인터럽트를 걸어서 RUNNABLE로 바꿀 수는 있지만, 내부적으로 아주 짧은 시간 내에 lock 메서드 내에서 해당 스레드를 다시 WAITING 상태로 강제로 변경한다.
    -   `void lockInterruptibly()`: 락 획득을 시도하되, 다른 스레드가 인터럽트 할 수 있도록 한다. 대기 중 인터럽트 발생 시 `InterruptedException`이 발생하며 락 획득을 포기한다.
    -   `boolean tryLock()`: 락 획득을 시도하고, 즉시 성공 여부를 반환한다. 다른 스레드가 이미 락을 획득했다면 `false`를 리턴한다. 락을 획득했다면 `true`를 리턴한다.
    -   `boolean tryLock(long time, TimeUnit unit)`: 주어진 시간 동안 락 획득을 시도한다. 해당 시간이 지나도 락을 획득하지 못하면 `false`를 반환한다. 대기 중 인터럽트가 발생하면 `InterruptedException`이 발생하며 락 획득을 포기한다.
    -   `void unlock()`: 락을 해제한다. 락을 획득한 스레드가 호출해야 하며 이를 지키지 않으면 `IllegalMonitorStateException`이 발생할 수 있다.
    -   `Condition newCondition()`: `Condition` 객체를 생성하여 반환한다. 이는 락과 결합되어 사용되며 스레드가 특정 조건을 기다리거나 신호를 받을 수 있도록 한다.
        -   `Object` 클래스의 wait, notify, notifyAll 메서드와 유사한 역할을 한다.
-   `ReentrantLock` 구현체는 스레드가 공정하게 락을 얻을 수 있는 모드를 제공한다.
    -   `Non-fair mode`: 비공정 모드는 ReentrantLock의 기본 모드이다.
        -   성능 우선: 락을 획득하는 속도가 빠르다.
        -   선점 가능: 새로운 스레드가 기존 대기 스레드보다 먼저 락 획득이 가능하다.
        -   기아 현상 (Starvation): 특정 스레드가 계속해서 락을 획득하지 못할 수 있다.
    -   `Fair mode`: ReentrantLock 생성자 파라미터에 true를 전달하면 된다.
        -   공정성 보장: 대기 큐에서 먼저 대기한 스레드가 락을 먼저 획득한다.
        -   기아 현상 방지: 모든 스레드가 언젠가 락을 획득할 수 있게 보장된다.
        -   성능 저하: 락을 획득하는 속도가 느려질 수 있다.

```java
public class ReentrantLockEx {
    // 비공정 모드 락
    private final Lock noFairLock = new ReentrantLock();

    // 공정 모드 락
    private final Lock fairLock = new ReentrantLock(true);
}
```

-   ReentrantLock은 객체 내부의 모니터 락이 아니다.

## 생산자 소비자 문제

-   생산자 소비자 문제는 멀티스레드 프로그래밍에서 자주 등장하는 동시성 문제 중 하나이다.
-   여러 스레드가 동시에 데이터를 생산하고 소비하는 상황을 다룬다.
    -   생산자(Producer): 데이터를 생성하는 역할을 한다. 파일에서 데이터를 읽어오거나 네트워크에서 데이터를 받아오는 스레드 등
    -   소비자(Consumer): 생성된 데이터를 사용하는 역할을 한다. 데이터를 처리하거나 저장하는 스레드
    -   버퍼(Buffer): 생산자가 생성한 데이터를 일시적으로 저장하는 공간이다.
        -   이 버퍼는 한정된 크기를 가진다. 버퍼를 통해 생산자와 소비자가 데이터를 주고받는다.
-   생산자가 너무 빠를때: 버퍼가 가득 차서 데이터를 넣을 수 없을때, 버퍼에 빈 공간이 생길때까지 대기해야 한다.
-   소비자가 너무 빠를때: 버퍼에 새로운 데이터가 들어올 때까지 기다려야 한다.
-   이러한 문제를 **생산자 소비자 문제(producer-consumer problem), 또는 한정된 버퍼 문제(bounded-buffer problem)**라고 부른다.
-   아래 상황을 가정해보자.
    1. 버퍼 크기는 2로 고정이다.
    2. 생산자가 생성할 데이터는 총 3개이다.
    3. 소비자가 데이터를 처리할 수 있는 스레드는 3개이다.
    4. 생산자가 데이터 2개를 먼저 처리한다. 버퍼에 2개의 데이터가 push된다.
    5. 나머지 한개의 처리되지 못한 데이터는 버퍼 슬롯이 확보되기 전까지 Lock을 잡고 대기한다.
    6. 소비자 스레드에서 데이터 처리를 위해 버퍼에 접근한다.
    7. 임계 영역 접근을 위한 락을 생산자 스레드에서 보유중이다.
    8. 모든 소비자 락은 BLOCKED 상태가 되어버린다.
-   DeadLock 문제 해결을 위해 잡고 있는 Lock을 잠깐 양보하면 문제가 해결된다.
-   `Object.wait()`, `Object.notify()`메서드들을 사용하면 위 문제를 해결할 수 있다.
    -   `Object.wait()`: **현재 스레드가 가진 락을 반납하고 대기한다.(WAITING)**
        -   현재 스레드가 `synchronized` 블록 또는 메서드에서 락을 소유하고 있을때만 호출 가능하다.
    -   `Object.notify()`: 대기 중인 스레드 중 하나를 깨운다.
        -   `synchronized`블록이나 메서드에서 호출되어야 한다. 대기 중인 스레드들 중 하나만 깨운다. 깨운 스레드는 락을 다시 획득할 기회를 얻는다.
    -   `Object.notifyAll()`: 대기 중인 모든 스레드를 깨운다.
        -   `synchronized` 블록이나 메서드에서 호출되어야 한다. 모든 스레드가 락을 획득할 기회를 얻는다.

:::tip 스레드 대기 집합(wait set)

-   `synchronized` 임계 영역 내에서 `Object.wait()`를 호출하면 스레드는 대기 상태에 들어간다.
-   위와 같이 대기 상태에 들어간 스레드를 관리하는 것을 대기 집합이라고 한다.
    -   모든 객체는 각자의 대기 집합을 가지고 있다.
    -   **대기 집합은 임계 영역 내에 위치한다.**

:::

-   wait / notify 기반으로 생산자 소비자 문제가 어떻게 해결되는지 보자.
    1. 두개의 데이터 push 후, 나머지 생산자에서 버퍼 부족 문제로 대기해야 하는 상황이다.
    2. 이때, 해당 스레드에서 wait을 호출하여 **락을 반납한 뒤 대기 집합에 들어간다.**
    3. 소비자 스레드가 이어서 실행된다.
    4. 버퍼로부터 데이터를 하나 취하고, notify를 호출하여 스레드 대기 집합의 스레드를 하나 깨운다.
        - **락은 아직 소비자가 가지고 있는 상태이다.**
        - **깨어난 생산자 스레드는 `BLOCKED` 상태로 대기한다.**
    5. 소비자 스레드가 데이터 소비를 완료한 뒤 락을 반납, 임계 영역을 빠져나간다.
    6. BLOCKED 상태였던 생산자 스레드가 락을 획득하고 `wait()` 이후 코드부터 로직을 수행한다.
-   만약 생산자 스레드가 아닌 소비자 스레드부터 전체적으로 실행되어, 대기 집합에 소비자 스레드만 존재하게 된 상황을 고려해보자.
    1. 소비자 스레드 3개 모두 대기 집합에 추가된다.
    2. 생산자 스레드 데이터 하나가 추가된 후 notify로 소비자 하나를 깨운다.
    3. 소비자에서 데이터를 소비한 뒤 다른 소비자를 깨운다.
    4. 이때 버퍼에 데이터가 비어있으므로 락을 반납한 뒤 다시 대기 집합에 들어간다.
-   이러한 비효율은 생산자, 소비자 모두에게 발생할 수 있다.
    -   데이터가 꽉차있을때 생산자 스레드를 notify
    -   데이터가 비어있을때 소비자 스레드를 notify
-   wait / notify기반으로 어떤 스레드를 깨울 지에 대한 우선순위가 없으면 **스레드 기아 현상**도 발생할 수 있다.
    -   notifyAll을 사용하면 해결을 할 수는 있다.
-   생산자 스레드에 기아 현상이 발생했다고 가정하자.
    -   버퍼에 데이터가 없는 상태에서 notifyAll을 호출한다.
    -   모든 소비자 스레드는 데이터가 없기 때문에 다시 스레드 대기 집합으로 들어간다.
    -   이때 남은 생산자 스레드가 데이터를 처리할 수 있게 된다.

## 생산자 소비자 비효율 개선

-   생산자용 소비자용 대기 집합을 서로 나누어 분리하면 비효율 문제를 해결할 수 있다.

### Condition

-   Condition은 `ReentrantLock`을 사용하는 스레드가 대기하는 스레드 대기 공간이다.
-   `lock.newCondition()`메서드를 호출하면 스레드 대기 공간이 만들어진다.
-   `Object.wait()`에서 사용하는 대기 공간은 모든 객체 인스턴스가 기본적으로 가지고 있다.
-   ReentrantLock을 사용하는 경우 스레드 대기 공간은 Condition으로 직접 만들어야 한다.
-   관련 함수는 아래와 같다.
    1. `condition.await()`: `Object.wait`과 유사한 기능이다.
        - 지정한 condition에 현재 스레드를 WAITING 상태로 보관한다.
        - 이때 ReentrantLock에서 획득한 락을 반납하고 대기상태로 컨디션에 보관된다.
    2. `condition.signal()`: `Object.signal`과 유사한 기능이다.
        - 지정한 condition에서 대기중인 스레드를 하나 깨운다.

```java
Condition condition = lock.newCondition();
```

-   `Condition.signal`은 대기중인 스레드 하나를 깨우는데, 일반적으로 Condition 구현은 큐 구조를 사용하기 때문에 FIFO 순서로 스레드를 깨운다.
    -   `ReentrantLock`을 가지고 있는 스레드가 호출해야 한다.
-   synchronized 블록 기반에서는 자체적으로 모니터 락을 제공한다.
    -   임계 영역 관리를 위해 락 대기 집합, 스레드 대기 집합 모두 기본적으로 제공된다.
-   ReentrantLock은 Lock 인터페이스를 구현한 커스텀 구현체이다.
    -   임계 영역 관리를 위해 자체 락 대기 큐, 스레드 대기를 위한 Condition이 내부적으로 구현되어 있다.
    -   모니터 락, synchronized 블록 기반에서의 락 대기 집합 및 스레드 대기 집합과는 별개이다.

### BlockingQueue

-   자바에서는 생산자 소비자 문제, 한정된 버퍼라 불리는 문제를 해결하기 위해 `java.util.concurrent.BlockingQueue`라는 인터페이스 및 구현체들을 제공한다.
-   `BlockingQueue`는 인터페이스이며, 대표적인 구현체들이 있다.
    1. `ArrayBlockingQueue`: 배열 기반 구현, 버퍼 크기 고정
    2. `LinkedBlockingQueue`: 링크 기반 구현, 버퍼 크기를 고정하거나 무한히 사용 가능하다.
    3. 이 외에 여러가지가 더 존재한다.
-   데이터 추가: `add()`, `offer()`, `put()`, `offer(타임아웃)`
    -   버퍼가 꽉 차면 동일 Condition에서 대기하는 기능 제공
-   데이터 획득: `take()`, `poll(타임아웃)`, `remove(..)`
    -   버퍼가 비어있으면 동일 Condition에서 대기하는 기능 제공
-   생산자 측에서 데이터가 꽉 찼거나 비었을때 삽입 및 제거에 대해 어떻게 처리하는 지에 따라 다른 메서드들을 사용하면 된다.

| Operation          | Throws Exception | Special Value | Blocks         | Times Out              |
| ------------------ | ---------------- | ------------- | -------------- | ---------------------- |
| **Insert (추가)**  | `add(e)`         | `offer(e)`    | `put(e)`       | `offer(e, time, unit)` |
| **Remove (제거)**  | `remove()`       | `poll()`      | `take()`       | `poll(time, unit)`     |
| **Examine (관찰)** | `element()`      | `peek()`      | not applicable | not applicable         |

-   Throws Exception: 대기시 예외
-   Special Value: 대기시 즉시 반환
    -   큐가 가득 차면 false 리턴
    -   큐가 비어있으면 null 반환
    -   큐의 머리요소 반환, 비어있으면 null
-   Blocks: 대기
-   Times Out: 시간 대기
    -   시간 이후로도 버퍼 확보가 안되면 false
    -   시간 이후로도 데이터 획득이 안되면 null

## CAS - 동기화와 원자적 연산

-   원자적 연산(atmonic operation)의 의미는 해당 연산이 더 이상 나눌 수 없는 단위로 수행된다는 것을 의미한다.
-   원자적 연산은 중단되지 않고, 다른 연산과 간섭없이 완전히 실행되거나 전혀 실행되지 않는 성질을 갖는다.
-   멀티스레딩 관점에서 원자적 연산이 아닌 경우 `synchonized`, `Lock`등을 사용해서 안전한 임계 영역을 만들어야 한다.
-   자바는 `AtomicInteger`와 같이 `Integer`연산을 멀티 스레딩 환경에서도 원자적으로 수행할 수 있도록 해주는 클래스를 제공한다.
    -   `AtomicInteger`, `AtomicLong`, `AtomicBoolean`등 다양한 `AtomicXXX` 클래스를 제공한다.
-   사실 `AtomicInteger`의 `incrementAndGet()`과 같은 원자적 연산 메서드는 **락을 사용하지 않고 원자적 연산을 만들어 낸다.**

### CAS 연산

-   락 기반 연산에서는 락 데이터 조회, 락 획득, 수행 및 반납 과정이 계속 반복되어 동작이 무겁다.
-   이런 문제를 해결하기 위해 락을 걸지 않고 원자적 연산을 수행할 수 있다.
-   이를 CAS(Compare-And-Swap / Compare-And-set) 연산이라 한다.
    -   락을 사용하지 않기 때문에 락-프리(Lock-Free) 기법이라고 한다.
-   CAS는 락을 완전히 대체하지는 못하고, 작은 단위의 일부 영역에 적용 가능하다.
-   Atomic 객체에 대해 `compareAndSet(0, 1)` 연산을 뜯어보면 원자적이지 않은 것으로 보인다.
    1. 메인 메모리 값 확인
    2. 해당 값이 현재 0이라면 1로 값을 변경
-   CAS 연산은 원자적이지 않은 두 연산을 CPU 하드웨어 차원에서 특별히 하나의 원자적 연산으로 묶어 제공하는 기능이다.
    1. 주소값 내의 값을 확인한다.
    2. 해당 값이 0이면 1로 변환한다.
    3. 위 두 동작을 하드웨어 단에서 원자적으로 묶어 처리한다.
-   `incrementAndGet` 동작 과정은 아래와 같다.
    1. get
    2. compareAndSet(current, current + 1)
    3. if (result == true) { break; } else continue;
-   위 코드에서 멀티스레딩 환경에서 get으로 얻은 값이 동일하고, 1번 스레드에서 Set이 먼저 이루어지게 되면 2번 스레드에서는 Set에 실패하여 result값이 false가 된다.
-   값 충돌시 루프를 돌며 락없이 데이터를 안전하게 변경 가능하다.
-   충돌이 거의 발생하지 않는 시나리오에서는 락을 사용하지 않기 때문에 성능이 좋다. 반대의 경우 반복문을 수행하기 때문에 CPU 자원을 많이 소모한다.
-   CAS와 락 방식을 비교하면 다음과 같다.
    -   Lock방식
        -   비관적(pessimistic) 접근
        -   다른 스레드가 방해할 것이라고 가정
        -   데이터 접근 시 항상 락 획득 및 다른 스레드 접근을 막음
    -   CAS 방식
        -   낙관적(optimistic) 접근
        -   락 사용 없이 데이터에 바로 접근
        -   대부분의 경우 충돌이 없을 것이라 가정
        -   충돌 발생시 그때 재시도
-   CAS 기반으로 락을 구현하는 경우 락 해제를 대기하면서 반복문을 통해 확인하게 된다.
    -   이 모습이 마치 제자리에서 회전(spin)하는 것처럼 보여, **스핀 락**이라고도 부른다.
    -   스핀 대기(spin-wait), 바쁜 대기(busy-wait)이라고도 한다.
-   위와 같은 스핀락 방식은 **CPU 연산이 매우 짧을때 사용해야 효율적이다.**

## 동시성 컬렉션

-   자바에서 하는 컬렉션 프레임워크들은 기본적으로 스레드 세이프하지 않다.
-   `ArrayList`와 같은 자료구조에 append 연산을 수행한다고 가정해보면, 연산이 원자적이지 않다.
    -   내부 배열에 데이터를 추가해야 하고, size값도 1 증가시켜야 한다.
    -   size값을 증가시키는 것 자체도 원자적이지 않다.
-   필요한 메서드에서 `synchronized`와 같은 키워드를 추가하여 임계 영역 접근에 대한 보호를 할 수 있다.

### 프록시(Proxy)

-   만약 ArrayList를 새로 구현한 SyncArrayList를 구현했다고 할때, ArrayList에서의 구현이 변경된 경우 SyncArrayList에도 변경사항을 반영해줘야 한다.
-   기존 코드를 그대로 사용하면서 `synchronized`기능만 멀티스레드 상황에 동기화가 필요할때만 추가하려면 **프록시를 사용해야 한다.**
-   변경 시 아래와 같은 구조를 갖게 된다.
    -   변경 전: 클라이언트 -> ArrayList
    -   변경 후: 클라이언트 -> SyncProxyArrayList -> ArrayList
    -   전체 코드를 그대로 가져다 사용하는 것이 아닌 필요한 구현 대상만 프록시에 구현해둔 뒤, 프록시가 `ArrayList` 인스턴스를 참조할 수 있도록 구현하면 된다.

```java
SimpleList arrayList = new ArrayList();
SimpleList proxyList = new SyncArrayList(arrayList);
test(proxyList)
```

-   이때 배열 요소를 조작하는 `test`라는 이름의 함수가 ArrayList와 SyncArrayList의 상위 타입에 의존하도록 하면 된다.
-   함수 입장에서는 내부 코드 구현에 상관없이 호출하고, 전달된 인스턴스 타입에 따라 별개로 `synchronized` 처리를 하게 될지 런타임에 구분하게 된다.
    -   `SyncProxyList`의 append라는 함수가 호출된다면 `synchronized`블록으로 처리된 메서드의 append가 호출되고, 내부적으로 원본 ArrayList의 append함수를 한번 더 호출하는 구조로 구현된다.

:::tip 프록시 패턴 사용 목적

-   접근 제어: 실제 객체에 대한 접근을 제한하거나 통제
-   성능 향상: 실제 객체의 생성 지연시키거나 캐싱하여 성능을 최적화
-   부가 기능 제공: 실제 객체에 추가정 기능 (로깅, 인증, 동기화) 등을 투명하게 제공 가능
-   실무에서의 프록시 패턴은 스프링 AOP 기능에서 주로 적용된다.

:::

-   `Collections.synchronizedList(target)`를 사용하면 기존 코드를 유지하면서 필요한 경우에 대해서만 동기화 적용이 가능하다.

```java
List<String> list = Collections.synchronizedList(new ArrayList<>());
```

-   내부에서 `SynchronizedRandomAccessList<>(new ArrayList())` 인스턴스를 생성한 뒤 리턴하는데, 생성자 파라미터에 Collections.synchronized 함수에 전달한 객체를 그대로 전달한다.
-   클라이언트 -> SynchronizedRandomAccessList -> ArrayList로 이어지는 구조가 된다.
-   synchronized 기반 프록시 사용시 아래와 같은 단점이 있다.
    -   동기화 오버헤드가 발생한다.
    -   특정 스레드가 컬렉션을 사용하고 있는 경우 다른 스레드들이 대기해야 한다.
        -   리스트를 기준으로 Index A 요소에만 락을 걸게되는 것이 아닌 컬렉션 전체에 락을 걸기 때문에 Index B를 참조하려는 다른 스레드도 대기를 해야한다.
    -   정교한 동기화가 불가능하다.특정 부분 혹은 메서드에 대해서만 선택적 동기화가 가능하다.

### 동시성 컬렉션

-   `java.util.concurrent` 패키지에는 고성능 멀티스레드 환경을 지원하는 다양한 동시성 컬렉션들을 제공한다.
-   `ConcurrentMap`, `CopyOnWriteArrayList`, `BlockingQueue` 등이 있다.
    -   내부적으로 다양한 성능 최적화 기법들이 적용되어 있다.
    -   `synchronized`, `Lock(ReentrantLock)`, `CAS`, 분할 잠금 기술(segmentLock)등 다양한 방법을 사용한다.
-   List
    -   `CopyOnWriteArrayList` -> ArrayList의 대안
-   Set
    -   `CopyOnWriteArraySet` -> HashSet의 대안
    -   `ConcurrentSkipListSet` -> TreeSet의 대안 / 정렬 순서 유지 및 Comparator 사용 가능
-   위와 같이 여러 컬렉션들이 존재한다.
-   `LinkedHashSet`, `LinkedHashMap`과 같이 입력순서를 유지하는 동시에 멀티스레드 환경에서 사용하는 `Set`, `Map` 구현체는 제공하지 않는다.
    -   Collections.synchronizedSet과 같은 메서드를 사용해야 한다.
-   `ArrayBlockingQueue`와 같은 타입들은 다른 스레드를 블록하는 컬렉션이다.

## 스레드 풀과 Executor 프레임워크 1

-   실무에서 스레드를 직접 생성하여 사용시 문제들이 있다.
    1. 스레드 생성 시간으로 인한 성능저하
    2. 스레드 관리
    3. `Runnable` 인터페이스의 불편함
-   스레드를 직접 생성하는 것은 아래와 같은 이유로 동작이 무겁다.
    -   메모리 할당: 각 스레드는 자체적으로 호출 스택을 가져야 한다. 호출 스택은 스레드가 실행되는 동안 사용하는 메모리 공간이다. 이를 위한 메모리를 할당해야 한다.
    -   운영체제 자원 사용: **스레드 생성 작업은 운영체제 커널 수준에서** 이루어진다. **이는 시스템 콜을 통해 처리된다.** 이는 CPU와 메모리 리소스를 소모하는 작업이다.
    -   운영체제 스케줄러 설정: 새로운 스레드 생성 시 운영체제 스케줄러가 해당 스레드를 관리하고 실행 순서를 조정해야 한다. 이는 운영체제 스케줄링 알고리즘에 따라 추가 오버헤드가 발생할 수 있다.
    -   일반적으로 스레드 하나는 1MB 이상의 메모리를 사용한다.
-   스레드 관리 문제
    -   서버 CPU / 메모리 자원은 한정되어 있기 때문에 무한히 스레드를 만들 수 없다.
    -   인터럽트 등의 신호를 주고 스레드를 종료하려는 경우 스레드가 객체로서 어딘가에 관리되고 있어야 한다.
-   Runnable 인터페이스의 불편함
    -   run 메서드는 반환값이 없다. 스레드 실행 결과를 멤버 변수에 두고 반환시 활용해야 하며 이때 경합 상황에 대한 대응도 추가로 필요할 수 있다.
    -   체크 예외를 던질 수 없어서 메서드 내부에서 반드시 처리되어야 한다.

```java
public interface Runnable {
    void run();
}
```

-   스레드 풀이라는 개념을 사용하면 1,2번 문제가 해결된다.
    -   스레드를 관리하는 스레드 풀에 스레드를 미리 필요한 만큼 만들어둔다.
    -   스레드는 스레드 풀에서 대기하며 쉰다.
    -   작업 요청이 오면 이미 만들어진 스레드를 조회하여 해당 스레드로 작업을 처리한다.
    -   **작업 완료된 스레드는 종료하지 않고 스레드 풀에 다시 반납한다.**
-   스레드 풀을 직접 구현하기 위해서는 생산자 소비자 문제 및 스레드 상태값 관리 등의 문제가 겹쳐서 복잡해진다.
-   이러한 문제를 자바의 Executor 프레임워크가 해결해준다.
    -   스레드 풀 / 스레드 관리 / Runnable 프레임워크 문제점을 해결해준다.
    -   생산자 소비자 문제까지 해결해주는 도구이다.

## Executor 프레임워크 주요 구성

-   Executor 인터페이스를 살펴보자.
    -   가장 단순한 작업 실행 인터페이스이다.

```java
public interface Executor {
    void execute(Runnable command);
}
```

-   ExecutorService 인터페이스도 존재한다.

```java
public interface ExecutorService extends Executor, AutoCloseable {
    <T> Future<T> submit(Callable<T> task);

    @Override
    default void close() { ... }
}
```

-   `ExecutorService` 인터페이스의 기본 구현체는 `ThreadPoolExecutor`이다.

## ThreadPoolExecutor

-   `ThreadPoolExecutor(ExecutorService)`는 크게 2가지 요소로 구성되어 있다.
    -   스레드 풀: 스레드 관리
    -   `BlockingQueue`: 작업들을 보관한다. / 생산자 소비자 문제를 해결하기 위해 단순 큐가 아닌 `BlockingQueue`를 사용한다.
    -   생산자: `es.execute(작업)`을 호출하면 BlockingQueue에 작업을 보관한다.
    -   소비자: 스레드 풀에 있는 스레드가 소비자이다.
-   ThreadPoolExecutor 생성자는 다음 속성들을 사용한다.
    -   `corePoolSize`: 스레드 풀에서 관리되는 기본 스레드 수
    -   `maximumPoolSize`: 스레드 풀에서 관리되는 최대 스레드 수. 처리할 작업이 많아지는 경우 corePoolSize보다 스레드를 더 생성할 수 있다.
    -   `keepAliveTime`, `TimeUnit unit`: 기본 스레드 수를 초과하여 만들어진 스레드가 생존할 수 있는 대기시간.
        -   해당 시간동안 처리할 작업이 없으면 제거됨
    -   `BlockingQueue workQueue`: 작업 보관을 위한 블로킹 큐
-   프로그램 실행 순서는 다음과 같다.
    1. corePoolSize와 maximumPoolSize를 각각 2로 지정하여 스레드 풀을 생성한다.
        - corePoolSize는 maximumPoolSize를 넘어설 수 없다.
    2. 작업들 4개를 ThreadExecutor를 통해 배치한다.
    3. **초기 상태에서는 스레드를 풀에 만들어놓지 않는다.**
    4. corePoolSize만큼만 스레드를 차례로 생성한다.
        - 작업 1이 들어오면 하나를 생성하고, 작업 2가 들어오면 하나를 더 생성하는 구조이다.
        - 해당 갯수만큼 스레드가 생성되고 나면 이후부터는 스레드를 더 생성하지 않고 재사용하게 된다.
    5. 작업을 스레드에 배치할때 스레드 풀의 스레드는 밖으로 나오는게 아니라 **스레드의 상태가 바뀐다.**
    6. 스레드 작업 권한 반납시 **WAITING 상태로 스레드풀에 대기한다.**
    7. 작업 완료시 ThreadPoolExecutor의 `close()` 메서드를 호출한다.
    8. 자바 19 미만 버전에서는 `shutdown()`을 호출한다.

:::tip ExecutorService vs ThreadPoolExecutor

```text
Executor                          (인터페이스 - execute()만 있음)
└── ExecutorService               (인터페이스 - submit, shutdown 등 추가)
    └── AbstractExecutorService   (추상 클래스)
        └── ThreadPoolExecutor    (구현체 - 실제 스레드풀 로직)
            └── ScheduledThreadPoolExecutor (주기적 실행 추가)
```

:::

-   만약 응답시간이 중요한 서버인 경우 스레드 풀에 스레드들을 미리 생성해둘 수도 있다.
-   `ThreadPoolExecutor.prestartAllCoreThreads()`를 호출하면 기본 스레드를 미리 생성할 수 있다.
    -   ThreadPoolExecutor에만 구현되어 있고, ExecutorService에는 없다.

```java
ExecutorService es = Executors.newFixedThreadPool();

ThreadPoolExecutor poolExecutor = (ThreadPoolExecutor) es;
poolExecutor.prestartAllCoreThreads();
```

## Callable과 Future

-   `run` 메서드는 리턴값이 없다. 실행결과를 얻기 위해서는 멤버 변수를 넣어두고 스레드 종료를 대기해야 한다.
-   예외를 던질 수 없다.
-   Executor에서는 이 문제들을 해결하기 위해 Callable과 Future라는 인터페이스를 도입했다.

```java
public interface Callable<V> {
    V call() throws Exception;
}
```

-   Callable 리턴 타입은 제네릭 V이다.
-   `throws Exception`도 함께 선언되어 있어 Exception의 모든 하위 예외들을 던질 수 있다.

```java
ExecutorService es = Executors.newFixedThreadPool(1);
Future<Integer> future = es.submit(new MyCallable());
Integer result = future.get();
es.close();

// ...

static class MyCallable implements Callable<Integer> {
    @Override
    public Integer call() {
        sleep(2000);
        int value = new Random().nextInt(10);
        return value;
    }
}
```

-   위와 같은 코드 기반으로 Callable과 Future가 어떻게 동작하는지 확인해보자.
-   `ExecutorService`의 `submit` 메서드를 통해 `Callable`을 작업으로 전달한다.
-   스레드 풀의 스레드 중 하나가 해당 `Callable` 작업을 실행하고, 작업 결과는 `Future` 인터페이스를 통해 반환된다.
-   `future.get()`메서드를 호출하면 `Callable` 인터페이스의 `call` 메서드 반환 결과를 받을 수 있다.
    -   `get()`메서드는 `InterruptedException`, `ExecutionException` 체크 예외를 던진다.
-   `Future`는 전달한 Callable 작업의 미래를 담고 있다.
-   Future에 작업 결과가 담기는 과정은 다음과 같다.
    1. submit 메서드를 호출한다.
    2. `ExecutorService`에서 전달된 태스크의 미래 결과를 알 수 있는 `Future` 객체를 생성한다.
        - Future 인터페이스 구현체는 `FutureTask`이며, 해당 구현체는 `Runnable`도 함께 구현하고 있어서 `run`메서드를 포함한다.
    3. 생성한 Future 객체 내에 태스크의 인스턴스를 보관한다.
    4. Future는 태스크 작업 완료 여부와 작업 결과값을 가진다.
    5. Future로 래핑된 태스크가 BlockingQueue에 담긴다.
    6. 작업 전달시 생성된 Future는 **submit 이후 즉시 반환된다.**
    7. `ExecutorService`에서 태스크를 꺼내어 스레드 풀 여유 스레드가 작업을 시작한다.
    8. 호출 단에서 `future.get()` 메서드를 호출한다.
        - submit이후 스레드 대기상태가 되는 것이 아니라 Future를 즉시 반환하기 때문에 future.get 메서드 호출이 가능하다.
    9. 스레드는 run 메서드를 내부적으로 호출하고, 해당 메서드는 태스크의 `call` 메서드를 호출하여 결과를 받아 처리한다.
    10. 작업 결과를 반환받는다.
-   `future.get` 메서드를 호출했을때 작업 완료 여부에 따라 동작이 달라진다.
    -   완료 상태일때: `Future`에 결과도 포함한다. **요청 스레드는 대기하지 않고 값을 즉시 반환받는다.**
    -   미완료 상태일때: 태스크가 수행되지 않았거나 수행 중이라는 의미이다. 이때 요청 스레드는 `WAITING` 대기한다.
        -   작업이 완료되면 요청스레드를 깨우고, 요청 스레드는 `RUNNABLE` 상태로 변환된다.
-   `Thread.join`과 같은 메서드를 사용하면서 스레드를 대기시킬 필요가 없어진다.
    -   전체 코드가 직관적으로 변하게 된다.
-   **비동기 작업 자체는 submit이후 스레드 풀 여유에 따라 작업 배치가 즉시 이루어진다.**
    -   get 메서드는 요청 스레드를 WAITING 시키면서까지 작업 결과를 받아야만 할때 사용하면 된다.

:::warning Future 제대로 활용하기

-   여러 비동기 작업들을 처리해야 할때, submit즉시 get을 같은 스레드에서 바로바로 호출하는 것은 비효율적이다.
-   다른 작업들에 대해서도 `submit` 호출을 해두어 블로킹 큐에 작업 배치를 해두고 get을 하나씩 호출해야 병렬적으로 작업을 의미있게 처리할 수 있게 된다.

```java
Future<Integer> future1 = es.submit(task1);
Integer sum1 = future1.get(); // 대기 시작

Future<Integer> future2 = es.submit(task2);
Integer sum2 = future2.get(); // 대기 시작
// 각 비동기 작업 소요시간만큼 정직하게 누적됨
```

:::

-   Future submit시 `Callable`이 아닌 `Runnable` 작업을 전달해도 된다.
    -   Runnable은 반환값이 없기 때문에 `future.get()`을 호출해도 null을 반환한다.

## Future 인터페이스 및 메서드

-   `boolean cancel(boolean mayInterruptIfRunning)`
    -   기능: 아직 완료되지 않은 작업을 취소한다.
    -   파라미터: `mayInterruptIfRunning`
        -   `cancel(true)`: Future를 취소 상태로 변경한다.
            -   작업이 실행중이라면 `Thread.interrupt()`를 호출하여 작업을 중단한다.
        -   `cancel(false)`: Future를 취소 상태로 변경한다.
            -   실행중인 작업을 중단하지는 않는다.
    -   반환값: 작업이 취소된경우 `true`, 완료되었거나 취소 불가능한 경우 `false`
    -   설명: 취소상태에서 `Future.get()`메서드 호출시 `CancellationException` 런타임 예외가 발생한다.
-   `boolean isCancelled()`
    -   `cancel()`메서드에 의해 취소된 경우 `true`를 반환한다.
-   `boolean isDone()`
    -   작업이 완료되었는지 여부를 확인한다. 완료, 취소, 예외 발생 후 종료된 경우 모두 true를 반환한다.
-   `State state()`
    -   Future 상태를 반환하고, 자바 19 이후부터 지원한다.
        -   `RUNNING`: 작업 실행중
        -   `SUCCESS`: 성공 완료
        -   `FAILED`: 실패 완료
        -   `CANCELED`: 취소 완료
-   `V get()`
    -   작업 완료까지 대기하고, 완료시 결과를 반환한다.
    -   예외
        -   `InterruptedException`: 대기중인 현재 스레드가 인터럽트된 경우 발생
        -   `ExecutionException`: 작업 계산 중 예외가 발생한 경우
-   `V get(long timeout, TimeUnit unit)`
    -   `get()` 메서드와 동일하지만 시간 초과 시 예외를 발생시킨다.
    -   `timeout`은 대기할 최대 시간, `unit`은 타임아웃 매개변수의 시간 단위
    -   예외
        -   InterruptedExeception, ExecutionException은 동일하다.
        -   대기 시간 초과 시 `TimeoutException`이 발생한다.
    -   **get 메서드는 작업 결과뿐 아니라 처리 과정에서 발생한 예외도 담아둔다.**
    -   요청 스레드에서 `get` 메서드 호출 시 Future가 FAILED 상태라면 `ExecutionException`을 던진다.
    -   에러를 잡아 `e.getCause()`를 호출하면 작업에서 발생한 원본 예외를 받을 수 있다.

### ExecutorService 작업 컬렉션 처리

-   `ExecutorService`는 여러 작업을 한번에 처리하는 `invokeAll`, `invokeAny` 메서드를 제공한다.
-   `<T> List<Future<T>> invokeAll(Coolection<? extends Callable<T>> tasks) throws InterruptedException`
    -   모든 `Callable` 작업을 제출하고 모든 작업 완료까지 대기한다.
    -   timeout을 받는 버전도 있다.
-   `<T> List<Future<T>> invokeAny(Collection<? extends Callable<T>> tasks) throws InterruptedException, ExecutionException`
    -   컬렉션에서 하나의 Callable 작업이 완료될 때까지 기다리고 가장 먼저 완료된 작업 결과를 반환한다.
    -   완료되지 않은 나머지 작업은 인터럽트를 통해 취소한다.
    -   이 역시 timeout을 받는 버전도 있다.

## ExecutorService 우아한 종료

-   서버 업데이트로 인해 서버 재시작을 해야하낟.
-   고객 주문 처리 과정에서 재시작된다면 주문이 제대로 진행되지 못할 것이다.
-   **새로운 요청 주문은 막고, 진행중인 주문은 모두 완료한 뒤 서버를 재시작하는 것이 가장 바람직하다.**
    -   위와 같이 문제없이 우아하게 종료하는 방식을 `graceful shutdown`이라고 한다.

### 서비스 종료 메서드

1. `void shutdown()`
    - 새로운 작업을 받지 않고, 이미 제출된 작업을 모두 마무리한 뒤 종료한다.
    - 논 블로킹 메서드이다.
2. `List<Runnable> shutdownNow()`
    - 실행 중 작업을 중단하고, 대기 중 작업을 반환하며 즉시 종료한다.
    - 실행 중 작업을 중단하기 위해 인터럽트를 발생시킨다.
    - 논 블로킹 메서드이다.
3. `boolean isShutDown()`
    - 서비스가 종료되었는지 확인한다.
4. `boolean isTerminated()`
    - shutDown, shutDownNow 호출 후 모든 작업이 완료되었는지 확인한다.
5. `boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException`
    - 서비스 종료 시 모든 작업이 완료될 때까지 대기한다. 지정 시간까지만 대기한다.
    - 블로킹 메서드이다.
6. `close()`
    - 자바 19부터 지원하는 메서드이며, `shutDown`과 동일하다고 보면 된다.
    - `shutDown`호출 후 작업이 완료되거나 인터럽트가 발생할때까지 무한정 대기한다.
    - 호출 스레드에 인터럽트가 발생해도 `shutDownNow`를 호출한다.

## 스레드 풀 전략

-   자바는 자신에게 맞는 스레드 풀 전략을 사용할 수 있다.
    1. `newSingleThreadPool()`: 단일 스레드 풀 전략
        - 스레드 풀에 기본 스레드 1개만 사용한다.
        - BlockingQueue 사이즈에 제한이 없다.
        - 테스트용과 같이 간단히 사용할때만 활용한다.
    2. `newFixedThreadPool(nThreads)`: 고정 스레드 풀 전략
        - 스레드 풀에 nThreads 갯수만큼의 기본 스레드를 생성한다. 초과 스레드는 생성하지 않는다.
        - 큐 사이즈 제한이 없다.
        - 고정 스레드 수로 관리되기 때문에 CPU / 메모리 리소스 사용이 예측 가능한 안정적 방식이다.
    3. `newCachedThreadPool()`: 캐시 스레드 풀 전략
        - 기본 스레드를 사용하지 않고 60초 주기를 갖는 초과 스레드만 사용한다. (주기는 당연히 조절 가능하다.)
        - 초과 스레드 수 갯수제한이 없다.
        - 기존 BlockingQueue에 작업을 저장하지 않고 `SynchronousQueue`에 작업을 저장한다.
        - `SynchronousQueue`는 `BlockingQueue`의 구현체이다.
            - 내부에 저장 공간이 없다.
            - 생산자 작업을 소비자 스레드에 직접 전달한다.
            - 중간 버퍼없이 스레드간 직거래를 하는 구조이다.

## Executor 예외 정책

-   큐도 가득차고 스레드도 더 생성 못하는 경우 작업을 거절하는데, 이 경우 어떻게 처리할지에 대한 다양한 정책이 존재한다.
    1. `AbortPolicy`: 새 작업 제출시 `RejectedExecutionException`을 발생시킨다. (기본값)
    2. `DiscardPolicy`: 새 작업을 조용히 버린다.
    3. `CallerRunsPolicy`: 새 작업을 제출한 스레드가 대신하여 직접 작업을 실행한다.
        - shutDown 이후에도 제출자 스레드에서 작업이 이루어질 수 있으므로 예외처리가 필요하다.
    4. 사용자 정의(`RejectedExecutionHandler`): 직접 정의한 거절 정책을 사용할 수 있다.
-   shutDown 이후 추가되는 작업들에 대해서도 거절하는데, 위의 정책에 따라 거절하게 된다.

## Reference

-   [Guide to the Volatile Keyword in Java](https://www.baeldung.com/java-volatile)
