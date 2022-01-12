---
layout: post
navigation: True
title: 파이썬에서 SQLalchemy로 mySQL연동하기
class: post-template
subclass: "post tag-python"
author: parkjju
---

- 자동 투자 봇 프로젝트 클론코딩 정리내용 중 부족한 부분이 있어서 보충함

- [210305 / 트레이딩 봇 클론코딩 - 데이터베이스 연동하기](https://github.com/Parkjju/TIL/blob/master/Projects/investing_bot/Chapter4/database_on.md)

- 파이썬 코드에서 Database와 연결하기 위한 라이브러리 중 SQLAlchemy라는 라이브러리가 있다.

- 클래스를 사용하여 DB TABLE들을 표현하고 CRUD를 할 수 있도록 해줌

### SQLAlchemy 설치

- pycharm에서 설치하였음 // 파이썬 패키지 매니저를 통해 설치 (pip)

- SQLAlchemy 설치 후 해당 라이브러리의 pymysql을 import!

```python
$ pip install sqlalchemy
$ import pymysql

# mysql db 와의 호환을 위해 아래 함수 호출
$ pymysql.install_as_MySQLdb()
```

- pymysql이란? **Python 전용 데이터베이스 커넥터를 뜻한다.** Python 프로그램이 MYSQL 서버와 통신할 수 있게 만들어주는 라이브러리.

### create_engine import

- SQLAlchemy가 DB에 접근하려면, DB 접속 정보를 알아야함.

- **이러한 접속 정보를 받아서 연결을 관리하는 객체가 Engine**

* 파이썬을 통한 mysql 접근을 하기 위해 진행하는 데이터베이스 설정은 다음과 같다.

```python
>>> from sqlalchemy import create_engine
>>> engine = create_engine("mysql+mysqldb://" + db_id + ":" + db_passwd + "@"
                                        + db_ip + ":" + db_port + "/" + db_name, encoding='utf-8')
```

- Connecting String

```text
mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
```

- db_id, db_password 등은 위의 클론 프로젝트 정리 내용에서 정의한 변수명이다.

### collector.py 파일 실행 시 데이터 베이스의 연결 정보를 저장할 내용 만들기 **name**="**main**"기반

```python
db = {
    db_name = 'database_name'
    db_id = 'mysql id'
    db_ip = 'localhost' # 자신의 로컬컴퓨터
    db_password = 'mysql password'
    db_port = '3306'
}
```

### 연동을 모두 마치고 기본적인 쿼리문을 실행해보기

```python
result = engine.execute("select * from test1.class1;").fetchall()
```

- db연결시 create_engine 함수를 통해 생성한 engine 객체의 execute 메소드를 이용한다.

- 또한 fetchall 메소드를 통해 row들을 튜플 리스트로 받아온다.
