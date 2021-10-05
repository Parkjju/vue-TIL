---
title: 네임드 튜플
---

## 네임드 튜플의 이해와 작성

```python
>>> tri = (10,24) # 주석처리를 통해 튜플의 각 값이 말하는 의미가 무엇인지 알려줘야함.
```

왼쪽의 값이 밑변이고, 오른쪽의 값이 높이라는 정보를 튜플에 새기려면?

**네임드 튜플(named tuple)** 이라는 것을 기반으로 주석처리를 통한 정보 표기를 할 필요가 없게 하자!!

```python
>>> from collections import namedtuple # collections 모듈의 namedtuple 함수 호출
>>> Tri = namedtuple('Triangle',['bottom', 'height']) # 네임드 튜플 클래스 생성
>>> t = Tri(3,7) # 네임드 튜플 객체 생성
>>> print(t[0], t[1]) # 일반 튜플과 마찬가지로 접근 가능
3 7
>>> print(t.bottom, t.height) # 일반 튜플과 달리 이름으로도 접근이 가능
3 7
```

namedtuple 기본 구조에 대한 분석

Tri = namedtuple('**Triangle**', ['bottom', 'height']) -> Triangle이라는 이름의 클래스를 생성

Tri = namedtuple('Triangle', ['**bottom**', '**height**']) => 첫 번째 위치의 이름은 bottom, 두 번째 위치의 이름은 height

t = Tri(3,7) => namedtuple 함수 호출을 통해 만들어진 클래스를 가지고 객체를 생성

첫 번째 값은 3, 두 번째 값은 7인 네임드 튜플 객체 생성

위에서 **클래스의 정보를 저장할 때 Triangle이라는 이름을 사용했고**, **Triangle 클래스의 객체를 생성하기 위해 Tri라는 변수 이름을 사용** 하였다.

클래스의 이름인 Triangle은 객체 생성에 사용되지 않음을 알 수 있는데, Triangle 이름이 의미가 있을까?

이는 **오류가 발생했을 때 오류의 원인을 찾는 데 도움이 된다**

생성한 네임드 튜플 객체도 튜플과 마찬가지로 저장된 값을 수정하지 못한다.

```python
>>> t[0]=15
Traceback (most recent call last):
  File "<pyshell#616>", line 1, in <module>
    t[0]=15
TypeError: 'Triangle' object does not support item assignment
```

네임드 튜플의 값에 대해 수정을 하려고 하면 위와 같은 오류가 발생함을 관찰!

그리고 위의 오류 메세지에 **Triangle이라는 이름이 보인다.** 이렇듯 네임드 튜플에서 오류가 발생하면 클래스의 이름이 출력되어 **오류가 발생한 원인 또는 위치를 찾는 데 도움을 준다.**

이것이 **네임드 튜플의 클래스에 이름을 붙이는 이유** 이다.

클래스의 이름과 변수의 이름이 달라야 할 필요는 없다.

Tri = namedtuple('Tri', ['bottom', 'height'])

## 네임드 튜플 언패킹

튜플과 마찬가지로 네임드 튜플을 대상으로도 언패킹을 진행할 수 있다.

```python
>>> t = Tri(12,79) # 네임드 튜플 객체 생성
>>> a,b = t # 언패킹
```

함수에 값을 전달할 때에도 \*을 붙여서 언패킹을 할 수 있다.

```python
>>> def show(n1,n2):
        print(n1,n2)

>>> t = Tri(3,7)
>>> show(*t)
3 7
```
