---
title: Concurrency - Task
tags: ['Swift', 'Concurrency']
---

## escaping 클로저

`escaping` 키워드는 클로저의 파라미터가 힙에 저장되어 함수 스택 프레임 해제 이후에도 사용될 때 붙인다.

```swift
class Data {
    var x = 10

    func doSomething() {
        escapingClosure { [self] in
            x = 100
        }
        nonEscapingClosure {
            x = 100
        }
    }
}

var completionHandler: (() -> Void)?

/// escapingClosure
func escapingClosure(closure: @escaping () -> Void) {
    completionHandler = closure
}

/// nonEscapingClosure
func nonEscapingClosure(closure: () -> Void) {
    closure()
}
```

`escapingClosure`가 실행될때 클로저 함수 호출이 종료되고 스택 프레임이 해제된 이후에도 `Data` 클래스 인스턴스가 힙에서 활용될 것이기 때문에 명시적인 캡처 리스트로 `self`를 추가해야 한다.

## (참고) @retroactive

```swift
extension String: @retroactive Error {}
```

`String`타입을 확장하여 `Error` 프로토콜을 채택하는데, Foundation 프레임워크에 실제로 `Error`프로토콜을 채택한채로 릴리즈되면 프로토콜 중복 채택으로 에러가 발생한다.

이러한 에러를 고려하여 `@retroactive`키워드를 추가하게 된다.

## Task

`Task`는 비동기적인 일처리를 할 수 있는 하나의 작업 단위이다. 각 태스크는 병렬적으로 실행되고 태스크 내부에서는 호출 순서를 보장하여 실행된다.

태스크는 두 개의 파라미터로 만들 수 있다.

```swift
Task(priority: TaskPriority?, operation: () async throws -> Sendable)
```

태스크는 `task.cancel()` 메서드를 호출하여 중간에 취소 할수도 있다.

특정 타입의 값을 리턴할 수도 있다.

```swift
let task: Task<String, Never> = Task {
    print("비동기 작업")
    return "작업 끝"
}

/// 작업 취소
task.cancel()

Task {
    await task.value // 리턴값
    await task.result // 태스크 성공여부
}
```

## Task 컨텍스트

태스크는 현재 실행중인 컨텍스트의 메타데이터를 그대로 상속하여 사용한다. (우선 순위, 실행 액터, 지역변수)

작업 취소 여부는 상속되지 않는다.

```swift
Task(priority: .background) {
    sleep(2)
    print("비동기 실행")

    // background 우선순위 자동 상속
    Task {
        print("중첩 Task 생성")
    }
}
```

Task 내부에서 호출되는 비동기 함수를 중간에 중단했다가 다시 복귀하도록 만들 수 있다. 이것이 Task의 주요한 특징이다.

## Task 클로저 내에서 self의 사용

```swift
class Worker {
    var work: Task<Void, Never>?
    var result: Worker?

    func start() {
        work = Task {
            result = Work()
        }
    }
}
```

`Task`는 현재 컨텍스트를 암시적으로 캡처한다. 위 코드에서 `result`라는 변수는 반드시 `self`를 캡처하는 동작밖에 하지 않는 것이다. 따라서 명시적인 `self`캡처를 하지 않아도 된다.

또한 weak self과 같은 약한 참조도 불필요하다. `Task` 내부에서는 작업이 끝나는 즉시 `self`에 대한 참조가 자동으로 해제된다.

기존 `DispatchQueue` 기반에서 이스케이핑 클로저가 외부 변수를 참조하는 경우 반드시 명시적인 캡처가 필요하다.
