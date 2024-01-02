---
title: Swift - 스택
---

```swift
struct Stack<T> {

    var array: [T] = []

    var isEmpty: Bool {
        return array.isEmpty()
    }

    var count: Int {
        return array.count
    }

    mutating func push(_ element: T) {
        array.append(element)
    }

    mutating func pop() {
        array.popLast()
    }

    var top: T? {
        return array.last
    }
}
```
