---
title: TCP/IP 소켓 프로그래밍 1
tags: ['Network', 'Computer Science', 'iOS']
---

## 네트워크 프로그래밍

네트워크를 통해 기기 간 데이터 송수신이 이루어질 때에는 소켓을 통해 이루어진다. 소켓은 각 `운영체제에서 제공되는 소프트웨어적 장치이다`. 네트워크 프로그래밍은 소켓 기반으로 이루어지기 때문에 소켓 프로그래밍이라고도 부른다. 소켓은 데이터 통신 송수신 방법의 세세한 부분을 래핑하여 추상화한다.

소켓은 전화기에 비유되는데, 수신을 위한 목적과 송신을 위한 목적으로 생성 방법이 구분된다. 소켓 생성시에는 주소정보가 할당된다. 소켓 주소정보는 **IP와 포트번호로 구성된다.**

`socket()`함수가 호출되고 `bind()`함수를 통해 주소 정보가 연결된다. 주소 정보까지 할당이 완료되면 외부로부터 연결 가능한 상태로 세팅해야한다. 해당 역할을 바로 `listen()` 함수가 하게 된다. 해당 함수 호출까지 이루어지면 수신 전용 소켓이 생성된다.

`listen`은 수신 가능한 상태가 되는 것이고, `accept()`함수가 호출되어야 따르릉 울리는 전화기의 수화기를 드는 행위가 이루어지는 것이다.

연결 요청을 허용하는 프로그램을 가리켜 `서버(Server)`라고 한다. 서버는 연결을 요청하는 클라이언트보다 먼저 실행되어야 한다.

위 과정을 거쳐 생성된 소켓을 `서버 소켓`, `리스닝 소켓`이라 한다.

### 정리

1. 소켓은 전화기로 비유할 수 있다.
2. 소켓 생성 (`socket()`)
3. 소켓 주소 할당 (`bind()`), 주소 정보는 IP와 포트번호로 이루어짐
4. 소켓을 네트워크 망에 연결 (`listen()`)
5. 외부 연결을 허용 (`accept()`)

## 리스닝 소켓 (서버 소켓) 생성 코드

```c
void error_handling(char *message);

int main(int argc, char *argv[])
{
	int serv_sock; // 소켓 디스크립터 저장 변수
	int clnt_sock;

	struct sockaddr_in serv_addr;
	struct sockaddr_in clnt_addr;
	socklen_t clnt_addr_size;

	char message[]="Hello World!";

	if(argc!=2){
		printf("Usage : %s <port>\n", argv[0]);
		exit(1);
	}

    // 소켓 생성 함수
	serv_sock=socket(PF_INET, SOCK_STREAM, 0);
	if(serv_sock == -1)
		error_handling("socket() error");
}
```

위 코드에서 `socket()`함수 호출을 통해 소켓이 생성된다. 실제 소켓 생성은 내부 운영체제를 통해 이루어지기 때문에 알 필요가 없고, 리턴되는 값을 통해 소켓을 활용하게 된다. 이때 리턴 값은 소켓을 지칭하는 숫자이며 `파일 디스크립터`, 혹은 `소켓 핸들`이라고 한다.

```c
int main(int argc, char *argv[])
{
    // ...
    serv_sock=socket(PF_INET, SOCK_STREAM, 0);
    if(serv_sock == -1)
        error_handling("socket() error");

    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family=AF_INET;
    serv_addr.sin_addr.s_addr=htonl(INADDR_ANY);
    serv_addr.sin_port=htons(atoi(argv[1]));

    if(bind(serv_sock, (struct sockaddr*) &serv_addr, sizeof(serv_addr))==-1 )
        error_handling("bind() error");

    if(listen(serv_sock, 5)==-1)
        error_handling("listen() error");

    clnt_addr_size=sizeof(clnt_addr);
    clnt_sock=accept(serv_sock, (struct sockaddr*)&clnt_addr,&clnt_addr_size);
    if(clnt_sock==-1)
        error_handling("accept() error");

    write(clnt_sock, message, sizeof(message));
    close(clnt_sock);
    close(serv_sock);
    return 0;
}
```

위 코드에서 `struct sockaddr_in serv_addr;`를 볼 수 있는데 소켓주소 구조체 타입 기반으로 서버 주소와 클라이언트 주소에 대한 변수를 선언할 수 있게 된다. `memset`으로 변수를 초기화해준다. 이후 `server_addr.sin_family`부터 이어지는 세 코드동안 주소 정보가 초기화된다.

이후 `bind`함수 호출 시 위에서 생성한 소켓 `파일 디스크립터`, 소켓 주소 정보를 전달한다. 소켓 정보를 `listen`함수에 전달하여 해당 소켓이 네트워크 망에 연결된다.

소켓이 `listen` 호출 뒤 `accept`까지 호출한다. 해당 함수는 호출로 동작이 끝나는 게 아니라 블록되어 대기 시간이 발생하며 이때 외부로부터 연결 요청이 오면 본격적으로 연결이 이루어진다.

## 클라이언트 소켓 생성 코드

클라이언트 소켓의 경우 리스닝 소켓 생성과 마찬가지로 `memset`까지 실행 과정이 동일하다.

```c
int main(int argc, char* argv[])
{
	// ...
	if(connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr))==-1)
		error_handling("connect() error!");

	str_len=read(sock, message, sizeof(message)-1);
	if(str_len==-1)
		error_handling("read() error!");

	printf("Message from server: %s \n", message);
	close(sock);
	return 0;
}
```

클라이언트 소켓 코드에서는 `connect` 함수를 호출하여 리스닝 중인 소켓에 연결을 요청한다. 리스닝 소켓 예제 코드에 `write`이 존재하므로 클라이언트 소켓에서는 서버에서 `write`한 데이터를 읽어들이고 소켓을 종료하게 되는 것이다.
