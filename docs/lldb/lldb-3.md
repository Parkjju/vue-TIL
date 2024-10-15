---
title: LLDB - 활용하기
tags: ['LLDB']
---

## LLDB 프로세스 연결

LLDB가 직접 프로세스에 연결되는 것은 아니고, `Xcode.app/Contents/SharedFrameworks/LLDB.framework/Resources/` 경로에 있는 `debugserver`라는 프로그램이 대상 프로세스에 연결하는 역할을 한다.

LLDB가 프로세스에 연결되는 과정을 알기 위해 직접 컨트롤 가능한 간단한 프로그램을 생성해야 한다.

전역 위치의 `tmp` 디렉토리에 이동한다. 해당 디렉토리는 리부트 이후에 비워진다.

```bash
$ cd /tmp
```

해당 디렉토리에서 텍스트 편집기 `vim` 혹은 `nano`를 활용하여 스위프트 파일을 하나 생성한다. 파일명은 아무렇게나 해도 되고 여기서는 `hello_world.swift`로 하고 있다.

```swift
import Foundation

print("Hello World!")
CFRunLoopRun()
```

이후 해당 스위프트 파일을 컴파일하고 실행한다.

```bash
$ swiftc hello_world.swift
$ ./hello_world
```

프로그램 실행 시 `&`를 뒤에 붙이면 해당 프로세스를 백그라운드에서 실행하겠다는 것을 의미한다.

```bash
$ ./hello_world &
```

백그라운드에서 실행해도 되고 터미널 탭을 하나 추가하여 독립적인 프로세스로 실행해도 된다.

프로세스가 실행시켜놓고 `lldb -n hello_world`를 입력하면 해당 프로그램을 디버깅하기 시작한다. lldb 모드로 정상적으로 진입하면 디버거가 프로세스와 연결된 것이다. `quit` 혹은 `q`를 입력하여 프로세스로부터 `detach`할 수 있다.

프로세스 이름 뿐만 아니라 프로세스 ID값으로도 연결할 수 있다. `lldb -n ...`은 프로세스 이름을 기준으로 연결을 요청하는 것이고, `lldb -p 숫자`는 프로세스 아이디 값을 기준으로 연결을 요청하는 것이다.

실행중인 프로세스를 죽이기 위해서는 아래 명령어를 입력한다.

```bash
$ pkill hello_world
```

## 프로세스 연결 감지

위 명령어는 실행중인 프로세스에 접근하여 디버거와 연결하는 역할을 한다. `-w` 옵션을 붙이면 현재 실행중인 프로세스가 아닌, 앞으로 새로 연결될 프로세스를 감지하는 역할을 한다.

```bash
$ lldb -n 프로그램명 -w
```

위 명령어로 프로세스 연결을 감지한 상태로 새로운 터미널에서 실행파일을 실행하면 lldb 디버거가 연결된다.

`-w`옵션은 기존에 실행중인 프로세스가 만약 있었다고 해도 해당 프로그램 이름에 대해 새로운 프로세스가 할당되는 것만 감시한다.

`-f` 옵션과 함께 실행할 파일 경로를 지정하면 lldb 디버거 모드로 프로세스가 실행이 준비되고, `process launch`를 하면 프로세스가 실행된다.

```bash
# 1. LLDB 디버거 모드로 진입
$ lldb -f /프로그램/위치

# 2. 프로세스 실행
$ process launch
```

## 프로세스 실행 시 사용할 수 있는 옵션

lldb 디버거 모드로 진입한 뒤 `help process launch`를 입력하면 프로세스 런치 과정에서 사용 가능한 옵션들을 확인할 수 있다.

리눅스 명령어 중 파일 목록을 나열해주는 `ls`를 실행파일로 지정해주려면 다음과 같이 명령어를 작성하면 된다.

```bash
$ lldb -f /bin/ls
```

위 명령어를 실행하고 나면 ls 명령어가 실행파일로 생성된다. 아래 결과가 출력되고 ls 프로세스가 실행될 준비가 된다.

```bash
(lldb) target create "/bin/ls"
Current executable set to '/bin/ls' (arm64e).
```

이후 프로세스를 실행하면 ls명령어가 실제로 실행된다. 다른 디렉토리의 하위 파일 리스트를 출력하고 싶다면 `cd`명령어를 통해 해당 디렉토리로 이동한 뒤 `lldb -f /bin/ls`, `process launch`를 차례로 실행해주면 된다.

```bash
(lldb) process launch
```

디렉토리를 이동하지 않고 process launch 명령어의 인수로 디렉토리를 전달하면 해당 경로의 하위 파일 리스트를 출력할 수 있다.

```bash
(lldb) process launch -- /Applications
```

인수에 물결 옵션을 주어 루트 디렉토리를 참조하려면 아래 명령어를 입력한다.

```bash
(lldb) process launch -X true –- ~/Desktop
# /Users/jun/Desktop..
```

`process launch -X true --` 명령어는 `run`명령어로 단축되기도 한다.

```bash
(lldb) run ~/Desktop
```
