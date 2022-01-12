---
title: iterable객체와 iterator 객체
---

## iter 함수

하나 이상의 값을 저장하는 저장된 값들을 하나씩 꺼내 보는 일은 단순하지만 중요하다.

for문을 기반으로 해당 작업을 진행할 수도 있겠지만, 이보다 더 유연하게 진행할 수 있게 해주는 것이 바로 iterator 객체이다.

```python
>>> ds = [1,2,3,4]
>>> ir = iter(ds) # iterator 객체를 얻는 방법, 첫 번째 값 반환
>>> next(ir) # iterator 객체를 통해 값을 하나 꺼내는 방법, 첫 번째 값 반환
1
>>> next(ir)
2
>>> next(ir)
3
>>> next(ir)
4
>>> next(ir)
>>> next(ir)
Traceback (most recent call last): # 더 이상 읽을 수 없으면 StopIteration 오류 출력
  File "<pyshell#474>", line 1, in <module>
    next(ir)
StopIteration
```

iter 함수를 호출하면 객체를 생성해서 반환하는데, 그 객체는 리스트에서 값을 꺼내는 기능을 제공하는 객체이다.

위 코드에서는 ir = iter(ds) 로 iterator 객체를 얻었고, next(ir) 함수를 통해 다음 차례의 값을 반환하였다.

다시 처음부터 값을 얻으려면 iterator 객체를 다시 얻으면 된다.

## iterable 객체와 iterator 객체의 구분

iterable 객체 iter 함수에 인자로 전달 가능한 객체

iterator 객체 iter 함수가 생성해서 반환하는 객체

어떤 객체가 iterable 객체인지 확인하는 방법은 iter함수에 전달해보면 된다.

## 스페셜 메소드

```python
>>> ds = [1,2,3]
>>> ir = iter(ds) # 이전에 호출했던 방식
>>> next(ir)
1
```

```python
>>> ds = [1,2,3]
>>> ir = ds.__iter__() # iter함수 호출 시 실제 모습
>>> ir.__next__() # next 함수 호출 시 실제 모습
```

즉 iter 함수 호출 시 파이썬 인터프리터에 의해 위의 코드 형태로 메소드 호출이 되고 next 또한 마찬가지이다.

이렇듯 직접 호출하지 않아도 파이썬 인터프리터에 의해서 호출되는 메소드를 가리켜 **스페셜 메소드(Special Method) 파이썬 인터프리터에 의해 호출되는 메소드** 라고 한다.

## iterable 객체의 종류와 확인 방법

위에서는 리스트를 통해 iterator 객체를 생성해보았다. 그렇다면 튜플이나 문자열을 대상으로도 가능할까?

```python
>>> td = ('one', 'two', 'three')
>>> ir = iter(td) # 튜플 대상으로 iter함수 호출
>>> next(ir) # iterator 객체를 통해 튜플 저장된 첫 번째 값 얻음
one
```

튜플은 가능!

```python
>>> s = "iteration"
>>> ir = iter(s)
>>> next(ir)
'i'
```

문자열 또한 가능함을 관찰할 수 있음.

즉 리스트, 튜플, 문자열은 모두 iterator 객체를 반환하는 iterable객체이다.

참고) dir함수를 호출하여 iter메소드가 촌재하는지 확인하는 방법으로도 iterable 객체 여부를 판단할 수 있다.

```python
>>> dir([1,2])
['__add__', '__class__', '__class_getitem__', '__contains__', '__delattr__', '__delitem__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__gt__', '__hash__', '__iadd__', '__imul__', '__init__', '__init_subclass__', '__iter__', '__le__', '__len__', '__lt__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__reversed__', '__rmul__', '__setattr__', '__setitem__', '__sizeof__', '__str__', '__subclasshook__', 'append', 'clear', 'copy', 'count', 'extend', 'index', 'insert', 'pop', 'remove', 'reverse', 'sort'] #iter메소드가 존재
```

또한 True 또는 False의 답으로 듣기 원한다면 hasattr함수 호출을 통해 iter메소드가 있는지 물어볼 수도 있다.

```python
>>> hasattr([1,2], '__iter__') # 리스트에 __iter__ 함수가 있나요?
True
```

## for 루프와 iterable 객체

for 루프는 값을 하나씩 꺼내기 위해 iterator 객체를 생성해서 도움을 받는다.

```python
>>> for i in [1,2,3]:
        print(i,end=' ')

1 2 3 # 우리가 코드 입력 및 실제로 보게 되는 결과
>>> # 실제 작동 방식
>>> ir = iter([1,2,3]) # iterator 객체를 얻는다
>>> while True:
        try:
            i = next(ir) # iterator 객체를 통해서 값을 하나씩 꺼낸다.
            print(i, end=' ')
        except StopIteration: # 더 이상 꺼낼 것이 없으면
            break # 루프를 탈출한다

1 2 3
```

따라서 for문의 루프 대상으로는 iterable 객체만 와야한다.

하지만 for 루프의 대상으로 iterable객체가 아닌 iterator 객체가 와도 정상적으로 동작한다.

```python
>>> ir = iter([1,2,3]) # ir 에 저장되는 것은 iterator 객체
>>> for i in ir: # for 루프에 iterator 객체를 가져다 둔다.
        print(i, end=' ')
1 2 3  # 정상작동
```

iterator 객체를 가져다 두어도 잘 작동하는 이유?
iter함수에 iterator 객체를 전달하면 전달된 iterator 객체를 그대로 되돌려 주기 때문이다.

```python
>>> ir1 = iter([1,2,3]) # 리스트의 iterator 객체를 얻음
>>> ir2 = iter(ir1) # iterator 객체를 전달하면서 다시 iterator 객체를 얻음
>>> ir1 is ir2 # ir1과 ir2가 참조하는 객체는 동일한 객체임을 확인
True
>>> id(ir1)
2745225739424
>>> id(ir2)
2745225739424
```

### for 루프와 iterable 객체 결론

"iterable 객체와 iterator 객체 모두 for 루프의 반복 대상이 될 수 있다."

"iterable 객체가 와야하는 위치에는 iterator 객체가 올 수 있다. "
