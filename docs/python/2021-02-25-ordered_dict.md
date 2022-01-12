---
title: dict와 orderedDict
---

## dict는 저장 순서를 유지하기 시작했다

파이썬의 dict은 저장 순서를 유지한다. (파이썬 3.7부터)

```python
>>> d = {}
>>> d['a'] = 1 # 첫 번째 저장
>>> d['b'] = 2 # 두 번째 저장
>>> d['c'] = 3 # 세 번째 저장
>>> d
{'a':1, 'b':2, 'c':3}
>>> for kv in d.items():
        print(kv)

('a',1)
('b',2)
('c',3)
```

이전에는 저장 순서를 기억하지 않았다. 출력 순서가 일정하지 않았다. -> **저장 순서를 이용하고 싶을 때 OrderedDict를 이용해야 했다**

```python
>>> from collections import OrderedDict # collecntions 모듈의 OrderedDict
>>> od = OrderedDict() # OrderedDict 객체 생성
>>> od['a'] = 1 # 이후 딕셔너리 사용 방법과 동일
>>> od['b'] = 2
>>> od
OrderedDict([('a',1),('b',2),('c',3)])
>>> for kv in od.items(): # 딕셔너리와 마찬가지로 items 메소드 호출 가능
        print(kv)

('a',1)
('b',2)
```

이제 딕셔너리가 저장 순서를 유지하기 때문에 OrderedDict를 순서 목적으로 사용할 필요가 없어졌다!

## 그래도 OrderedDict를 써야 하는 이유?

```python
>>> d1 = dict(a=1, b=2, c=3)
>>> d2 = dict(c=3, a=1, b=2)
>>> d1
{'a':1, 'b':2, 'c':3}
>>> d2
{'c':3, 'a':1, 'b':2}
>>> d1 == d2 # d1, d2는 저장 순서는 다르고 내용물은 같다.
True
```

dict는 저장된 내용물만 동일하면 == 연산 결과가 True이다. **저장 순서는 dict 객체를 비교함에 있어서 비교 대상이 아님.**

```python
>>> from collections import OrderedDict
>>> od1 = OrderedDict(a=1,b=2,c=3)
>>> od2 = OrderedDict(c=3,b=2,a=1)
>>> od1==od2
False
```

OrderedDict 객체 비교에 있어서는 **저장 순서도 중요하다.**

아무리 내용물이 동일해도 저장 순서가 일치하지 않으면 == 연산 결과도 False이다.

따라서 딕셔너리의 저장 순서가 **객체 구분에 의미를 갖는 상황이면 OrderedDict를 사용해야한다.**

```python
>>> from collections import OrderedDict
>>> od = OrderedDict(a=1,b=2,c=3)
>>> for kv in od.items():
        print(kv,end=' ')

('a',1) ('b', 2) ('c',3)
>>>
>>> od.move_to_end('b') # 키가 'b'인 키와 값을 맨 뒤로 이동
>>> for kv in od.items():
        print(kv, end=' ')

('a',1) ('b',2) ('c',3)
>>>
>>> od.move_to_end('b',last=False) # 매개변수 last에 False 전달하면 맨 앞으로 이동
>>> for kv in od.items():
        print(kv,end=' ')

('b',2) ('a',1) ('c',3)
```
