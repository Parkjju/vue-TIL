---
title: Swift - 생명주기
---

## 뷰 컨트롤러의 생명주기

뷰 컨트롤러가 기본적으로 정의될 때에 반드시 만들어져 있는 함수 `viewDidLoad`를 본 적이 있다. 이러한 함수들이 내부 운영체제에 따라 자동으로 실행되는 뷰 컨트롤러 생명주기 함수들이다.

해당 함수의 종류들은 아래와 같다.

1. `loadView` - 뷰를 메모리에 올리는 과정
2. `viewDidLoad` - 스토리보드상의 뷰들과 코드가 연결이 끝난 시점
3. `viewWillAppear` - 뷰가 스크린에 올라가기 직전 호출
4. `viewDidAppear` - 뷰가 스크린에 올라간 직후 호출
5. `viewWillDisappear` - 뷰가 스크린에서 사라지기 직전 호출
6. `viewDisDisappear` - 뷰가 스크린에서 사라진 직후 호출

`willDisappear` ~ 이러한 함수들은 클래스 및 구조체에서의 속성 감시자와 동일한 역할을 한다. 각 함수 사용을 위해서는 아래와 같이 코드를 작성한다.

```swift
override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated)
    print("viewWillDisappear 호출됨")
}
```

뷰컨트롤러의 각 생명주기에 해당하는 함수를 오버라이딩하고 `super` 클래스에 정의된 각 메서드를 호출한다. `loadView`와 `viewDidLoad`는 파라미터가 따로 존재하지 않고 나머지는 `animated`라는 파라미터를 받지만 큰 역할은 하지 않는 것 같다. (super클래스의 메서드 호출 시 파라미터로 animated를 그대로 전달해야함)

화면 present나 dismiss시 animated속성을 false로 줘봤는데 몇몇 생명주기에서는 animated가 false로 출력되는 것을 보니 아마 애니메이션 효과가 부여된 채로 화면이 올라갔다 내려가는지 여부를 체크하는 것 같다.

화면 트랜지션 효과에 `modal`형태로 띄울지 `fullScreen`으로 띄울지에 따라서도 뷰가 스크린에서 완전히 닦여 나가서 메모리에서 내려가는지 여부가 다르기 때문에 이 또한 명확한 구분을 하여 생명주기를 다뤄야 한다.

## Reference

1. [앨런 Swift 문법 마스터스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8-%EC%95%B1%EB%A7%8C%EB%93%A4%EA%B8%B0/dashboard)
2. [Apple document - viewDidAppear](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621423-viewdidappear)
