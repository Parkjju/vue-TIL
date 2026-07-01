---
title: Snack - [SwiftUI] Layout 프로토콜로 Chip Flow 배치 구현하기
tags: ['Swift', 'SwiftUI']
---

## 개요

iOS 앱 온보딩 화면에서 장르 선택 칩(chip)을 여러 개 보여줘야 했다. 칩마다 텍스트 길이가 달라서 너비가 제각각이고, 화면 폭을 넘으면 자동으로 다음 줄로 넘어가야 하는 "flow-wrap" 배치가 필요했다.

UIKit이었다면 `UICollectionViewFlowLayout`을 썼겠지만, SwiftUI에는 이런 가변 너비 아이템을 자동으로 줄바꿈해주는 기본 컴포넌트가 없다. `LazyVGrid`는 셀 폭을 균일하게 맞추는 성격이라 칩처럼 너비가 들쭉날쭉한 아이템엔 어색하다. 결국 iOS 16+ `Layout` 프로토콜로 커스텀 컨테이너를 직접 구현해야 했다.

## Layout 프로토콜 기본 구조

`Layout`은 `VStack`/`HStack`처럼 여러 자식 뷰를 담는 컨테이너를 직접 만들 때 쓰는 프로토콜이다. 요구 메서드는 두 개뿐이다.

```swift
struct FlowLayout: Layout {
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        // 이 레이아웃 전체가 차지할 크기를 계산해서 리턴
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        // 각 자식 뷰를 실제 좌표에 배치
    }
}
```

역할이 명확히 나뉜다.

-   `sizeThatFits` — "나 전체 크기가 얼마나 필요해?"에 답하는 **측정** 단계. 아직 배치는 안 하고 크기만 계산한다.
-   `placeSubviews` — 실제로 각 subview를 `(x, y)` 좌표에 놓는 **배치** 단계.

:::tip 왜 두 메서드가 따로 있나
SwiftUI는 이 둘을 서로 다른 시점에 독립적으로 호출한다. 하나가 계산한 결과를 다른 하나가 자동으로 넘겨받는 구조가 아니라서, `placeSubviews`도 배치를 위해 다시 크기 계산이 필요하다. 뒤에서 다룰 "줄 나누기 로직 중복 호출" 문제가 여기서 비롯된다.
:::

## Subviews와 LayoutSubview — 실제 뷰가 아니라 프록시

```swift
FlowLayout(spacing: 8) {
    ForEach(genres) { genre in
        DSGenreChip(...)
    }
}
```

이렇게 쓰면 `subviews` 파라미터엔 실제 `DSGenreChip` 인스턴스가 들어오는 게 아니라, SwiftUI가 만들어주는 **`LayoutSubview`라는 프록시 객체들의 컬렉션**이 들어온다. 칩이 10개면 `subviews.count == 10`이다.

`FlowLayout` 입장에서는 안에 뭐가 들어오든(`DSGenreChip`이든 `Text`든) 상관없이 똑같은 방식으로 다뤄야 한다. 그래서 SwiftUI가 실제 뷰 타입 정보는 감추고, 레이아웃에 필요한 기능만 노출하는 프록시를 대신 준다.

`LayoutSubview`로 할 수 있는 것:

| 메서드/프로퍼티                    | 용도                                          |
| ----------------------------------- | --------------------------------------------- |
| `sizeThatFits(_:)`                  | 크기 물어보기                                 |
| `place(at:anchor:proposal:)`        | 위치에 배치하기                               |
| `priority`                          | `.layoutPriority()` 모디파이어로 지정한 우선순위 조회 |
| `dimensions(in:)`                   | 정렬 가이드(`VerticalAlignment` 등) 값 조회   |

이때 리턴되는 크기는 `DSGenreChip` 내부에 이미 적용된 `.padding`, `.frame(height:)` 등이 다 반영된 **최종 크기**다. `FlowLayout`은 그 완성된 숫자만 받아서 배치 계산에 쓸 뿐, 자식 뷰 내부 구현은 전혀 몰라도 된다.

## ProposedViewSize와 `.unspecified`

`sizeThatFits(proposal:)`의 `proposal`은 `ProposedViewSize` 타입이다. `width`/`height`가 각각 `CGFloat?`인데, `nil`이면 "특별히 제한 없음"이라는 뜻이다.

SwiftUI 레이아웃은 위에서 아래로 "이 정도 공간을 줄게"라는 **제안**이 내려가는 구조다. `VStack`/`HStack`은 자기가 부모로부터 받은 폭을, 특별히 제약을 걸지 않는 한 그대로 자식에게 다시 제안한다. 그래서 `FlowLayout`이 `.padding(.horizontal, 24)`가 걸린 `VStack` 안에 있다면, `sizeThatFits`가 받는 `proposal.width`는 **디바이스 화면 폭 − 좌우 padding**이 된다 — "화면 폭 그대로"가 아니라 조상 뷰들이 이미 깎아낸 만큼 줄어든 값이다.

### 자식을 물어볼 땐 왜 `.unspecified`를 쓰나

`FlowLayout` 내부에서 각 칩의 크기를 알아낼 땐 이렇게 쓴다.

```swift
let size = subview.sizeThatFits(.unspecified)
```

`.unspecified`는 `width`/`height`가 **둘 다 `nil`**인 특수 값이다. "공간 제약 없다고 치고, 네가 원하는 자연스러운 크기가 뭐야?"라고 묻는 것이다.

만약 `.unspecified` 대신 구체적인 폭(예: `bounds.width`)을 제안하면 결과가 달라질 수 있다. `sizeThatFits(proposal:)`는 뷰마다 제안받은 크기에 반응하는 방식이 다르기 때문이다. `Text`, `DSGenreChip`처럼 콘텐츠 기반 뷰는 대개 제안을 무시하고 자기 콘텐츠 크기를 그대로 리턴하지만, 만약 그 안에 `.frame(maxWidth: .infinity)` 같은 게 있다면 제안받은 폭까지 늘어난 크기를 리턴해버린다.

`.unspecified`로 물어봐야 자식 뷰가 얼마나 유연하게 설계됐든 상관없이 항상 **콘텐츠 기준의 진짜 자연 크기**를 받을 수 있다. 이게 "Indie Pop"은 짧게, "Korean Indie"는 길게 — 칩마다 너비가 자동으로 달라지는 근본 원리다.

### `.unspecified`(nil)와 진짜 `.infinity`는 다르다

| 구분              | 의미                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `.unspecified` (nil) | "크기 제약을 안 걸겠다 — 네 이상적인 크기를 알려줘"                   |
| 구체적인 `.infinity` 값 | "너한테 무한한 공간을 줄게, 그 안에서 원하는 만큼 커져봐"              |

`Color`, `Rectangle`, `Spacer`처럼 주어진 공간을 다 채우려는(greedy) 뷰들은 `.infinity`를 실제 값으로 받으면 진짜로 무한대 크기를 리턴해버릴 수 있다. `nil`은 "제약 없음"이라는 **의도**를 전달하는 것이고, `.infinity`는 "무한히 큰 공간"이라는 **구체적인 값**을 주는 것이라 뷰의 반응이 다르다.

:::warning 헷갈리기 쉬운 지점
`FlowLayout` 코드 안에는 `let maxWidth = proposal.width ?? .infinity`라는 줄도 있는데, 이건 위와 다른 용도다. 이건 우리가 부모로부터 받은 제안이 `nil`일 때 "줄바꿈 없이 한 줄로 취급"하겠다는 **내부 계산용 fallback 상수**일 뿐, 자식에게 다시 전달하는 값이 아니다. `subview.sizeThatFits(.unspecified)` 쪽이 "자식에게 물어보는" 시나리오다.
:::

## 줄바꿈 알고리즘

핵심 로직은 `sizeThatFits`와 `placeSubviews`가 공통으로 쓰는 `rows(for:maxWidth:)` 헬퍼에 있다.

```swift
private func rows(for subviews: Subviews, maxWidth: CGFloat) -> [Row] {
    var rows: [Row] = []
    var currentElements: [Element] = []
    var currentWidth: CGFloat = 0
    var currentHeight: CGFloat = 0

    for subview in subviews {
        let size = subview.sizeThatFits(.unspecified)
        let nextWidth = currentElements.isEmpty ? size.width : currentWidth + spacing + size.width

        if nextWidth > maxWidth, !currentElements.isEmpty {
            rows.append(Row(elements: currentElements, height: currentHeight))
            currentElements = [Element(subview: subview, size: size)]
            currentWidth = size.width
            currentHeight = size.height
        } else {
            currentElements.append(Element(subview: subview, size: size))
            currentWidth = nextWidth
            currentHeight = max(currentHeight, size.height)
        }
    }

    if !currentElements.isEmpty {
        rows.append(Row(elements: currentElements, height: currentHeight))
    }

    return rows
}
```

`maxWidth = 200`, `spacing = 10`, 칩 폭이 `[80, 70, 60, 90]`인 예시로 추적해보면:

1. **칩1(80)** — `currentElements`가 비어있으니 `nextWidth = 80`. 안 넘음 → 현재 줄에 추가, `currentWidth = 80`
2. **칩2(70)** — `nextWidth = 80 + 10 + 70 = 160`. 안 넘음 → 추가, `currentWidth = 160`
3. **칩3(60)** — `nextWidth = 160 + 10 + 60 = 230`. `200` 넘음 → 지금까지 쌓인 `[칩1, 칩2]`를 완성된 줄로 `rows`에 push하고, **새 줄을 칩3 하나로 다시 시작**
4. **칩4(90)** — `nextWidth = 60 + 10 + 90 = 160`. 안 넘음 → 추가

루프가 끝나면 마지막에 진행 중이던 줄(`[칩3, 칩4]`)을 한 번 더 push해줘야 한다 — "다음 칩"이 없어서 루프 안에서는 자동으로 push될 기회가 없기 때문이다.

핵심은 두 가지다.

-   `nextWidth`는 "이 칩을 지금 줄에 **추가했다고 가정했을 때** 줄 전체 폭이 얼마가 되는가"를 미리 계산해보는 것이다.
-   `!currentElements.isEmpty` 조건이 없으면, 칩 하나가 너무 커서 혼자서도 `maxWidth`를 넘는 극단적 케이스에서 빈 줄인데도 못 넣는다고 판단해 무한히 새 줄만 만드는 버그가 생길 수 있다. "이미 뭔가 들어있는 줄"에서만 넘침 여부를 따지고, 빈 줄이면 일단 무조건 넣는 안전장치다.

`sizeThatFits`는 이 `rows`의 높이를 합산해서 전체 크기를 리턴하고, `placeSubviews`는 같은 `rows`를 다시 계산해서 각 줄의 요소들을 `x` 누적하며 `place(at:proposal:)`로 실제 좌표에 그린다.

## 최적화 여지: Cache

`sizeThatFits`와 `placeSubviews`가 각각 독립적으로 `rows()`를 호출하다 보니, 칩 10개 기준으로 `sizeThatFits(.unspecified)`가 총 20번(칩당 2번) 호출된다. 작은 리스트에서는 무시할 수준이지만, `Layout` 프로토콜엔 이 중복 계산을 없애기 위한 `Cache` associated type이 정식으로 존재한다.

지금 구현은 `cache: inout ()`(빈 타입, 사실상 캐시 없음)를 쓰고 있는데, 커스텀 `Cache` struct를 정의해서 `sizeThatFits` 시점에 계산한 `rows` 결과를 저장해두면 `placeSubviews`에서 재계산 없이 꺼내 쓸 수 있다. 리스트가 커지거나 성능이 실제로 문제가 될 때 손볼 지점으로 남겨둔다.

## 덤: NavigationStack에 넘기는 값은 왜 Hashable이어야 하나

같은 화면 작업 중에 `NavigationStack` 기반 push 흐름도 새로 짰다.

```swift
@State private var path = NavigationPath()

NavigationStack(path: $path) {
    // ...
    .navigationDestination(for: OnboardingDestination.self) { destination in
        // ...
    }
}
```

여기서 push할 목적지를 나타내는 타입을 정의할 때, `Hashable`을 명시적으로 채택해야 한다.

```swift
private enum OnboardingDestination: Hashable {
    case genreSelection
}
```

`NavigationPath.append(_:)`도 `.navigationDestination(for:)`도 내부적으로 `Hashable` 타입을 요구한다. Swift는 연관값 없는 단순 enum이라도 **명시적으로 `Hashable`을 선언해야만** `==`/`hash(into:)`를 자동으로 합성해준다. 타입 선언에 프로토콜을 안 붙이면, 컴파일러가 이론적으로 합성 가능한 경우라도 그 타입은 해당 프로토콜을 준수하지 않는 것으로 취급한다.
