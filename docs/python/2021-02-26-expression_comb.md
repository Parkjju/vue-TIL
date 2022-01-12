---
title: 표현식 기반 문자열 조합
---

## 문자열 조합이란?

편집하듯 하나의 문자열을 구성해 내는 것

```python
>>> s = 'I am ' + str(7) + ' years old' # 문자열 조합 => str(7)은 숫자 7 을 문자열화한것
>>> s
'I am 7 years old'
```

위처럼 단순한 방법으로도 문자열을 얼마든지 조합해낼 수 있다.

하지만 파이썬에서는 더 적은 양의 코드로 다양하게 문자열을 조합할 수 있는 방법을 제공하고있다.

1. **String formatting expressions** -> '표현식'을 기반으로 문자열을 조합 -> %s % (string)

2. **String formattin method calls** -> '메소드 호출'을 토해 문자열 조합하기 (다음 차례에 다룸)

```python
>>> friends = [('Jung',22),('Hong',23),('Park',24)] # 이름과 나이 리스트
>>> for f in friends:
        print('My friend', f[0], 'is', f[1], ' years old') # 출력할 내용 각각 전달

```

전달할 값의 수가 많고, print 출력 방식까지 고려해야함 (end, sep옵션..)

```python
>>> friends = [('Jung', 22), ('Hong',23), ('Park',24)]
>>> for f in friends:
        s = 'My friend ' + f[0] + 'is ' + string(f[1]) + 'years old.'
        print(s)
```

print 출력 형식을 고려하지는 않게 되었지만, 문자열에 수 많은 덧셈을 표기해야한다는 문제점이 발생한다.

## 표현식 기반 문자열 조합

**String formatting expressions\***

```python
>>> s = 'My name is %s' % 'Yoon' # %s 위치에 문자열 'Yoon'
>>> s
'My name is Yoon'
```

1. 연산자 %가 사용되었다.

2. % 왼편에 있는 것이 구성할 문자열의 **기본 틀** 이다. **'My name is %s'** % 'Yoon'

3. %s가 의미하는 바? => 이 위치에 %s 를 대체할 내용을 놓아라.

4. %s 를 대체할 내용이 %오른편의 Yoon이다.

% 연산자에 대하여 타입 지시자 or 서식 지시자 (conversion specifier)

1. %s 이 위치에다가 문자열을 넣어라.

2. %d 이 위치에다가 정수를 넣어라.(10진수 정수)

3. %f 이 위치에다가 실수를 넣어라

% 오른편에 둘 이상의 값들을 넣을 수도 있다.

```python
>>> s = 'My friend %s is %d years old and %fcm tall.' % ('Jung', 23, 180.2)
```

더 다양한 타입 지시자에 대해서는 파이썬 문서를 참조!

기본적으로, 타입 지시자와 값을 같아야한다. (%d % '문자열입니다.' 와 같이 사용 불가) -> **%d 의 오른편에 실수 입력시 소수점 아래 짤림**, 이를 파이썬 **형 변환** 이라고 함.

```python
>>> print('%d' % '엥')
Traceback (most recent call last):
  File "<pyshell#756>", line 1, in <module>
    print('%d' % '엥')
TypeError: %d format: a number is required, not str
```

%s가 등장하면 문자열 이외에 원하는 것 대부분을 가져다 놓을 수 있다.

```python
>>> s = 'My friend %s is %s years old and %scm tall. ' % ('Jung', 22, 178.5)
>>> s
'My friend Jung is 22 years old and 178.5cm tall. '
```

정수 및 실수의 값들을 문자열로 바꿔버리면 그만이기때문에 %s로의 형 변환이 가장 빈번히 이루어진다.

따라서 %s만 사용해서 문자열을 조합할 때에 str함수를 %오른편 값에 호출할 필요가 없다.

```python
>>> s = 'My friend %s is %s years old and %scm tall.' % ('Jung', str(23), str(179.5)) # str호출 안해도 됨. 파이썬 형 변환 이용
```

## 튜플 말고 딕셔너리로 출력 대상 지정하기

위에서의 문자열 조합 스타일은 % 오른 편에 튜플이 왔었다.

아래와 같이 튜플 대신 딕셔너리가 오게 할 수도 있다.

```python
>>> s = "%(name)s : %(age)d" % {'name': 'Yoon', 'age': 22}
>>> s
'Yoon : 22'
```

위에서는 그냥 %s 가 아니라 %(name)s, %(age)d가 사용되었다.

%(name)s 'name'의 값인 문자열 %s를 이 위치에 가져다 놓아라

%(age)d 'age'의 값인 정수를 이 위치에 가져다 놓아라

name과 age는 당연히 딕셔너리의 키이고, 이름으로 직접 지정하기 때문에 두 딕셔너리 키의 등장 순서가 바뀌어도 괜찮다.

## 보다 세밀한 문자열 조합 지정

%f를 통해 실수를 출력했을 때 0이 많이 붙는다.

```python
>>> print('height: %f' % 178.5)
height : 178.500000
```

위와 같은 출력형태들을 모두 조절할 수 있다.

%[flags][width][.precision]f

    [flags] 또는 0 또는 +를 넣어서 특별한 신호를 줌

    [width] 폭, 어느 정도 넓이를 확보하고 출력할지 결정

    [.precision] 정밀도, 소수 이하 몇째 자리까지 출력할지 결정

정밀도 지정 예제)

```python
>>> 'height: %f' % 3.14 # 정밀도 설정 없이 출력
'height: 3.140000'
>>> 'height %.3f' % 3.14 # 소수점 이하 셋째 자리까지 출력
'height: 3.140'
```

정밀도 지정 + 최소 폭에 해당하는 [width]까지 채웠을 때 예제)

```python
>>> 'height: %7.2f' %3.14
'height:    3.14'
```

width는 % 오른편의 값이 차지하는 공간을 포함한 총 필요한 빈칸의 개수를 말한다.

따라서, %7f 옵션으로 width를 7칸 지정하고, %오른편에 3.14가 오면 3.14 왼쪽에 빈칸 셋이 함께 출력된다.

이를 확인하기 위해 빈 공간에 숫자 0을 넣고싶다면, -> 특별한 신호를 주는 [flags]위치에 0을 넣자

```python
>>> 'height: %07.2f' %3.14
'height: 0003.14'
```

flags 값에 -를 주면 빈칸을 오른쪽에 둔다. (왼쪽맞춤)

```python
>>> 'height: %-7.2f입니당.' % 3.14
'height: 3.14   입니당.'
```

flags값에 +를 주면 빈칸을 왼쪽에 둔다? NONONONO (반대 효과 아님)

```python
>>> n = 3
>>> 'num: %+d' %n # +를 두면 부호가 함께 출력
'num: +3'
>>> n = -1
>>> 'num: %+d' % n
'num -3'
```

## 정리

[flags]

+: 부호 정보 함께출력

0: 빈 공간을 0으로 채우기

-: 공간이 남을때 왼쪽으로 붙여서 출력

다음 요구 사항을 만족시키는 출력 결과 만들기 실습

1. 출력패턴 -> 'height: %f입니다.' %3.14

2. 출력 정밀도 -> 소수점 이하 셋째 자리까지

3. 출력을 위한 공간 확보 -> 10칸

4. 옵션 1 -> 왼쪽맞춤

5. 옵션 2 -> 부호 정보 함께출력

```python
>>> 'height: %-+10.3f입니다.' % 3.14
'height: +3.140    입니다.'
```

-와 +의 순서가 바뀌어도 상관없는듯 보임
