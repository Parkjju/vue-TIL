---
title: 리스트 컴프리헨션(list comprehension)
---

## 리스트 생성 방법에 대한 복습

```python
>>> r1 = [1,2,3] # 일반적인 생성
>>> r2 = [] # 빈 리스트
>>> r3 = [1,2,[3,4]] # 중첩 리스트
```

```python
>>> r4 = list("HI") # 문자열 내용으로 이루어진 리스트 'H','I'
>>> r5 = list((1,2,3)) # 튜플의 내용으로 이루어진 리스트 1,2,3
>>> r6 = list(range(0,5)) # 레인지의 내용으로 이루어진 리스트
```

위의 예시들처럼 리스트의 생성이 단순하지 않고, 복잡한 조건을 통한 생성이라면?

예) 리스트 [1,2,3]의 각 원소를 2배씩 증가시킨 리스트를 생성하라

for문과 append의 적절한 조합으로 할 수 있을 것

but 이보다 더 간단하게 **리스트 컴프리헨션(list comprehension)** 을 이용하면 된다.

```python
>>> r1 = [1,2,3]
>>> r2 = [x * 2 for x in r1] # 리스트 컴프리헨션 기본 구조
>>> r2
[2,4,6]
```

리스트 컴프리헨션 분석 시 컴프리헨션 내의 for문 아래를 생략하고 중심연산에 주목!

**x\*2** _for x in r1_ -> r1 리스트 내에 있는 값들을 하나씩 x에 넣어 두배 증가시킨 값으로 저장하라.

### 컴프리헨션에 조건 필터 추가하기

```python
>>> r1 = [1,2,3]
>>> r2 = [x*2 for x in r1 if x%2] # 조건필터 추가
```

컴프리헨션 내의 if문은 **True상황일 때 x에 대한 연산을 실행하라** 는 의미이다.

### 컴프리헨션에 이중 for문이 들어가는 경우

```python
>>> r1 = ["white", "black"]
>>> r2 = ["red", "blue", "green"]
>>> r3 = [t+p for t in r1 for p in r2]
```

t-> white일때, p가 red,blue,green 세 경우 발생

t-> black일 때, p가 red, blue, green 세 경우 발생

결과 -> whitered, whiteblue ........

```python
# t+p for t in r1 for p in r2
for t in r1:
    for p in r2:
        t+p
```

### 이중 for루프에 조건 필터 추가

```python
>>> r = [n*m for n in range(2,10) for m in range(2,10) if (n*m)%2]
```

구구단을 출력하는데, 구구단의 결과가 짝수인 구구단만 출력!

리스트 컴프리헨션 -> 직관적으로 이해하기.
