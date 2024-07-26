---
title: TCP/IP 소켓 프로그래밍 2
tags: ['Network', 'Computer Science', 'iOS']
---

## 프로토콜의 이해와 소켓의 생성

소켓 송수신은 구분되는 타입이 존재한다. 소켓 송수신 규칙을 프로토콜이라는 용어로 표현한다.

프로토콜은 컴퓨터 상호간의 데이터 송수신에 필요한 통신규약을 의미한다. 소켓 생성시 기본적일 프로토콜을 지정해야 한다.

```c
#include <sys/socket.h>

int socket(int domain, int type, int protocol);
```

`domain`인자에 소켓이 사용할 프로토콜 체계 정보를 전달한다. `type`에 소켓의 데이터 전송 방식 정보를 전달한다. `protocol`에 두 컴퓨터간 통신에 사용되는 프로토콜 정보를 전달한다.

위를 비유적으로 표현하면 `편지` 도메인에 `등기`와 `일반` 전송 방식이 존재하고 `일반-택배`,`일반-편지`, `등기-빠른등기`, `등기-더빠른 등기`라는 전송 방식에 맞는 프로토콜이 존재하는 것이라고 이해하면 될 것이다.

아래는 소켓 생성시 도메인에 해당하는 프로토콜 체계이다.

1. `PF_INET`: IPv4 인터넷 프로토콜 체계
2. `PF_INET6`: IPv6 인터넷 프로토콜 체계
3. 나머지도 여러가지가 있지만 크게 중요하지 않음

아래는 `PF_INET`타입에 해당하는 소켓 데이터 전송방식이다.

1. 연결 지향형 소켓 타입: 재차 확인하는 절차가 존재, **데이터 전송 완료를 보장하기 때문에 속도가 느리다.** 0. TCP 소켓으로 불린다.(SOCK_STREAM)
    1. 중간에 데이터가 소멸되지 않는다.
    2. 전송 순서대로 데이터가 수신된다.
    3. 데이터 경계가 존재하지 않는다. 송신자가 5, 10바이트로 분리하여 데이터를 보내도 수신자가 15바이트로 합쳐서 처리가 가능하게 됨을 의미한다.
    4. 소켓 대 소켓 연결은 반드시 1대1 구조이다.
2. 비 연결 지향형 소켓 타입: 던져놓고 끝. **속도는 빠르지만 데이터 전송 완료를 보장하지 못한다.**
    1. 순서 상관없이 빠른 속도를 지향한다.
    2. 데이터 손실 및 파손 우려가 존재한다. TCP 소켓도 데이터 파손은 될 수 있지만 이를 인지하고 재요청이 이루어지지만 UDP는 인지조차 못한다.
    3. 데이터 경계가 존재한다.
    4. 한 번에 전송할 수 있는 데이터 크기가 제한된다.

IPv4 인터넷 프로토콜 체계 내에서 소켓 생성 코드를 보면 다음과 같다.

```c
// TCP 소켓
int tcp_socket=socket(PF_INET, SOCK_STREAM, IPPROTO_TCP);

// UDP 소켓
int udp_socket=socket(PF_INET, SOCK_DGRAM, IPPROTO_UDP);
```

IPv4 프로토콜 체계 내에서 TCP, UDP 타입만 지정해주면 내부 프로토콜은 하나밖에 존재하지 않으므로 인자를 0으로 전달해도 된다.

## 실습

아래는 TCP 기반 리스닝 소켓에 해당한다.

```c
int main(int argc, char *argv[])
{
	char message[]="Hello World!";

	if(argc!=2){
		printf("Usage : %s <port>\n", argv[0]);
		exit(1);
	}

    // domain: IPv4 프로토콜 체계
    // type: TCP
    // protocol: 디폴트값
	serv_sock=socket(PF_INET, SOCK_STREAM, 0);
	if(serv_sock == -1)
		error_handling("socket() error");

    // 변수 초기화
	memset(&serv_addr, 0, sizeof(serv_addr));

    // 서버 주소값 지정
	serv_addr.sin_family=AF_INET; // TCP
	serv_addr.sin_addr.s_addr=htonl(INADDR_ANY);
	serv_addr.sin_port=htons(atoi(argv[1]));

    // 서버 주소값 바인딩
	if(bind(serv_sock, (struct sockaddr*) &serv_addr, sizeof(serv_addr))==-1)
		error_handling("bind() error");

    // 소켓 리스닝 시작
	if(listen(serv_sock, 5)==-1)
		error_handling("listen() error");

    // 클라이언트 소켓 accept로 데이터 송신할 대상 확인
	clnt_addr_size=sizeof(clnt_addr);
	clnt_sock=accept(serv_sock, (struct sockaddr*)&clnt_addr,&clnt_addr_size);
	if(clnt_sock==-1)
		error_handling("accept() error");

    // 클라이언트 소켓에 데이터 쓰기
	write(clnt_sock, message, sizeof(message));
	close(clnt_sock);
	close(serv_sock);
	return 0;
}
```

아래는 TCP 클라이언트 소켓에 해당한다.

```c
int main(int argc, char* argv[])
{
	int sock;
	struct sockaddr_in serv_addr;
	char message[30];
	int str_len=0;
	int idx=0, read_len=0;

	if(argc!=3){
		printf("Usage : %s <IP> <port>\n", argv[0]);
		exit(1);
	}

    // IPv4 TCP 소켓 생성
	sock=socket(PF_INET, SOCK_STREAM, 0);
	if(sock == -1)
		error_handling("socket() error");

    // 서버주소 할당
	memset(&serv_addr, 0, sizeof(serv_addr));
	serv_addr.sin_family=AF_INET; // TCP
	serv_addr.sin_addr.s_addr=inet_addr(argv[1]); // 파라미터에서 IP주소 가져오기, 로컬호스트
	serv_addr.sin_port=htons(atoi(argv[2])); // 포트번호

	if(connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr))==-1)
		error_handling("connect() error!");

    // 소켓으로부터 데이터 읽어들이기
	while(read_len=read(sock, &message[idx++], 1))
	{
		if(read_len==-1)
			error_handling("read() error!");

		str_len+=read_len;
	}

	printf("Message from server: %s \n", message);
	printf("Function read call count: %d \n", str_len);
	close(sock);
	return 0;
}
```

위 코드를 통해 알 수 있는 것은 서버 소켓으로부터 전달받는 데이터는 특정 바이트의 문자열 데이터이지만, 클라이언트 소켓은 구분없이 1바이트씩 이어서 읽어들일 수 있다는 것이다.
