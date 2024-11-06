---
title: Concurrency - async await
tags: ['Swift', 'Concurrency']
---

## async await

기존 비동기 함수는 콜백 클로저를 통해 데이터를 돌려받아야 했다.

```swift
func getImage() -> UIImage? {
    var image: UIImage? = nil

    DispatchQueue.global().async {
        sleep(5)
        image = UIImage(systemName: "heart")
    }

    return image
}
```

위 코드를 실행하면 리턴값이 매번 nil일 수 밖에 없다. 반면 async await을 사용하면 아래와 같이 함수를 작성할 수 있다.

```swift
func getImage() async -> UIImage? {
    var image: UIImage? = nil

    sleep(5)
    image = UIImage(systemName: "heart")

    return image
}

Task {
    // 아래 작업은 순차적으로 실행된다.
    let image1 = await getImage()
    let image2 = await getImage()
}
```

함수를 async로 선언하여 내부에 비동기 작업이 있음을 나타낸다. 이후 해당 async 함수를 호출할 때는 반드시 `Task` 작업 단위 내에서 `await`키워드를 붙여서 함수를 호출해야 한다.
