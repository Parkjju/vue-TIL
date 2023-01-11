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

:::warning loadView

`viewDidLoad`시점 이전에는 `loadView`라는 생명주기가 있다. 커스텀 뷰를 뷰 컨트롤러에 올리는 경우가 아니면 `loadView`시점에 대한 함수는 구현하면 안된다.

코드로 구현한 UI를 올릴때에만 뷰를 교체하기 위해 사용해야함을 명심하자.

또한 `loadView`는 내부에서 `super.loadView()`도 호출해서는 안된다.

:::

:::tip 앱의 생명주기 - AppDelegate, SceneDelegate

뷰컨트롤러의 생명주기는 앱 내에서 화면 전환과 관련된 내용이고 앱의 생명주기는 앱의 비활성화, 일시정지, 종료 등 앱 자체 구동에 대한 내용이다. 앱 구동중 전화가 오는 등의 일이 앱의 생명주기와 관련된 내용이다.

이러한 앱의 생명주기는 `AppDelegate.swift` 파일에서 관리된다. 또한 OS 버전 업데이트에 따라 최근 씬(Scene)이라는 개념이 새롭게 등장했다.

기존에는 앱의 실행 - 백그라운드 실행 - 대기 - 종료 등의 모든 앱의 상태를 앱 델리게이트에서 관장했다면 **한 화면에서 여러 앱들이 실행되면서 특정 앱에만 포커싱되는 개념인 씬이라는 개념이 등장하게 되면서** 앱의 실질적인 실행 - 종료 - 대기는 앱 델리게이트에서 관장하게 되었고 앱의 실행 과정에서 백그라운드, 포어그라운드 실행에 대해서는 씬 델리게이트가 이를 담당하게 되었다.

:::

## Drawing Cycle

화면을 그리는 주기는 웹 SPA 프레임워크의 리렌더링 조건과 유사한 부분이 있다. 리액트의 경우 상태값이 업데이트 되는 경우 화면이 리렌더링 되는 등의 일이 일어나는데 앱에서는 어떤 조건에 따라 어떠한 주기로 화면이 그려지는 것일까?

아래 단계는 드로잉 싸이클의 일부분이지만, 번호 순서대로 실행되는 함수들이다.

1. `updateConstraints` - 오토레이아웃 제약조건의 업데이트를 반영
2. `layoutSubviews` - 서브 뷰들의 레이아웃 변경 (위치 및 크기)
3. `draw` - 이미지 및 텍스트 그리기

화면 주사율에 따라 1초에 위의 드로잉 싸이클이 60번 정도 반복된다고 한다.

실제로 위의 드로잉싸이클에 해당하는 함수들을 직접 호출하는 것이 아니라, 각 드로잉싸이클마다 스위프트에서 제공하는 특정 함수들을 골라 호출하면 된다.

`setNeeds~()`형태의 함수는 다음 돌아오는 드로잉 싸이클에 해당 주기의 함수를 실행해달라는 의미이고, `~IfNeeded()`형태의 함수는 1초에 N번 반복된다고 가정했을때 한번 그려지는 싸이클에 소요되는 시간 `1/N`초를 기다리지 말고 즉시 해당 주기의 함수를 실행해달라는 의미이다.

1. updateConstraints
    - `setNeedsUpdateConstraints()`
    - `updateConstraintsIfNeeded()`
2. layoutSubviews
    - `setNeedsDisplay()`
    - `layoutIfNeeded()`
3. draw
    - `setNeedsDisplay()`
    - `displayIfNeeded()`는 존재하지 않음

예제코드를 살펴보자.

```swift
@objc func handleAnimationEffect(){
    print(#function)

    // 높이/넓이 변경 관련 애니메이션 코드
    if !myButton.onAndOff {
        btnHeightAnchor.constant = 400
        btnWidthAnchor.constant = 200
    } else {
        btnHeightAnchor.constant = 60
        btnWidthAnchor.constant = 100
    }

    UIView.animate(withDuration: 2) {
        self.view.layoutIfNeeded()
    } completion: { success in
        print("애니메이션 처리 완료")
    }

    myButton.toggle()
}
```

`UIView`인스턴스에는 `animate`이라는 메서드가 존재한다. 애니메이션 듀레이션을 파라미터로 주고 클로저 형태로 뷰의 layoutSubviews 사이클의 `layoutIfNeeded()` 함수를 실행하면 된다.

[다음 문서를 참조하면](https://stackoverflow.com/questions/20609206/setneedslayout-vs-setneedsupdateconstraints-and-layoutifneeded-vs-updateconstra) `updateConstraintsIfNeeded()` 함수는 애니메이션 효과를 처리하지 않는다고 설명한다.

위의 `animate` 메서드 실행과 함께 `layoutIfNeeded`를 실행하게 되면 제약조건에 따른 레이아웃 변경을 위해 호출되는 `layoutSubviews` 싸이클이 강제로 2초 유지 되는것이다.

:::warning 원 깎기

정사각형을 원으로 깎기 위해서는 `radius`값을 한 변의 절반에 해당하는 수치로 할당하면 된다. 원을 깎는다는 것은 **애초에는 정사각형이었던 도형을 원으로 다시 깎는다는 의미이다.**

따라서 이때 다시 깎는 시점에 대해 주목해야한다. 정사각형의 레이아웃 배치가 마무리된 이후 시점에서야 원을 깎아야 제대로 도형이 나오는 것이다.

```swift
// 버튼클래스
override func layoutSubviews() {
    super.layoutSubviews()
    self.layer.cornerRadius = self.frame.width / 2
}
```

위의 코드는 버튼 인스턴스 자체에 대해 레이아웃이 뷰에 올라타는 시점에서 바라본 관점이고, 뷰의 입장에서 버튼을 바라볼 수도 있다.

`viewDidLayoutSubviews`라는 싸이클 함수이다.

```swift
override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    self.myButton.layer.cornerRadius = self.myButton.frame.width / 2
}
```

동일하게 `layoutSubviews` 싸이클에 해당하는 함수이며 뷰 아래에 버튼 인스턴스가 그려진 이후에 버튼에 접근하여 레이아웃을 깎는 작업을 한다.

:::

:::warning updateConstraints
`updateConstraints`메서드 구현시 `super.updateConstraints()` 메서드 호출은 반드시 마지막에 한다.

```swift
override func updateConstraints() {
    // 구현 내용...

    // 구현 내용...
    super.updateConstraints() // 나중에 호출 ⭐️
}
```

`layoutSubviews`는 frame기준으로 바뀌는 수치들을 다룰때 사용하고 오토레이아웃을 다룰때는 `updateConstraints`와 관련된 함수들을 사용하면 된다. 프레임 기준으로 화면 계산을 하기 전에 오토레이아웃 기준으로 수치를 다루게 된다.

```swift
// 버튼의 넓이와 높이를 오토레이아웃으로 맞춘다면
// 자신을 감싸는 박스에 대해 오토레이아웃을 가지고 너비와 높이를 다룬다. (비율)
override func updateConstraints() {
    print(#function)
    myButton.widthAnchor.constraint(equalTo: self.widthAnchor, multiplier: 0.5).isActive = true
    myButton.heightAnchor.constraint(equalTo: self.heightAnchor, multiplier: 0.5).isActive = true
    myButton.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true
    myButton.centerYAnchor.constraint(equalTo: self.centerYAnchor).isActive = true

    super.updateConstraints()
}

// 버튼의 넓이와 높이를 프레임기준으로 맞춘다면
// 자신을 감싸는 박스 자체의 절대적인 너비와 높이값을 가져온다.
override func layoutSubviews() {
    super.layoutSubviews()
    print(#function)

    myButton.frame.size = CGSize(width: self.frame.size.width/2, height: self.frame.size.height/2)
    myButton.center = CGPoint(x: self.bounds.midX, y: self.bounds.midY)
}
```

:::

## Reference

1. [앨런 Swift 문법 마스터스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8-%EC%95%B1%EB%A7%8C%EB%93%A4%EA%B8%B0/dashboard)
2. [Apple document - viewDidAppear](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621423-viewdidappear)
3. [stackoverflow - updateConstraintsIfNeeded vs layoutIfNeeded](https://stackoverflow.com/questions/20609206/setneedslayout-vs-setneedsupdateconstraints-and-layoutifneeded-vs-updateconstra)
4. [ios 레이아웃 완전정복](https://itpeace.tistory.com/44)
