---
title: 클래스 메소드와 static 메소드
---

## 클래스 변수에 대한 이해

인스턴스 변수 vs 클래스 변수

```python
class simple:
    def __init__(self):
        self.iv = 10 # iv는 인스턴스 변수 객체별 존재

class simple2:
    cv = 20 # cv는 클래스 변수
    def __init__(self):
        self.iv=10

>>> simple2.cv # 클래스 변수는 클래스 이름으로 접근 가능
20
>>> s = simple2()
>>> s.cv # 클래스 변수는 객체를 통해서도 접근 가능
20
```

클래스 변수는 클래스 이름과 객체를 통한 접근이 둘 다 가능하지만 객체를 통한 접근을 하게되면 **클래스 변수인지 인스턴스 변수인지에 대한 구분이 불분명해진다.**

클래스 변수는 객체를 **통한** 접근과, **객체 내에서의 접근** 도 구분된다.

```python
class Simple:
    count=0 # Simple클래스의 클래스 변수
    def __init__(self):
        Simple.count+=1 # 클래스 변수 count 값 1 증가
    def get_count(self):
        return Simple.count # 클래스 변수 count 값 반환

def main():
    s1 = Simple()
    print(s1.get_count())
    s2 = Simple()
    print(s1.get_count())
```

```python
1
2
```

## static 메소드

위에서 정의했던 Simple 클래스의 객체 생성 횟수를 세기 위해 count 클래스 변수를 생성하였었다.

이후 get_count 메소드도 simple 클래스에 정의하였는데, 이를 호출하기 위해서는 Simple 클래스의 객체가 있어야 한다.

1. Simple 객체를 하나 생성하던가

2. 어딘가에 있을 Simple 객체를 찾던가..

get_count 메소드의 기능은 self를 가지고 하는 것이 없기 때문에 메소드 호출에 대한 불합리가 존재한다.

이러한 상황에 **static 메소드를 이용한다**

static 메소드는 클래스 변수와 매우 유사하다!

```python
class Simple:
    def sm():
        print('static method!')
    sm = staticmethod(sm) # sm메소드를 static 메소드로 만드는 방법

def main():
    Simple.sm() # static 메소드는 클래스 이름을 통해 호출 가능하다
    s = Simple()
    s.sm() # static 메소드는 객체를 통해서도 호출 가능하다.
```

static 메소드와 인스턴스 메소드의 외형적인 차이점은 **static 메소드는 첫 번째 인자로 self를 전달받지 않는다**

이는 **객체가 아닌 클래스에 속한 메소드이기 때문이다**

객체가 아닌 클래스에 속한 메소드를 정의했다면, staticmethod 데코레이터 함수에 통과시켜 실제로 static 메소드가 되도록 만들어야한다.

이는 @기반 표현으로도 통과시킬 수 있다.

```python
class Simple:
    @staticmethod
    def sm():
        print('static method!')
```

## class 메소드

static 메소드와 유사한 메소드로 class 메소드가 있다.

```python
class Simple:
    num = 5 # 클래스 변수
    @staticmethod
    def sm(i):
        print('st~ 5 + {0} = {1}'.format(i,Simple.num+i))
    @classmethod
    def cm(cls,i):
        print('cl~ 5 + {0} = {1}'.format(i,Simple.num+i))

>>> Simple.sm(3) # 클래스 이름 기반 static 메소드 호출
st~ 5 + 3 = 8
>>> Simple.cm(3) # 클래스 이름 기반 class 메소드 호출
cl~ 5 + 3 = 8
>>> s = Simple()
>>> s.sm(4) # 객체 대상 static 메소드 호출
st~ 5 + 4 = 9
>>> s.cm(4) # 객체 대상 class 메소드 호출
cl~ 5 + 4 = 9
```

static method vs class method

1. @staticmethod vs @classmethod

2. def sm(i): vs def cm(cls, i)

   첫 번째 매개변수 cls의 유무의 차이

   해당 위치에서 cls로 변수 이름을 짓는 것이 관례 !!

클래스 메소드 생성시 cls 변수를 매개인자로 전달하였지만, 실제 호출 시에는 cls를 무시하고 i에만 값을 전달한다.

1. **첫 번째 매개변수 cls를 빼고 보면 static 메소드와 class 메소드는 동일하다**

2. **cls에는 자동으로 전달되는 무엇인가가 존재한다**

```python
class Simple:
    count = 0
    def __init__(self):
        Simple.count+=1
    @classmethod
    def get_count(cls):
        return cls.count # cls에 전달되는 것은 Simple 클래스
```

```python
>>> print(Simple.get_count())
0
>>> s = Simple()
>>> print(Simple.get_count())
1
```

class 메소드의 첫 번째 인자로 전달되는 것은 **이 메소드의 클래스이다.**

따라서 위의 return cls.count문은 return **Simple.count** 로 이해할 수 있다.

class 메소드의 첫 번째 인자로는 클래스가 전달되므로 **객체 생성 또한 가능하다**

```python
class Natural:
    def __init__(self,n):
        self.n=n
    def getn(self):
        return self.n
    @classmethod
    def add(cls,n1,n2):
        return cls(n1.getn()+n2.getn()) # Natural 객체 생성 후 반환
```

## static 메소드보다 class 메소드가 더 어울리는 경우

class 메소드를 사용하는 타이밍?

```python
class Date:
    def __init__(self, y, m, d):
        self.y=y
        self.m=m
        self.d=d
    def show(self):
        print('{0}, {1}, {2}'.format(self.y,self.m,self.d))
    @classmethod
    def next_day(cls,today): # 다음 날에 대한 객체를 생성
        return cls(today.y, today.m, today.d+1)
```

위의 예시에서처럼, **새로운 객체를 생성 및 반환하는 메소드를 가리켜 팩토리 메소드(factory method)**라 하는데, class 메소드에는 클래스 정보가 전달되므로 팩토리 메소드를 만드는 데에 적합하다.

위의 예제는 물론 static 메소드로도 구현 가능하다!

## static 메소드보다 class 메소드가 더 어울리는 경우

```python
class Date:
    def __init__(self,y,m,d):
        self.y=y
        self.m=m
        self.d=d
    def show(self):
        print('{0}, {1}, {2}'.format(self.y, self.m, self.d))
    @classmethod
    def next_day(cls, today):
        return cls(today.y, today.m, today.d+1)

class KDate(Date): # Date 클래스 상속
    def show(self):
        print('KOR TIME: {0}, {1}, {2}'.format(self.y, self.m, self.d))

class JDate(Date):
    def show(self):
        print('JPN TIME: {0}, {1}, {2}'.format(self.y,self.m,self.d))

```

```python
>>> kd1 = KDate(2025, 4, 12) # 한국 시각 정보
>>> kd1.show()
KOR TIME: 2024,4,12
>>> kd2 = KDate.next_day(kd1)
>>> kd2.show() # KDate객체이므로 한국 시각 출력
KOR TIME: 2024,4,13
>>>
>>> jd1 = JDate(2027,5,19)
>>> jd2 = JDate.next_day(jd1)
>>> jd1.show()
JPN TIME: 2027, 5, 19
>>> jd2.show()
JPN TIME: 2027, 5, 20
```

KDate와 JDate 클래스는 각각 Date 클래스를 상속한 상태이다.

kd2 객체와 jd2 객체를 생성 시, 각각의 클래스인 KDate와 JDate 클래스의 이름으로 next_day 메소드를 호출했기 때문에, class 메소드의 next_day메소드가 호출할 때에 **cls 매개 인자로 KDate와 JDate가 전달된다.**

static으로는 구현하기가 쉽지 않아 보임! 따라서 class 메소드에 더 잘 어울린다
