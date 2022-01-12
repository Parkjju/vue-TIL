---
title: 제너레이터 함수
---

## 제너레이터에 대한 이해와 제너레이터 함수

**제너레이터(Generator)는 객체의 한 종류이다.** 제너레이터를 전달하면서 next함수를 호출하면 값을 하나씩 얻을 수 있다.

제너레이터를 만드는 두 가지 방법

1. 제너레이터 함수(funtion) 제너레이터를 만들기 위한 함수 정의

2. 제너레이터 표현식(expression) 제너레이터를 만들기 위한 식

```python
>>> def gen_num(): # 제너레이터 함수 정의
        print('first number')
        yield 1
        print('second number')
        yield 2
        print('third number')
        yield 3

>>> gen = gen_num() # 제너레이터 객체 생성
```

코드에 대한 관찰

1. yield가 보인다. (yield는 값을 리턴하는 역할을 하는듯 보인다.)

2. 함수 몸체에 yield가 보이면 이는 제너레이터 함수이다.

3. gen = gen_num() 으로 함수를 호출한다

4. 함수라면 위의 대입연산이 진행된 후 함수 내의 코드들이 실행되지만, yield가 보이는 제너레이터 함수라면 함수 내의 코드가 한 문장도 실행되지 않고, **제너레이터 객체가 생성된다**

```python
>>> type(gen) #  gen 객체에 대한 확인
<class 'generator'>
```

제너레이터 객체란 무엇인가?

위의 gen_num에 대한 코드에서 제너레이터 함수 및 객체를 생성하고 next() 함수를 호출하면 **함수의 첫 번째 문장부터 시작해서 첫 번째 yield문을 만날 때까지 실행을 이어간다.**

```python
>>> next(gen) # 첫 번째 next함수 호출
first number
1
```

이후 next함수를 계속 호출하면 다음 yield문을 만날 때까지 함수 내의 문장이 실행된다.

- 마지막 yield문까지 실행한 뒤에도 next함수를 호출하면 iterator 객체의 경우와 마찬가지로 StopIteration 오류가 발생한다.

```python
>>> def gen_num():
	print('a')
	yield 1
	print('b')
	yield 2
	print('c')
	yield 3


>>> gen = gen_num()
>>> next(gen)
a
1
>>> next(gen)
b
2
>>> next(gen)
c
3
>>> next(gen)
Traceback (most recent call last):
  File "<pyshell#526>", line 1, in <module>
    next(gen)
StopIteration
```

제너레이터 함수 내에 for문을 집어넣어 yield 구분 생성도 가능!

## 제너레이터가 갖는 장점

제너레이터가 갖는 의미와 필요성?

**제너레이터도 iterator 객체의 일종이다.**

아래의 코드를 비교하며 관찰

```python
>>> def pows(s):
        r = [] # 빈 리슽트
        for i in s:
            r.append(i**2)
        return r

>>> st = pows([1,2,3,4,5,6,7,8,9])
>>> for i in st:
        print(i,end=" ")

1 4 9 16 25 36 49 64 81
```

해당 코드를 통해 반환된 리스트의 메모리 값을 관찰해보자.

sys모듈 import, 해당 모듈의 getsizeof()함수를 호출한다. -> 메모리 공간의 크기 확인

```python
>>> import sys
>>> sys.getsizeof(st)
184
```

```python
>>> def gpows(s):
        for i in s:
            yield i**2

>>> st = gpows([1,2,3,4,5,6,7,8,9])
>>> getsizeof(st)
112
```

분명 입력값과 출력될 값들은 같음에도 불구하고 메모리 크게에 변화가 발생했다.

제너레이터 함수의 yield는 **값을 필요할 때 만들고,** 처음의 예시처럼 일반 값에 대한 생성 및 저장은 **만들어 값을 저장해놓고 가져다쓴다.**

메모리의 효율성 면에서 제너레이터 함수가 압도적임!

lazy evaluation?

스터디룸 10명 공간 대관

10명이 언제 올 지 모르는 상황

10명분의 식사를 미리 준비할 것인가? 각자가 올 때 마다 식사를 준비할 것인가?

**생성되는 값들을 순서대로 하나씩 가져다 쓰는 상황에서는 제너레이터 기반으로 코드를 작성하는 것이 합리적.**

map&filter도 사실은 제너레이터 함수임.

map&filter 함수가 반환하는 것은 iterator 객체이자 제너레이터 객체이다.

## yield form

python 3.3이상에서 사용 가능한 문법

```python
>>> get_nums():
        ns=[0,1,0,1,0,1]
        for i in ns:
            yield i

>>> g = get_nums()
>>> next(g)
0
>>> next(g)
1
```

리스트 내의 값들을 차례로 전달하기 위해 yield문을 사용하였다.

이는 yield from ns 로 간단히 대체가능!

```python
>>> def get_nums():
        ns=[0,1,0,1,0,1]
        yield from ns

>>> g = get_nums()
>>> next(g)
0
>>> next(g)
1
```
