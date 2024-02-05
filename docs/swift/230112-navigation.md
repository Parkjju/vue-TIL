---
title: Swift - 네비게이션, 탭 바
tags: ['Swift', 'UIKit']
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

    // 탭바 아이템 타이틀 설정
    vc1.title = "Main"
    vc2.title = "Play"
    vc3.title = "Setting"

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

:::tip 네비게이션 바 설정
스토리보드가 아닌 코드 기반으로 네비게이션 바 관련 설정을 하기 위해서는 아래와 같은 코드가 필요하다.

```swift
override func viewDidLoad(){
    super.viewDidLoad()

    // ...

    let appearance = UINavigationBarAppearance()

    navigationController?.navigationBar.tintColor = .blue
    navigationController?.navigationBar.standardAppearance = appearance
    // ...
}
```

자세한 내용은 [다음 공식 문서를](https://developer.apple.com/documentation/uikit/uinavigationcontroller/customizing_your_app_s_navigation_bar) 참조하자.

:::

## 로그인 예제

다음 조건을 따르는 로그인 앱을 간단하게 제작해보자.

```text
1. 이니셜 ViewController에 탭/네비게이션 바를 구현하지 말고 앱 구동 특정 시점에 탭바를 삽입하는 형태로 구현해보자.
2. 로그인이 되어있으면 메인페이지를 보여주고 로그인이 되어 있지 않으면 로그인 페이지를 보여주자.
```

1번 조건의 경우 일반적인 예제코드 작성시에 버튼과 같은 UI요소 상호작용 이후에 **addTarget** 함수와 함께 UI가 생성되는 방식이었다.

```swift
@objc func buttonTapped(){
    let tabBarVC = UITabBarController()

    let vc1 = UINavigationController(rootViewController: FirstViewController())
    let vc2 = SecondViewController()
    let vc3 = ThirdViewController()

    vc1.title = "Home"
    vc2.title = "Play"
    vc3.title = "Profile"

    tabBarVC.setViewControllers([vc1, vc2, vc3], animated: false)
    tabBarVC.tabBar.backgroundColor = .white
    tabBarVC.tabBar.tintColor = .black
    tabBarVC.modalPresentationStyle = .fullScreen

    guard let items = tabBarVC.tabBar.items else {return}

    items[0].image = UIImage(systemName: "house")
    items[1].image = UIImage(systemName: "play.circle")
    items[2].image = UIImage(systemName: "person.fill")

    present(tabBarVC, animated: false)
}
```

탭바 및 네비게이션 바의 경우 UI 생성에 단 몇초라도 지연될 가능성이 존재한다. 메인페이지를 구성하는 경우 서버와의 API 통신으로 이미지와 같은 파일들을 불러와야 하는 경우가 있을텐데 버튼 클릭 시점부터 화면을 그리기 시작한다면 분명 사용자 입장에서 흐름을 깨는 상황이 될것이다.

따라서 앱 구동시에 로그인이 되어 있지 않은 경우에 로그인 화면을 띄워주기 전 미리 뒷단에 네비게이션 바와 탭 바 페이지를 깔아두는 것이다.

앱 구동과 관련된 싸이클은 AppDelegate인데, 앱 구동 이후 시점에서 화면의 Scene을 관장하는 곳에서 위의 로직을 구현해야 한다. 이는 SceneDelegate에서 이루어진다. 씬 델리게이트에 대한 자세한 내용은 [다음 문서를](https://medium.com/@kalyan.parise/understanding-scene-delegate-app-delegate-7503d48c5445) 참조하자.

씬 델리게이트 내에서도 싸이클이 있고 여러가지 단계가 존재한다. 이 중 `scene(_:willConnectTo:options:)` 함수는 화면 구동과 함께 첫 UI 루트뷰를 설정하는 역할을 한다. 바로 이 함수에 탭 바 및 네비게이션 바 생성 코드를 삽입해두면 된다.

기존 뷰 컨트롤러 내에서의 UI작성 코드와는 다르게 씬 델리게이트에서 추가로 작성해야하는 코드 몇가지가 있다. 씬에서는 `UIWindow`라는 특별한 객체를 다루며 이 객체를 루트 뷰 컨트롤러로 취급한다.

> This is the first method called in UISceneSession life cycle. This method will creates new UIWindow, sets the root view controller and makes this window the key window to be displayed. - medium, Understanding Scene Delegate & App Delegate

```swift
// SceneDelegate.swift
var window: UIWindow?

func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {

    // 추가된 코드
    guard let windowScene = (scene as? UIWindowScene) else { return }

    // 추가된 코드
    window = UIWindow(windowScene: windowScene)

    // 탭바컨트롤러의 생성
    let tabBarVC = UITabBarController()

    // ....
    // 나머지 탭바 및 네비게이션 바 생성 코드 작성
    // 나머지 탭바 및 네비게이션 바 생성 코드 작성
    // ....

    // 기본루트뷰를 탭바컨트롤러로 설정⭐️⭐️⭐️
    window?.rootViewController = tabBarVC

    // ... and makes this window the key window to be displayed.
    window?.makeKeyAndVisible()
}
```

로그인 여부 확인 후 `isLoggedIn`속성이 false로 확인되어 로그인 화면을 띄웠을때, 일련의 로그인 작업 후 홈화면의 `isLoggedIn`속성을 다시 `true`로 바꿔주려면 어떻게 해야할까?

```swift
@objc func buttonTapped(){
    let homeVC = HomeViewController()
    homeVC.isLoggedIn = true
}
```

인스턴스를 새로 생성하여 내부 속성을 변경하는 것은 틀린 방법이다. 스크린 상에 올라간 HomeViewController 인스턴스와 코드 내에서 버튼 클릭과 함께 생성된 인스턴스는 메모리상 다른 인스턴스이기 때문이다.

따라서 기존 화면에 올라가있는 뷰 컨트롤러의 인스턴스에 접근하는 방법을 알아야 한다. 이때 사용하는 것이 `presentingViewController`이다.

> 핵심만 먼저 말하면 presentedViewController는 지금 ViewController가 띄우는 ViewController, presentingViewController는 지금 ViewController를 띄우는 ViewController다.

위의 문장을 현재 프로젝트에 적용해본다면 지금 ViewController가 띄우는 ViewContoller는 LoginViewController가 될 것이고, presentingViewController는 지금 ViewController( == `LoginViewController`)를 띄우는 ViewController는 HomeViewController가 될 것이다.

홈 화면이라는 것을 표현하기 위해 `HomeViewController`라고 표현하긴 했지만, 위의 씬 델리게이트 예제 코드를 따라 다시 수정하여 말하면 UINavigationViewController의 루트 뷰 컨트롤러 인스턴스로 전달된 `FirstViewController`가 presentingViewController가 된다.

presentingViewController로부터 우리가 실제로 다루고싶은 FirstViewController인스턴스를 얻어내기 위해서는 타입 다운캐스팅을 여러번 해줘야한다. 이는 탭바, 네비게이션 바 컨트롤러와 우리의 뷰 컨트롤러 인스턴스가 일련의 계층을 가지고 화면에 구성되기 때문이다.

```swift
@objc func buttonTapped(){
    guard let presentingVC = presentingViewController else {return}
    guard let tabBarCon = presentingVC as? UITabBarController else {return}
    guard let navBarController = tabBarCon.viewControllers?[0] as? UINavigationController else {return}
    guard let homeVC = navBarController.viewControllers[0] as? ViewController else {return}

    homeVC.isLoggedIn = true
    dismiss(animated: true)
}
```

화면의 층을 3D형태로 상상하여 층을 이루는 화면을 생각해보자. 가장 바닥에는 탭바 컨트롤러가 있다. 탭 바의 탭들을 이리저리 클릭하면 바로 위층의 네비게이션 바에 해당하는 컨트롤러 인스턴스들이 교체된다. 바로 이 네비게이션 바 위에 있는 화면이 우리가 찾고자 하는 화면의 뷰컨트롤러 인스턴스가 된다.

탭바 기준 네비게이션 바와 우리의 뷰컨트롤러 인스턴스는 내부 속성에 접근할 수 없을 가능성이 매우 농후하다. 저장속성이 추가된다던지 하는 등 기능의 확장 방향으로 인스턴스들이 화면 위에 쌓이기 때문이다.

따라서 타입캐스팅도 업캐스팅이 아닌 다운캐스팅에 해당하므로, 옵셔널 타입이 리턴됨에 따라 `guard let` 등와 같이 언래핑 문법을 이어서 작성해줘야 한다.

1. `presentingController` 인스턴스를 얻어낸다. 옵셔널 타입이므로 언래핑해주어 변수에 저장한다.
2. 가장 바닥층에 쌓여있는 탭바 타입으로 다운캐스팅한다.
3. 탭바 바로 위층에 있는 네비게이션 바 타입으로 다운캐스팅한다. 이때 중요한 것은 **탭바는 하나지만 탭바 위에 있는 네비게이션 바는 여러가지일 수 있다.** 따라서 본인이 코드 작성 시 위치시켰던 인덱스에 맞춰 인스턴스를 얻어낸다.
4. 네비게이션 바 위층에 있는 뷰컨트롤러 인스턴스를 얻어낸다. 네비게이션 바도 동일하게 한 네비게이션 위에 여러 뷰들이 쌓일 수 있다. 자동으로 생성되는 상단 바의 뒤로가기 기능을 보면, 기존의 화면에서 push되어 층이 쌓이고, pop되어 층이 사라지는 것을 보면 된다.
5. 얻어낸 인스턴스의 로그인 저장속성 값을 변경한 뒤 dismiss하여 홈 화면으로 이동한다.

:::tip 네비게이션 바 vs 뷰컨트롤러

뷰컨트롤러의 세그웨이를 통한 여러 화면의 구성과 네비게이션 바를 활용한 여러 화면의 구성은 **다르다.** 화면에 보여지는 것만 보면 크게 다를 바가 없어보이지만, 한 네비게이션 바에서는 화면이 그려지는 방식이 `present`가 아닌 `push`이고, 화면이 지워지는 방식이 `dismiss`가 아닌 `pop`이다.

스택구조로 화면들을 관리하게 됨으로써 화면 간 계층을 구성하는 데에 뷰 컨트롤러의 세그웨이 방식을 통한 연결보다 훨씬 간편해진다.

네비게이션 바 컨트롤러의 인스턴스에는 `func pushViewController(_ viewController: UIViewController, animated: Bool)`, `func popViewController(animated: Bool) -> UIViewController?` 두 메서드가 존재한다. 위에서 언급한 스택 구조 화면을 구성하기 위한 메서드들이다. `pushViewController`는 `present`와 유사한 기능을 갖지만 스택형태로 화면에 쌓고 `popViewController`는 `dismiss`와 유사한 기능을 갖지만 스택형태로 화면에서 pop out 된다.

자세한 내용은 [다음 문서를](https://stackoverflow.com/questions/28751457/difference-between-navigation-controller-and-viewcontroller) 참조해보자.

:::

:::warning 네비게이션 바 생성

씬 델리게이트에서 탭 바 위에 뷰 컨트롤러들을 올려놓을 때에, 반드시 네비게이션 바를 올려놓을 필요는 없다. 탭 바 위에 뷰 컨트롤러만 탭 바 아이템 수대로 올려놓아도 되지만 그렇게 되면 사실상 탭 바를 사용해야할 이유가 없다.

위의 씬 델리게이트 예제코드를 다시 살펴보자.

```swift
let vc1 = UINavigationController(rootViewController: FirstViewController())
let vc2 = SecondViewController()
let vc3 = ThirdViewController()

// let vc2 = UINavigationController(rootViewController: SecondViewController())
```

위와 같이 뷰 컨트롤러들을 구성하게 되면 `vc1` 인스턴스만 네비게이션 컨트롤러를 갖게된다. 추후 네비게이션 바 위에서 화면을 push하고 pop하기 위해서는 `pushViewController(뷰컨트롤러, animated:)`메서드와 `popViewController(animated:)`메서드를 사용하게 되는데 **`UINavigationController`로 생성되지 않은 인스턴스에 대해서는 위의 두 메서드를 사용해도 기능이 적용되지 않는다.**

화면에서 스택 뷰를 구성하기 위한 코드는 아래와 같다.

```swift
@objc func buttonTapped(){
    self.navigationController?.popViewController(animated: true)
}
```

현재 뷰 기준으로 `navigationController` 속성에 접근하여 pop out할지, push할지를 메서드 호출에 따라 처리하게 되는데 이때 `self.navigationController`에 대한 애플 도큐먼트의 설명을 보면 아래와 같이 적혀있다.

> If the view controller or one of its ancestors is a child of a navigation controller, this property contains the owning navigation controller.

현재 기준 뷰 컨트롤러의 조상 뷰들을 검색하여 네비게이션 컨트롤러를 가져온다는 의미이다. 네비게이션 컨트롤러에 접근하여 `pop`하거나 `push`하는 메서드를 호출할 수 있다.

:::

:::tip 네비게이션 컨트롤러 인덱싱

네비게이션 컨트롤러에서 특정 화면에 접근할때에 서브스크립트 형태로도 접근할 수 있다.

스토리보드 기반으로 네비게이션 컨트롤러를 제작할때에 화면의 순서는 아래와 같이 이루어진다.

1. 네비게이션 컨트롤러
2. 네비게이션 컨트롤러의 루트 뷰 컨트롤러
3. 나머지 서브 뷰 컨트롤러

뷰 컨트롤러에서는 `navigationController`라는 객체를 자동으로 제공하는데 이때 현재 뷰 컨트롤러 기준으로 루트 위치에 네비게이션 컨트롤러가 이미 등록된 상태라면 위의 객체가 사용 가능하게 된다.

위 객체 내부 속성 중 `viewControllers`라는 속성은 `var viewControllers: [UIViewController] { get set }`과 같은 선언을 갖는다. `UIViewController`로 이루어진 배열 타입임을 알 수 있는데, 이때 네비게이션 컨트롤러를 기준으로 루트 뷰 컨트롤러가 0번째 인덱스에 위치하고 + 나머지 서브 뷰 컨트롤러들이 배열 형태로 저장되어 있다.

> The root view controller is at index 0 in the array, the back view controller is at index n-2, and the top controller is at index n-1, where n is the number of items in the array. [Apple document]

:::

:::tip BarButtonItem

스크린 상단 바의 왼쪽 및 오른쪽에서 아이템을 선택할때에 사용할 버튼은 일반적인 `UIButton` 인스턴스가 아니다. `UIBarButtonItem`이라는 요소를 사용해야한다.

```swift
lazy var plusButton: UIBarButtonItem = {
    let button = UIBarButtonItem(barButtonSystemItem: .add, target: self, action: #selector(plusButtonTapped))
    return button
}()
```

버튼을 속성으로 관리하지 않고 함수에서 붙일때에는 navigationItem 속성을 활용한다. 네비게이션 바 내에는 각 위치마다 지정해줄 수 있도록 영역을 미리 나누어놓았다.

```swift
func setupButton(){
    let plusButton = UIBarButtonItem(barButtonSystemItem: .add, target: self, action: #selector(plusButtonTapped))
    navigationItem.rightBarButtonItem = plusButton
}
```

일반적으로 시스템 버튼을 등록하여 사용하고 나머지는 UIButton과 동일하다. (셀렉터 및 타겟 등록)
:::

## Reference

1. [앨런 Swift 문법 마스터스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8-%EC%95%B1%EB%A7%8C%EB%93%A4%EA%B8%B0/dashboard)
2. [Understanding Scene Delegate & App Delegate](https://medium.com/@kalyan.parise/understanding-scene-delegate-app-delegate-7503d48c5445)
3. [presentingViewController와 presentedViewController의 사용](https://yoojin99.github.io/app/presentedViewController,-presentingViewController/)
4. [stackoverflow - Difference between navigation controller and viewcontroller?](https://stackoverflow.com/questions/28751457/difference-between-navigation-controller-and-viewcontroller)
5. [Apple document - Customizing your app's Navigation Bar](https://developer.apple.com/documentation/uikit/uinavigationcontroller/customizing_your_app_s_navigation_bar)
