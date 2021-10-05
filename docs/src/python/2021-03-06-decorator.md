---
layout: post
navigation: True
title: 데코레이터
class: post-template
subclass: "post tag-python"
author: parkjju
---

### 데코레이터에 대한 이해

- 데코레이터란? 꾸며주는 역할을 하는 함수 또는 클래스

```python
>>> def smile():
        print("^_^")

>>> def confused():
        print("@_@")

>>> smile()
^_^
>>> confused()
@_@
```

- 위의 두 함수는 웃는 얼굴과 혼란스러워 보이는 얼굴을 출력한다.

- 위의 함수의 위와 아래에 이모티콘임을 알리는 단어의 출력이 이루어지길 원한다.

```plain text
emoticon!
^_^
emoticon!
```

- 위의 형태로 출력하도록 기능을 추가해주는 함수가 데코레이터 함수이다.

```python
# 데코레이터 적용 예시
>>> def deco(func):
        def df():
            print('emoticon!')
            func()
            print('emoticon')
        return df

>>> smile(deco)
emoticon!
^_^
emoticon!
```

- 데코레이터 함수가 인자로 전달된 함수에 기능을 추가하는 방식은 다음과 같다.

- **기능이 추가된 새로운 함수를 만들고 이 함수를 반환한다**

### 전달 인자가 있는 함수 기반의 데코레이터

```python
>>> def adder2(n1,n2):
        return n1+n2

>>> def adder3(n1,n2,n3):
        return n1+n2+n3
```

- 위의 두 함수에 데코레이터를 적용시켜보자

```python
>>> def adder_deco(func): # 데코레이터 함수
        def ad(*args):
            print(*args, sep = ' + ', end=' ')
            print("= {0}".format(func(*args)))
        return ad

>>> adder2 = adder_deco(adder2)
>>> adder2
3 + 4 = 7
```

- 튜플의 패킹과 언패킹을 사용 !

- [튜플 언패킹 관련 정리](https://github.com/Parkjju/TIL/blob/master/Python/middle_class/tuple_packing.md)

- 대략의 호출 과정을 정리하면 다음과 같다.

  1. \*args로 매개인자 패킹 -> 매개인자 패킹

  2. print함수에 전달하여 언패킹

  3. func에 한번 더 전달하여 언패킹 (수식의 결과를 출력하기 위함)

### @ 기반으로

- 이전에 정의했던 smile 예시는 함수의 정의와 데코레이터 통과 과정이 분리되어 있다. (**데코레이터 통과 과정 -> smile = deco(smile)**)

- 이를 한번에 묶어서 다음과 같이 표현할 수 있다.

```text
@deco
def smile():
    print("^_^")
```

- smile 함수를 deco 함수에 전달하고, 이때 반환되는 함수를 다시 smile에 넣는다.

```python
def adder_deco(func):
    def ad(*args):
        print(*args, sep=' + ', end=' ')
        print("= {0}".format(func(*args)))
    return ad

@adder_deco
def adder2(n1, n2):
    return n1+n2
```

```python
>>> adder2(3,4)
7
```

- 필요한 데코레이터가 이미 존재하는 상황에서, 지금 정의하는 함수를 그 데코레이터에 통과시킬 목적이면 @기반으로 코드 작성하는 것이 훨씬 간결하다 !!

### 데코레이터 함수 두 번 이상 통과하기

```text
@deco1
@deco2
def simple():
    print("simple")
```

- 위와 같이 데코레이터를 두 번 이상 통과시킬 수도 있다.

- 이는 simple = deco1(deco2(simple))과 동일하다.
