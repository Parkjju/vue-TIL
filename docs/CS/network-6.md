---
title: TCP/IP 소켓 프로그래밍 5
tags: ['Network', 'Computer Science', 'iOS']
---

## UDP 소켓 특징과 구현

1. UDP 소켓은 SEQ, ACK과 같은 메시지 전달을 하지 않는다.
2. 연결의 설정과 해제의 과정도 존재하지 않는다.
3. 데이터 분실 및 손실 위험이 있다.
4. 별다른 연결 설정 등의 과정이 없기 때문에 데이터 전송이 빠르다.
5. 안전성보다 성능이 중요할 때에 UDP를 사용한다.

TCP는 호스트가 서로 연결된 이후 소켓의 파일 디스크립터 정보를 통해 데이터를 통신하게 된다. 연결만 되면 종료 이전까지 IP주소에 대한 정보를 알 필요 없이 소켓의 파일 디스크립터를 통해 핸들링하면 된다.

UDP 소켓이 연결의 개념이 없기 때문에 파생되는 세 가지 개념이 있다.

1. 매번 데이터를 전송할 때마다 목적지 주소와 소켓에 대한 정보를 전달해줘야 한다.
2. 서버 소켓과 클라이언트 소켓의 구분이 없다.
3. 하나의 소켓으로 둘 이상의 영역과 데이터 송수신이 가능하다.

## UDP 기반 데이터 입출력

UDP 소켓의 데이터 송수신 함수는 `sendto`와 `recv`가 있다.

```c
#include <sys/socket.h>

ssize_t sendto(
    int sock,
    void *buff,
    size_t nbytes,
    int flags,
    struct sockaddr *to,
    socklen_t addrlen
);
```

1. `sock`: 데이터 전송에 사용될 소켓 파일 디스크립터
2. `buff`: 전송할 데이터를 저장하고 있는 버퍼의 주소값
3. `nbytes`: 전송할 데이터 크기
4. `flags`: 옵션 지정에 사용되는 매개변수, 전달할 옵션이 없으면 0
5. `to`: 목적지 주소정보를 담고 있는 `sockaddr` 참조값
6. `addrlen`: to 파라미터로 전달된 주소값의 구조체 크기

```c
#include <sys/socket.h>

ssize_t recvfrom(
    int sock,
    void *buff,
    size_t nbytes,
    int flags,
    struct sockaddr *from,
    socklen_t *addrlen
);
```

1. `sock`: 데이터 수신에 사용될 UDP 소켓 파일 디스크립터
2. `buff`: 데이터 수신에 사용될 버퍼 주소값
3. `nbytes`: 수신할 최대 바이트 수 (buff 크기 이하)
4. `flags`: 옵션 지정
5. `from`: 송신 소켓 정보를 채워넣을 비어있는 소켓 주소 참조 전달
6. `addrlen`: 매개변수 from으로 전달된 소켓 구조체 크기

위의 두 함수 호출 리턴값은 각각 성공 시 송수신된 바이트 수를 나타낸다.

UDP는 데이터 경계가 존재하기 때문에 한번의 `recvfrom`호출을 통해 하나의 메시지를 완전히 읽어들인다.

`버퍼를 넘어서는 메시지를 수신하는 경우 데이터가 소실되는지 확인`

`sendto` 호출 시 IP와 PORT번호가 자동으로 할당되기 때문에 일반적으로 UDP 클라이언트 프로그램에서는 주소정보를 할당하는 과정이 불필요하다.
