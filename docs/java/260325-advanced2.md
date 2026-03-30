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

## 문자 다루기

-   스트림 시 모든 데이터는 `byte` 단위를 사용한다. 따라서 바이트가 아닌 문자를 스트림에 직접 전달할 수 없다.
-   `String`문자를 스트림을 통해 파일에 저장하려면 `byte`로 변환한 뒤 저장해야 한다.
    -   `문자열.getBytes(UTF_8)` 메서드를 호출하여 바이트로 변경한다.
-   입출력간 데이터들을 바이트로 변환해줘야 하는 과정을 `StreamWriter`가 해준다.
    -   `OutputStreamWriter`: 스트림에 `byte`대신 문자를 저장할 수 있게 지원한다.
        -   문자를 입력받고, 받은 문자를 인코딩하여 `byte[]`로 변환한다.
        -   변환한 바이트 데이터를 전달하기 위해 인코딩 문자 집합도 필요하다.
    -   `InputStreamWriter`: 스트림에 `byte` 대신 문자를 읽을 수 있게 지원한다.
        -   인풋 스트림과 문자 집합이 필요하다.
        -   스트림에서 `byte[]`로 데이터를 먼저 읽어들이고, `InputStreamReader`에서 바이트 데이터를 char로 변환한다.
        -   반환값 자체는 EOF 표현을 위해 int이며, 문자로 사용하려면 타입 변환을 하면 된다.
-   스트림은 기본적으로 바이트 단위로 데이터를 읽고 쓴다. write 함수의 파라미터 역시 `byte` 데이터들을 전달했다.
-   반면 `StreamWriter`의 write 함수는 String이나 char를 사용한다.
-   위의 이유는 byte를 다루는 클래스와 문자를 다루는 클래스가 구분되어 있기 때문이다.
    -   문자를 직접 다루는 부모 클래스는 `Writer`, `Reader`이다.
    -   문자를 직접 다룬다 하여 내부 데이터도 **문자 자체가 저장되는 것은 아니다.**
-   `FileWriter`, `FileReader`를 사용하면 기존에 파일 읽고 쓰기 시 바이트 단위로 처리했던 코드가 간결해진다.
    -   Filewriter, FileReader는 `OuputStreamWriter`과 `InputStreamWriter`의 자식 클래스이다.
    -   내부적으로 FileOutputStream, FileInputStream을 생성해주어 조금이나마 편리하게 사용하게 해주는 역할을 한다.
-   `BufferedReader`, `BufferedReader`는 한줄단위로 데이터를 읽어들인다.
    -   내부에서 버퍼 처리를 자동으로 해준다.

:::tip try-with-resource

-   Writer, Reader 사용시 `try-with-resource` 구문을 사용하면 명시적인 close 함수 호출 없이도 try 블럭이 끝나면 자원을 정리해준다.

```java
try (BufferWriter bw = new BufferedWriter(new FileWriter(FILE_PATH, UTF_8, true))) {
    // ...
}
```

-   인라인 형태로 작성하면 된다.

:::

### DataInputStream

-   `DataStream`은 구분자 및 라인없이 데이터를 저장하고 조회할 수 있다.

```java
dataOutputStream.writeUTF("UTF데이터_쓰기");
dataInputStream.readUTF(); // 문자열 읽기
```

-   writeUTF 메서드는 `UTF-8`로 문자를 저장하는데, 저장 시 2byte를 추가로 사용하여 글자 길이를 저장한다.
-   기타 타입들은 각 타입들의 사용 바이트 규격에 맞춰 데이터를 읽어들인다.
-   write과 read의 읽어들이는 데이터 순서 쌍이 동일해야 한다.
    -   writeUTF & writeInt를 했는데 readInt부터 호출하게 되면 데이터 파싱 및 읽기가 실패한다.

### ObjectStream

-   ObjectStream을 사용하면 메모리에 보관되어 있는 인스턴스를 파일에 편리하게 저장할 수 있다.
-   **자바 객체 직렬화를 사용하면, 객체 인스턴스를 바이트 스트림으로 변환하여 파일에 저장하거나 네트워크를 통해 전송할 수 있다.**
-   객체 직렬화를 하려면 클래스는 반드시 `Serializable` 인터페이스를 구현해야 한다.
    -   구현해야할 특정 기능은 없다.
    -   직렬화 가능한 클래스라는 것을 표시하기 위한 목적이다.
    -   **표시가 목적인 인터페이스를 마커 인터페이스라 한다.**

```java
public class ObjectRepositoryImpl implements MemberRepository {
    @Override
    public void add(Member member) {
        List<Member> members = findAll();
        members.add(member);

        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("members-object.dat"))) {
            oos.writeObject(members);
        } catch (IOException e) {
        }

    }

    @Override
    public List<Member> findAll() {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("members-object.dat"))) {
            Object objects = ois.readObject();
            return (List<Member>) objects;
        } catch (IOException | ClassNotFoundException e) {
            return new ArrayList<>();
        }
    }
}
```

-   비어있을때 List.of를 리턴하면 불변 리스트를 반환하기 때문에 `new ArrayList`를 반환해야 한다.
-   writeObject로 객체 쓰기를 하고, readObject로 객체 읽기가 가능하다.
-   `ClassNotFoundException`도 잡아야 하는 예외이다.
    -   현대에는 객체 직렬화를 거의 사용하지 않는다.
        -   버전 관리가 어렵다.
        -   자바 플랫폼에 종속적이다.
        -   직렬화 및 역직렬화가 성능을 저하시킨다.
        -   유연하지 않다.
        -   크기가 상대적으로 크다.
-   이러한 한계점으로 현대에는 JSON을 주로 사용한다.

## File / Files

-   자바에서 파일 또는 디렉토리를 다룰 때는 File / Files / Path 클래스를 사용하면 된다.
-   해당 클래스들로 파일이나 폴더 삭제 및 생성, 조회가 가능하다
-   다양한 메서드들이 존재한다.
    -   `new File("directory/file.dat")` 생성자에 경로를 지정하면 파일을 생성할 수 있다.
    -   확장자를 지정하지 않고 `mkdir()` 메서드를 호출하면 디렉토리로 생성된다.
    -   `file.createNewFile()`: 파일 생성, 생성 성공 시 true반환
    -   `file.isDirectory()`, `file.isFile()`: 디렉토리 여부, 파일 여부 반환
    -   `file.getName()`: 파일명 반환
    -   `originalFile.renameTo(File newFile)`: 기존 파일명을 동일 디렉토리에서 변경하거나, 다른 디렉토리로 이동
    -   `file.lastModified()`: 마지막 수정시각 반환
-   `Files`, `Path`는 자바 1.7 이후 File을 대체하기 위해 생겨났다.
    -   `FileInputStream`과 같이 파일과 관련된 스트림 사용 전에 `Files`에 있는 기능을 찾아보는게 더 권장된다.
    -   많은 유틸 함수들을 제공한다.
    -   `Files.writeString(path, writeString, UTF_8)`, `Files.readString(path, UTF_8)`등으로 쉽게 읽고 쓸수있다.
    -   `List<String> lines = Files.readAllLines(path, UTF_8)` 함수 호출로 라인별로 파일을 읽을 수 있다.
-   파일 복사시 `InputStream`에는 `transferTo`라는 메서드가 있다.
    -   해당 메서드는 읽은 데이터를 바로 `OutputStream`으로 출력한다.
    -   성능 최적화가 되어있어 자바 프로세스 메모리에 바이트단위로 직접 복사하는 것보다 조금 더 빠를 수 있다.
    -   코드도 `inputStream.transferTo(outputStream)`이면 끝이기 때문에 속도가 빠르다.
    -   Files에서 제공하는 `Files.copy(Path source, Path target, StandardCopyOption option)`메서드를 사용하면 자바 프로세스 메모리에 바이트를 적재하지 않고, 즉시 파일끼리 복사 작업을 처리하게 된다.
        -   운영체제 자체의 파일 복사 기능을 사용하기 때문에 속도가 가장 빠르다.

## 네트워크

-   클라이언트가 요청을 보내고 서버가 그 요청을 처리하여 응답을 돌려주는 모델을 **클라이언트-서버 모델이라고 한다.**
-   자바 Main 객체가 서비스 클래스에 메서드 호출로 요청을 하고, 그에 대한 작업을 수행하는 것도 마찬가지로 클라이언트-서버 모델이다. (타입이 void여도 상관없다.)
-   클라이언트와 동시에 서버가 될 수 있다.

### 인터넷 프로토콜

-   IP 프로토콜 기반으로 클라이언트와 서버가 통신하는 과정을 정리한다.
    1. 클라이언트와 서버 사이에는 인터넷이 존재한다.
    2. 매우 복잡한 노드들로 구성되어 있다.
    3. 서로를 찾아가기 위한 식별자로 IP주소가 각각 부여된다.
    4. IP 인터넷 프로토콜은 지정한 IP주소로, 패킷이라는 통신 단위로 데이터를 전달하게 해준다.
-   IP 프로토콜은 한계가 존재한다.
    1. 비연결성: 패킷을 받을 대상이 없거나 서비스 불능이어도 패킷을 전송한다.
    2. 비신뢰성: 중간에 패킷이 소실되거나 패킷 송수신 순서를 보장하지 못한다.
    3. 프로그램 구분: 동일 IP를 사용하는 서버에서 통신하는 애플리케이션이 둘 이상일 수 있다.
-   인터넷 프로토콜 스택 4계층
    1. 애플리케이션 계층: HTTP, FTP, DNS, TLS
    2. 전송 계층: TCP, UDP
    3. 인터넷 계층: IP
    4. 네트워크 인터페이스 계층: LAN 장비, Wi-Fi, Ethernet
-   메시지를 특정 목적지로 전달하는 것을 구현 측면에서 살펴보면 아래와 같다.
    1. App → HTTP 메시지 생성
    2. Socket API → 커널(OS)로 전달
    3. TCP 헤더 추가 → 세그먼트(Segment)
        - **출발지 PORT, 목적지 PORT**
        - **전송 제어, 순서, 검증 정보 등 포함**
    4. IP 헤더 추가 → 패킷(Packet)
        - **출발지 IP, 목적지 IP**
    5. Ethernet 헤더 추가 → 프레임(Frame)
        - 기기 자체 맥주소 등 포함
    6. Network Interface Card → 물리 신호로 송출 (0과 1의 물리신호)
    7. 인터넷 망(라우터 경유) → 목적지 도달

### TCP(Transmission Control Protocol) 특징

-   TCP 3 way handshake 기반으로 연결 지향으로 처리
    1. SYN(synchronize): 클라이언트에서 서버로 연결요청
    2. SYN+ACK(acknowledgement): 서버에서 클라이언트로 연결 가능 응답
    3. ACK: 클라이언트에서 서버로 연결 처리
    4. 데이터 전송
-   데이터 전달 보증
    -   데이터 전송 시 서버에서 데이터 수신에 대한 성공 여부를 응답으로 보낸다.
-   순서 보장
    -   순서가 꼬인 패킷부터 다시 보내라고 클라이언트에 응답한다.
-   신뢰 가능한 프로토콜
-   클라이언트 서버 사이의 연결은 물리적 실제 연결이 아닌 개념적 연결이다.

### UDP(User Datagram Protocol) 특징

-   기능이 거의 없음
-   연결지향 아님
-   데이터 전달 보증 안함.
-   순서 보장 안함
-   속도가 빠름
-   IP와 거의 유사하고, PORT 및 checksum 정도만 추가된다.
    -   애플리케이션 레벨에서 추가 작업이 필요하다.
    -   체크섬: 데이터가 제대로 왔는지 검증하는 데이터

:::tip 포트

-   포트는 동일 IP에서 실행중인 서로 다른 애플리케이션에 데이터를 전달할때 사용한다.
-   같은 IP 내에서 프로세스를 구분할때 사용한다.

:::

### PORT

-   0~65535 범위에서 할당 가능
-   0~1023은 잘 알려진 포트로 사용하지 않는게 좋다.
    -   FTP: 20, 21
    -   TELNET: 23
    -   HTTP: 80
    -   HTTPS: 443

### DNS (Domain Name System)

-   IP는 기억하기 어렵고 변경될 수 있다.
-   도메인 명을 IP 주소로 변환하여 사용하기 위한 시스템이 DNS이다.
    1. 도메인 명으로 DNS 서버에 요청한다.
    2. DNS 서버가 매핑된 IP 주소를 응답해준다.
    3. 클라이언트가 해당 IP로 접속한다.

## 네트워크 프로그램 작성

-   아래는 클라이언트 코드다.
    1. localhost는 IP가 아니므로 내부에서 InetAddress를 통해 IP를 조회한다.
    2. 호스트 파일에 저장되어 있으므로 `127.0.0.1` 주소를 반환받고 PORT변수값의 포트 번호를 덧붙여 접속을 시도한다.
    3. 연결이 완료되면 `Socket`객체를 반환한다.
    4. 해당 객체는 서버와 연결된 연결점이라고 보면 된다.
    5. 소켓 객체를 통해 서버와 통신하게 된다.

```java
public static void main(String[] args) throws IOException {
    log("클라이언트 시작");
    Socket socket = new Socket("localhost", PORT);
    DataInputStream input = new DataInputStream(socket.getInputStream());
    DataOutputStream output = new DataOutputStream(socket.getOutputStream());

    String toSend = "Hello";
    output.writeUTF(toSend);

    String received = input.readUTF();
    System.out.println(received);

    input.close();
    output.close();
    socket.close();
}
```

-   아래는 서버 코드다.
    -   클라이언트 서버 통신은 소켓 객체가 제공하는 스트림을 사용하면 된다.
    -   클라이언트 OutputStream -> 서버 InputStream
    -   서버 OutputStream -> 클라이언트 InputStream
-   서버는 서버 소켓(ServerSocket)이라는 특별한 소켓을 사용해야 한다.
    1. 지정한 포트로 서버 소켓을 열어둔다.
    2. 클라이언트에서 해당 포트에 연결을 시도한다.
    3. OS 계층에서 TCP 3way hanshake가 이루어진다.
    4. TCP 연결이 완료되면 OS backlog queue라는 곳에 클라이언트와 서버 사이의 TCP 연결 정보를 보관한다.
        - 해당 연결정보에 IP, PORT 정보들이 들어있다.
-   클라이언트는 요청시 포트를 명시적으로 지정할 필요가진 없다.
    -   지정하지 않는 경우 랜덤 포트가 할당된다.
-   `serverSocket.accept()`: 서버 소켓은 **단순히** 클라이언트와 서버의 TCP 연결만 지원하는 특별한 소켓이다.
    -   실제 클라이언트 서버 사이의 데이터 통신을 위해서는 **`Socket`객체가 필요하다.**
    -   `accept()`메서드를 호출하면 TCP 연결정보를 기반으로 `Socket`객체를 생성한다.
-   `accept`호출시 백로그 큐에서 TCP 연결 정보를 조회한다.
    -   **연결 정보가 없는 경우 해당 정보가 생성될때까지 블로킹하며 대기한다.**
    -   해당 정보를 기반으로 Socket 객체를 생성한다.
    -   **사용한 TCP 정보는 큐에서 제거된다.**

```java
public static void main(String[] args) throws IOException {
    ServerSocket serverSocket = new ServerSocket(PORT);

    Socket socket = serverSocket.accept();
    DataInputStream input = new DataInputStream(socket.getInputStream());
    DataOutputStream output = new DataOutputStream(socket.getOutputStream());

    String received = input.readUTF();
    String toSend = received + " World";
    output.writeUTF(toSend);

    input.close();
    output.close();
    socket.close();
}
```

-   서버 프로그램을 먼저 실행해야 한다.

:::tip localhost, 127.0.0.1

-   현재 사용중인 컴퓨터 자체를 가리키는 호스트 이름이다.
    -   127.0.0.1이라는 IP로 매핑된다.
    -   위 주소는 IP 주소 체계에서 루프백 주소로 지정된 IP 주소이다.
    -   컴퓨터가 스스로를 가리킬때 사용된다.

:::

-   자바에서는 `InetAddress` 클래스를 사용하면 호스트명으로 IP 주소를 찾을 수 있다.
    -   `InetAddress.getByName("호스트명")`
    -   DNS 조회 전, 시스템의 로컬 호스트 파일을 먼저 조회한다.
    -   호스트파일에 해당 호스트가 없으면 DNS에 요청하여 IP주소를 얻는다.
    -   `https://parkjju.github.io/vue-TIL/`라는 URL이 있으면, `parkjju.github.io`가 호스트 명에 해당된다.

```text
# hosts 파일 예시
127.0.0.1       localhost
192.168.1.10    my-server.local
93.184.216.34   example.com
```

### 여러 클라이언트 연결 처리하기

-   서버는 하나의 클라이언트가 아닌 여러 클라이언트 연결을 처리해야 한다.
-   서로 다른 포트의 클라이언트로부터 서버로 요청이 이루어진다.
-   두 클라이언트에 대해 모두 TCP 3way handshake가 이루어지고 OS backlog queue에 각 클라이언트에 대해 연결정보가 보관된다.
-   `Socket.accept()`함수를 호출하여 큐 정보를 기반으로 소켓 객체를 생성한다.
    -   큐 정보에서 추출된 연결 정보를 기반으로 해당 클라이언트와 스트림을 통해 데이터를 송수신한다.
    -   **이때 나머지 하나 클라이언트에서는 메세지 송수신이 안되는 것으로 보인다.**
-   그 이유는 다음과 같다.
    1. 클라이언트가 메시지를 서버에 전송하는 경우 다음과 같은 흐름이 존재한다.
        - 애플리케이션 -> OS TCP 송신 버퍼 -> 네트워크 인터페이스
        - 서버 네트워크 인터페이스 -> OC TCP 수신 버퍼 -> 애플리케이션
    2. 이때 나머지 클라이언트에서 송신한 메시지는 서버 애플리케이션에서 아직 읽지 않아 서버 TCP 수신 버퍼에서 대기한다.
    3. **소켓 객체 없이 서버 소켓만으로도 TCP 연결은 완료된다는 점을 기억하자.**
    4. **연결 이후 서로 메시지를 주고 받기 위해서는 소켓 객체가 필요하다.**
-   aceept 메서드는 **새로운 연결 정보가 도착할때까지** 블로킹 상태로 대기한다.
-   여러 클라이언트 연결을 처리하기 위해서는 서버쪽에서 새로운 연결이 있을때마다 `Session`객체와 별도 스레드를 생성하고, 새로운 스레드에서 해당 객체를 실행하면 된다.

```java
public static void main(String[] args) throws IOException {
    log("서버 시작");
    ServerSocket serverSocket = new ServerSocket(PORT);
    log("서버 소켓 시작 - 리스닝 포트: " + PORT);

    while (true) {
        Socket socket = serverSocket.accept(); // 블로킹
        log("소켓 연결: " + socket);

        SessionV3 session = new SessionV3(socket);
        Thread thread = new Thread(session);
        thread.start();
    }
}
```

-   메인스레드에서 `serverSocket.accept`를 무한루프로 호출하더라도 해당 함수를 호출하는 곳에서 블로킹이 이루어진다.
-   새 연결이 감지되면 블로킹이 해제되고 새 세션을 생성하여 새로운 스레드에서 데이터 송수신을 처리하게 된다.

### 자원 정리

-   클라이언트 연결을 직접 종료하면 클라이언트 프로세스가 종료되면서 클라이언트 <-> 서버 TCP 연결도 종료된다.
-   이때 readUTF로 서버에서 클라이언트 메시지를 읽으려 하면 `EOFException`이 발생한다.
    -   위와 같은 예외가 발생하게 되면 자원 정리 코드를 호출하지 못한다.
-   서버는 프로세스가 계속 살아 실행되어야 하기 때문에 자원 사용 후에는 반드시 정리해야 한다.
-   try-catch-finally 구문으로 자원 정리가 반드시 이루어지도록 코드를 작성해야 한다.
    -   finally에서 자원 정리를 할때 만약 예외가 발생한다면 finally 내에서 해당 예외를 잡아 처리하도록 해야한다.
    -   위 구문 역시 `close`코드를 명시적으로 호출하지 않을 여지가 존재한다.
-   `try-with-resource` 구문을 활용하여 자원을 정리하는 것이 가장 좋다.
-   자원 클래스에서 `AutoCloseable` 인터페이스를 구현해야 한다.
    -   `close` 메서드를 오버라이딩 해야한다.
    -   자원 정리 과정에서 해당 메서드가 자동으로 호출될것인데, 이때 예외를 던졌다고 가정해보자.
    -   `try-catch-resource`구문에서 해당 예외를 잡아 처리를 하게 된다.

```java
private static void logic() throws CallException, CloseException {
    try (ResourceV2 resource1 = new ResourceV2("resource1");
         ResourceV2 resource2 = new ResourceV2("resource2")) {

        resource1.call();
        resource2.callEx(); // CallException
    } catch (CallException e) {
        System.out.println("ex: " + e);
        throw e;
    }
}
```

-   위 구문은 아래 문제들을 해결한다.
    1. AutoCloseable 기반으로 close를 자동으로 호출해주어 자원 정리 코드를 호출하지 않을 휴먼에러를 제거한다.
    2. close 과정에서 발생하는 예외를 잡아 처리하여, 다른 자원들을 무사히 닫을 수 있게 한다.
    3. close 호출 순서를 잘못 작성할 여지를 방지한다.
    4. try-catch-finally를 거쳐 catch이후 자원 반납을 하는 것이 아닌 try 구문 내에서 자원 반납을 마친다.
-   try 로직 예외와 자원정리 예외가 동시에 발생하는 경우
    -   `Suppressed`라는 이름으로 부가 예외들을 담아준다.

```java
private static void logic() throws CallException, CloseException {
    try (ResourceV2 resource1 = new ResourceV2("resource1");
         ResourceV2 resource2 = new ResourceV2("resource2")) {

        resource1.call();
        resource2.callEx(); // CallException
    } catch (CallException e) {
        System.out.println("ex: " + e);
        throw e;
    }
}
```

-   위 코드에서 resource2를 생성하는 과정에서 예외가 발생하는 경우 resource1의 자원은 닫고 catch로 넘어간다.
-   만약 resource2에서 예외가 발생하여 resource1을 close하는데, 이때 예외가 발생하는 경우
    -   e.suppressed에 close 과정의 예외가 담긴다. (부가 예외)
    -   resource2 생성 예외가 주 예외가 된다.

```java
System.out.println("주 예외: " + e.getMessage());

for (Throwable t : e.getSuppressed()) {
    System.out.println("Suppressed: " + t.getMessage());
}
```

-   주 예외, 부가 예외는 위와 같이 출력한다.

## 서버 종료

-   자바 서버를 종료할 때 서버 소켓과 연결된 모든 소켓 자원을 다 반납한 뒤, 안정적으로 종료하는 방법이 필요하다.
-   셧다운 훅(Shutdown Hook)
    -   자바에서는 **프로세스 종료시 자원 정리나 로그 기록과 같이 종료 작업을 마무리 할 수 있는 셧다운 훅 기능을** 지원한다.
    -   프로세스 종료는 크게 두가지로 분류 가능하다.
        -   정상 종료
            -   모든 non 데몬 스레드 실행 완료로 프로세스 종료
            -   Ctrl+C를 눌러 프로그램 중단
            -   kill 명령어 전달 (kill -9는 제외)
                -   kill -9는 OS 커널이 직접 프로세스를 종료하는 옵션임.
                -   kill 명령어만 전달하는 경우 프로세스가 직접 graceful shutdown을 수행함
            -   인텔리제이 stop버튼
        -   강제 종료
            -   `kill -9`
            -   운영체제에서 프로세스를 더 이상 유지할 수 없다고 판단할때 사용
    -   정상 종료는 셧다운 훅이 작동하여 프로세스 종료 전 필요한 후처리가 가능하다.
    -   셧다운 훅 구현시 모든 세션들을 찾아서 종료해야 한다.
    -   따라서 세션들을 보관하고 관리할 매니저 객체가 필요하다.

```java
public class SessionManagerV6 {

    private List<SessionV6> sessions = new ArrayList<>();

    public synchronized void add(SessionV6 session) {
        sessions.add(session);
    }

    public synchronized void remove(SessionV6 session) {
        sessions.remove(session);
    }

    public synchronized void closeAll() {
        for (SessionV6 session : sessions) {
            session.close();
        }
        sessions.clear();
    }
}
```

-   `try-with-resources` 구문은 try 가 끝나는 시점에 즉시 자원을 정리한다.
-   try에서 자원 선언과 정리를 묶어 처리할때 사용 가능하다.
-   만약 try 구문 뿐만 아니라, **프로세스를 종료하는 시점에도 동일하게 자원을 정리하고 싶은 경우에는 `try-with-resources`를 통해 자원을 정리할 수 없게 된다.**
    -   try 구문은 지역변수 기반으로 수행되기 때문에 세션 매니저 멤버를 활용해야 한다.
-   try 구문 내에서도, 셧다운 훅 내에서도 자원 정리 코드가 중복으로 호출될 수 있기 때문에 `synchronized` 키워드를 사용해야 한다.

```java
public static void main(String[] args) throws IOException {
    log("서버 시작");
    SessionManagerV6 sessionManager = new SessionManagerV6();
    ServerSocket serverSocket = new ServerSocket(PORT);
    log("서버 소켓 시작 - 리스닝 포트: " + PORT);

    // ShutdownHook 등록
    ShutdownHook shutdownHook = new ShutdownHook(serverSocket, sessionManager);
    Runtime.getRuntime().addShutdownHook(new Thread(shutdownHook, "shutdown"));
    //...
}
```

-   셧다운 훅 등록은 위와 같이 서버 소켓과 세션 매니저를 생성자에 전달해야 한다.
-   이후 런타임에 해당 셧다운 훅 객체를 등록해야 한다.

```java
static class ShutdownHook implements Runnable {
    private final ServerSocket serverSocket;
    private final SessionManagerV6 sessionManager;

    public ShutdownHook(ServerSocket serverSocket, SessionManagerV6 sessionManager) {
        this.serverSocket = serverSocket;
        this.sessionManager = sessionManager;
    }

    @Override
    public void run() {
        log("shutdownHook 실행");
        try {
            sessionManager.closeAll();
            serverSocket.close();

            Thread.sleep(1000); // 자원 정리 대기
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("e = " + e);
        }

    }
}
```

-   서버 소켓을 닫고, 세션 매니저가 관리하는 모든 자원들을 정리해준다.
-   non 데몬 스레드 실행이 완료되면 자바 프로세스가 정상 종료되지만, Ctrl + C, kill, intelliJ STOP의 종료들은 **non 데몬 스레드 종료 여부와 상관없이 프로세스를 종료한다.**
    -   다만 셧다운 훅 실행 종료까지는 기다려준다.
    -   각 세션에서 read / write 작업간에 지연이 발생할 수 있다.
    -   graceful shutdown을 위해 synchronized 함수 내에서 close 호출이 된다.
    -   Thread.sleep보다는 join을 통해 모든 락 해제가 완료되었을때 shutdown 훅이 호출되도록 하는것이 더 안전하다.

```java
public static void main(String[] args) throws IOException {
    long start = System.currentTimeMillis();

    try {
        Socket socket = new Socket();
        socket.connect(new InetSocketAddress("192.168.1.250", 45678), 1000);
    } catch (SocketTimeoutException e) {
        e.printStackTrace();
    }
    long end = System.currentTimeMillis();
    System.out.println("end = " + (end - start));
}
```

-   소켓 객체 생성시 객체만 생성한 뒤 IP, 포트 지정을 나중에 할 수 있다.
-   소켓 객체 생성 파라미터에 포트와 IP 주소를 지정하면 즉시 연결을 시도하는데, 생성자에 빈 파라미터를 전달하고 connect 메서드를 활용하면 연결 시점을 조절할 수 있다.
    -   **connect 메서드에는 timeout 파라미터도 전달할 수 있어서, 연결 타임아웃도 지정 가능하다.**
-   클라이언트가 서버에 요청을 했는데도 서버가 응답을 계속 주지 않는 경우도 존재한다. (서버 폭주 등)
    -   이때 소켓 타임아웃을 사용하면 된다.
    -   `socket.setSoTimeout(timeout);`
    -   해당 타임아웃 시간만큼 지나면 read time out 예외가 발생한다.
-   외부 서버와의 소켓 통신 시 소켓 타임아웃을 반드시 설정해야 한다.

### TCP 연결 해제

-   TCP 기반으로 A,B가 서로 통신한다.
-   TCP 연결 종료를 위해서는 서로 FIN 메시지를 주고 받아야 한다.
    -   A -> B: FIN 메시지를 보낸다.
    -   B -> A: FIN을 받은 B도 A에게 FIN을 보낸다.
-   `socket.close()`를 호출하면 TCP에서 FIN 메시지를 상대에게 보낸다.
-   FIN을 받은 상대방도 `socket.close()`를 호출하여 FIN을 다시 보내야 한다.
-   과정을 자세히 정리해보면 다음과 같다.
    1. 서버가 연결 종료를 위해 `socket.close()`를 호출한다.
        - 서버가 클라이언트에 FIN을 전송한다.
    2. 클라이언트는 FIN을 받고, OS에서 FIN + ACK를 서버에 보낸다.
        - 서버가 FIN을 보냈더라도, 클라이언트는 아직 전송할 데이터가 남아있을 수 있기 때문에 일단 ACK으로 수신만 확인하고, 데이터를 다 보낸 후에 FIN을 따로 보낸다.
    3. 클라이언트도 연결 종료를 위해 `socket.close()`를 호출한다.
        - 클라이언트가 서버에 FIN을 전송한다.
    4. 서버 OS는 ACK를 클라이언트에 보낸다.
-   클라이언트에서 데이터를 읽어들이는 메서드에 따라 EOF 해석이 다르다.
    -   `InputStrea read()`: 1byte 단위로 데이터를 읽음 (-1)
    -   `BufferedReader().readLine()`: 라인 단위로 String을 읽음 (null)
    -   `DataInputStream.readUTF()`: DataInpuStream을 통해 String 단위로 데이터를 읽음 (EOFException 발생)
    -   위와 같이 EOF발생 시 읽어들일 데이터가 더 없다는 의미이므로 소켓 close 메서드를 호출하여 서버에 FIN 메시지를 전달해야 한다.
-   만약 서버와의 TCP 연결에 문제가 생긴 경우 서버로부터 **RST(Reset) 패킷이 전달된다.**
    -   이 경우 해당 연결을 사용해서는 안된다는 의미이다.
    -   read로 읽는 경우 Connection Reset
    -   write로 쓰는 경우 Broken pipe 예외를 던진다.
