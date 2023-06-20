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

## 입출력

### 1. cin

cin은 개행문자까지만 입력을 받는다.

```cpp
#include <bits/stdc++.h>
using namespace std;
int main(){
    string a;
    cin >> a;
    cout << a << "\n";
    return 0;
}
```

"박경준 바보" 를 입력하는 경우 중간에 공백문자로 인해 변수 a에는 "박경준"만 저장된다.

`cin` 두개를 연속적으로 사용하여 출력하면 된다.

```cpp
#include <bits/stdc++.h>
using namespace std;
int main(){
    string a, b;
    cin >> a >> b;
    cout << a << "\n";
    cout << b << "\n";
    return 0;
}
```

### 2. scanf

```cpp
#include <bits/stdc++.h>
using namespace std;

int main(){
    int a;
    scanf("%d", &a);
    printf("%d\n", a);
    return 0;
}
```

`scanf`는 받을 수 있는 타입이 정해져있다.

1. int - `%d`
2. char - `%c`
3. double - `%lf`
4. long long - `%ld`

### 3. getline

문자열 입력을 위한 메서드이다. 개행문자 구분에 따라 매번 `cin`을 호출하지 않고싶을때 사용한다.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main(){
    int T;
    string s;

    // 버퍼플래시 필요
    cin >> T;
    string bufferflush;
    getline(cin, bufferflush);

    for (int i = 0; i < T; i++){
        getline(cin, s);
        cout << s << "\n";
    }
    return 0;
}
```

T번 입력을 받고자 할때 정수 T 입력을 위한 `cin` 함수에서 개행문자가 버퍼에 남게 되기때문에 이를 플러시해주는 것이다.

### 4. cout

`cout`으로 실수타입 출력을 하는 경우 `cout.precision(자릿수 + 1)`를 통해 소수점 반올림 자릿수를 지정할 수 있다. 출력 형식 지정을 위한 메서드이다.

```cpp
#include <bits/stdc++.h>
using namespace std;
int main(){
    double a = 1.234567;

    cout << a << "\n"; // 1.23457
    cout.precision(7);
    cout << a << "\n"; // 1.234567
    return 0;
}
```

### 5. printf

`printf`함수는 출력형식을 디테일하게 지정할 때에 사용한다. 형식지정자를 통해 출력 형식을 지정한다.

1. `"%.3f"` - 소수점 3자리까지만 출력
2. `"%02d"` - 일의자리 수에 대해 십의자리 수를 0으로 하여 두자리로 출력해주도록 형식을 지정

```cpp
#include <bits/stdc++.h>
using namespace std;

int main(){
    double a = 1.23456789;
    int b = 11;
    int c = 2;

    printf("%.3f\n", a);
    printf("%02d\n", b);
    printf("%02d\n", c);
    return 0;
}
```

## 문자열 처리

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
