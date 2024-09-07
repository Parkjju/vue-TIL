---
title: LLDB - 기초 세팅
tags: ["LLDB"]
---

## LLDB 디버깅을 위한 세팅

[예제 프로젝트](https://developer.apple.com/documentation/virtualization/running_macos_in_a_virtual_machine_on_apple_silicon) 다운로드를 받는다. 맥OS 가상 머신을 실리콘 맥에서 돌리는 예제 앱이다.

`Finder`와 같은 기본 앱에 대해 `lldb` 디버거를 활용하여 호출 함수들을 모니터링 하기 위해서는 `System Integrity Protection(SIP)`을 비활성화 해야 한다. 해당 기능은 애플이 멀웨어 차단을 위해 도입한 기능이며, 앱 무결성을 보장해주는 기능이다. 이 기능으로 인해 LLDB나 DTrace 등을 활용할 수 없다. 아래 과정을 따라가며 실습해보자.

앱 스킴을 `InstallationTool`로 지정하고 Run한다. 앱을 실행하면 MacOS 이미지가 자동으로 설치된다. 설치가 완료되면 `startVirtualMachine` 함수를 수정한 뒤, 앱 스킴을 `MacOSVirtualMachineSampleApp`으로 수정하고 실행한다.

```swift
func startVirtualMachine() {
    let options = VZMacOSVirtualMachineStartOptions()
    options.startUpFromMacOSRecovery = true
    virtualMachine.start(options: options, completionHandler: { (result) in
        // .. 아무 코드나 삽입
    })
}
```

위 코드의 옵션은 맥OS 가상머신 실행 시 복구모두로 실행하는 옵션이다. 가상머신 실행 뒤 맥OS를 초기 세팅하고 나면 OS에 대한 사용자 정보들이 저장된다. 가상머신에 대해 세팅을 하지 않으면 `_mbsetupuser` 기반으로 `csrutil` 비활성화를 해야 하는데, 하드웨어 단의 계정 정보이기 때문에 알 수 있는 방법이 없다.

사용자 정보를 설정한 뒤, xcode Run을 다시 해주면 기존 코드에서 지정해놓은 대로 복구모드에서 MacOS가 실행된다. 복구모드에서 터미널을 켜주고 아래 코드를 입력한다.

```bash
csrutil disable && reboot
```

위의 `csrutil disable` 명령어를 통해 SIP을 비활성화 할 수 있다. 재부팅 후 평소 모드에 진입하여 `csrutil status` 명령어를 입력하면 SIP이 비활성화 되었다는 문구를 볼 수 있다. 이후 `lldb -n Finder`를 입력하면, 현재 Finder 프로세스에 lldb 디버거가 연결되게 된다.

터미널에서 lldb에 연결된 프로세스 로그들을 출력하려면 터미널 탭을 두개 열어서 확인해볼 수 있다. 먼저 하나의 탭에서 `lldb`를 실행하고 다른 하나의 터미널에서는 아래 명령어를 입력한다.

```bash
tty
```

`tty`명령어는 현재 터미널의 주소값을 알려준다. 나의 경우 `/dev/ttys001`로 되어 있는데, 이건 터미널 생성 상황에 따라 각자 다르다. 해당 터미널 주소로 명령어 전송이 가능한지 확인하기 위해서 다른 터미널에서 `echo`명령어로 문자열을 전달할 수 있다.

```bash
# 다른 터미널 탭
echo "HELLO" 1>/dev/ttys001
```

## lldb와 프로세스 연결하기

lldb를 실행해둔 터미널 탭에서 아래 명령어를 실행한다.

```bash
(lldb) file /System/Applications/Notes.app
```

위의 file 명령어를 통해 실행 대상을 `Notes`앱으로 지정한다. 이후 아래 명령어를 이어 실행한다.

```bash
(lldb) process launch -e /dev/ttys001
```

lldb와 연결된 프로세스 로그들을 `-e` 옵션 파라미터인 `/dev/ttys001`주소값을 가진 터미널로 전송하는 것을 의미한다.

:::tip 리눅스 명령어 몇가지

```bash
grep [옵션][패턴][파일명]

# 특정 파일에서 'error' 문자열 찾기
grep 'error' 파일명

# 여러개의 파일에서 'error' 문자열 찾기
grep 'error' 파일명1 파일명2

# 현재 디렉토리내에 있는 모든 파일에서 'error' 문자열 찾기
grep 'error' *

# 특정 확장자를 가진 모든 파일에서 'error' 문자열 찾기
grep 'error' *.log
```

`grep`명령어는 특정 파일에서 패턴에 해당하는 행을 출력해주는 명령어이다.

- c : 일치하는 행의 수를 출력한다.
- i : 대소문자를 구별하지 않는다.
- v : 일치하지 않는 행만 출력한다.
- n : 포함된 행의 번호를 함께 출력한다.
- l : 패턴이 포함된 파일의 이름을 출력한다.
- w : 단어와 일치하는 행만 출력한다.
- x : 라인과 일치하는 행만 출력한다.
- r : 하위 디렉토리를 포함한 모든 파일에서 검색한다.
- m 숫자 : 최대로 표시될 수 있는 결과를 제한한다.
- E : 찾을 패턴을 정규 표현식으로 찾는다.
- F : 찾을 패턴을 문자열로 찾는다.

:::

## 터미널에서 중단점 설정하기

터미널에서 lldb를 실행한다. `file 실행할_앱.app`으로 실행할 프로세스를 세팅하고, 아래 명령어를 디버거에 입력한다.

```bash
(lldb) b -[NSView hitTest:]
```

위의 `b` 명령어는 브레이크 포인트를 지정하는 것을 의미한다. `Cocoa SDK`에서 `-[NSView hitTest:]`는 이벤트 실행 루프에서 화면 탭이나 제스처를 처리하는 클래스가 무엇인지 알려주는 오브젝티브-C 메서드이다.

```bash
(lldb) continue
```

`continue`로 프로세스를 시작하고 실행한 앱을 탭하면 탭된 뷰 중단점에서 실행되는 메서드를 확인할 수 있다.

```bash
(lldb) po $arg1
```

위 명령어를 실행하면 중단점에서 히트된 뷰 주소와 정보를 확인할 수 있다. `po`는 print object를 의미하는 명령어이다. swift 객체를 쉽게 출력하기 위한 명령어이다. `NSObject`의 description 혹은 debugDescription 메서드를 제공한다.

인스턴스 출력 후에 `continue`, `po $arg1` 명령어를 계속 번갈아 사용하게 되면 UI 리스폰더 체인에 따라 내부 하위계층 서브뷰들이 계속해서 출력되는 것을 볼 수 있다. `arg1`은 브레이크 포인트로 영향받는 코드의 가상주소를 나타낸다.

```bash
(lldb) breakpoint delete
```

위 명령어는 설정해둔 중단점들을 삭제하는 명령어이다.

```bash
(lldb) breakpoint set -n "-[NSView hitTest:]" -C "po $arg1" -G1
```

위 명령어를 입력하면 설정한 오브젝티브 C 메서드에 대해 `po $arg1`명령어를 재귀적으로 계속 실행한다는 것을 의미한다. LLDB 디버깅 시 스위프트 환경에서 할 수도 있는데, Foundation과 같은 모듈들을 불러오는 데 시간이 오래 소요되고 성능도 떨어지기에 오브젝티브C 기반으로 디버깅하는 것이 좋다.
