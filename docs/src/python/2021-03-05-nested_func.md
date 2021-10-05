---
title: 네스티드 함수와 클로저
---

## 함수를 만들어서 반환하는 함수

```python
>>> def maker(m):
        def inner(n):
            return m*n
        return inner

>>> f1 = maker(2)
>>> f2 = maker(3)
>>> f1(7)
14
>>> f2(7)
21
```

위의 코드를 보고 해석해볼 것.

## 클로저(closure)

위의 코드에서 짚고 넘어가야할 것이 있음 -> 전역, 지역변수 개념

maker에 전달된 m은 원래 함수 내에서 사용된 이후 소멸되는 것이 맞지만 inner함수로 인해 maker함수 밖에서 m값을 참조하게 된다.

**위의 코드에서 정의한 inner함수가 변수 m의 값을 어딘가에 저장해놓고 사용한다** 라고 이해하자.

위의 테크닉을 **클로저(Closure)** 라고함.

## 저장된 위치 확인하기

```python
>>> def maker(m):
        def inner(n):
            return m*n
        return inner

>>> f1 = maker(101)
>>> f2 = maker(75)
>>> f1.__closure__[0].cell_contents # 변수 m의 값을 저장해 놓은 위치
101
>>> f2.__closure__[0].cell_contents # 변수 m의 값을 저장해 놓은 위치
75
```

\_\_closure\_\_ 변수의(속성의) 인덱스 0의 위치에 저장된 객체의 변수(속성)인 cell_contents에 네스티드 함수 inner가 변수 m의 값을 저장해놓고 사용한다.
