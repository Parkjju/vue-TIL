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

## Reference

1. [앨런 Swift 문법 마스터스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8-%EC%95%B1%EB%A7%8C%EB%93%A4%EA%B8%B0/dashboard)
