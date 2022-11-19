---
title: Swift - 네트워크 통신
---

## iOS 네트워크 통신 과정

iOS에서 네트워크 통신을 위해서는 아래와 같은 과정이 존재한다.

1. URL 등록 - 요청할 URL을 스위프트의 URL타입 구조체로 바꿔줘야 한다. URL구조체 생성자는 옵셔널을 리턴
2. URLSession 객체로 요청 생성
3. dataTask로 등록한 URL을 URLSession과 연결
4. 요청 보내기

```swift
let myUrl = "http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=발급받은 키값&targetDt=20210201"

// 1. URL 구조체 생성
let structUrl = URL(string: movieURL)! // 옵셔널

// 2. URL Session 생성 - 1 기본 방법
let session = URLSession(configuration: .default) // 기본세팅으로 세션 생성

// 2. URL Session 생성 - shared 싱글톤 생성
// 더 자주사용함, 싱글톤 객체
// 네트워크 통신은 이 객체가 모두 담당하게 된다
let session = URLSession.shared

// 3. 세션에 접근하여 URL을 연결한다
// session.dataTask(with: 위에 생성한 URL구조체, completionHandler: 콜백함수를 클로저로 정의)
// completionHandler type : (Data?, URLResponse?, Error?) -> Void
// 콜백 핸들러의 파라미터는 옵셔널 Data, 옵셔널 URLResponse, 옵셔널 Error가 있다
// 태스크 생성 후 실제로 태스크를 시작해야함. 변수에 할당
let task = session.dataTask(with: structUrl){ data, response, error in
    if error != nil {
        print(error?.localizedDescription) // 에러반환시 출력한번 하고 리턴하기
        return
    }

    guard let safeData = data else {return}

    // 문자열 형태로 디코딩해줘야 콘솔에 출력 가능
    print(String(decoding: safeData, as: UTF8.self))
}

// 4. 태스크 시작
task.resume()

// 또는 태스크 생성과 동시에 resume() 메서드 호출하기도 함
session.dataTask(...).resume()
```
