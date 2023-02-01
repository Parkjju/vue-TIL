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

## Reference

1. [앨런 Swift 문법 마스터스쿨](https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8-%EC%95%B1%EB%A7%8C%EB%93%A4%EA%B8%B0/dashboard)
