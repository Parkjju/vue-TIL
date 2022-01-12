---
title: 데이터프레임
---

Dataframe? -> 행렬을 저장

**pandas 모듈의 Dataframe 클래스 import**

```python
from pandas import Dataframe
```

딕셔너리 형태로 데이터프레임을 만들기 !

```python
>>> company = {
    'code': ('005930', '066570', '017670'),
    'code_name': ('삼성전자', 'LG전자', 'SK텔레콤'),
    'close': ('55200', '71000', '234000')
}
>>>
>>> df_company = DataFrame(company) # cbind가 default임
```

DataFrame

1. type : 'pandas.core.frame.DataFrame'>

2. len(df_company) -> 3 (데이터프레임 행의 개수)

iloc -> 행, 열 단위로 데이터프레임 데이터에 접근

```python
>>> print(f"df_company.iloc[0,0]:{df_company.iloc[0,0]}, df_company.iloc[0,1]: {df_company.iloc[0,1]}")
```

loc : iloc와 동일하게 DataFrame에 행, 열에 접근함

loc는 **열(column) 에 접근할 경우 라벨명으로 접근**

```python
>>> print(df_company.loc[0,'code'])
```

%참고 -> pycharm IDE는 코드가 길어져서 Enter로 줄바꿈을 진행할 시에 자동으로 f"{}"형식을 추가해준다.

위의 형식을 사용하지 않으려면 f''' {} ''' 로 작은따옴표 셋을 앞뒤로 붙여주어 가독성 up

```python
>>> company2 = {
    'code': ('005930', '066570', '017670'),
    'code_name': ('삼성전자', 'LG전자', 'SK텔레콤'),
    'close': ('55200', '71000', '234000')
}
>>> df_company2 = DataFrame(company2, columns=['close', 'code', 'code_name'])
```

columns 옵션을 통해 딕셔너리에 저장되어 있는 키 값의 순서에 상관 없이 열의 이름을 마음대로 배열할 수 있다.
