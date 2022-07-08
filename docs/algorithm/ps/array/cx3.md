---
title: Udemy JavaScript CodingExercise3 - sameFrequency
---

```text
Write a function called sameFrequency.
Given two positive intergers,
find out if the two numbers have the same frequency of digits.
```

## Solution

```javascript
const sameFrequency = (num1, num2) => {
    let freq1 = {};
    let freq2 = {};

    for (let i of num1.toString()) {
        if (freq1[i] === undefined) {
            freq1[i] = 1;
        } else {
            freq1[i] += 1;
        }
    }

    for (let i of num2.toString()) {
        if (freq2[i] === undefined) {
            freq2[i] = 1;
        } else {
            freq2[i] += 1;
        }
    }

    for (let i in freq1) {
        if (freq1[i] !== freq2[i]) {
            return false;
        }
    }
    return true;
};

console.log(sameFrequency(182, 281));
console.log(sameFrequency(34, 14));
console.log(sameFrequency(3589578, 5879385));
console.log(sameFrequency(22, 222));
```
