---
title: Swift - 연결 리스트
---

## 연결리스트

```text
+--------+    +--------+    +--------+    +--------+
|        |    |        |    |        |    |        |
| node 0 |--->| node 1 |--->| node 2 |--->| node 3 |
|        |    |        |    |        |    |        |
+--------+    +--------+    +--------+    +--------+
```

연결리스트는 각 원소가 노드로 이루어져 있다. 각 노드는 다음 원소를 참조하고 있으며 양방향 연결 리스트의 경우 이전 노드를 가리킨다. 반드시 head와 tail 위치를 트래킹해야한다. 범위를 벗어나는 경우 nil을 참조하도록 한다.

```text
         +--------+    +--------+    +--------+    +--------+
head --->|        |--->|        |--->|        |--->|        |---> nil
         | node 0 |    | node 1 |    | node 2 |    | node 3 |
 nil <---|        |<---|        |<---|        |<---|        |<--- tail
         +--------+    +--------+    +--------+    +--------+
```

## 연결리스트 성능

선형 자료구조이기때문에 대부분 **O(n)** 시간이 소요된다. 대부분의 작업이 배열보다 느리지만 **특정 노드에 대한 삽입과 삭제 연산이 빠르다.** 노드의 레퍼런스만 바꿔주면 되기 때문에 O(1)시간이 소요된다.

## 연결리스트 구현

1. 노드를 정의한다.
2. 노드로 이루어진 전체 연결리스트를 정의한다.

```swift
class Node{
    // 제네릭
    var value: T
    var next: Node?

    // weak var previous: Node?
    init(value: T){
        self.value = value
    }
}
```

```swift
class LinkedList{
    var head: Node?

    var last: Node? {
        // guard var 바인딩임에 주의하자
        guard var node = head else {
            return nil
        }

        while let next = node.next else {
            node = next
        }
        return node
    }

    var count: Int{
        guard var node = head else {return 0}

        var count = 1
        while let nextNode = node.next {
            node = nextNode
            count += 1
        }

        return count
    }

    func isEmpty() -> Bool {
        return head == nil
    }

    func first() -> Node?{
        return head
    }

    func append(value: T){
        let newNode = Node(value: value)

        // if let 라스트노드 언래핑
        if let lastNode = last {
            newNode.next = nil
            lastNode.next = newNode
        } else {
            head = newNode
        }
    }

    func node(atIndex: Int) -> Node{
        if index == 0 {
            return head!
        }else{
            var node = head!.next

            for _ in 1 ..< atIndex{
                node = node?.next

                if(node == nil){
                    break
                }
            }

            return node!
        }
    }

    subscript(index: Int) -> T{
        let node = self.node(atIndex: index)
        return node.value
    }

    func insert(_ node: Node, atIndex index: Int){
        let newNode = node

        if index == 0{
            newNode.next = head
            head = newNode
        } else {
            let previousNode = node(atIndex: index - 1)
            let nextNode = previousNode.next

            newNode.next = nextNode
            previousNode.next = newNode

        }
    }

    func removeAll(){
        head = nil
    }

    // remove 메서드는 양방향 연결리스트일때 구현이 쉽다.
    // previous 속성이 있어야함.
    public func remove(node: Node) -> T {
        let prev = node.previous
        let next = node.next

        if let prev = prev {
        prev.next = next
        } else {
        head = next
        }
        next?.previous = prev

        node.previous = nil
        node.next = nil
        return node.value
    }

}
```

1. last노드(계산속성) - 헤드 노드를 옵셔널 바인딩으로 언래핑했을때 `nil`이라면 해당 연결리스트는 빈 리스트이다.
    - 노드의 next가 존재하면 무한반복문을 계속 순회하며 nil이 나오면 해당 노드가 last이므로 리턴한다.
    - guard var 바인딩임에 주의하자.
2. count(계산속성) - 헤드노드가 nil이면 0을 리턴하고 nil이 아니면 node.next를 바인딩하여 카운트를 1씩 증가시켜 최종 값을 리턴한다.
    - count속성을 트래킹하면 O(n)에서 O(1)로 속도를 증가시킬 수 있다.
3. isEmpty(메서드) - 헤드노드가 nil이면 빈 리스트이다.
4. first(메서드) - head노드를 리턴한다.
5. append(메서드) - 파라미터로 전달된 값으로 노드를 하나 생성하고 라스트노드의 next레퍼런스를 새로운 노드로 설정한다. 새로운 노드의 next는 nil로 초기화한다.
    - 라스트노드가 없다면 빈 리스트이므로 헤드노드를 새 노드로 초기화한다.
6.

:::warning 순환참조

양방향 연결리스트 구현 시 클래스 인스턴스간 순환참조 문제로 인해 메모리 누수가 발생한다. **반드시 약한참조로 선언하자.**

:::

## Reference

1. [swift algorithm club - Linked Lists](https://github.com/kodecocodes/swift-algorithm-club/tree/master/Linked%20List)
