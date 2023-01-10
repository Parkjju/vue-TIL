---
title: Swift - 디자인 패턴
---

## BMI 앱 MVC 패턴 적용하기

기존 UI를 그리는 코드는 ViewController 안에 비즈니스 로직을 비롯한 데이터 관리가 모두 한 공간에서 이루어지고 있었다는 점이 문제였다. 이렇게 되면 클래스 자체가 너무 비대해지며 확장성이 줄어들게 된다.

좌측 파일 메뉴에 Model, View, Controllers라는 이름으로 폴더를 생성한다. xcode 좌측 메뉴에서 우클릭을 한 뒤 New Group을 클릭하면 된다.

## Reference

1. [앨런 Swift 문법 마스터스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8-%EC%95%B1%EB%A7%8C%EB%93%A4%EA%B8%B0/dashboard)
