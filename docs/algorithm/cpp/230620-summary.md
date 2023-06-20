---
title: C++ PS용 메서드 정리
---

## 개발환경

1. `<bits/stdc++.h>` 헤더파일 추가. [헤더파일 링크](https://raw.githubusercontent.com/wnghdcjfe/wnghdcjfe.github.io/master/bits/stdc++.h)

```sh
cd /usr/local/include
mkdir bits
cd bits
vi stdc++.h
```

2. cpp파일 컴파일 - `g++ -std=c++14 -Wall test.cpp -o test.out`
3. `.out`파일 실행 - `./test.out`

## 메서드

### 순열

`next_permutation` - **오름차순 정렬된** 배열 원소들에 대해 순열을 만들어 반환해준다.

```cpp
#include <bits/stdc++.h>
using namespace std;
int main(){
    int a[] = {2, 1, 3};
    sort(a, a + 3);
    do
    {
        for(int i : a){
            cout << i << " ";
        }
        cout << "\n";
    } while (next_permutation(a, a + 3));
}
```
