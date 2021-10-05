---
title: map과 filter를 대신하는 리스트 컴프리헨션
---

## map과 filter를 대신하는 리스트 컴프리헨션

```python
>>> st1 = [1,2,3]
>>> st2 = list(map(lambda n: n**2, st1))
>>> st2
[1,4,9]
```

위의 map 함수를 통해 st2리스트를 생성하는 코드는 리스트 컴프리헨션으로 변환 가능하다.

```python
>>> st1 = [1,2,3]
>>> st2 = [n**2 for n in st1]
```

```python
# filter함수를 사용하는 예제
>>> st = [1,2,3,4,5]
>>> ost = list(filter(lambda n: n%2,st))
>>> ost
[1,3,5]
```

filter함수를 사용한 위의 예는 다음의 리스트 컴프리헨션으로 변환 가능하다.

```python
>>> st = [1,2,3,4,5]
>>> ost = [n for n in st if n%2]
```

다음으로 map과 filter를 동시에 사용한 예제까지 봐보자.

```python
>>> st = list(range(1,11))
>>> fst = list(map(lambda n: n**2, filter(lambda n: n%2, st)))
>>> fst
[1,9,25,49,81]
```

위의 코드를 해석해보면, map 함수에 적용할 함수는 차례로 전달될 값들을 제곱하라는 함수이고, 차례로 전달될 값들은 filter함수를 통해 st에서 걸러진 값들, 즉 2로 나누었을 때 True를 반환하는 값들이다.

```python
>>> st = list(range(1,11))
>>> fst = [n**2 for n in st if n%2]
```

map과 filter가 동시에 사용되는 리스트의 경우 리스트 컴프리헨션을 이용하는 편이 확실히 간결해보인다 !
