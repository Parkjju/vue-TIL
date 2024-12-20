---
title: LLDB - 활용하기
tags: ["LLDB"]
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

## 환경변수

위에서 ls 명령어를 하나의 파일로 생성한 뒤 프로세스로서 동작하게 했었는데, 환경변수 역시 추가할 수 있다.

```bash
# 명령어 실행
$ lldb -f /bin/ls

# 환경변수 출력
(lldb) env
target.env-vars (dictionary of strings) =
```

`settings` 명령어를 입력하면 환경변수와 관련된 작업을 처리할 수 있다.

```bash
(lldb) settings set|show|replace|clear|list target.env-vars
```

set, show.. 저 작업들 중 원하는 작업을 골라 활용하면 된다. `-E`옵션을 활용하면 환경변수에 대한 값을 지정하여 명령어를 바로 실행 가능하다.

```bash
(lldb) process launch -E LSCOLORS=Db -E CLICOLOR=1  -- /usr/share
```

위 명령어는 lldb 환경에서 ls 프로세스가 실행될 때 LSCOLORS와 CLICOLOR라는 환경변수 값을 각각 `Db`와 `1`로 지정하는 것을 의미한다.

`man` 명령어를 입력하면 명령어에 대해 미리 정의되어 있는 환경변수 리스트를 포함하여 명렁어에 대한 자세한 정보를 알 수 있다.

```bash
$ man ls
```

## stdin, stderr and stdout

리눅스 `wc` 명령어는 특정 파일 내 바이트 수, 단어 수, 행 수를 카운트하여 화면에 출력해주는 명령어이다.

```sh
# hello world 문자열을 /tmp/wc_input.txt에 저장하기
echo "hello world" > /tmp/wc_input.txt

wc /tmp/wc_input.txt
```

옵션없이 wc 명령어를 입력하면 `[라인 수]`, `[단어 수]`, `[문자 수]`, `[파일명]` 순으로 출력된다.

lldb 환경에서 `wc` 명령어를 실행하기 위해 타겟을 생성한다.

```sh
(lldb) target create "/usr/bin/wc"
(lldb) process launch -i /tmp/wc_input.txt
```

`-i` 옵션은 디버깅 프로그램에 제공할 표준 입력 데이터를 지정하는 옵션이다. `/tmp/wc_input.txt` 파일을 표준 입력에 전달하여 프로그램을 실행하는 것이다.

위의 lldb 명령어를 실행하면 `wc < /tmp/wc_input.txt`를 실행한 것과 동일한 출력결과를 보인다.

`<` 옵션을 주면 뒤에 오는 파일을 표준 입력으로 리다이렉션한다는 것을 의미한다.

:::tip 표준 입력?

표준 입력은 단순히 데이터 스트림을 처리하는 통로일 뿐이다. 데이터 출처에 대한 메타데이터는 표준입력에 포함되지 않는다. 파일 출처와 같은 메타데이터 정보는 없이 내용만 전달받게 된다. 참고로, Xcode같은 GUI 프로그램에서는 표준입력이 필요하지 않다.
:::

lldb상에서 아래 명령어를 입력하면 `wc` 명령어를 인자 없이 실행할 수 있다.

```sh
# target create 이후
(lldb) run
```

위 명령어를 입력하면 표준 입력으로부터 데이터를 읽기 위해 대기하게 된다. 텍스트 입력 후 엔터, control + D를 입력하면 `wc` 명령어에 입력 데이터가 전달된다.

lldb에서 프로세스 실행 시 `-n` 옵션을 추가하면 표준입력을 생성하지 않는다. `wc` 명령어를 타겟으로 설정한 상태에서 `-n` 옵션을 주면 데이터가 없어서 즉시 수행이 종료된다.

```sh
(lldb) process launch -n
```
