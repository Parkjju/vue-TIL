---
layout: post
navigation: True
title: 깊은 복사와 얕은 복사
class: post-template
subclass: "post tag-python"
author: parkjju
---

객체 비교시 사용할 수 있는 두 가지 연산자를 정리하면 다음과 같다.
v1 == v2 변수 v1과v2가 참조하는 **객체의 내용이 같은가?**
v1 is v2 변수 v1과 v2가 참조하는 객체가 **동일한 객체인가?**

```python
>>> r1 = [1,2]
>>> r2 = [1,2]
>>> r1==r2
True
>>> r1 is r2
False
```

다음 예제의 객체 복사를 보자.

```python
>>> r1 = ['John', ('man', 'korea'),[173,24]]
>>> r2 = list(r1) # 리스트 r1의 내용을 가진 r2리스트 객체 생성
>>> r1 is r2
False
>>> r1[0] is r2[0]
True
>>> r1[1] is r2[1]
True
>>> r1[2] is r2[2] # r1,r2리스트 객체의 각 원소가 동일한 객체인가?
True
```

Python 리스트는 생성 시 리스트 안에 선언되는 값들이 리스트라는 공간에 쏙 들어가있는 것이 아니라 각 값(객체)들을 리스트 내에서 **참조하는 형태가 된다.**

<img src="/assets/images/object.jpg" width="50%" height = "50%"/>

r2 = list(r1) 코드를 통해서 r1리스트의 내용이 담긴 새로운 리스트 객체가 생성된다.

<img src = "/assets/images/object2.jpg" width="50%" height="50%"/>

r2가 레퍼런스 하는 리스트 객체의 각 원소들을 관찰해보자.

r1리스트 객체의 내용이 복사될 때 각 원소에 대하여 새로운 객체를 생성하여 참조하는 것이 아니라 **r1 생성 시 각 원소가 참조하고있는 데이터를 r2또한 참조하고 있다.**

위와 같은 복사 방식을 얕은 복사(shallow copy) 라고 하며, 튜플과 같이 변경 불가능한 데이터에 대해 안전성을 높여주는 복사 방식이다.

얕은 복사가 있다면, 깊은 복사 또한 존재한다(deep copy)

```python
>>> J2021 = ['John', ('man', 'Korea', [175,23]]
import copy # deepcopy 함수 호출 위해서 copy 모듈 import
>>> J2022 = copy.deepcopy(J2021)
>>> J2022[2][1]+=1 # 해가 바뀌면서 John의 나이를 추가해야되는 상황.
>>> J2021
['John',('man', 'Korea'),[175,23]]
>>> J2022
['John',('man', 'Korea'),[175,24]]
>>> (J2021[0] is J2022[0]) and (J2021[1] is J2022[1]) # 얕은 복사 진행 완료
True
>>> J2021[2] is J2022[2] # 깊은복사 진행 완료
False
```

deepcopy함수 호출을 통해 immutable객체에 대해서는 얕은 복사가 진행되었고, mutable객체에 대해서는 깊은 복사가 진행됨.

```python
>>> d1 = (1,2)
>>> str1 = 'str'
>>> d2 = tuple(d1) # d1 기반의 튜플생성. 튜플복사
>>> str2 = str(str1) # str1 기반의 문자열 생성. 문자열 복사
>>> d1 is d2
True
>>>str1 is str2
True
```

위의 방식으로 문자열과 튜플에 대하여 얕은 복사를 진행할 수 있다.
