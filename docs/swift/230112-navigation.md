---
title: Swift - 네비게이션, 탭 바
---

## 네비게이션 바 & 탭 바 제작(스토리보드)

네비게이션 바는 present가 아닌 `show`라는 이름의 동작으로 화면이 전환된다.

1. 메인 뷰 컨트롤러에 페이지 전환을 위한 버튼 하나를 생성한다.
2. 페이지 전환을 위한 서브 뷰 컨트롤러를 하나 생성한다.
3. 버튼과 새로 생성한 뷰 컨트롤러를 세그웨이로 연결한다. 이때 연결 종류(kind)는 show로 해야한다.
4. 이후 메인 뷰 컨트롤러를 선택하고 우측하단 스택뷰를 생성할때 사용했던 버튼을 클릭하여 Embed in View Controller - Navigation Controller를 선택한다.
5. 좌측에 네비게이션 바 컨트롤러가 하나 생성된다.
6. 메인 뷰 컨트롤러의 상단쪽을 클릭하거나, 좌측에 요소 탐색기에서 `Navigation Item`을 선택하면 타이틀 등을 직접 커스터마이징 할 수 있다.

탭 바의 경우에는 아래의 과정을 거쳐 추가한다.

1. 위의 과정을 거쳐 네비게이션 컨트롤러와 이에 연결된 뷰 컨트롤러를 생성해둔다.
2. 뷰 컨트롤러를 선택한 뒤 동일하게 우측 하단의 버튼 클릭 후 이번에는 Tab Bar Controller를 선택한다. 연결된 뷰 컨트롤러가 첫 탭이 된다.
3. 새로운 탭 생성을 위해 뷰 컨트롤러를 하나 생성한다.
4. 탭 바 컨트롤러를 선택한 후 컨트롤 + 드래그로 뷰 컨트롤러로 드래그 앤 드롭을 한다.
5. 드롭다운 메뉴 중 `Relationship Segue` 섹션의 View Controllers를 선택한다.
6. 탭 바 아이템을 클릭하여 원하는대로 커스터마이징 한다.

## 네비게이션 바 & 탭 바 제작(코드로)

1. 다음페이지로 넘어가기 위한 상호작용 UI요소를 만든다. (버튼 등)
2. addTarget에 따라 실행되는 함수에서 탭바 컨트롤러 인스턴스를 생성한다.
3. 탭 바의 루트뷰가 되는 기본 네비게이션 바 인스턴스를 하나 더 생성한다. 이때 아규먼트에는 클래스를 전달하는 것이 아니라 인스턴스를 전달해야 한다.
4. 나머지 뷰 컨트롤러들을 생성한다.
5. 탭바 컨트롤러 인스턴스의 `setViewControllers` 메서드에 서브 뷰 컨트롤러들을 모두 전달한다. animated 속성을 true로 설정하면 탭이 아래서 올라오는 애니메이션이 생긴다.
6. 탭바 커스터마이징
7. 탭바 아이템 커스터마이징. 탭바 컨트롤러 인스턴스에는 `tabBar` 속성이 있고 해당 속성 내부에 탭바 내부의 아이템들을 배열로 관리하는 `items`속성이 있다. 옵셔널 형태이므로 언래핑 후 사용한다.
8. 스크린에 연결

```swift
@objc func nextButtonTapped(){
    // 1. 탭바 컨트롤러 인스턴스 생성
    let tabBarVC = UITabBarController()

    // 2. 탭바에 대한 루트뷰 생성
    let vc1 = UINavigationController(rootViewController: FirstViewController())

    // 3. 나머지 뷰 컨트롤러 생성
    let vc2 = SecondViewController()
    let vc3 = ThirdViewController()

    // 4. 탭바 서브뷰 등록
    tabBarVC.setViewControllers([vc1, vc2, vc3], animated: false)

    // 5. 탭바 스타일링
    tabBarVC.modalPresentationStyle = .fullScreen
    tabBarVC.tabBar.backgroundColor = .white

    // 6. 탭바 아이템 언래핑 및 커스터마이징
    guard let items = tabBarVC.tabBar.items else { return }

    items[0].image = UIImage(systemName: "...")
    items[1].image = UIImage(systemName: "...")
    items[2].image = UIImage(systemName: "...")

    // 7. 스크린에 연결
    present(tabBarVC, animated: true, completion: nil)
}
```

:::tip UIImage 기본이미지 사용하기

`UIImage` 인스턴스 생성 시 `systemName` 파라미터를 사용하면 스위프트 자체적으로 제공하는 이미지를 사용할 수 있다.

해당 이미지 목록을 보기 위해서는 앱스토어의 [SF Symbols Explorers](https://apps.apple.com/kr/app/symbols-explorer/id1612933742) 앱을 설치하자.

:::

## Reference

1. [앨런 Swift 문법 마스터스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8-%EC%95%B1%EB%A7%8C%EB%93%A4%EA%B8%B0/dashboard)
