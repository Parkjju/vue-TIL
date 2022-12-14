---
title: Swift - 고급 연산자
---

## 숫자 리터럴
```swift
var num: Int = 25 // 10진법 리터럴
num = 0b00011001 // 2진법 리터럴
num = 0o31 // 8진법
num = 0x19 // 16진법

num = 1_000_000 // 1,000,000
num = 10_000_000 // 10,000,000
```

정수 타입의 범위는 아래와 같다.

```swift
// 0. Int, UInt - 플랫폼에 따라 자동 할당
// 1. 8비트 - Int8, UInt8
// 2. 16비트 - Int16, UInt16
// 3. 32비트 - Int32, UInt32
// 4, 64비트 - Int64, UInt64
MemoryLayout<Int8>.size // 1바이트
Int8.max // 127 (2^7-1)
Int8.min // -128 (-2^7)

MemoryLayout<UInt8>.size // 1바이트
UInt8.max // 255
UInt8.min // 0
```
