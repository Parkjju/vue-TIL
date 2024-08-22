---
title: TCP/IP 소켓 프로그래밍 8. 도메인 이름과 인터넷 주소
tags: ['Network', 'Computer Science', 'iOS']
---

## 도메인 이름과 DNS 서버

도메인 이름은 IP를 대신하는 서버의 주소를 의미한다. (ex: www.naver.com) **실제 접속에 사용되는 주소는 아니다.** 이 정보는 IP로 변환이 되어야만 접속이 가능하다.

네트워크 상에는 DNS서버가 존재한다. 이는 도메인 이름을 IP주소로 변환해주는 서버이며 일종의 분산 데이터베이스 시스템이다.

1. 도메인 이름을 통해 서버 접속 요청
2. DNS 서버에 도메인의 IP주소 요청
3. IP주소 기준으로 실제 접속

DNS는 분산적으로 데이터들을 관리해야 하기 때문에 계층적으로 관리된다.

1. `Default DNS 서버`: 가장 규모가 작은 도메인 네임 서버
2. `DNS 서버`: default dns 서버에 IP가 없는 경우 그 다음 서버
3. `Root DNS 서버`: DNS 서버에서도 IP 못찾은 경우 그 다음 최상위 계층

루트 DNS 서버라고 해도 모든 IP를 담고 있는 것은 아니다. 루트에서 다시 지역적으로 목적지 근방의 DNS 서버 하위 계층에 쿼리를 날린다.

## IP주소와 도메인 이름 사이의 변환

IP주소를 통해 DNS에 저장되어 있는 도메인 네임 정보를 추출하고, 도메인 네임 정보를 통해 DNS에 저장되어 있는 IP주소를 추출한다.

도메인 이름을 이용해서 IP주소를 얻어오기 위해서는 아래의 함수를 호출한다.

```c
#include <netdb.h>

// 성공시 hostent 구조체 변수의 주소 값, 실패 시 NULL 포인터 반환
struct hostent * gethostbyname(const char * hostname);
```

`hostname`에 도메인 이름 정보를 전달하면 도메인 서버 정보가 `hostent` 구조체 변수에 채워진다.

```c
struct hostent {
    char * h_name;      // official name
    char ** h_aliases;  // alias list
    int h_addrtype;     // host address type
    int h_length;       // address length
    char ** h_addr_list;// address list
}
```

IP는 도메인 이름에 비해 변동이 심하다. 컴파일 타임에 IP를 하드코딩 해두면 변경된 IP 주소로 인해 컴파일을 다시 해줘야 한다. 도메인 이름을 이용하면 서버 실행마다 IP를 얻어올 수 있도록 구현하면 문제가 해결된다.

## 구조체 hostent에 채워지는 정보

1. `h_name`: 공식 도메인 이름
2. `h_aliases`: 도메인 별칭, 별칭으로 접근해도 뿌려지는 결과는 동일
    - `char **` 더블포인터 타입이라는 것은 `char *`문자열로 구성된 배열이라는 것을 의미한다.
    - 별칭 여러개가 저장되어 있을 수 있다는 의미
3. `h_addrtype`: 반환된 IP 정보가 IPv4인 경우 `AF_INET` 반환
4. `h_length`: 반환된 IP주소 크기, IPv4인 경우 4, IPv6인 경우 16이 저장된다. (IPv4는 32비트, IPv6는 128비트)
    - int형 더블포인터가 아닌 char 더블포인터인 이유는 바이트 버퍼 참조 시 4바이트 데이터인지 16바이트 데이터인지 모르기 때문에 설정해둔 것이다
    - 오늘날에는 `void*`로 타입이 표준화되지 않은 타입으로 바이트 버퍼 타입을 지칭한다.

## IP주소를 이용해서 도메인 정보 얻어오기

```c
#include <netdb.h>

// 성공시 hostent 구조체 변수 주소값, 실패시 null 포인터 반환
struct hostent * gethostbyaddr(const char * addr, socklen_t len, int family);
```
