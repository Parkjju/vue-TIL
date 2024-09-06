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
