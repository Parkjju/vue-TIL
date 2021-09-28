---
title: 코멘토 - 프론트엔드 직무체험
---

## 1주차

1. 리액트 프로젝트 생성 (리액트 CRA이용)
2. ESlint, Prettier 생성
3. 커밋 메세지 디테일하게 작성

### Commit Type

[커밋 메세지 컨벤션](https://doublesprogramming.tistory.com/256) 을 참조하여 커밋 메세지 태그에 대해 알게되었다.

1. feat: 기능 개발
2. fix: 버그 수정
3. docs: 문서 수정
4. style: 코드 포맷팅, 세미콜론 누락, 코드의 변경이 없는 경우
5. refactor: 코드 리팩토링
6. test: 테스트 코드, 리팩토링 테스트 코드 추가
7. chore: 빌드 업무 수정, 패키지 매니저 수정

### Prettier 설정법

[뷰 캠프 경환님 README파일 참조](https://github.com/joshua1988/vue-camp/blob/47c404998735f469276322fe862f528c47d2b0d1/docs/format/prettier.md)

### Eslint 설정법

```sh
npm install -g eslint
eslint --init
```

## 2주차

### API

:::tip API란?
API는 응용 프로그램에서 운영체제나 프로그래밍 언어가 제공하는 기능을 제어할 수 있게 만든 인터페이스를 의미합니다. 주로 파일 제어, 창 재어, 화상 처리, 문자 제어 등을 위한 인터페이스를 제공합니다.
:::

APP과 OS, APP과 프로그래밍 언어의 상호작용을 돕는 것이 API이다.

### 웹 API

웹 API란 웹 어플리케이션 개발시 클라이언트와 서버, 어플리케이션과 어플리케이션 등 서로 요청을 주고 받기 위해 정의한 API이다.

웹 API가 하는 역할은 다음과 같다.

1. 서버와 DB의 리소스에 접근할 수 있게 해준다.
2. 다양한 OS나 브라우저에 따라 달라질 수 있는 요청과 응답 방식을 **표준화한다.**

### REST API

REST API란 웹상에서 사용되는 여러 리소스를 HTTP URI로 표현하고 해당 리소스에 대한 행위를 HTTP 메서드로 정의하는 방식을 말한다.

규칙은 다음과 같다.

1. 리소스에 대한 행위를 HTTP 메서드 (POST, GET, PUT, DELETE)로 표현해야한다.
2. 슬래시를 통해 계층 관계를 표현한다.
3. URI 마지막 문자에 슬래시를 사용하지 않는다.
4. URL에 언더스코어는 사용하지 않고 되도록 소문자로 표현한다.
5. URI는 동사가 아니라 명사를 사용한다.
6. URL에 파일 확장자가 포함되지 않도록 한다.

### Reference

[API 개념 정리](https://velog.io/@taeha7b/api-restapi-restfulapi)
