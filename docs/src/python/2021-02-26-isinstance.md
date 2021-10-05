---
title: isinstance 함수와 object 클래스
---

## isinstance 함수

isinstance(object, classinfo) -> 객체의 클래스 유형을 확인하는 함수

object -> 객체, classinfo -> 클래스

```python
>>> class Simple:
        pass

>>> s = Simple()
>>> isinstance(s, Simple) # s객체가 Simple클래스의 객체인가?
True
>>> isinstance([1,2], list) # [1,2]가 list 클래스의 객체인가?
True
```

isinstance 함수의 역할? -> 이 객체는 저 클래스의 객체인가?

```python
>>> class Fruit:
        pass

>>> class Apple(Fruit):
        pass

>>> class SuperApple(Apple):
        pass

>>> sa = SuperApple()
>>> isinstance(sa, SuperApple)
True
>>> isinstance(sa, Apple)
True
>>> isinstance(sa, Fruit)
True
```

SuperApple은 Apple을 상속하고, Apple은 Fruit을 상속하는 관계이다.

SuperApple이 Apple을 상속함으로써 SuperApple은 Fruit을 간접상속한다.

isinstance가 True를 반환하는 경우

1. isinstance(o, c) 객체 o가 c의 객체인 경우

2. isinsatnce(o, c) 객체 o가 클래스 c를 간접 혹은 직접 상속하는 경우

## object 클래스

파이썬의 모든 클래스는 **object 클래스를 간접 혹은 직접 상속한다**

type클래스도 object 클래스를 상속한다.

위의 사실들은 issubclass 함수를 통해 확인할 수 있다.

issubclass 첫 번째 전달인자는 객체가 아니라 클래스이다.

```python
>>> class A:
        pass

>>> class B(A):
        pass

>>> issubclass(B,A) # B는 A를 상속하는가?
True
```

```python
>>> issubclass(type, object) # type 클래스는 object클래스를 상속하는가?
True
```
