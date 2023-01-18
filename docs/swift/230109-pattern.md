---
title: Swift - 디자인 패턴
---

## BMI 앱 MVC 패턴 적용하기

MVC 패턴의 중심 개념은 뷰는 컨트롤러를 통해서만 모델과 소통하고, 모델도 역시 컨트롤러를 통해서만 뷰와 소통한다는 것이다.

기존 UI를 그리는 코드는 ViewController 안에 비즈니스 로직을 비롯한 데이터 관리가 모두 한 공간에서 이루어지고 있었다는 점이 문제였다. 이렇게 되면 클래스 자체가 너무 비대해지며 확장성이 줄어들게 된다.

좌측 파일 메뉴에 Model, View, Controllers라는 이름으로 폴더를 생성한다. xcode 좌측 메뉴에서 우클릭을 한 뒤 New Group을 클릭하면 된다.

BMI 계산 앱의 첫 코드는 아래와 같았다.

```swift
import UIKit

class ViewController: UIViewController, UITextFieldDelegate {
    var bmi: Float?
    // viewDidLoad를 포함한 각종 UI 세팅 코드들은 생략..
    @IBAction func submitButtonTapped(_ sender: UIButton) {
        if(heightTextField.text == "" || weightTextField.text == ""){
            mainLabel.text = "키와 몸무게를 입력하세요 ;"
            return
        }
        let bmi = calculateBmi()
        let commentTuple = comment(bmi: bmi)

        guard let resultVC = storyboard?.instantiateViewController(withIdentifier: "result") as? SecondViewController else {return}

        resultVC.bmi = String(format: "%.2f", bmi)
        resultVC.comment = commentTuple.0
        resultVC.bgColor = commentTuple.1

        present(resultVC, animated: true)
    }

    func calculateBmi() -> Float{
        guard let height = Float(heightTextField.text!) else {return 0}
        guard let weight = Float(weightTextField.text!) else {return 0}

        let bmi = weight / ((height / 100) * (height / 100))
        return bmi
    }

    func getCommentAndBackgroundColor(bmi: Float) -> (String, UIColor){
        if(bmi < 18.5){
            return ("저체중", UIColor(displayP3Red: 22/255, green: 231/255, blue: 207/255, alpha: 1))
        }else if(bmi >= 18.5 && bmi < 22.9){
            return ("정상", UIColor(displayP3Red: 212/255, green: 251/255, blue: 121/255, alpha: 1))
        }else if(bmi >= 22.9 && bmi < 24.9){
            return ("과체중", UIColor(displayP3Red: 218/255, green: 127/255, blue: 163/255, alpha: 1))
        }else if(bmi >= 24.9 && bmi < 25.0){
            return ("중도비만", UIColor(displayP3Red: 255/255, green: 150/255, blue: 141/255, alpha: 1))
        }else{
            return ("고도비만", UIColor(displayP3Red: 255/255, green: 100/255, blue: 78/255, alpha: 1))
        }
    }
}
```

1. `ViewController` 클래스내에 `bmi: Float?` 타입의 저장속성을 하나 마련한다.
2. `ViewController` 클래스 내에 `bmi` 저장속성을 계산하는 로직과 bmi 수치에 따른 코멘트 반환 로직을 구현하여 포함시킨다.

프로젝트 규모가 장난감 수준이라서 문제가 없지만 하나의 뷰 컨트롤러 클래스에 모든 로직들을 포함시키게 되면 확장성 측면에서 관리가 어려워진다.

따라서 이 앱의 중심 로직이라고 할 수 있는 bmi와 관련된 데이터와 함수들을 외부 코드로 먼저 분리하는 것이다. Model과 Controller의 분리이다.

모델을 분리한다는 것은 데이터와 데이터를 다루는 함수를 함께 분리한다는 것이므로 역시나 인스턴스로 관리를 해야한다. 일반적으로 클래스로 분리한다.

모델을 분리할때 이름은 `~Manager`로 관리하며 특정 데이터를 관리한다는 관리자 측면에서 해당 이름을 붙인다.

```swift
// Model/Model.swift
// 앱의 규모가 매우 작으므로 구조체로 분리
struct BMICalculatorManager{
    var bmi: Float?

    // 구조체의 저장속성 값을 변경하기 위해서는 mutating 키워드가 필요하다.
    mutating func calculateBmi(height: String, weight: String){
        guard let height = Float(height) else {return}
        guard let weight = Float(weight) else {return}

        self.bmi = weight / pow(height / 100, 2)
    }

    func getBmi(){
        return self.bmi
    }

    func getCommentAndBackgroundColor(){
        // 위의 코드와 동일함..
    }
}
```

모델을 정의했으면 메인 뷰 컨트롤러에서 해당 모델을 불러온다. ViewController 클래스의 저장속성으로 `BMICalculatorManager` 인스턴스를 저장한다. 이후 비즈니스 로직과 관련된 부분들을 인스턴스 메서드 호출을 통해 적용하면 된다.

```swift
// Controllers/ViewController.swift
var bmiManager = BMICalculatorManager()

@IBAction func submitButtonTapped(_ sender: UIButton) {
    if(heightTextField.text == "" || weightTextField.text == ""){
        mainLabel.text = "키와 몸무게를 입력하세요 ;"
        return
    }

    // bmi 계산 로직 호출
    bmiManager.calculateBmi(height: heightTextField.text!, weight: weightTextField.text!)

    // 계산된 bmi 수치를 반환하는 로직
    let bmi = bmiManager.getBmi()

    // 코멘트와 배경색을 받아오는 로직
    let commentAndBackgroundColor = bmiManager.getCommentAndBackgroundColor(bmi: bmi)

    // 뷰 컨트롤러로 불러온 bmi매니저의 값들을 뷰에 표현
    guard let resultVC = storyboard?.instantiateViewController(withIdentifier: "result") as? SecondViewController else {return}

    resultVC.bmi = String(format: "%.2f", bmi)
    resultVC.comment = commentAndBackgroundColor.0
    resultVC.bgColor = commentAndBackgroundColor.1

    present(resultVC, animated: true)
}
```

모델의 형태를 어떻게 보느냐에 따라 bgColor와 comment 속성도 bmi와 관련된 데이터로 볼 수 있다. 이들을 휘발성으로 관리하지 않겠다고 한다면 모델에 대해 데이터만을 담는 구조체를 새로 정의한 뒤, 멤버와이즈 생성자를 통한 리팩토링을 한번 더 진행할 수 있다.

## 코드로 만든 UI를 MVC로 리팩토링하기

코드로 만든 로그인 화면 프로젝트에서는 비밀번호 또는 아이디와 관련된 비즈니스 로직이 없기 때문에 뷰와 컨트롤러 사이의 분리만 하면 된다. 뷰와 관련된 인스턴스를 뷰컨트롤러 내에 저장속성으로 마련했다면 이들을 모두 View 그룹으로 이동시키면 된다.

`UIView` 클래스를 상속한 커스텀 클래스로 묶어 관리하면 된다.

:::warning present MVC

UI를 코드로 만들때 addTarget 메서드와 같이 present로직이 필요한 코드는 `View` 클래스가 아닌 `ViewController` 클래스에 위치해야한다. 이때 addTarget의 셀렉터로 실제 동작하는 함수를 연결해야 하는데, 이러한 문제로 인해 `addTarget`또한 ViewController 클래스 내에 위치시켜야 한다.

뷰를 상속한 상태에서 텍스트필드 델리게이트 등과 같은 프로토콜은 채택 가능하므로 이에 해당하는 셀렉터 함수들은 분리하여 그대로 구현해도 문제가 없다.

뷰와 뷰 컨트롤러를 분리한 뒤 셀렉터를 연결하는 방법은 아래와 같다.

```swift
private let loginView = LoginView()

override func loadView() {
    view = loginView
}

override func viewDidLoad() {
    super.viewDidLoad()
    // Do any additional setup after loading the view.
}
```

뷰 컨트롤러에는 `loadView`라는 함수가 존재하는데 이때 뷰컨트롤러의 저장속성으로 초기화 되어 있는 뷰 관련 객체를 최상위 `view` 객체에 집어넣어주는 것이다.

이때 `LoginView` 내의 UI요소 중 뷰 컨트롤러에서 접근해야할 요소들은 private하게 선언하면 당연히 접근이 안되고 셀렉터 연결도 불가능하므로 주의하자.

:::

`LoginView`와 같은 클래스 내에서 각종 UIView 요소들의 오토레이아웃 설정을 할 때에 기존에는 아래와 같은 코드를 작성했었다.

```swift
passwordResetButton.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    passwordResetButton.topAnchor.constraint(equalTo: view.bottomAnchor, constant: 10),
    passwordResetButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 30),
    passwordResetButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -30)
])
```

버튼을 최상위 view객체를 기준으로 좌표 정렬을 할 때에 `view.Anchor요소`를 통해 정렬을 진행했었다. 하지만 클래스를 분리했으므로 좌표 정렬을 `LoginView`를 기준으로 하게 되는데 이때 `present` 메서드를 사용하기 위해 `loadView`메서드에서 뷰 컨트롤러와 뷰를 연결했던 것처럼 `LoginView`객체를 뷰 컨트롤러와 연결하게 되면 `LoginView` 클래스 내에서 `self` 키워드는 최종적으로 뷰컨트롤러의 최상위 view를 가리키게 된다.

이때 LoginView 클래스 내에서 equalTo에 대한 파라미터로 `self.bottomAnchor`라고 전달해도 되지만 어차피 클래스 인스턴스 자기 자신을 가리킬 것이 자명하기 때문에 해당 키워드는 생략하여 아래와 같이 나타내도 된다.

```swift
passwordResetButton.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    passwordResetButton.topAnchor.constraint(equalTo: bottomAnchor, constant: 10),
    passwordResetButton.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 30),
    passwordResetButton.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -30)
])
```

또한 뷰와 뷰컨트롤러를 분리했을때 필요한 것은 생성자 함수 오버라이딩이다.

```swift
override init(frame: CGRect) {
    super.init(frame: frame)

    emailTextField.delegate = self
    passwordTextField.delegate = self

    setupUI()
}

required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
}
```

**반드시 뷰 클래스 내에 위 두 함수를 구현해야 한다.** `override init(frame:)` 함수는 커스텀 UIView에 대한 생성자 함수이고 기존 뷰 컨트롤러의 `override viewDidLoad()` 메서드와 동일한 역할을 한다고 보면 된다.

또한 `UIView`가 어딘가로부터 상속받는 필수생성자 `required init?(coder: NSCoder)`를 구현해줘야 하는데 이는 FatalError가 xcode상에 발생했을때 Fix버튼을 클릭하면 위와 같은 코드가 자동으로 삽입된다.

init(coder: NSCoder)에 대해서는 [다음 문서](https://medium.com/@b9d9/required-init-coder-nscoder-%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C-b67ddfc628)를 참조해보자.

init(coder: NSCoder)는 스토리보드로 UI를 구성할때 사용되는 생성자인데, UIView 상속을 통해 커스텀 뷰 클래스를 코드로 작성할때 명시적으로 이를 나타내기 위한 방편이라고 이해하면 될 것 같다.

:::tip 서브뷰 버튼 타겟을 상위 컨트롤러에 등록하기

MVC패턴에 따라 뷰컨트롤러에 커스텀뷰 인스턴스를 등록한 상황에서 커스텀 뷰의 버튼 액션중 화면 전환을 위한 present 등의 메서드가 UIView 클래스에서는 사용이 불가능하다.

따라서 커스텀뷰 내의 버튼 액션을 뷰 컨트롤러에 연결해야 한다.

뷰 컨트롤러의 `loadView` 시점에 `view = CustomViewInstance`로 뷰를 교체해주고 난 뒤 뷰컨트롤러 안에서 **뷰 인스턴스 버튼에 직접 접근하여 addTarget을 설정한다.**

```swift
override func loadView() {
    view = detailView
}

// ...

func setupButtonAction(){
    // 1. 뷰 인스턴스에 접근
    // 2. 뷰 인스턴스 내의 버튼 UI에 직접 접근 후 addTarget을 뷰 컨트롤러로 지정
    detailView.updateButton.addTarget(self, action: #selector(saveButtonTapped), for: .touchUpInside)
}
```

:::

## Reference

1. [앨런 Swift 문법 마스터스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8-%EC%95%B1%EB%A7%8C%EB%93%A4%EA%B8%B0/dashboard)
2. [required init?(coder: NSCoder) 에 대해서](https://medium.com/@b9d9/required-init-coder-nscoder-%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C-b67ddfc628)
