---
title: 연산자 오버로딩
---

## 연산자 오버로딩 간단히 이해하기

```python
class Account:
    def __init__(self, aid, abl):
        self.aid = aid # 계좌번호
        self.abl = abl # 계좌잔액
    def __add__(self,m): # 출금
        self.abl+=m
        print('__add__')
    def __sub__(self,m): # 입금
        self.abl-=m
        print('__sub__')
    def __call__(self):
        print('__call__')
        return str(self.aid) + ':' + str(self.alb)

def main():
    acnt = Account('James01', 100)
    acnt + 100 # __add__호출
    acnt - 100 # __sub__호출
    print(acnt()) # __call__호출

```

위의 코드를 통한 메소드 호출 관게

acnt + 100 => acnt.add(100)

acnt 50 => acnt.sub(50) ... 마크다운이므로 짝대기 두개 양쪽으로 깔린 스페셜 메소드 호출형태

acnt() => acnt.call()

acnt + 100 이 add 메소드 호출로 이어졌는데 **이를 연산자 오버로딩** 이라고 한다.

**연산자와 호출되는 메소드의 관계는 약속되어있음 (이미 정해져 있음)**

위의 예제는 논리적으로 결함이 존재한다.

**덧셈 연산은 새로운 값을 만들어야 하지만, 위의 예제는 객체에 저장된 값만 변화되었다.**

따라서 연산자 오버로딩을 한다면 **내부적으로 해당 연산자와 관련된 일을 하고 또 그 결과를 반환하도록 오버로딩 해야한다**

## 메소드 **str**의 정의

```python
>>> class Simple:
        def __init__(self,i):
            self.i=i

>>> s = Simple(10)
>>> print(s)
<__main__.Simple object at 0x000001D5BA50B280>
>>> s.__str__()
'<__main__.Simple object at 0x000001D5BA50B280>'
```

str 메소드는 문자열을 반환하도록 정의해야하고, 해당 문자열은 객체의 정보를 담고 있어야 한다.

일반적으로, 객체가 저장된 위치정보는 필요없는 경우가 많기 때문에 위의 예제에서 단순 출력을 위한 메소드 정의로는 str을 이용하는 것이 이 메소드를 더 쓸모있게 만든다

```python
# 벡터 클래스 정의
class Vector:
    def __init__(self,x,y):
        self.x=x
        self.y=y
    def __add__(self,o):
        return Vector(self.x+o.x, self.y+o.y)
    def __str__(self):
        return 'Vector ({0}, {1})'.format(self.x,self.y) # 벡터 정보를 문자열로 반환
```

## in-place 형태의 연산자 오버로딩

```python
# 위의 벡터 클래스 이용

def main():
    v1 = Vector(2,2)
    v2 = Vector(7,7)
    print(v1,id(v1))
    v1 += v2 # v1 = v1.__add__(v2)
    print(v1,id(v1))
```

+= 연산자의 경우 v1 = v1+v2 로 해석되어 add 메소드의 호출로 이어진다.

+= 연산 이후에는 결국 다른 객체가 저장된다. (위의 코드에서 v1의 id 출력하는 코드 확인)

정수에 대해서도 += 연산에 대해 id 값 출력을 실행해보면 다른 객체가 저장되었음을 알 수 있다.

이는 **정수와 문자열이 immutable객체이기 때문에 보인 결과이다.** mutable 객체의 경우 += 연산을 진행하여도 id값에 대한 변화가 생기지 않는다. (리스트를 통해 확인하기)

사용자 정의 클래스에 대하여 mutable, immutable 성격을 정하려면 +와 += 연산에 대한 오버로딩을 따로 진행해주면 된다. (물론 += 연산을 따로 정의하면 mutable객체)

```python
# 벡터클래스에 mutable 성질 추가
class Vector:
    def __init__(self,x,y):
        self.x=x
        self.y=y
    def __add__(self,o):
        return Vector(self.x+o.x, self.y+o.y)
    def __iadd__(self,o):
        self.x+=o.x
        self.y+=o.y
        return self
    def __str__(self):
        return 'Vector({0}, {1})'.format(self.x, self.y)
```

+= 나 -= 연산을 in-place 연산이라고 하며, 이들을 오버로딩 할 때에는 반드시 **self를 반환해야한다.**

self를 반환하지 않으면 객체가 텅 빌수 있다. **다른 객체를 가리키게 되어 객체를 잃어버림**

- v1 = v1.add_method(v2)
