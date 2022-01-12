---
title: map과 filter
---

## map

```python
>>> def pow(n):
        return n**2 # n의 제곱값을 계산, 반환

>>> st1 = [1,2,3]
```

위에서 정의한 pow 함수와 st1이 참조하는 리스트를 이용하여 st2=[1,4,9] 리스트를 만들고싶다.

```python
>>> st2 = [pow(st1[0]), pow(st1[1]), pow(st1[2])] # 값을 일일이 넣어서 pow 함수 호출.... ?
>>> st2
[1,4,9]
```

작성 자체가 불편할 뿐만 아니라, 리스트의 길이가 길어지면 값의 입력에 당연히 실수가 생길 수 밖에 없으며 일일이 함수를 호출하는 것도 여간 귀찮은 일이 아니다. ==> **map함수를 이용!**

```python
>>> st2 = list(map(pow,st1)) # map은 st1의 값들을 전달하면서 pow를 호출한다.
>>> st2
[1,4,9]
```

list(**map**(**pow**,**st1**)) 부분을 관찰해보자.

map 함수는 st1에 저장된 값들을 하나씩 전달하면서 pow함수를 호출해준다.
즉 st1에 저장된 값의 수만큼 pow함수가 호출되며 그것이 map함수가 하는 일이다.
**단 이때 map의 두 번쨰 전달 대상은 iterable 객체이어야 한다.**

위의 예시에서, pow함수가 반환하는 값들을 어떻게 얻을까?

map은 iterator 객체를 반환한다.

```python
>>> def pow(n):
        return n**2

>>> st = [1,2,3]
>>> ir = map(pow,st)
>>> for i in ir:
        print(i, end=' ')

1 4 9
```

map에는 리스트 뿐만 아니라 튜플, 문자열도 전달 가능하다. iterable 객체이면 뭐든 전달 가능!

```python
>>> def dbl(e):
        return e*2

>>> list(map(db1,(1,3,4))) # 튜플을 map에 전달
[2,6,8]
>>> list(map(db1,'hi'))
['hh','ii']
```

map함수는 전달되는 함수의 매개변수 개수에 따라 요구하는 iterable 객체의 수도 달라질 수 있다.

```python
>>> def sum(n1,n2):
        return n1+n2

>>> st1 = [1,2]
>>> st2 = [3,4]
>>> st3 = list(map(sum,st1,st2))
>>> st3
[4,6]
```

## map과 람다

슬라이싱 연산 시 세번쨰 인자에 음수를 전달하면 값을 꺼내는 방향이 달라진다.

```python
>>> st = [1,2,3]
>>> st[: :-1]
[3,2,1]
```

```python
>>> s = 'hello'
>>> s[::-1]
'olleh'
```

map을 통해 리스트에 담긴 문자열들을 모두 뒤집기 !

```python
>>> def rev(s):
        return s[::-1] # 전달된 내용의 순서를 뒤집어서 반환

>>> st = ['one', 'two', 'three']
>>> rst = list(map(rev,st))
>>> rst
# st의 각 원소에 있는 문자열이 뒤집어서 출력될 것.
```

```python
>>> st = ['one', 'two', 'three']
>>> rst = list(map(lambda s: s[::-1], st)) # 람다식을 이용하여 위의 코드를 변형!
```

## filter

filter함수도 map과 마찬가지로 함수를 인자로 받는다.

filter함수는 값을 걸러내는 기준이 된다.

```python
>>> def is_odd(n):
        return n%2 # 값이 0과 1로 나뉨 -> 홀수이면 True를 반환하게됨

>>> st = [1,2,3,4,5]
>>> ost = list(filter(is_odd, st))
>>> ost
[1,3,5]
```

위의 예시에서 ost = list(filter(is_odd,st))를 보면, is_odd함수를 기준으로 st에 저장된 값들 중 일부를 걸러냈다.

filter함수의 첫 번째 인자는 따라서 **"True 또는 False를 반환하는 함수이어야 한다."**

filter함수의 두 번째 인자는 **리스트나 튜플과 같이 값을 저장하고 있는 iterable객체** 이어야 한다.

위의 예시에서 filter는 st에 저장된 값들을 하나씩 꺼내서 is_odd에 전달하고, True False 여부를 판단하여 True 반환하는 값들만 모은다. => 이후 해당 값들에 접근할 수 있게 iterator 객체를 반환한다.

```python
>>> st = [1,2,3]
>>> ost = list(filter(lambda s: s%2, st))
>>> ost
[1,3]
```

```python
>>> st = list(range(1,11)) # range함수도 iterable객체임.
>>> fst = list(filter(lambda n: not(n%3), st))
>>> fst
[3,6,9]
```

```python
# map과 filter를 모두 사용
>>> st = list(range(1,11))
>>> fst = list(filter(lambda n: not(n%3), map(lambda n: n**2, st))) # filter의 첫 인자로 filter기준되는 람다함수를 전달하고, filter 기준에 넘겨줄 인자를 map으로 st리스트 각 원소에 제곱하여 넘겨주었다.
>>> fst
>>> [9,36,81]
```
