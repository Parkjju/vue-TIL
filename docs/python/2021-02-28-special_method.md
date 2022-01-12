---
title: 스페셜 메소드
---

## 스페셜 메소드

스페셜 메소드란 ? -> 프로그래머가 그 이름을 직접 명시하여 호출하지 않는 메소드를 가리켜 **스페셜 메소드(Special Method)** 라고 한다.

함수의 이름 앞 뒤로 \_ 두개씩 잇슴 (마크다운이라 짝대기 마크가 안됨)

가장 대표적인 스페셜메소드로 init 메소드가 있다.

그 외에도 len, iter, str 스페셜메소드가 예로 있다.

```python
>>> t = (1,2,3)
>>> len(t) # len 스페셜메소드를 호출
3
```

```python
>>> t = (1,2,3)
>>> t.__len__() # len(t) 스페셜 메소드가 실제로 호출되는 형태
3
```

## 클래스에 스페셜 메소드 정의하기

```python
class Car:
    def __init__(self,id):
        self.id=id # 차량 번호
    def __len__(self):
        return len(self.id) # 차량 번호의 길이 반환
    def __str__(self):
        return 'Vehicle number : ' + self.id

def main():
    c = Car("12라3929")
    print(len(c)) # __len__메소드 호출
    print(str(c)) # __str__메소드 호출

main()
```

## iterable 객체가 되게끔 하기

iterable 객체가 되기 위한 조건 스페셜 메소드인 \***\*iter\*\***가 존재해야한다.

iterator 객체가 되기 위한 조건 스페셜 메소드인 \***\*next\*\***가 존재해야한다.

```python
class Car:
    def __init__(self,id):
        self.id=id
    def __iter__(self):
        return iter(self.id) # 변수 id의 iterator객체를 반환

def main():
    c = Car("12러1234")
    for i in c: # Car 객체가 iterable이라는 증거
        print(i,end =' ')
```

## iterator 객체가 되게끔 하기

next 스페셜 메소드에 대해서 실제로 해당 기능을 수행할 수 있게끔 메소드를 정의해야한다.

1. next 메소드가 가져야 하는 기능 -> 가지고 있는 값을 하나씩 반환한다.

2. 더 이상 반환할 값이 없는 경우 StopIteration 예외를 발생시킨다

```python
class Coll:
    def __init__(self,d):
        self.ds=d
        self.cc=0 # next 메소드 호출 횟수
    def __next__(self):
        if len(self.ds) <= self.cc:
            raise StopIteration
        self.cc+=1
        return self.ds[self.cc-1]

def main():
    co = Coll([1,2,3,4,5])
    while True:
        try:
            i = next(co)
            print(i, end=' ')
        except StopIteration:
            break
```

## iterator 객체이자 iterable 객체가 되게끔 하기

```python
class Coll2:
    def __init__(self,d):
        self.ds=d
    def __next__(self):
        if len(self.ds) <= self.cc:
            raise StopIteration
        self.cc+=1
        return self.ds[self.cc-1]
    def __iter__(self): # 이 메소드의 정의가 핵심
        self.cc=0
        return self

```

Coll2 객체는 next메소드를 갖는 iterator 객체이다. 또한 동시에 iter 메소드를 갖는 iterable 객체이다.

따라서 Coll2 객체의 iter메소드는 self를 반환한다.

```python
>>> co = Coll2('hello')
>>> itr = iter(co)
>>> itr is co
True
```
