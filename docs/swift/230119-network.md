---
title: Swift - 네트워킹
---

## GET

```swift
func getMethod() {

    // URL구조체 만들기
    guard let url = URL(string: "URL주소") else { return }

    // URL요청 생성
    // 메서드 지정
    var request = URLRequest(url: url)

    // URLRequest 객체 httpMethod 속성만 선택하면 된다
    request.httpMethod = "GET"


    // 요청을 가지고 작업세션시작
    URLSession.shared.dataTask(with: request) { data, response, error in

        // 에러가 없어야 넘어감
        if error == nil else {
            print("Error: error calling GET")
            print(error?.localizedDescription)
            return
        }
        // 옵셔널 바인딩
        guard let safeData = data else {
            print("Error: Did not receive data")
            return
        }
        // HTTP 200번대 정상코드인 경우만 다음 코드로 넘어감
        // 범위 ~= 특정값
        guard let response = response as? HTTPURLResponse, (200 ..< 299) ~= response.statusCode else {
            print("Error: HTTP request failed")
            return
        }

        // 원하는 모델이 있다면, JSONDecoder로 decode코드로 구현 ⭐️
        print(String(decoding: safeData, as: UTF8.self))


    }.resume()     // 시작
}
```

## POST

```swift
func postMethod() {

    guard let url = URL(string: "URL 주소") else {
        print("Error: cannot create URL")
        return
    }

    // 업로드할 모델(형태)
    // Codable 프로토콜 채택
    struct UploadData: Codable {
        let name: String
        let salary: String
        let age: String
    }

    // 실제 업로드할 (데이터)인스턴스 생성
    let uploadDataModel = UploadData(name: "Jack", salary: "3540", age: "23")

    // 모델을 JSON data 형태로 변환
    guard let jsonData = try? JSONEncoder().encode(uploadDataModel) else {
        print("Error: Trying to convert model to JSON data")
        return
    }

    // URL요청 생성
    var request = URLRequest(url: url)
    request.httpMethod = "POST"

    // 요청 헤더 설정
    request.setValue("application/json", forHTTPHeaderField: "Content-Type") // 요청타입 JSON
    request.setValue("application/json", forHTTPHeaderField: "Accept") // 응답타입 JSON

    // HTTP 바디에 JSON 인코딩 데이터 전달
    request.httpBody = jsonData


    // 요청을 가지고 세션 작업시작
    URLSession.shared.dataTask(with: request) { data, response, error in
        // 에러가 없어야 넘어감
        guard error == nil else {
            print("Error: error calling POST")
            print(error!)
            return
        }
        // 옵셔널 바인딩
        guard let safeData = data else {
            print("Error: Did not receive data")
            return
        }
        // HTTP 200번대 정상코드인 경우만 다음 코드로 넘어감
        guard let response = response as? HTTPURLResponse, (200 ..< 299) ~= response.statusCode else {
            print("Error: HTTP request failed")
            return
        }

        // 원하는 모델이 있다면, JSONDecoder로 decode코드로 구현 ⭐️
        print(String(decoding: safeData, as: UTF8.self))

    }.resume()   // 시작
}
```

DELETE, PUT은 GET, POST와 유사하게 작성하면 된다.

## 콜백함수 설계

네트워크 요청을 주고받는 함수는 비동기적으로 처리된다. 비동기 요청 결과값을 함수의 단순 리턴값으로만 사용하면 의미가 없게 된다.

**비동기 함수는 리턴형으로 선언하는 것이 아니라 콜백 함수로 설계해야 한다.**

함수 파라미터에 콜백 함수를 전달하는 형태로 정의한다. 스택 프레임에 푸쉬 되면서 관리되는 함수 특성상 최상위 호출함수가 리턴되면 내부 함수들은 자동으로 pop out 된다. 파라미터로 전달된 파라미터를 `@escaping`키워드 없이 선언하게 되면 역시나 함수가 pop되므로 내부 결과값을 추적할 수 없게 된다.

`@escaping` 키워드를 통해 함수 컨텍스트를 힙 메모리에서 더 유지하게 된다. (요청이 완전히 이루어진 시점에 제대로된 동작을 시키기 위함)

```swift
func getMethod(completionHandler: ([Data]?) -> Void) {

    // URL구조체 만들기
    guard let url = URL(string: "URL주소") else {
        completionHandler(nil)
        return
    }

    // URL요청 생성
    // 메서드 지정
    var request = URLRequest(url: url)

    // URLRequest 객체 httpMethod 속성만 선택하면 된다
    request.httpMethod = "GET"


    // 요청을 가지고 작업세션시작
    URLSession.shared.dataTask(with: request) { data, response, error in

        // 에러가 없어야 넘어감
        if error == nil else {
            completionHandler(nil)
            return
        }
        // 옵셔널 바인딩
        guard let safeData = data else {
            completionHandler(nil)
            return
        }
        // HTTP 200번대 정상코드인 경우만 다음 코드로 넘어감
        // 범위 ~= 특정값
        guard let response = response as? HTTPURLResponse, (200 ..< 299) ~= response.statusCode else {
            completionHandler(nil)
            return
        }

        // 원하는 모델이 있다면, JSONDecoder로 decode코드로 구현 ⭐️
        do{
            let decoder = JSONDecoder()
            let data = try decoder.decode(클래스또는구조체.self ,safeData)
            completionHandler(data)
            return
        } catch{
            completionHandler(nil)
        }
    }.resume()     // 시작
}

getMethod{ response in
    guard let responseData = response else {return}
    dump(responseData)
}
```

## Reference

1. [앨런 Swift 문법 마스터스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8-%EC%95%B1%EB%A7%8C%EB%93%A4%EA%B8%B0/dashboard)
2. [What is @escaping in Swift?](https://www.codingem.com/escaping-in-swift/)
