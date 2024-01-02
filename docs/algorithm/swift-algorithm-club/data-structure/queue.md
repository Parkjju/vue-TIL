---
title: Swift - 큐
---

```swift
struct Queue<T> {
    var array: [T?] = []
    var head = 0

    var isEmpty: Bool {
        return count == 0
    }

    var count: Int {
        return array.count - head
    }

    mutating func enqueue(_ element: T) {
        array.append(element)
    }

    mutating func dequeue() -> T? {
        guard head < array.count,
              let element = array[head] else { return nil }

        array[head] = nil
        head += 1

        let percentage = Double(head) / Double(array.count)
        if array.count > 50 && percentage > 0.25 {
            array.removeFirst(head)
            head = 0
        }

        return element
    }

    var front: T? {
        if isEmpty {
            return nil
        } else {
            return array[head]
        }
    }
}
```

디큐 과정에서 큐 요소 카운트값이 50 이상이면서 디큐된 `nil` 요소의 비율이 25% 이상이면 nil값들을 정리해주는 로직이다.
