---
title: 상속
---

## 부모 클래스와 자식 클래스

클래스 A와 클래스 Z가 있고, Z가 A를 상속한다고 가정

클래스 A : 부모 클래스, 슈퍼 클래스, 상위 클래스

클래스 Z : 자식 클래스, 서브 클래스, 하위 클래스

**부모 클래스가 갖는 모든 메소드가 자식 클래스에도 담긴다.**

**자식 클래스에는 별도의 메소드를 추가할 수 있다.**

```python
# 상속 예시
class Father:
    def run(self):
        print("fast")

class son(Father):
    def jump(self):
        print("high")

def main():
    s = Son()
    s.run() # 부모 클래스로부터 상속받으므로 run 메소드 호출 가능
    s.jump() # 자식 클래스의 별도 정의 메소드

```

한번에 둘 이상의 클래스를 상속하는 것도 가능하다.

```python
class Father:
    def run(self):
        print("fast")

class mother:
    def dive(self):
        print("deep")

class son(Father, mother):
    def jump(self):
        print("high")

def main():
    s = Son()
    s.run() # father클래스로부터 물려받음
    s.dive() # mother클래스로부터 물려받음
    s.jump() # 자기자신의 메소드

```

둘 이상의 클래스를 동시에 상속하면 구조가 복잡해지고 주의해야할 사항들이 늘어나기 때문에 일반적으로 둘 이상의 클래스를 상속하지는 않는다.

## 메소드 오버라이딩과 super

상속관계에 있어서 부모 클래스가 갖는 메소드와 동일한 이름의 메소드를 자식 클래스가 정의하는 경우도 있다.

이를 **메소드 오버라이딩**이라 하며, 이 경우 부모 클래스의 메소드는 보이지 않는 상태가 됨

지워진 상태가 아니라 호출이 불가능한 상태

```python
class Father:
    def run(self):
        print("fast")

class son(Father):
    def run(self):
        print("slow")

def main():
    s = son()
    s.run() # son의 run메소드가 호출
```

son 클래스가 father 클래스로부터 상속받았기 때문에 father클래스의 run메소드도 son 클래스에 있는 상태이다. (son 클래스에는 run메소드가 두개!)

가려져있기 때문에 출력을 못할까? No

```python
class Father:
    def run(self):
        print("fast")

class son(Father):
    def run(self):
        print("slow")
    def run2(self):
        super().run() # 부모 클래스의 run 호출법. 가려진 메소드 호출법

def main():
    s = son()
    s.run()
    s.run2()
```

가려진 메소드 앞에 super()을 붙여주면 된다.

## **init**메소드의 오버라이딩

```python
class Car:
    def __init__(self,id,f):
        self.id=id
        self.fuel=f
    def drive(self):
        self.fuel-=10
    def add_fuel(self, f):
        self.fuel+=f
    def show_info(self):
        print(self.fuel, self.id)

class Truck(Car):
    def __init__(self, id, f, c):
        super().__init__(id,f)
        self.cargo = c
    def add_cargo(self,c):
        self.cargo+=c
    def show_info(self):
        super().show_info()
        print("Cargo: ", self.cargo)
```

위의 코드에서 볼 수 있듯이 **자식 클래스의 init 메소드 내에서는 부모 클래스의 init 메소드를 호출해야 한다**

**자식 클래스의 init메소드는 부모의 변수를 초기화할 값도 함께 전달받아야 한다.**
