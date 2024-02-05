---
title: Snack 10호 - Swift TextView 플레이스홀더
tags: ['Snack', 'Swift', 'UIKit']
---

## 텍스트뷰

스위프트에서 텍스트뷰는 플레이스홀더를 제공하지 않는다.

델리게이트 프로토콜에서 플레이스 홀더 관련 로직을 따로 구현해주는 예제 코드를 사용하자.

```swift
extension DetailViewController: UITextViewDelegate {
    func textViewDidBeginEditing(_ textView: UITextView) {
        if textView.text == "텍스트를 여기에 입력하세요 :)" {
            textView.text = nil
            textView.textColor = .black
        }
    }

    // 입력이 끝났을때
    func textViewDidEndEditing(_ textView: UITextView) {
        if textView.text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            textView.text = "텍스트를 여기에 입력하세요."
            textView.textColor = .lightGray
        }
    }
}
```

:::tip trimmingCharacters

String 타입 데이터는 trimmingCharacters 메서드를 사용할 수 있고 `in` 파라미터에 열거형 케이스 `whitespacesAndNewlines`를 전달하면 문자열기준 양쪽 공백과 개행문자를 트리밍해준다.

:::

## Reference

1. [iOS - textView 플레이스홀더 사용법](https://ios-development.tistory.com/693)
