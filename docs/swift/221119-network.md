---
title: Swift - 네트워크 통신
tags: ['Swift', 'UIKit']
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

응답코드 검사를 위한 태스크 예시 코드도 있다.

```swift
session.dataTask(with: url){ (data , response, error) in
    // 에러처리

    guard let response = response as? HTTPURLResponse, (200 ..< 299) ~=

    response.statusCode else{
        print("ERROR: HTTP request failed")
        return
    }

}
```

## JSON Parsing

[다음 사이트](https://app.quicktype.io/)를 이용하면 JSON 데이터를 클래스로 만드는 작업을 편하게 진행할 수 있다.

```swift
// 사용하려는 구조체 형태
struct MovieData: Codable {
    let boxOfficeResult: BoxOfficeResult
}

struct BoxOfficeResult: Codable {
    let dailyBoxOfficeList: [DailyBoxOfficeList]
}

struct DailyBoxOfficeList: Codable {
    let rank: String
    let movieNm: String
    let audiCnt: String
    let audiAcc: String
    let openDt: String
}

func parseJSON(_ movieData: Data) -> [DailyBoxOfficeList]? {

    do {
        // 스위프트5
        // 자동으로 원하는 클래스/구조체 형태로 분석
        // JSONDecoder
        let decoder = JSONDecoder()

        let decodedData = try decoder.decode(MovieData.self, from: movieData)

        return decodedData.boxOfficeResult.dailyBoxOfficeList

    } catch {

        return nil
    }
}
```

JSONDecoder 객체를 사용하여 데이터를 조정한다. 서버와 데이터를 주고받기 위해서는 프로토콜을 채택해야 하는데, 데이터 -> 클래스/구조체로 파싱할때에는 Decodable, 클래스/구조체 -> 데이터로 파싱할때는 Encodable 프로토콜을 채택해야 하고, 위의 개념 둘 다를 포함하는 프로토콜이 **Codable**이다.

또한 Codable 프로토콜이 채택된 클래스/구조체에 대한 인스턴스만 `JSONDecoder()`에서 다룰 수 있다.

:::tip dump
콘솔에 출력시 print보다 dump를 사용하면 더 깔끔하게 정리된 형태를 볼 수 있다.
:::

## Reference

1. [인프런 - 앨런 swift 문법 마스터 스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard)
2. [Side Table in Swift](https://sihyungyou.github.io/iOS-side-table/)
