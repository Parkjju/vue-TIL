---
title: Swift - 컬렉션뷰
---

## 컬렉션 뷰

검색결과를 표현해주는 방법으로 테이블 뷰를 사용할 수도 있고 컬렉션 뷰를 사용할 수도 있다. 테이블 뷰는 단일 열에 수직 스크롤 형태로만 데이터를 표시하는 뷰이다. 컬렉션 뷰는 열과 행 모두 그 수를 커스텀할 수 있다. 이렇게 둘 사이의 레이아웃 차이를 만들 수 있게 된 이유는 `flowLayout` 객체때문이다.

```swift
// SearchViewController.swift
@IBOutlet weak var collectionView: UICollectionView!

// 컬렉션뷰 flowLayout객체 생성
let flowLayout = UICollectionViewFlowLayout()

override func viewDidLoad() {
    super.viewDidLoad()

    // Do any additional setup after loading the view.
    view.backgroundColor = .white
    setupCollectionView()
}

func setupCollectionView(){
    collectionView.dataSource = self
    collectionView.backgroundColor = .white

    flowLayout.scrollDirection = .vertical

    let collectionCellWidth = (UIScreen.main.bounds.width - CVCell.spacingWidth * (CVCell.cellColumns - 1) ) /  CVCell.cellColumns

    flowLayout.itemSize = CGSize(width: collectionCellWidth, height: collectionCellWidth)
    flowLayout.minimumInteritemSpacing = CVCell.spacingWidth
    flowLayout.minimumLineSpacing = CVCell.spacingWidth

    collectionView.collectionViewLayout = flowLayout
}
```

컬렉션 뷰는 `UICollectionView`와 `UICollectionViewLayout` 인스턴스를 생성한 뒤 해당 인스턴스의 `컬렉션뷰-인스턴스.collectionViewLayout`이라는 속성에 생성했던 `UICollectionViewLayout` 인스턴스를 할당해주는 패턴을 갖는다.

컬렉션뷰 레이아웃 인스턴스 할당 전 레이아웃과 관련된 설정을 이미 마친 상태여야 한다.

예시 코드에서 사용된 레이아웃 속성들은 아래와 같다.

1. `scrollDirection`: 전체 컬렉션뷰 스크롤 방향
2. `itemSize`: 컬렉션뷰 각 셀의 크기
3. `minimumInteritemSpacing`: 셀 간 가로간격 (the flow layout uses the value in this property to set the spacing between items in the same line)
4. `minimumLineSpacing`: 각 행간 간격 (the flow layout uses the value in this property to set the spacing between lines in a section.)
5. `UIScreen.main.bounds.size`: 화면 크기를 벡터값으로 반환받는다. `width`, `height`로 너비와 높이를 각각 얻을 수 있다.

셀 너비를 계산한 방식은 셀 사이의 너비를 제외한 스크린사이즈 전체 너비를 컬럼 수로 나눠주는 로직이다.

## 셀 이미지 임베딩

서버 통신을 통해 얻어오는 이미지는 로우데이터가 아닌 URL이다. 앱 내에서 해당 이미지를 임베딩하기 위해서는 어떻게 해야할까?

일반적인 비동기 통신 코드에 에러처리를 모두 해둔 뒤, 최종 데이터를 받아오는 코드에서 기존 예시에서는 JSON을 다뤘다면 이미지를 로드할때는 받아온 데이터 로우데이터임을 가정하고 다루면 되는 것이다.

```swift
func getImage(){
    guard let url = URL(string: urlString) else {return}

    let session = URLSession(configuration: .default)

    let task = session.dataTask(with: url){(data, response, error) in
        if error != nil{
            print(error!)
            return
        }

        guard let safeData = data else {
            return
        }

        // 이미지 얻어서 원하는대로 처리
        // UIImage(data:) 생성자 함수 사용하면 됨
        UIImage(data: safeData)
    }
}
```

위와 같은 비동기통신 코드를 셀에서 컬렉션뷰나 테이블뷰 셀에서 사용한다고 가정하면 위의 비동기통신 코드는 잘못 설계된 것이다.

```swift
extension ViewController: UITableViewDataSource{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return musicArrays.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = musicTableView.dequeueReusableCell(withIdentifier: Cell.musicCellIdentifier, for: indexPath) as! MusicCell

        cell.imageUrl = musicArrays[indexPath.row].previewUrl
        cell.songNameLabel.text = musicArrays[indexPath.row].trackName!.count > 15 ? "\(musicArrays[indexPath.row].trackName)..." : musicArrays[indexPath.row].trackName
        cell.artistNameLabel.text = musicArrays[indexPath.row].artistName
        cell.albumNameLabel.text = musicArrays[indexPath.row].collectionName
        cell.releaseDateLabel.text = musicArrays[indexPath.row].releaseDateString

        cell.selectionStyle = .none


        return cell
    }
}
```

예를 들어 `func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell` 함수에서 셀 인스턴스에 대해 `url`을 통한 접근이 아닌 실제 이미지 데이터를 델리게이트 메서드에서 즉각 비동기통신하도록 설계하면 안된다는 것이다.

그 이유는 바로 `dequeueReusableCell` 메서드에 있다. 테이블뷰, 컬렉션뷰는 각 셀이 재사용되기 때문에 큐의 front에서 pop된 셀이 tail에서 재사용되어 push된다. 이때 데이터 초기화 과정이 제대로 이루어지지 않게 되면 재사용되는 데이터가 그대로 셀에 포함되는 경우가 생긴다.

위 코드에서 재사용하는 셀을 정의함에 있어서 `imageUrl` 속성을 사용하는 것이 아닌 실제 로우데이터를 얻기위한 비동기통신 코드를 삽입하게 된다면 내부 스케줄링에 따라 front 또는 tail에서 pop된 이미지가 나중에서야 재사용되어 push되고, 결국 엉뚱한 데이터를 화면상에 표기하게 되는 문제가 발생한다.

테이블 뷰나 컬렉션 뷰 셀에 대한 정의 안에 비동기 통신 코드를 포함하면 안된다는 것이다! 또한, 이에 더하여 셀 정의시 기존 데이터들은 빈 데이터, 즉 메타데이터에 맞는 초기값으로 설정해주는 코드도 추가해주는게 바람직하다. 자세한 내용은 [다음 문서를](https://sihyungyou.github.io/iOS-dequeueReusableCell/) 참조하자.

이를 개선하기 위해서는 이미지 셀 클래스의 `url` 속성감시자 `didSet`을 구현하고, URL 속성값이 세팅된 이후 이미지를 로드하면 된다.

```swift
import UIKit

final class MusicCollectionViewCell: UICollectionViewCell {

    @IBOutlet private weak var mainImageView: UIImageView!

    // 이미지 URL을 전달받는 속성
    // imageUrl 저장속성이 세팅되면 loadImage 메서드를 실행한다.
    var imageUrl: String? {
        didSet {
            loadImage()
        }
    }

    // URL ===> 이미지를 셋팅하는 메서드
    private func loadImage() {
        guard let urlString = self.imageUrl, let url = URL(string: urlString)  else { return }

        DispatchQueue.global().async {
            guard let data = try? Data(contentsOf: url) else { return }

            guard self.imageUrl! == url.absoluteString else { return }

            DispatchQueue.main.async {
                self.mainImageView.image = UIImage(data: data)
            }
        }
    }

    // 셀이 재사용되기 전에 호출되는 메서드
    override func prepareForReuse() {
        super.prepareForReuse()
        // 일반적으로 이미지가 바뀌는 것처럼 보이는 현상을 없애기 위해서 실행 ⭐️
        self.mainImageView.image = nil
    }
}

```

위 코드에서 `loadImage` 메서드가 실행되면 인스턴스의 imageUrl 저장속성을 옵셔널 바인딩하여 문자열을 추출하고, 추출한 URL 문자열을 URL 객체로 생성한다.

이미지 객체를 생성하는 코드가 비동기적으로 직접 URL에 데이터를 전달받고 `UIImage(data: data)` 생성자 함수를 통해 만들어진 이미지 인스턴스를 리턴하는 방식도 가능하지만 더 간단하게 `Data`라는 타입의 `contentsOf` 생성자 함수를 사용하면 된다.

`try ~ catch`문을 통해 `Data` 객체의 생성을 시도하면, UIImage타입의 객체에 대해서 url에 접속 후 만들어진 이미지 로우데이터를 반환받을 수 있게 된다.

이때 `Data` 객체 생성자 함수 자체는 동기적으로 동작하기 때문에 반드시 디스패치큐 작업목록 아래에 전달해야한다.

이미지 로우데이터가 생성되면 `UIImage(data:)` 생성자 함수를 통해 이미지 인스턴스를 하나 만든 뒤 이미지 뷰에 연결하면 된다.

중간에 `guard self.imageUrl! == url.absoluteString else { return }` 코드도 보이는데, 이는 인스턴스의 url 저장속성과 이 저장속성을 URL 객체로 만든 인스턴스의 url 문자열을 비교하는 로직이다. 셀 재사용 과정에서 인스턴스 이미지 url과 URL객체의 url이 다르면 셀 배치가 잘못된 것이므로 그 즉시 함수를 탈출해야한다.

또한 셀 인스턴스는 재사용되는 것이 필수적이므로, 스위프트 자체적으로 `prepareForReuse`를 제공한다. 함수를 오버라이딩 한 뒤 초기화할 저장속성들을 찾아 해당 메서드 안에서 초기값으로 초기화해주면 된다.

## Reference

1. [앨런 Swift 문법 마스터스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8-%EC%95%B1%EB%A7%8C%EB%93%A4%EA%B8%B0/dashboard)
2. [유셩장 - dequeueReusableWithIdentifier](https://sihyungyou.github.io/iOS-dequeueReusableCell/)
