---
title: Udemy JavaScript CodingExercise3 - isSubsequence
---

```text
Write a function called isSubsequence which takes
in two strings and checks whether
the characters in the first string form a subsequence
of the characters in the second string.
In other words, the function should check whether the characters
in the first string appear somewhere in the second string,
without their order changing.

Time Complexity: at least follwing O(N + M)
Space Complexity: O(1)
```

## Solution

```javascript
// 부분 문자열 판단
// str1이 str2의 subSequence인지
// str1문자가 모두 연속적으로 str2에 나타날 필요 X
// str1의 순서만 보장되면 됨

const isSubsequence = (str1, str2) => {
    let indexOfStr2Char = {};

    for (let i in str2) {
        if (indexOfStr2Char[str2[i]] === undefined) {
            indexOfStr2Char[str2[i]] = [+i];
        } else {
            indexOfStr2Char[str2[i]].push(+i);
        }
    }
    let prevIndex = 0;
    for (let i in str1) {
        prevIndex = indexOfStr2Char[str1[i]].shift();
        if (i > prevIndex) {
            return false;
        }
    }
    return true;
};
```

## Description

함수에는 문자열 둘이 전달됩니다. 첫 번째 문자열에 대해 두 번째 문자열에서 **연속적으로 나열될 필요는 없습니다.** 서로 떨어져 있더라도 **첫 번째 문자열 간의 순서만 유지되면 부분 문자열로 판단합니다.**

1. str2를 순회하여 각 문자의 인덱스를 배열에 저장합니다.
2. str1을 순회하며 문자에 대한 str2에서의 인덱스를 비교합니다.
3. 예를 들어 abc,acb가 전달되었을 때 abc라는 str1 문자열에서 a가 str2에서는 0번째에 존재합니다. (shift메서드)
4. 다음 문자인 b는 str2에서 2번째에 존재하며 ab까지는 순서가 왜곡되지 않은 상태입니다.
5. 마지막 문자인 c는 str2에서 prevIndex에 저장된 2보다 작은 값으로, 순서가 뒤집어졌다고 판단하여 false를 리턴하게 됩니다.

## Refactor

로직은 동일하지만 배열 순회를 통해 더 가볍게 구현된 솔루션

```javascript
function isSubsequence(str1, str2) {
    var i = 0;
    var j = 0;
    if (!str1) return true;
    while (j < str2.length) {
        if (str2[j] === str1[i]) i++;
        if (i === str1.length) return true;
        j++;
    }
    return false;
}
```
