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
        if error != nil else {
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

:::tip 네임스페이스
네트워크 요청 URL이나 각종 UI 요소 `identifier`값들을 저장할때 네임스페이스 패턴을 활용하게 된다.

프로젝트 루트에 `Helpers`폴더를 생성하고 (이름은 상관 없음) `constant.swift` 파일을 생성한 뒤 구조체 또는 열거형 타입을 정의한다. 각 속성들을 타입 속성으로 정의한다.

구조체 정의시에는 생성자를 프라이빗으로 생성해둠으로써 인스턴스를 외부에서 생성하지 못하도록 억제한다. 타입 속성만 활용할 것이기 때문이다.

```swift
// 열거형의 경우 case를 만드는 것이 아님.
// case를 갖고 외부에서 MusicApi.case로 접근하게 되는 경우 인스턴스가 생성되기 때문이다.
public enum MusicApi{
    static let requestURL = "https://..."
    static let musicParam = "파라미터"
}

public struct Cell{
    static let musicCellIdentifier = "MusicCell"
    static let musicCollectionViewIdentifier = "MusicCollectionViewCell"
    private init() {}
}

public struct CVCell{
    static let spacingWidth: CGFloat = 1
    static let cellColumns: CGFloat = 3
    private init() {}
}
```

:::

위의 예시로 제시된 코드는 분리가 필요하다. url을 관리하는 부분과 실제 데이터를 fetch해오는 부분을 분리하여 코드를 작성한다.

```swift
import Foundation

//MARK: - 네트워크에서 발생할 수 있는 에러 정의

enum NetworkError: Error {
    case networkingError
    case dataError
    case parseError
}

//MARK: - Networking (서버와 통신하는) 클래스 모델

final class NetworkManager {

    // 여러화면에서 통신을 한다면, 일반적으로 싱글톤으로 만듦
    static let shared = NetworkManager()
    // 여러객체를 추가적으로 생성하지 못하도록 설정
    private init() {}

    //let musicURL = "https://itunes.apple.com/search?media=music"

    typealias NetworkCompletion = (Result<[Music], NetworkError>) -> Void

    // 네트워킹 요청하는 함수 (음악데이터 가져오기)
    func fetchMusic(searchTerm: String, completion: @escaping NetworkCompletion) {
        let urlString = "\(MusicApi.requestUrl)\(MusicApi.mediaParam)&term=\(searchTerm)"
        print(urlString)

        performRequest(with: urlString) { result in
            // result에 대한 처리는 switch를 통해 추가 처리를 할 수 있다.
            switch result{
            case .success:
                completion(result)
            case .failure(let error):
                switch error{
                case .networkingError:
                // ....
                }
            }
        }

    }

    // 실제 Request하는 함수 (비동기적 실행 ===> 클로저 방식으로 끝난 시점을 전달 받도록 설계)
    private func performRequest(with urlString: String, completion: @escaping NetworkCompletion) {
        //print(#function)
        guard let url = URL(string: urlString) else { return }

        let session = URLSession(configuration: .default)

        let task = session.dataTask(with: url) { (data, response, error) in
            if error != nil {
                print(error!)
                completion(.failure(.networkingError))
                return
            }

            guard let safeData = data else {
                completion(.failure(.dataError))
                return
            }

            // 메서드 실행해서, 결과를 받음
            if let musics = self.parseJSON(safeData) {
                print("Parse 실행")
                completion(.success(musics))
            } else {
                print("Parse 실패")
                completion(.failure(.parseError))
            }
        }
        task.resume()
    }

    // 받아본 데이터 분석하는 함수 (동기적 실행)
    private func parseJSON(_ musicData: Data) -> [Music]? {
        //print(#function)

        // 성공
        do {
            // 우리가 만들어 놓은 구조체(클래스 등)로 변환하는 객체와 메서드
            // (JSON 데이터 ====> MusicData 구조체)
            let musicData = try JSONDecoder().decode(MusicData.self, from: musicData)
            return musicData.results
        // 실패
        } catch {
            print(error.localizedDescription)
            return nil
        }
    }
}
```

```swift
// 네트워크 매니저 인스턴스를 호출하여 실질적으로 비동기 동작이 시작되는 구간
func setupData(){
    networkManager.fetchMusic(searchTerm: "jazz") { result in
        switch result{
        case .success(let musicData):
            dump(musicData)
            self.musicArrays = musicData

            DispatchQueue.main.async {
                self.musicTableView.reloadData()
            }

        case .failure(let error):
            dump(error)
        }
    }
}
```

:::warning reloadData
스위프트에서 **클로버 기반의 URLSession** 네트워크 통신 코드를 작성하면 자동으로 비동기적인 동작이 이루어진다. (추후 async await 문법도 적용이 가능하다.)

> Traditionally, when we want to make a network request, we must use the closure-based URLSession APIs to perform the request asynchronously so that our apps can be responsive while waiting for it to complete... [SWIFT SENPAI - Making Network Requests with Async/await in Swift]

UI와 관련된 코드로 테이블뷰의 기존 데이터를 업데이트하는 reloadData 메서드도 있는데, 이를 호출할때 네트워크통신 코드 내에서 호출하게 되면 오류가 발생한다. 엄밀히 따지면 UI를 업데이트해주는 코드를 **메인 쓰레드에 위치시켜야 한다.**

위의 비동기 실제 호출 예시코드에서 `Result.success` 케이스로 `completion`파라미터에 전달한 콜백함수를 통해 데이터의 전달 결과가 인스턴스 속성으로 저장되고 나면 `DispatchQueue.main.async` 클로저를 통해 어떤 UI요소를 업데이트 할지 지정해야한다. 위의 예시 코드에서는 테이블 뷰를 리로딩해주었다.
:::

네트워크 콜백 함수 설계시 `Result` 타입을 사용한다.

1. fetchMusic 메서드를 호출한다.
2. fetchMusic 내에서 performRequest를 다시 호출한다. 이때 타입 앨리어스 선언된 `NetworkCompletion`에 따라 클로저를 작성하게 된다. 클로저 내에서 `fetchMusic`호출시 데이터 통신 성공 함수로 전달된 클로저를 다시 전달한다.
3. `performRequest`의 `completion`파라미터로 전달된 클로저 함수는 데이터 통신 성공에 따라 Result의 열거형 케이스인 `.success`를 파라미터에 담아 `completion` 콜백을 호출하거나 `.failure`를 파라미터에 담아 `completion` 콜백을 호출하게 된다.

Result 타입 복습을 위해 [다음 페이지](https://parkjju.github.io/vue-TIL/swift/221123-result.html)를 참조하자.

## Reference

1. [앨런 Swift 문법 마스터스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8-%EC%95%B1%EB%A7%8C%EB%93%A4%EA%B8%B0/dashboard)
2. [What is @escaping in Swift?](https://www.codingem.com/escaping-in-swift/)
3. [Swift - Result 타입](https://parkjju.github.io/vue-TIL/swift/221123-result.html)
4. [SWIFT SENPAI - Making Network Requests with Async/await in Swift](https://swiftsenpai.com/swift/async-await-network-requests/)
