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

## 정수론

### 1. 모듈로 연산

1. `(a + b) % n == (a % n + b % n) % n`
2. `(a * b) % n == (a % n * b % n) % n`

덧셈에 대한 나머지 연산은 각 피연산자에 대한 나머지 연산 결과값의 합을 모듈로 연산한 결과와 동일하다. 곱셈도 마찬가지

### 2. 최대공약수와 최소공배수

```cpp
int gcd(int a, int b){
    if(int a==0){
        return b;
    }

    return gcd(b%a, a);
}
```

최소공배수는 두 수의 곱을 최대공약수로 나누면 된다.

```cpp
include<bits/stdc++.h>
using namespace std;

int gcd(int a, int b){
    if(int a==0){
        return b;
    }

    return gcd(b%a, a);
}

int lcm(int a, int b){
    return (a * b) / gcd(a, b);
}
```

### 3. 에라토스테네스의 체

소수를 걸러내는 방법이다.

```cpp
#include <bits/stdc++.h>
using namespace std;

bool check(int n){
    if(int n <= 1){
        return 0;
    }
    if(n == 2){
        return 1;
    }
    if(n % 2 == 0){
        return 0;
    }
    for(int i=0; i * i< n; i++){
        if(n % i == 0){
            return 0;
        }
    }
    return 1;
}
```

아래는 소수를 만들어 배열에 저장하는 방법이다.

```cpp
#include <bits/stdc++.h>
using namespace std;

bool che[max_num+1];

vector<int> era(int max_n){
    vector<int> v;
    for(int i=2; i<=max_n; i++){
        if(che[i]){
            continue;
        }

        // i에 대해 2의 배수는 모두 소수가 아님.
        for(int j=2*i; j<=max_n; j+=i){
            che[j] = 1;
        }
    }

    for(int i=2; i<max_n; i++){
        if(che[i] == 0){
            v.push_back(i);
        }
    }

    return v;
}
```

### 4. 등차수열의 합

1. 초항이 a, 항의 개수가 n, 공차가 d일때

$\frac{n\times\{2a + (n-1)d\}}{2}$

2. 초항이 a, 항의 개수가 n, 마지막 항이 l일때

$\frac{n(a+l)}{2}$

### 5. 등비수열의 합

1. 초항이 a, 공비가 r, 항의 개수가 n일때

$\frac{a(r^{n}-1)}{r-1}$

### 6. 승수

pow함수를 사용한다.

```cpp
pow(밑, 제곱수);
```

### 7. 제곱근

sqrt 함수를 사용한다.

```cpp
sqrt(3);
```

## 입출력

아래 코드를 main함수 상단에 위치시켜 입출력 속도를 향상시킬 수 있다.

```cpp
ios_base::sync_with_stdio(false);
cin.tie(NULL);
cout.tie(NULL);
```

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

### 3. scanf 따닥따닥 붙어있는 문자 입력

```cpp
#include <bits/stdc++.h>
using namespace std;
int a[10][10], n, m;

int main(){
    cin >> n >> m;
    for(int i=0; i<n; i++){
        for(int j=0; j<m; j++){
            scanf("%1d", &a[i][j]);
        }
    }
    return 0;
}
```

`%1d`는 한자리의 정수만 받겠다는 의미이다.

### 4. getline

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

### 5. cout

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

### 6. printf

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

### 범위 기반 for 루프

```cpp
for(int a : v){
    cout << a << " ";
}
cout << "\n";
```

### 배열 초기화

테스트케이스 유형의 문제에서는 각종 값 초기화가 매우 중요한데, 이때 배열을 초기화 하는 방법을 정리한다. `fill`과 `memset`을 활용한다.

```cpp
// 1차원 배열 초기화
int a[10];
fill(&a[0], &a[10], 초기화할 값);
memset(a, -1 또는 0, sizeof(a));
```

1차원배열 초기화 시 두번째 파라미터는 선언시 사용했던 배열 길이 그대로 인덱싱하여 주소값을 사용하면 된다.

```cpp
// 2차원 배열 초기화
int a[10][10];
fill(&a[0], &a[0] + 10 * 10, 0);
memset(a, -1 또는 0, sizeof(a));
```

2차원 배열은 가로길이와 세로길이를 직접 숫자로 연산하여 전체 사이즈를 측정해야한다.

`memset`은 1차원이던 2차원이던 `sizeof`로 반환된 배열 전체 사이즈를 기반으로 초기화를 진행해준다. 하지만 **0 또는 -1로만 초기화가 가능하다는 점을 주의하자.**

## 자료구조

:::warning 스택, 큐, 덱 조회시 주의

size체크 후 값 조회를 진행해야 segmentation fault에러와 같이 참조 에러가 발생하지 않는다. 주의!

:::

### 연결리스트

연결리스트 구현을 위한 클래스는 아래와 같다.

```cpp
class Node{
public:
    int data;
    // next는 다른 Node의 주소값을 가리키므로 Node* 타입이 됨.
    Node* next;

    // 기본생성자
    Node(){
        data = 0;
        next = NULL;
    }
    Node(int data){
        this->data = data;
        this->next = NULL;
    }
}
```

하지만 실제로는 C++에서 자체적으로 제공하는 원형연결리스트 타입을 사용하면 된다.

```cpp
list<int> a;
```

1. push_front(값) - 맨앞에 값 추가
2. push_back(값) - 맨뒤에 값 추가
3. insert(idx, value) - idx위치에 값 추가
4. erase(idx) - 링크만 삭제하면 되므로 O(1)
5. pop_front() - 맨앞 삭제
6. pop_back() - 맨뒤 삭제
7. front() - 맨앞 조회
8. back() - 맨뒤 조회
9. clear() - 모든 요소 삭제

### 스택(Stack)

문제 내에서 **교차하지 않고**, 괄호만들기, 짝찾기, 문자열 폭발 등의 키워드가 나오는 경우 스택 자료구조를 사용한다.

`stack<타입>` 형태로 선언한다.

```cpp
#include<bits/stdc++.h>
using namespace std;
stack<string> stk;

int main() {
    ios_base::sync_with_stdio(false); cin.tie(NULL);
    stk.push("화");
    stk.push("이");
    stk.push("팅");
    while(stk.size()){
        cout << stk.top() << "\n";
        stk.pop();
    }
    return 0;
}
```

1. push(값) - 끝에 푸시
2. pop() - 끝에 삭제
3. top() - 맨 위 원소 조회
4. size() - 스택 원소 개수

### 큐(Queue)

선입선출(FIFO) 자료구조이다. `queue<타입> 변수명` 형태로 선언한다.

```cpp
#include <bits/stdc++.h>
using namespace std;
queue<int> q;

int main(){
    for(int i=0; i < 10; i++){
        q.push(i);
    }

    while(q.size()){
        cout << q.front() << " ";
        q.pop();
    }
    return 0;
}
```

1. push(값) - 맨 앞에 삽입. `O(1)`
2. pop() - 맨 앞 삭제. `O(1)`
3. front() - 맨 앞 원소 반환
4. size() - 큐 사이즈

### 덱(Deque)

앞뒤로 삽입 및 삭제가 가능하다.

```cpp
#include <bits/stdc++.h>
using namespace std;
int main(){
    deque<int> dq;
    dq.push_back(1);
    dq.push_front(0);

    cout << dq.front() << "\n";
    cout << dq.back() << "\n";
    cout << dq.size() << "\n";

    dq.pop_back();
    dq.pop_front();
}
```

1. push_back(값) - 뒤에 값 푸시. O(1)
2. push_front(값) - 앞에 값 푸시. O(1)
3. pop_back() - 뒤 삭제
4. pop_front() - 앞 삭제
5. front() - 앞 조회
6. back() - 뒤 조회
7. size() - 덱 사이즈

## 중복제거

### map

map 자료구조를 사용하는 방법이 있다. map 자료구조는 key-value쌍으로 이루어지는 자료구조이다. `map.first`가 키값이며 `map.second`가 밸류이다.

```cpp
#include <bits/stdc++.h>
using namespace std;
map<int, int> m;

int main(){
    vector<int> v{1, 1, 2, 2, 3, 3};
    for(int i : v){
        if(m[i]){
            continue;
        }else{
            m[i] = 1;
        }
    }

    vector<int> ret;
    for(auto it : m){
        // 키값들만 모아서 확인하면 중복이 제거가 되어있음.
        ret.push_back(it.first);
    }

    for(int value : ret){
        cout << value << " ";
    }
    cout << "\n";
    return 0;
}
```

:::tip auto키워드

auto키워드는 타입 추론에 사용된다. `for(auto it : m)`의 경우 `it` 변수 타입이 자동으로 `<int, int>`가 될 것이다.

:::

### unique

`unique`는 중복되는 값들을 오름차순 정렬한 뒤 나머지 요소를 그대로 배치한다.

```cpp
#include <bits/stdc++.h>
using namespace std;
vector<int> v{1, 1, 2, 2, 3, 3, 4, 5, 6, 7};

int main(){
    auto it = unique(v.begin(), v.end());
    for(int i : v){
        cout << i << " ";
    }
    cout << "\n";
    return 0;
}

// 1 2 3 4 5 6 7 5 6 7
```

1. 1 2 3 중복 제거하면 -> 3자리 비게되며 뒤에있던 요소들이 한칸씩 당겨짐. `1 2 3 4 5 6 7`로 배열 구성
2. 이후 나머지 요소들 그대로 배치 -> `1 2 3 4 5 6 7 5 6 7`
3. `unique 반환값 - 기존벡터.begin()`를 하면 **중복제거가 된 배열 이후의 인덱스를 받을 수 있다.** 위의 예시에서 `1 2 3 4 5 6 7` 이후 인덱스인 `5 6 7`의 5 인덱스값을 받는다.

**반드시 오름차순 정렬 되어 있어야 하므로** `sort` 함수와 같이 사용해야 한다. `sort(v.begin(), v.end());`로 정렬한다.

`unique`정렬 후 뒤쪽에 배치되는 배열을 삭제하기 위해서는 `erase`를 사용한다.

```cpp
#include <bits/stdc++.h>
using namespace std;
vector<int> v{1, 1, 2, 2, 4, 3, 4, 5, 6, 7};

int main(){
    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()), v.end());

    for(int i : v){
        cout << i << " ";
    }
    cout << "\n";
    return 0;
}
```

## 벡터

벡터는 컴파일 시점에 요소들의 개수를 알 수 없을때 동적 할당을 해주는 배열이다. `vector<벡터 요소 타입> v` 형태로 선언한다.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main(){
    vector<int> v;

    // ...
    return 0;
}
```

### 정적 할당

벡터 사이즈를 정해놓고 시작할 수 있다.

```cpp
vector<int> v1(5, 100); // v 벡터 요소를 5개로 정하고 각각 100을 할당한다.
vector<int> v2{100, 200, 300, 400, 500} // v벡터에 값을 하나씩 직접 할당한다.
```

### 2차원 배열

for문을 통해 직접 할당하거나 인라인 형태로 정적 할당을 할 수 있다.

```cpp
int main(){
    vector<vector<int>> v;

    for(int i = 0; i < 10; i++){
        vector<int> temp;
        v.push_back(temp);
    }
}
```

```cpp
int main(){
    vector<vector<int>> v(5, vector<int>(10, 0));
}
```

:::tip 2차원 행렬 순회

2차원 행렬(벡터, Array) 순회시 낮은차원부터 순회하는 것이 성능적으로 좋다.

:::

### v.size()

벡터 요소 개수를 알아낸다.

```cpp
cout << v.size() << "\n";
```

### v.push_back

append와 동일하다.

```cpp
v.push_back(값)
```

### v.pop_back

```cpp
v.pop_back(값)
```

### v.erase(from, to)

요소 하나 또는 인덱스 범위 내의 요소들을 지워준다. **일반적인 서브스크립트 형태가 아니라 주소값을 직접 참조하게 된다.** `[from, to - 1]`까지 삭제한다.

```cpp
v.erase(v.begin()); // 하나 삭제
v.erase(v.begin(), v.begin() + 5); // 0번째부터 4번째까지 삭제
```

### find(from, to, finding value)

벡터 내의 원소 인덱스를 사용한다. `find` 함수의 리턴값이 **v.end()**인 경우 벡터 내에 원소가 존재하지 않음을 나타낸다.

`find(from 인덱스, to 인덱스, 찾을 값)`으로 사용한다. int형으로 인덱스값을 반환받을때는 `find`함수에서 `v.begin()`을 빼준다.

```cpp
if(find(v.begin(), v.end(), 5) == v.end()){
    cout << "존재하지 않는 값!" << "\n";
}else{
    cout << "인덱스: " << find(v.begin(), v.end(), 5) - v.begin() << "\n";
}
```

### v.clear()

벡터 내의 원소 모두 삭제한다.

```cpp
v.clear()
```

### v.fill(from, to, value)

벡터 인덱스 범위에 값을 삽입한다. `fill(from, to, 채울 값)` 형태로 사용한다.

```cpp
fill(v.begin(), v.begin() + 3, 10)
```

## 메서드

### 누적합 (prefix sum)

누적합은 n개의 요소를 갖는 배열이 있을때 각 인덱스의 요소가 0부터 해당 인덱스까지의 누적합으로 구성되는 새로운 배열을 마련하는 방법이다.

예컨대 `1 2 3 4 5 6`이라는 배열이 있을때 누적합 배열은 `1 3 6 10 15 21`이 된다. 누적합 배열을 사용하지 않으면 매번 계산을 새로이 하는 것이 부담된다. `prefix sum` 방법은 정적배열에서 사용된다.

```cpp
#include <bits/stdc++.h>
using namespace std;
int a[100004], psum[100004], n;

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // 누적합 배열 생성
    cin >> n
    for (int i = 1; i <= n; i++){
        cin >> a[i];
        psum[i] = psum[i - 1] + a[i];
    }

    return 0;
}
```

### split - 직접구현

STL에서는 `split`을 지원하지 않아 직접 구현해야한다. 시간복잡도는 O(n)이다.

```cpp
vector<string> split(string input, string separator){
    vector<string> result;
    long long pos = 0;
    string token = "";

    while((pos = input.find(separator)) != string::npos){
        token = input.substr(0, pos);
        result.push_back(token);
        input.erase(0, pos + separator.length());
    }

    result.push_back(input);
    return result;
}
```

1. 임시 벡터를 선언한다.
2. 구분자가 위치한 곳의 인덱스를 pos에 저장한다. 이때 문자열을 `input` 문자열에서 찾지 못한 경우 `string::npos`가 반환된다. 이 값을 가지고 분기처리를 진행하면 된다.
3. 구분자 문자열의 맨 처음 인덱스까지 `input` 문자열을 서브스트링 한다.
4. 임시 벡터에 서브스트링한 문자열을 푸시한다.
5. `input` 문자열의 0번째부터 구분자 문자열 마지막 인덱스까지 `erase`한다.
6. while문 탈출 후 남아있는 `input`문자열을 푸시한 뒤 임시 벡터를 리턴한다.

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

### 조합

빈 벡터에서 시작하여 조합을 위한 값들을 쌓아간다. 원하는 조합 원소 최대개수에 도달할때가 base case에 해당한다.

```cpp
int n = 5;

vector<int> v;
combination(-1, v);

void combination(int start, vector<int> b){
    if(b.size() == n){
        print_combination(b);
    }

    for(int i = start + 1; i < n; i++){
        b.push_back(i);
        combination(i, b);
        b.pop_back();
    }
}

void print_combination(vector<int> b){
    for(int a : b){
        cout << a << " ";
    }
    cout << "\n";
}
```

### atoi(string.c_str())

문자열을 int로 바꿔주는 메서드이다. 변환 실패시 0을 반환한다.

## 각종 팁 정리

:::tip 재귀함수 시간복잡도

재귀함수 내에서 자신을 몇번 호출하느냐에 따라 `O(x^n)`꼴로 시간복잡도가 이루어진다. (base case까지 가는 로직이 -1, +1)로 이루어지는 경우에 해당한다.

:::

:::tip exit(0)

`exit(0)`은 main함수를 그 즉시 종료시킨다. 재귀함수에서 `return`하지 않고 exit을 하면 원하는 결과가 나왔을때 바로 종료시킬 수 있다.

:::

:::tip 아스키코드

아스키코드는 대문자 A, 소문자 a의 시작 코드만 외워두자. 대문자 A는 `065`, 소문자 a는 `097`이다. 알파벳 개수가 26개이므로 a 아스키코드 + 25를 하면 된다. 타입 변환은 `cout << (int)a << "\n";` 형태로 이루어진다.

:::

:::tip 경우의수

경우의수 풀이시 크기가 커져 오버플로우 가능성이 있기 때문에 `long long` 타입으로 선언하자.

:::

:::tip char to int

char형 데이터에서 문자 `'0'`를 빼주면 된다.

```cpp
char c = "3";
cout << c - '0' << "\n" // 3
```

:::
