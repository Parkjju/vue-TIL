---
title: 자바 고급 - IO, 네트워킹
tags: ['Java']
---

## 문자 인코딩

-   프로그래밍 언어에서는 문자를 표현하기 위한 문자 집합이 필요하다.
-   자바에서는 `Charset.availableCharSets()` 함수를 호출하여 이용 가능한 모든 문자 집합을 조회할 수 있다.
-   `String.getByte(CharSet)` 메서드를 사용하면 문자를 바이트 배열로 변경할 수 있다.
-   현재 프로그래밍 체계에서는 UTF-8을 일반적으로 사용한다.
-   문자집합에 없는 문자를 디코딩하려는 경우 깨진 결과를 볼 수 있다.

## 스트림

-   **자바 프로세스 데이터를 밖으로 내보내려면 출력 스트림을, 외부 데이터를 자바 프로세스로 가져오려면 입력 스트림을 사용한다.**

```java
public static void main(String[] args) throws IOException {
    FileOutputStream fos = new FileOutputStream("temp/hello.dat");
    fos.write(65);
    fos.write(66);
    fos.write(67);
    fos.close();

    FileInputStream fis = new FileInputStream("temp/hello.dat");
    System.out.println(fis.read());
    System.out.println(fis.read());
    System.out.println(fis.read());
    System.out.println(fis.read());
    fis.close();
}
```

-   `new FileOutputStream("file.data")`: 파일에 데이터를 출력하는 스트림이다.
    -   파일이 없으면 파일을 자동으로 만들고, 데이터를 해당 파일에 저장한다.
    -   폴더를 만들지는 않는다.
    -   `FileOutputStream("file.data", true)`와 같이 append 옵션 파라미터를 추가할 수 있다.
        -   true로 지정 시 기존 파일 끝에 이어서 쓴다.
-   `write()`: 바이트 단위로 값을 출력한다.
-   `new FileInputStream("file.dat")`: 파일에서 데이터를 읽어오는 스트림이다.
-   `read()`: 파일에서 바이트 단위로 값을 읽어온다.
    -   EOF 도달시 -1을 반환한다.
-   `close()`: 파일에 접근하는 자바 외부 자원을 닫아준다. (반드시 호출 필요하다.)

:::tip byte[]을 사용하여 원하는 크기만큼 데이터 다루기

```java
public static void main(String[] args) throws IOException {
    // 1. output
    FileOutputStream fos = new FileOutputStream(("temp/hello.dat"), true);
    byte[] input = {65,66,67};
    fos.write(input);
    fos.close();

    // 2. input
    FileInputStream fis = new FileInputStream("temp/hello.dat");
    byte[] buffer = new byte[10];
    int readCount = fis.read(buffer, 0, 10);

    System.out.println("readCount: " + readCount);
    System.out.println(Arrays.toString(buffer));

    fis.close();
}
```

-   출력 스트림
    -   `write(byte[])`: `byte[]`에 데이터를 담고 `write()`에 전달하여 데이터를 한번에 출력할 수 있다.
-   입력 스트림
    -   `read(byte[], offset, length)`: byte[]를 미리 변수로 만들어두고 입력 스트림을 통해 데이터를 한번에 읽어올 수 있다.
        -   `offset`: 데이터 입력을 시작할 `byte[]`의 인덱스
        -   `length`: 읽어올 `byte`의 최대 길이
    -   offset과 length를 생략할 수 있다. 생략 시 아래와 같이 디폴트 값이 사용된다.
        -   offset: 0
        -   length: `byte[].length`
    -   `readAllBytes`를 호출하면 한번의 호출로 모든 데이터를 한 번에 읽어들일 수 있다.

:::

-   자바 데이터 입출력은 모두 바이트 단위로 이루어진다.
-   데이터 I/O는 파일 저장소, 네트워크, 콘솔 등 다양한 경로에서 이루어질 수 있다.
    -   각 경로마다 모두 구현체가 달라지게 되면 코드의 변경이 커지게 된다.
-   이 문제를 해결하기 위해 자바 `InputStream`, `OutputStream`이라는 기본 추상 클래스를 제공한다.
    -   InputStream: `read()`, `read(byte[])`, `readAllBytes()`
        -   `FileInputStream`: 파일 스트림
        -   `ByteArrayInputStream`: 메모리 스트림
        -   `SocketInputStream`
    -   OutputStream: `write(int)`, `write(byte[])`
        -   `FileOutputStream`: 파일 스트림
        -   `ByteArrayOutputStream`: 메모리 스트림
        -   `SocketOutputStream`
-   `ByteArray..Stream`을 사용하면 메모리에 스트림을 읽고 쓸수 있다.
    -   메모리에 데이터를 읽고 쓸때는 배열 및 컬렉션을 사용하면 되기 때문에 거의 사용하지 않는다.
-   `PrintStream`은 콘솔 출력 스트림이다.
    -   `System.out`이 PrintStream이다.
    -   위 스트림은 자바가 시작될때 자동으로 만들어진다.

## 파일 입출력 최적화

```java
public static void main(String[] args) throws IOException {
    FileOutputStream fos = new FileOutputStream(FILE_NAME);
    long startTime = System.currentTimeMillis();

    for (int i = 0; i < FILE_SIZE; i++) {
        fos.write(1);
    }
    fos.close();

    long endTime = System.currentTimeMillis();
    System.out.println(endTime - startTime);
}
```

-   `fos.write(1)` 코드를 `FILE_SIZE`만큼 반복하며 호출하는데, 1바이트 데이터를 계속해서 스트림을 통해 출력하는 것을 의미한다. 이는 부하가 큰 방식이다.
    -   `write`, `read`는 호출할때마다 OS 시스템 콜을 통해 파일을 읽거나 쓰는 명령어를 전달한다.
    -   하드디스크 쓰기 읽기 작업도 부하가 존재한다.
    -   물론 내부적으로 시스템 레벨의 최적화가 있긴 하지만, 방식 자체가 부하가 큰 것은 사실이다.
-   최적화를 위해서는 더 많은 양의 데이터를 한번에 입출력해야한다.

```java
public static void main(String[] args) throws IOException {
    FileOutputStream fos = new FileOutputStream(FILE_NAME);
    long startTime = System.currentTimeMillis();

    byte[] buffer = new byte[BUFFER_SIZE];
    int bufferIndex = 0;

    for (int i = 0; i < FILE_SIZE; i++) {
        buffer[bufferIndex++] = 1;

        if (bufferIndex == BUFFER_SIZE) {
            fos.write(buffer);
            bufferIndex = 0;
        }
    }

    if (bufferIndex > 0) {
        fos.write(buffer, 0, bufferIndex);
    }

    fos.close();

    long endTime = System.currentTimeMillis();
    System.out.println(endTime - startTime);
}
```

-   위 코드에서 BUFFER_SIZE만큼 데이터를 쌓은 뒤 버퍼가 꽉찰때마다 출력하는 구조로 코드를 변경했다.
-   성능이 매우 크게 개선되는 것을 볼 수 있다.
    -   버퍼 크기가 무한정 크다고 해서 성능이 좋아지는 것은 아니다.
    -   **디스크 및 파일 시스템에서 데이터를 읽고 쓰는 기본 단위가 보통 4KB / 8KB이기 때문이다.**

:::tip BufferedOutputStream

-   `BufferedOutputStream`은 버퍼 기능을 내부에서 대신 처리해준다.

```java
public static void main(String[] args) throws IOException {
    FileOutputStream fos = new FileOutputStream(FILE_NAME);
    BufferedOutputStream bos = new BufferedOutputStream(fos, BUFFER_SIZE);
    long startTime = System.currentTimeMillis();

    for (int i = 0; i < FILE_SIZE; i++) {
        bos.write(1);
    }
    bos.close();

    long endTime = System.currentTimeMillis();
    System.out.println(endTime - startTime);
}
```

-   아웃풋 스트림 객체를 생성자에 전달한다.
-   버퍼 크기도 지정할 수 있다.
-   `byte[]`직접 다룰 필요가 없다.
-   버퍼가 가득차면 내부적으로 버퍼 내용을 비우고, 다시 채우기 시작한다.
-   `flush` 메서드를 사용하면 버퍼가 다 차지 않아도 출력이 가능하다.
-   내부에 데이터가 남아있는데 `close`호출하는 경우 내부적으로 `flush`를 호출하여 출력을 진행한 뒤 자원을 반납한다.
-   읽기 연산의 경우 다음과 같이 동작한다.
    -   FileInputStream에서 데이터를 BUFFER SIZE만큼 읽어들인 뒤 버퍼를 최대한 꽉 채워 저장해둔다.
    -   1바이트 단위로 데이터를 읽어 자바 프로세스로 전달한다.
    -   버퍼가 비게 되면 다시 FileInputStream에서 새러 받아온다.
-   Buffered 스트림은 데이터 동기화가 내부적으로 처리되어 있어 직접 다루는 것보다 성능이 떨어진다.

:::
