---
title: dicr와 defaultdict
---

# dict & defaultdict

## 키가 존재할 때와 존재하지 않을 때

키가 존재할 때에는 대입 연산의 결과가 값의 수정으로 이루어진다.

키가 존재하지 않을 때에는 대입 연산의 결과가 새로운 키와 값의 추가로 이어진다. (앞에서 다 다뤘던 내용, 이해가 가지 않는다면 딕셔너리 다시 공부!)

딕셔너리에 저장되어 있는 값을 **참조하는 경우에는** 이야기가 달라진다.

```python
>>> d = {'a':1, 'b':2}
>>> d['c']+=1
Traceback (most recent call last):
  File "<pyshell#652>", line 1, in <module>
    d['c']+=1
KeyError: 'c'
```

딕셔너리의 값에 대한 참조 시 키가 존재하지 않으면 예외가 발생한다.

따라서 딕셔너리를 다룰 때에 위와 같은 예외가 발생할 수 밖에 없는 상황이라면, 이에 대한 처리를 해 두어야 한다.

**키가 존재할 때와 존재하지 않을 때의 상황 별 실행 코드를 구분**

```python
>>> s = 'robbbbot'
>>> d = {}
>>> for k in s:
        if k in d: # 키가 존재하면
            d[k]+=1 # 해당 키의 값 1 증가
        else:
            d[k]=1 # 키가 없으면 값을 1로하여 새로 추가
```

위의 예제는 문자열 각 문자가 몇 번씩 등장하는 지 계산하는 코드 (직접 분석 ! 간단..)

## setdefault 메소드

위에서 if~else를 이용하여 키가 존재할 때와 존재하지 않을 때를 구분하였다.

이를 대체할 두 가지 방법 중 첫 번째 방법 -> **setdefault** 메소드

```python
>>> s = "robbbot"
>>> d = {}
>>> for k in s:
        d[k] = d.setdefault(k,0) + 1 # 딕셔너리의 setdefault 메소드 호출
# 결과는 위와 동일
```

위에서 호출한 setdefault메소드는 다음과 같이 작동

1. d.setdefault(k,v) 매개변수 k에는 키, v에는 디폴트 값 전달.
2. k에 해당하는 키가 있을 때 그 키의 값을 반환
3. k에 해당하는 키가 없을 때 딕셔너리에 k:v를 저장하고 v를 반환

키가 없을 때의 경우만 살펴보면, 처음 등장하는 r 키에 대해 k 자리에 키인 r을 저장하고 값 자리인 v에 디폴트 값 0 을 저장한다

## defaultdict

딕셔너리 값에 대한 참조 시 예외를 처리하는 두 번째 방법 -> **'디폴트 값을 갖는 딕셔너리'**를 생성하는 방법

예제를 통해 확인!

```python
>>> from collections import defaultdict # defaultdict는 collections 모듈의 함수
>>> s = 'robbbot'
>>> d = defaultdict(int) # int 함수를 등록하면서 defaultdict 호출
>>> for k in s:
        d[k]+=1 # 일반 딕셔너리와 사용법 같음

>>> d
defaultdict(<class 'int'>, {'r': 1, 'o': 2, 'b': 3, 't': 1})
>>> print(d['r'])
1
```

d = defaultdict(int) 코드는 int함수를 등록하면서 defaultdict를 호출한 것이다.

디폴트 값은 키 저장 시 사용되는 기본 값이다.

defaultdict 함수 호출 하면서 등록된 디폴트 값은 int이고, int는 함수이며, **int함수에 아무것도 전달하지 않으면 0을 반환한다.**

디폴트 값을 반환하는 함수를 **직접 정의하여 defaultdict함수 매개변수에 전달하면 int함수를 전달했던 것과 동일한 원리가 적용된다.**

람다를 통해 defaultdict함수를 깔끔하게 호출

```python
>>> d = defaultdict(lambda:7) # defaultdict함수에 함수를 등록
>>> d['z']
7
```
