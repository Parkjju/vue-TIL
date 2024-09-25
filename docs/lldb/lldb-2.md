---
title: LLDB - Overview
tags: ['LLDB']
---

## LLDB 구성

LLDB는 기능적인 디버거를 만들기 위해 여러 구성 요소로 구분되어 있다. 먼저 모든 것을 조정하는 `lldb` 실행파일이 존재한다. LLDB를 실행 파일 측면에서 이야기 할 때에는 lowercase `lldb`로 표기한다.

`lldb`는 실행파일과 함께 프레임워크도 제공된다. `po somthing`과 같이 디버거에서 특정 연산 처리를 위한 명령어 집합들이 제공된다.

또한 LLDB는 표현식을 동적으로 분석하고 즉석에서 컴파일 한 뒤 결과를 lldb 출력으로 반환하기 때문에 컴파일러가 필요하다. 이러한 이유로 LLDB는 내부에 축소된 형태의 Clang 컴파일러를 가지고 있다. 해당 프레임워크는 `Xcode.app/Contents/SharedFrameworks/LLDB.framework` 경로에 존재한다.

해당 프레임워크는 컨슈머 서드파티 API를 제공한다. 컨슈머 API란 다른 소프트웨어 어플리케이션 또는 서비스에서 특정 기능 혹은 데이터를 사용할 수 있도록 제공하는 인터페이스를 의미한다. 해당 API는 스크립트 브릿징 코드로 알려져 있으며 C++ API 시리즈이다.

스크립트 브릿징 코드란 표준 Objective-C 문법을 통해 애플 및 타사 어플리케이션을 제어할 수 있게 해주는 기술이다.

LLDB는 `SWIG`라는 언어 번역기를 통해 C++ 스크립트 브릿징 API에 대한 파이썬 래퍼를 생성한다. 이를 통해 LLDB에서 라이브 프로그램을 빠르게 실험하고 고급 명령을 실행하기 용이해진다.

또한 `debugserver`, 혹은 `lldb-server`라는 제어 프로세스는 디버그 중인 프로세스를 조작하는 역할을 한다.

## 원격으로 iOS 기기 디버깅하기

PC 내부의 프로그램 외에도 원격 iOS기기의 디버깅이 가능하다. `DeveloperDiskImage.dmg`마운트를 iOS 기기에 로드한다. 마운트란 OS에서 특정 디스크나 파일 시스템을 사용할 수 있도록 연결하는 과정을 의미한다.

마운트는 `Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport/`에 위치한다. 해당 dmg 파일에는 `debugserver`뿐만 아니라 여러 디버깅 실행 파일 및 프레임워크가 포함되어 있다.

컴퓨터에 lldb가 있고 iOS 기기에 디버그 서버가 로드되어도 둘 사이의 통신 브릿징을 시작할 수 있는 수단도 필요하다. 여기서 `/usr/libexec/lockdown`이 중요한 역할을 한다.

`lockdownd`는 데몬이다. 데몬이란 백그라운드에서 실행되는 프로세스를 의미한다. 해당 데몬은 USB 연결을 통해 iOS 기기와 컴퓨터 간 통신 요청을 처리한다.

Xcode와 같은 도구는 특정 서비스를 위해 장치에 요청을 보내며 `lockdownd`데몬이 요청을 수락하면 필요한 설정을 수행한다. 디버깅 시 `lockdownd`는 포트를 `debugserver`로 전달하고 컴퓨터 lldb와 원격 호스트 `debugserver`간 브릿지를 설정한다.

Xcode는 Xcode와 `lockdownd`간 통신을 원활히 하기 위해 `MobileDevice`라는 프라이빗 프레임워크를 사용한다. 해당 프레임워크는 리버스 엔지니어링 되어 배포중이다.

1. [iOS-deploy](https://github.com/ios-control/ios-deploy)
2. [libimobiledevice](https://libimobiledevice.org/)

## 초심자에게 좋은 lldb 커맨드

### 1. help

`help` 커맨드를 사용하면 lldb 커맨드에 대한 설명을 확인할 수 있다. lldb 커맨드는 서브 커맨드를 이어 붙여 사용할 수 있고, 서브 커맨드와 연관된 서브 커맨드들 역시 여러가지가 존재한다.

```bash
(lldb) help breakpoint name
```

`breakpoint`라는 명령어에 대해 `name`이라는 서브 명령어가 존재한다. 해당 명령어에 대한 `help`를 요청하는 것이라 이해하면 된다.

### 2. apropos

`apropos`는 찾고 있는 명령어 이름은 모르지만 관련 단어 및 문구를 알 때, lldb 문서에서 검색 용도로 사용하는 명령어이다.

```bash
(lldb) apropos swift
```

위 명령어를 입력하면 `swift`키워드와 관련된 각종 명령어 및 lldb 동작 제어를 위한 설정들이 나타난다.

만약 `reference count`라는 키워드와 관련되어 검색하고 싶다면 `apropos "reference count"`를 입력하면 된다.

위 명령어 인자는 하나밖에 받지 못하기 때문에 따옴표로 감싸면 하나의 인자로 취급되어 검색이 가능하다.
