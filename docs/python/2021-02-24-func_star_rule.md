---
title: 함수 호출과 매개변수 선언에 있어서 star 특수문자의 사용 규칙
---

## iterable 객체와 매개변수

앞으로 알아볼 내용 네 가지

1. func(\*iterable) iterable객체를 전달하면서 별을 붙여 함수를 호출
2. func(\*\*dict) dict 객체를 전달하면서 별 두개를 붙여 함수 호출
3. def func(\*args) 함수를 정의하면서 매개변수에 별을 붙일 때
4. def func(\*\*args) 함수를 정의하면서 매개변수에 별을 두개 붙일 때

func(\*iterable) 리스트, 튜플, 문자열을 풀어서 전달

```python
>>> def who(a,b,c):
        print(a,b,c,sep=", ")

>>> who(*[1,2,3]) # 리스트를 풀어서 각 매개변수에 전달
1,2,3
>>> who(*(1,2,3)) # 튜플을 풀어서 각 매개변수에 전달
1,2,3
>>> who(*'abc') # 문자열을 풀어서 각 매개변수에 전달
a,b,c
```

func(\*\*dict) -> 딕셔너리의 **값을** 풀어서 전달

```python
>>> def who(a,b,c):
        print(a,b,c, sep=", ")
>>> d = dict(a=1, b=2, c=3)
>>> who(*d) # *을 붙이면 키가 매개변수에 전달
a, b, c
>>> who(**d) # **을 붙이면 값이 매개변수에 전달
1, 2, 3
```

키와 값을 튜플로 묶어서 함수에 전달?

```python
>>> def who(a,b,c):
        print(a,b,c,sep=", ")

>>> d = dict(a=1,b=2,c=3)
>>> who(*(d.items())) # items 메소드 사용하여 뷰 객체 얻기
('a', 1), ('b', 2), ('c',3)
```

뷰 객체도 iterable객체 이므로 \*을 붙이는 경우 리스트에 별을 붙이는 경우와 동일한 형태의 결과

## 딕셔너리와 매개변수

def func(\*args) 형태의 함수 정의가 갖는 의미 -> **전달되는 값들이 모두 하나의 튜플로 묶여서 매개변수 args에 전달**

```python
>>> def func(*args):
        print(args) # args는 튜플

>>> func() # 빈 튜플이 전달되는 형태
()
>>> func(1,2) # 1,2 가 튜플로 묶여 전달
(1,2)
```

def func(\*\*args) 형태의 함수 정의가 갖는 의미 -> **딕셔너리의 생성**, **이 딕셔너리를 구성할 키와 값의 정보를 key=value형태로 전달해야함**

```python
>>> def func(**args):
        print(args) # args는 딕셔너리

>>> func(a=1) # {'a':1}이 생성되어 args에 전달
{'a':1}
>>> func(a=1,b=2)
{'a':1, 'b':2}
```

매개변수 선언에 있어서 \*args와 \*\*args를 동시에 둘 수 있다.

```python
>>> def func(*args1, **args2):
        print(args1) # args1은 튜플
        print(args2) # args2는 딕셔너리

>>> func()
()
{}
>>> func(1,2,a=1,b=2) # 함수 호출 시 튜플의 자리와 딕셔너리의 자리가 섞이면 SyntaxError 발생!
(1,2)
{'a':1, 'b':2}
```
