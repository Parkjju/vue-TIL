---
title: Udemy JavaScript CodingExercise3 - minSubArrayLen
---

```text
Write a function called minSubArrayLen
which accepts two paramters - an array of positive integers and a positive integer.

This function should return the minimal length of a contiguous subarray of which
the sum is greater than or equal to the integer passed to the function.
If there isn't one, return 0 instead.
```

## Solution

```javascript
const minSubArrayLen = (arr, num) => {
    if (arr.length === 0 || num < 1) {
        return 0;
    }

    let start = 0;
    let end = 0;
    let total = 0;
    let minLen = Infinity;

    while (start < arr.length) {
        if (total < num && end < arr.length) {
            total += arr[end];
            end += 1;
        } else if (total >= num) {
            minLen = Math.min(minLen, end - start);
            total -= arr[start];
            start += 1;
        } else {
            break;
        }
    }
    return minLen === Infinity ? 0 : minLen;
};
```
