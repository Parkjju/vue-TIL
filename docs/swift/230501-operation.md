---
title: Swfit - 오퍼레이션
---

아래 내용은 [인프런 - 앨런 iOS Concurrency 프로그래밍](https://www.inflearn.com/course/iOS-Concurrency-GCD-Operation/dashboard) 강의 내용을 요약한 글입니다.

## 오퍼레이션

오퍼레이션은 작업을 클래스 형태로 구현하여 세부 동작을 정의할 수 있게 해준다. (데이터 다운로드, 압축풀기 등) 작업을 클래스화 할 경우 재사용성이 올라간다. 오퍼레이션은 여러 기능이 기본적으로 제공되는데, 대표적으로 다음과 같은 기능들이 있다.

1. 작업 취소
2. 순서지정(의존성)
3. 상태체크 (state machine)
4. KVO notifications
5. Qos 수준 (작업 우선순위 지정)
6. completionBlock 제공 (컴플리션 핸들러 클로저와 동일)

오퍼레이션은 기본적으로 `start()`, `cancel()`메서드를 보유하고 있다. 또한 작업 현황을 알 수 있는 속성값들도 존재한다.

1. `isReady`
2. `isExecuting`
3. `isCancelled`
4. `isFinished`

:::warning 참고

1. 오퍼레이션 객체는 생성 및 할당 이후 한번의 라이프사이클만 사용 가능하다. 해당 작업을 다시 시작하고 싶은 경우 객체를 재생성, 재할당 해야한다.
2. 오퍼레이션은 별다른 처리가 없으면 메인 스레드에서 동기적으로 동작한다.

:::

오퍼레이션은 `Opeartion`클래스 상속 후 내부 작업을 직접 정의해야 한다.

1. input
2. main() - 실제로 처리할 내부 동작, main메서드를 `Operation` 클래스로부터 오버라이딩
3. output

```swift
class SomeOperation: Operation{
    var inputImage: UIImage?
    var outputImage: UIImage?

    override func main(){
        // 실제 동작
    }
}

let op = SomeOperation()
// op.qualityOfService = .userInteractive
```

오퍼레이션 자체에 qos를 설정할 수 있다.

## 라이프사이클

1. 오퍼레이션 객체 생성 및 할당 후 - `isReady: true`
2. `start()` 메서드 실행 후 - `isExecuting: true`
3. 작업 마무리 후 - `isFinished: true, isExecuting: false, isReady: true`
4. `cancel()`메서드 호출 뒤 - `isCancelled: true, isFinished: true, isExecuting: false`

## 오퍼레이션 큐

오퍼레이션큐는 오퍼레이션들을 담아 사용하는 큐이다. 오퍼레이션 큐 생성시 설정해줘야 하는 것들이 몇가지 있다.

1. 직렬 큐인지 동시 큐인지
2. 동시 큐라면 몇개의 쓰레드를 사용할 지 (default: -1, 쓰레드 생성을 모두 시스템에게 위임한다)
    - 속성의 이름은 `maxConcurrentOperationCount`이다.
    - 직렬 큐의 경우 1값을, 동시 큐의 경우 2 이상의 값을 가질 수 있다.
3. QoS 설정
    - `queue.qualityOfService`를 통해 설정 가능하다.
    - 디폴트는 background를 갖는다.
    - `.userInteractive`, `.userInitiated`, `.default`, `.utility`, `.background` 다섯가지를 가질 수 있다. 설정은 `queue.qualityOfService = .userInteractive` 형태로 한다.
    - 오퍼레이션 큐는 `queue.underlyingQueue = .global()`라는 속성도 지원한다. 기반 큐를 글로벌 큐로 지정함으로써 오퍼레이션 큐들 중 어떠한 서비스 품질보다도 가장 앞선 순위를 갖게 할 수 있다.
4. 오퍼레이션 큐에는 클로저, 오퍼레이션, 오퍼레이션 배열을 추가할 수 있다.
    - 오퍼레이션 큐에서 다른 쓰레드에 작업을 배치했을때 오퍼레이션 라이프사이클이 `isExecuting` 상태가 된다.
5. 오퍼레이션 실행 또는 취소시 오퍼레이션 큐를 떠난다. 이로 인해 오퍼레이션 객체를 `One Single-Shot` 객체라고 부른다.
6. 오퍼레이션 큐에는 동기적으로 기다리는 메서드가 존재한다.
    - 오퍼레이션 큐 내의 모든 작업이 마무리 될때까지 대기한다. `waitUntilAllOperationsAreFinished()`
    - `Blocks the current thread until all the receiver’s queued and executing operations finish executing.`로 공식문서에 정의되어 있으며, `finish executing`이라고 언급되는 것을 보니 라이프사이클 isFinished가 될때까지 블록하는 것으로 보인다.
7. 일시중지 / 재개 가능
    - 오퍼레이션 큐의 `isSuspended` 속성을 Bool값으로 조절 가능하다.
    - `isSuspended`가 true로 설정되면 오퍼레이션 큐가 일시정지 되지만, 기존 실행되던 오퍼레이션은 계속 처리된다.
    - 다음 추가되는 오퍼레이션들은 `isSuspended`가 `false`로 설정될때까지 쓰레드 배정 등의 스케줄링이 이루어지지 않는다.

```swift
let someQueue = OperationQueue()

// 오퍼레이션 하나만 추가
someQueue.addOperation(오퍼레이션)

// 오퍼레이션 여러개 추가
someQueue.addOperation([오퍼레이션들], waitUntilFinished: true) // 오퍼레이션 배열 모두가 fisish될때까지 동기적으로 기다리겠다
```

오퍼레이션 객체 하나만 생성 후 `start`메서드 등으로 관리하면 동기적으로 처리되지만, 오퍼레이션 큐에 오퍼레이션을 넣는 순간 이들 오퍼레이션은 비동기적으로 동작한다.

## 블락 오퍼레이션 (BlockOperation)

블락 오퍼레이션은 오퍼레이션 내에 블록들을 내장하고 있는 오퍼레이션이다. 블락 오퍼레이션은 디스패치 그룹과 유사하게 동작하며 여러 쓰레드에 걸쳐 블록들이 동시처리 되어도 모든 블록 실행이 마칠때까지 다른 태스크 할당이 이루어지지 않게끔 동기적으로 설계되어 있다.

블록 오퍼레이션은 기본 `Operation`에 Block이 더해진 형태이다. 따라서 기본적인 오퍼레이션 기능을 가지며, 디스패치 그룹들의 기능들을 추가적으로 갖는 것이라 생각하면 된다.

오퍼레이션을 많이 갖는 앱일 경우, 매번 input, main, output을 오퍼레이션마다 정의하는 것보다 클로저 형태로 정의하기에 편하다.

```swift
let aOperation = BlockOperation()

aOperation.addExecutionBlock{
    // 블록 추가
}

// 클로저 형태로 블록을 정의
let bOperation = BlockOperation{
    result = 2 + 3
    print("작업!")
}
```

## 비동기 오퍼레이션

비동기 오퍼레이션은 오퍼레이션 내에 비동기 함수가 포함된 것을 의미한다. 오퍼레이션 큐를 통해 다른 쓰레드로 오퍼레이션이 할당된 후, 내부 비동기 함수를 실행하게 되는데 이때 또 다시 내부 비동기 함수를 다른 쓰레드로 보내게 된다.

이때 오퍼레이션은 `isFinished` 사이클을 적용할 때가 되었음에도 비동기 함수는 종료되지 않은 상태일 수 있다. 따라서 비동기 오퍼레이션의 경우에는 오퍼레이션 상태의 관리를 수동으로 해줘야 한다. 하지만 **오퍼레이션 상태값은 읽기 전용의 값이므로 속성값을 직접 변경하는 것은 불가능하다.** 상태 뿐 아니라 notification도 수동으로 관리해야한다.

비동기 오퍼레이션 처리는 다음과 같은 과정으로 이루어진다.

1. `Operation` 클래스를 상속한 `AsyncOperation` 클래스를 생성한다.
2. `AsyncOperation` 클래스는 실질적으로는 직접 정의해야 하는 클래스이지만, 사실상 이미 만들어진 코드를 가져다가 사용하면 된다.
3. `AsyncOperation` 클래스를 상속하여 커스텀 오퍼레이션을 새롭게 정의한다. 나머지는 기존 오퍼레이션 구현과 동일하게 `Input`, `main`, `output`을 정의하면 된다.
    - `main`에는 오퍼레이션 상태를 체크하는 코드를 넣어야 한다. 비동기 동작의 컴플리션 핸들러 부분에서 오퍼레이션 상태를 `isFinished` 사이클로 바꿔줘야 하는 것이다.

비동기 오퍼레이션 코드는 아래와 같다.

```swift
class AsyncOperation: Operation {
    // Enum 생성
    enum State: String {
        case ready, executing, finished

        // KVO notifications을 위한 keyPath설정
        fileprivate var keyPath: String {
            return "is\(rawValue.capitalized)"
        } // isReady/isExecuting/isFinished
    }

    // 직접 관리하기 위한 상태 변수 생성
    var state = State.ready {
        willSet {
            willChangeValue(forKey: newValue.keyPath)
            willChangeValue(forKey: state.keyPath)
        }
        didSet {
            didChangeValue(forKey: oldValue.keyPath)
            didChangeValue(forKey: state.keyPath)
        }
    }
}

extension AsyncOperation {
    // 상태속성은 모두 read-only
    override var isReady: Bool {
        return super.isReady && state == .ready
    }

    override var isExecuting: Bool {
        return state == .executing
    }

    override var isFinished: Bool {
        return state == .finished
    }

    override var isAsynchronous: Bool {  // 무조건 true로 리턴
        return true
    }

    override func start() {
        if isCancelled {
            state = .finished
            return
        }
        main()
        state = .executing
    }

    override func cancel() {
        super.cancel()
        state = .finished
    }
}
```

내장 `Operation` 클래스의 라이프사이클 상태값은 `read-only`이기 때문에 직접 상태 관리가 안되지만 비동기 오퍼레이션에서는 반드시 직접 관리를 해야만 한다. 이를 위해 `AsyncOperation`클래스를 정의할때 상위 라이프사이클 속성들을 오버라이딩 하여 계산속성으로 정의를 하고 있는 것이다.

사용 예시 코드를 보자.

```swift
class SumOperation: AsyncOperation {
    // 비동기 오퍼레이션 input
    var lhs: Int
    var rhs: Int

    // 비동기 오퍼레이션 output
    var result: Int?

    // 초기화메서드 포함(속성 설정 때문에)
    init(lhs: Int, rhs: Int) {
        self.lhs = lhs
        self.rhs = rhs
        super.init()
    }

    // 비동기 오퍼레이션 main
    override func main() {
        // asyncAdd_OpQ는 비동기 함수이다.
        asyncAdd_OpQ(lhs: lhs, rhs: rhs) { result in
            self.result = result

            // 라이프사이클 직접 지정
            self.state = .finished   // 컴플리션 핸들러에서 상태를 .finished로 셋팅
        }
    }
}

// 실행 예시
// 덧셈 대상
let input = [(1,5), (5,8), (6,1), (3,9), (6,12), (1,0)]

// 오퍼레이션 큐
let additionQueue = OperationQueue()

// for문을 돌며 비동기 오퍼레이션 추가
for (lhs, rhs) in input {
    let operation = SumOperation(lhs: lhs, rhs: rhs)

    // 컴플리션 블록 정의
    operation.completionBlock = {
        guard let result = operation.result else { return }
        print("\(lhs) + \(rhs) = \(result)")
    }

    // 오퍼레이션 큐에 비동기 오퍼레이션 전달
    // 비동기 오퍼레이션이 다른 스레드로 전달되고, 내부 비동기 함수가 다시 다른 스레드로 전달된다.
    additionQueue.addOperation(operation)
}
```

비동기 오퍼레이션을 사용하는 이유가 뭘까? 비동기 동작의 순서가 중요한 경우가 분명 존재한다. 예컨대 특정 데이터는 이전 데이터에 의존적으로 존재하는 경우가 있다. 이전 데이터 역시 비동기적으로 데이터를 받아와야 한다면 비동기적인 데이터 간의 순서가 보장되어야 하는 것이다.

컴플리션 핸들러를 연속적으로 배치하면 자바스크립트 ES6 프라미스에서 콜백 지옥 형태의 코드가 작성된다.

비동기 오퍼레이션을 사용하면 오퍼레이션 큐에 `addOperation`만 순차적으로 해주면 되기 때문에 코드 가독성이 매우 개선될 것이다.

## 오퍼레이션 주요 기능

오퍼레이션 큐에서 순서 관리가 이루어지는건 직렬 큐를 통한 처리와 유사하지만 여러 쓰레드를 사용하는 것이 맞다. 다음 시나리오를 생각해보면,

1. 리소스를 다운로드 받는다. (input: URL, main: 다운로드, output: 압축파일)
2. 리소스의 압축을 푼다. (input: 압축파일, main: 디컴프레싱, output: 내부 파일)

위 두 작업을 한 오퍼레이션으로 정의하면 모듈화 관점에서 좋은 코드가 아니다. 둘을 별개의 오퍼레이션으로 분리하여 관리하는 것이 더 좋다. 이때 오퍼레이션 간의 선후 관계가 명확하므로 **의존성 설정이 필요하며** 선후 관계 사이에서 **오퍼레이션 간의 통신을 위한 프로토콜 정의가 필요하다.**

프로토콜 채택은 인풋을 전달받는 오퍼레이션이 아닌 아웃풋을 전달하는 오퍼레이션 쪽에서 채택한다. 다음 오퍼레이션의 인풋은 이전 오퍼레이션에서 뽑아온다.

오퍼레이션 의존성 대상들은 기본 `Operation` 클래스의 `dependencies` 속성으로 관리된다. 디펜던시 추가는 `전달받는_오퍼레이션.addDependency(전달하는_오퍼레이션)` 메서드 호출로 가능하다.

```swift
// 아웃풋을 전달하는 오퍼레이션
class ImageLoadOperation: AsyncOperation {
    var inputName: String?
    var outputImage: UIImage?

    override func main() {
        // 이 메서드는 잠깐 sleep했다가 이미지를 반환하는 시뮬레이팅 메서드임.
        simulateAsyncNetworkLoadImage(named: self.inputName) {
            [unowned self] (image) in
            self.outputImage = image
            self.state = .finished
        }
    }
}

// 전달할 아웃풋에 대한 프로토콜 정의
protocol FilterDataProvider {
    var image: UIImage? { get }
}

// 프로토콜 채택하기
extension ImageLoadOperation: FilterDataProvider {
    var image: UIImage? { return outputImage }
}


// 이미지 변환, 즉 아웃풋을 이전 오퍼레이션의 인풋으로 받는 오퍼레이션
class TiltShiftOperation: Operation {
    var inputImage: UIImage?
    var outputImage: UIImage?

    override func main() {
        // 🔸🔸🔸 2) 프로토콜 채택한 앞의 오퍼레이션에서, 인풋값을 얻어내기
        if inputImage == .none,    // 인풋이미지가 없으면,
            let dependencyImageProvider = dependencies
                // 클로저 0번째 파라미터를 통해 디펜던시를 순회한다.
                // 디펜던시 타입이 특정 프로토콜에 해당한다면? 해당 요소만 얻는다
                // filter메서드는 조건을 충족하는 요소들을 모아놓은 배열임
                // 배열 First접근을 통해 프로토콜 타입에 해당하면 -> 인풋으로 사용
                .filter({ $0 is FilterDataProvider})
                .first as? FilterDataProvider {   // (의존하고 있는) 오퍼레이션의 배열에서 오퍼레이션 꺼내기
                inputImage = dependencyImageProvider.image
        }

        // 실제 작업
        outputImage = tiltShift(image: inputImage)
    }
}

// 앞의 오퍼레이션 정의
let imageLoad = ImageLoadOperation()

// 뒤의 오퍼레이션 정의
let filter = TiltShiftOperation()

// 오퍼레이션 인풋 정의
imageLoad.inputName = "train_day.jpg"

// 디펜던시 연결
filter.addDependency(imageLoad)


// 큐에 오퍼레이션 넣기 (동기적으로 기다리게 해서 확인해보기)
let queue = OperationQueue()

// 작업 시작
queue.addOperations([imageLoad, filter], waitUntilFinished: true)
```

:::tip 오퍼레이션 큐 작업취소

오퍼레이션 큐에는 `cancelAllOperations()` 메서드가 있다. 큐 내의 모든 오퍼레이션들의 `isCancelled` 속성을 true로 설정한다.

```swift
class ArraySumOperation: Operation {
    let inputArray: [(Int, Int)]
    var outputArray = [Int]()

    init(input: [(Int, Int)]) {
        inputArray = input
        super.init()
    }

    override func main() {
        // 더해서 배열에 넣기
        for pair in inputArray {
            // 속성 확인 후 리턴
            if isCancelled { return }
            outputArray.append(slowAdd(pair))
        }
    }
}
```

작업 취소에 따른 동작은 직접 정의해줘야 한다. `isCancelled` 값에 따른 분기처리 코드를 확인하자.

오퍼레이션 취소는 컬렉션 뷰 `didEndDisplaying` 메서드에서 이미지 로드를 더 이상 하지 않아도 될 때 사용할 수 있겠다.

:::

## Reference

1. [인프런 - 앨런 동시성 프로그래밍](https://www.inflearn.com/course/iOS-Concurrency-GCD-Operation/dashboard)
2. [The thread safety of lazy variables in Swift](https://medium.com/what-i-talk-about-when-i-talk-about-ios-developmen/the-thread-safety-of-lazy-variables-in-swift-b20184ef5a38)
