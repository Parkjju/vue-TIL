---
title: DailyTech - 네트워크
---

## What is Networking?

### What is Internet?

interconnection of computers a network.

네트워크 내의 컴퓨터들은 서로 데이터를 주고받을 수 있다.

웹 (World Wide Web) 브라우저를 통해 인터넷에 접속

:::warning
internet != world wide web
:::

internet == physical connection of computers and wires around the world
web == information on the internet

networking managing, building and designing networks

### Internet

> composed of massive network of satellites, cellular networks, and physical cables (buried beneath the ground.)

우리는 인터넷에 직접 접속하지 않는 대신에, 서버라고 불리는 컴퓨터들이 인터넷에 직접 연결됨. 서버는 우리가 사용하는 웹 사이트들을 저장함(google, 등) + 웹 사이트는 우리에게 콘텐츠를 제공함

machines that we use mobile phones, consoles, and more... are called **clients**
클라이언트는 컨텐츠를 서버에 요청.

클라이언트는 인터넷에 직접 연결되지 않고, 특정 네트워크에 연결됨.
해당 네트워크는 ISP (Internet service provider)임. Centurylink, Level 3, Comcast 등.
ISP들은 네트워크를 구축해놓은 상태이고, 각 컴퓨터들을 연결하는 물리적인 요소를 갖추고있음

클라이언트가 서버에 접속되어있는가?

네트워크의 컴퓨터들은 IP주소를 지닌다 (Identifier)
특정 웹사이트에 접근하고자 할 때, 해당 웹사이트가 지닌 IP주소로 이동함
IP 외에도 MAC address라는 고유 식별자도 존재.

MAC address 장치에 영구적이고 하드코딩되어있음. `(예 82:4f:23:59:47:4)`

네트워크상에서 데이터를 주고받으려면 IP주소와 MAC주소 둘 다 지녀야함.

편지를 보낼 때, IP는 집주소 MAC은 수신자의 이름

네트워크상에서 데이터는 패킷을 통해 전달된다. (작은 데이터 조각들, 1&0)

특정 데이터 (이미지, 텍스트 등..)가 전달될 때에는 패킷들로 분해됨.
패킷들이 목적지에 도착하면 순서대로 재정렬됨.

구글이라는 웹사이트에 데이터를 요청하는 상황

1. google.com에 접속할 수 있는지 물어보기 위해 패킷을 보냄
2. 사용자는 google의 IP주소가 무엇인지 알고있지만 목적지까지 가는 길을 모르는 상황
3. 계속해서 다른 장소로 이동하며 google이 어디 위치해있는지 찾음 (패킷이 google에 가깝게 다가갈 수 있는 다른 대상으로 라우팅)
4. 구글 서버에 패킷을 전달할 수 있는 목적지에 도착하면 구글이 사용자에게 데이터에 액세스 할 수 있다는 패킷을 전달 (Once it reaches a destination that can deliver the packet to a server at google.com, Google will send User a packet saying He/She can access an unlimited number of data)

## Networking Hardware

How computers are connected to a networks.

1. Ethernet cable(이더넷) 케이블을 통해 물리적으로 연결
2. Wi-Fi Wireless networking
3. fiber optic cables(광섬유 케이블) 가장 빠른 속도(가장비쌈)
   전기 대신 빛을 통해 데이터를 이동시키는 유리섬유를 포함 (전류 대신 광선을보냄)

We don't just have millions of cables going in and out computers to connect them together, instead, computers connect to a few different devices that help organize our network together.
수백만 개의 케이블이 컴퓨터 안팎으로 서로 연결되는 것이 아님. -> 컴퓨터 네트워크를 함께 구성할 수 있는 몇 개의 다른 장치에 연결

1. first device : router
   connects lots of different devices together and helps route network traffic
   라우터는 패킷의 위치를 추출하여, 그 위치에 대한 최적의 경로를 지정하며, 이 경로를 따라 데이터 패킷을 다음 장치로 전향시키는 장치이다
   같은 네트워크 내에서 파일을 서로 주고받을 때 라우터와 패킷을 주고받으며 네트워크 프로토콜에 따라서 처리됨.
   외부 네트워크의 컴퓨터와 통신 시, 라우터는 패킷을 ISP의 네트워크로 라우팅함 (다양한 라우터, 스위치, 허브를 거쳐 이동)
   [허브, 스위치, 라우터 차이](https://blog.naver.com/reductionist101/221468851236)

## Language of the Internet

패킷이 올바른 목적지로 도착하게 하기 위한 네트워크 프로토콜은 다양하다.

network protocol은 패킷이 이동함에 있어서

1. routed efficiently
2. aren't corrupted
3. are secure
4. go to the right machine
5. named appropriately (적정한 이름이 지정되도록)

predominant protocols of the internet

1. The Transmission Control Protocol
2. Internet Protocol

TCP/IP

Internet protocol(IP)는 올바른 컴퓨터에 패킷을 전달하는 역할

네트워크에서 무엇인가 찾기 위해 컴퓨터가 사용하는 주소 IP주소
정보를 라우팅하는 것을 도움

Transmission Control Protocol(TCP) 한 네트워크에서 다른 네트워크로 신뢰할 수 있는 정보 전달을 처리하는 프로토콜

## The Web

URL (www.google.com)

Uniform Resource Locator (web address similar to home address)
www World Wide Web
google domain name (ICANN Internet Corporation for Assigned Names and Numbers, ICANN에 도메인 네임 등록시 다시 사용할 수 있기 전까지 다른 사용자는 해당 이름 사용 불가)
.com domain endings : 웹 사이트 유형에 대한 표준 (.edu 교육기관 등..)

DNS web protocol
172.217.6.46 주소창에 입력시 구글 홈페이지 이동함.
172.217.6.46 라는 IP주소가 DNS를 통해 google의 홈페이지에 매핑되어있기 때문.
DNS는 사람이 읽을 수 있는 단어를 통해 IP 주소와 매핑시켜준다.
웹 사이트에 접속하기 위해 컴퓨터는 입력한 웹 사이트의 IP주소를 찾기 위해 DNS를 뒤진다
domain name을 통한 접속은 안되면서, IP주소를 통한 접속이 되면 DNS상에 문제가 발생했을 가능성이 농후

## Limitations of the Internet

current protocol Internet Protocol version four (IPv4) -> an address that consists of 32 bits seperated into four groups (73.55.242.3.) // 1바이트는 0~255까지 표현 가능

IPv4주소는 43억개 미만인데, 오늘날 웹에는 43억개 이상의 웹사이트가 존재한다.
일부 IPv4 주소는 특수 목적으로 예약되기도 함. (실제 사용가능한 IP 주소의 수가 훨씬 적다)
인터넷에 연결하려는 장치는 IP주소를 지녀야하지만 오늘날 전 세계의 장치의 수가 IP주소의 수를 넘어서버렸다.
따라서 IPv6, (Internet Protocol version six)가 등장. -> 128비트로 구성

IPv6
128비트로 구성되어 주소 채택은 느리지만 더 많은 장치가 IP주소를 가질 수 있게됨.
379f:3e7d:4860:0370:7334:0000(예시)
2^1 ~ 2^128까지의 IP주소 할당 가능

> 2012년 1월 30일 기준으로 IPv6의 2128인 약 3.4x1038개(340,282,366,920,938,463,463,374,607,431,768,211,456개) 가운데 21,131,922개의 주소만 전 세계에서 할당되어 사용중이고 이 중에 20,971,520개의 주소는 특수목적용으로 할당되어 있으므로 실제 160,402개의 주소만 실제 사용되고 있다. 대한민국에서는 현재 5,219개의 IPv6 주소를 할당받아 사용 중이다.

NAT(Network Address Translation)
조직 네트워크 -> 하나의 공용 IP + 각자 개인 IP주소 사용가능
기존 수백개의 public IP를 할당해야했음

## Impact of the Internet

### Internet of Things IoT

[What is the Internet of Things?](https://www.wired.co.uk/article/internet-of-things-what-is-explained-iot)

In the broadest sense, the term IoT encompasses everything connected to the internet, but it is increasingly being used to define objects that "talk" to each other. (인터넷에 연결된 모든 것을 포괄하는 넓은 의미에서, 서로 대화하는 객체로 정의하는 데 점점 더 많이 사용되는중)

Why do connected devices need to share data?
An argument has been raised that only because something can be connected to the internet doesn't mean it should be, but each device collects data for a specific purpose that may be useful to a buyer and impact the wider economy.
인터넷에 연결된다고 해서 데이터를 공유해야만 한다는 것이 아니라, 넓은 경제에 영향을 미치고, 구매자에게 유용함을 제공하기 위한 목적으로 각 기기들이 데이터를 수집하는 것.
"IoT offers us oppotunity to be more efficient in how we do things, saving us time, money and often emissions in the process" 기업과 정부 및 공공기관이 서비스 제공 & 상품 생산에 대한 방법론을 재고하게됨.
The quality and scope of the data across the Internet of Things generates an opportunity for much more contextualised and responsive interaction with devices to create a potential for change.

IoT를 거친 데이터의 질과 범위는 (to create a potential for change, 변화의 잠재력을 만들어내기 위해 ) 더욱 contextualised되고 (문맥화된. 방향성이 뚜렷한 데이터) , resposive interaction with device를 위한 기회를 창출해낸다.

### Reference

[coursera - Technical support Fundamentals](https://www.coursera.org/programs/36a7e5dd-98e8-4404-bd61-4d65e31e771d?currentTab=CATALOG&productId=7sBiclFIEeetjQ5ppGVTyA&productType=course&showMiniModal=true)
