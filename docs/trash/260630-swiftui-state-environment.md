---
title: Snack - [SwiftUI] State, Environment, 그리고 View는 왜 "값"인가
tags: ['Swift', 'SwiftUI']
---

## 개요

온보딩 장르 선택 화면(칩 다중 선택 + 최대 3개 제한 + 완료 시 화면 전환)을 만들면서 마주친 세 가지 질문을 정리한다. `ForEach`에 왜 `Set`을 못 넣는지, 탭한 순간 UI가 알아서 갱신되는 원리가 뭔지, `@Environment`가 실제로 뭘 하는지를 파다 보니 결국 "SwiftUI에서 View란 무엇인가"라는 근본 질문까지 이어졌다.

## ForEach와 RandomAccessCollection — Set을 못 쓰는 이유

장르 전체 목록과 선택 상태를 둘 다 `Set<Genre>`로 관리하려다 이런 에러를 만났다.

```
Generic struct 'ForEach' requires that 'Set<Genre>' conform to 'RandomAccessCollection'
```

`Array`는 인덱스로 임의 위치에 O(1) 접근이 가능해서 `RandomAccessCollection`을 준수하지만, `Set`은 해시 테이블 기반이라 그런 순서/인덱스 접근 자체가 없다. `ForEach`는 뷰들을 순서대로 그려야 하므로 이 제약을 요구한다.

이건 사실 자료구조 선택을 다시 보는 계기가 됐다. "전체 장르 목록"과 "선택된 장르"는 요구사항이 다르다.

| 데이터                | 요구사항                              | 적합한 타입 |
| ---------------------- | -------------------------------------- | ------------ |
| 전체 장르 목록 (`genres`) | 항상 같은 순서로 렌더링돼야 함           | `Array`      |
| 선택된 장르 (`selectedGenres`) | 순서 상관없이 "포함 여부"만 빠르게 체크 | `Set`        |

```swift
private let genres: [Genre] = [ /* 10개, 순서 고정 */ ]
@State private var selectedGenres: Set<Genre> = []
```

`ForEach(genres)`는 이제 `Array`라 문제없이 컴파일된다. 선택 여부는 `selectedGenres.contains(genre)`로 체크하면 되고, `Set`이라 중복 삽입 걱정도 없다.

:::tip Identifiable 요구사항
`ForEach(data) { ... }`처럼 `id:`를 명시하지 않고 쓰려면 `data.Element`가 `Identifiable`을 채택해야 한다. `Genre`도 `struct Genre: Hashable, Identifiable { let id: Int; let name: String }`로 `Identifiable`을 같이 채택해야 이 형태로 쓸 수 있다.
:::

## `@State`가 UI를 자동 갱신하는 원리

칩을 탭하면 별도로 "새로고침"을 호출하지 않아도 UI가 바로 갱신된다.

```swift
private func toggle(_ genre: Genre) {
    if selectedGenres.contains(genre) {
        selectedGenres.remove(genre)
    } else if selectedGenres.count < 3 {
        selectedGenres.insert(genre)
    }
}

ForEach(genres) { genre in
    let isSelected = selectedGenres.contains(genre)
    let isDisabled = !isSelected && selectedGenres.count >= 3

    DSGenreChip(title: genre.name, isSelected: isSelected, isDisabled: isDisabled) {
        toggle(genre)
    }
}
```

흐름은 이렇다.

1. 칩 탭 → `action` 클로저 실행 → `toggle(genre)` 호출
2. `toggle` 안에서 `@State`로 선언된 `selectedGenres`가 변경됨
3. SwiftUI가 이 변경을 감지 → `body`를 다시 계산 → `ForEach`가 다시 돌면서 각 칩의 `isSelected`/`isDisabled`를 새로 평가
4. 값이 바뀐 칩만 시각적으로 갱신됨

`@State`는 "이 값이 바뀌면 이 값을 읽는 뷰의 `body`를 다시 그려야 한다"를 SwiftUI 런타임에게 알려주는 선언이다. `isDisabled` 계산(`!isSelected && selectedGenres.count >= 3`)이 3개 초과 선택을 막아주지만, 이건 UI 레이어의 방어일 뿐이라 `toggle` 함수 자체에도 `count < 3` 체크를 넣어서 이중으로 방어하는 게 안전하다 — `isDisabled`는 렌더링 시점의 파생값일 뿐, "3개 제한"이라는 불변조건을 `toggle`이 직접 알고 있어야 다른 경로로 호출돼도 깨지지 않는다.

## SwiftUI View는 "값"이지 지속되는 객체가 아니다

`@State`/`@Environment`가 왜 재렌더링을 거쳐도 값을 잃지 않는지 이해하려면, SwiftUI의 View가 UIKit의 `UIViewController`와 근본적으로 다른 모델이라는 걸 먼저 알아야 한다.

```swift
struct AppRootView: View {
    @State private var appSession = AppSession()

    var body: some View {
        Group {
            switch appSession.authState {
            case .signedOut, .onboardingRequired: OnboardingFlowView()
            case .signedIn: MainTabView()
            }
        }
        .environment(appSession)
    }
}
```

`AppRootView`는 `struct`이고 `body`는 계산 프로퍼티다. `body`가 리턴하는 `OnboardingFlowView()`는 "지금 이 순간 화면이 이렇게 생겨야 한다"는 **설명(description)**일 뿐이다. `AppRootView`가 이 인스턴스를 프로퍼티에 저장해서 계속 들고 있는 게 아니라, 상태가 바뀔 때마다 `body`가 **다시 통째로 호출**돼서 새로운 값을 매번 새로 만들어낸다.

:::warning UIKit 배경이면 헷갈리는 지점
"부모 객체가 자식 객체를 프로퍼티로 강하게 붙들고 있다"는 그림을 SwiftUI에 그대로 적용하면 안 맞는다. SwiftUI에서 뷰 struct는 매번 버려지고 새로 만들어지는 **값**이다.
:::

그럼 실제 "뷰 그래프"는 누가 관리하나? `AppRootView` 자신이 아니라 **SwiftUI 프레임워크 런타임**이다. 이 런타임이 각 뷰의 정체성(identity)을 추적하고, 이전 `body` 결과와 새 `body` 결과를 비교(diff)하고, `@State`/`@Environment` 값들을 뷰 struct 밖의 별도 저장소에 그 정체성 기준으로 영구 보관한다.

`@State private var appSession = AppSession()`라고 써도 `body`가 재호출될 때마다 `AppSession()`이 매번 새로 생성되는 게 아니다. SwiftUI 런타임이 "이 `AppRootView`는 최초 1번만 초기화하고, 그 다음부턴 저장해둔 기존 인스턴스를 재사용"하도록 처리한다. struct 자체는 매번 버려지고 새로 만들어져도, 그 안의 상태는 정체성에 묶여서 살아남는다.

## EnvironmentValues — 트리 위치 기반 값 전달

`.environment(appSession)`도 같은 맥락이다. 정확한 SwiftUI 타입 이름은 `EnvironmentValues`다.

```swift
// 등록 (조상 뷰에서)
.environment(appSession)

// 조회 (후손 뷰에서)
@Environment(AppSession.self) private var appSession
```

`.environment(_:)`가 붙은 지점부터, 그 서브트리 안에서는 해당 타입의 값이 "이 인스턴스"로 등록된다. `@Environment(Type.self)`는 "지금 내가 렌더링되는 위치에서, 조상 중 누군가 등록해둔 값을 꺼내와라"라고 동작한다.

핵심은 **전역(global) 저장소가 아니라 트리 위치 기반 저장소**라는 점이다. React의 Context, Angular의 DI 계층과 비슷하다. 앱 전체에 하나뿐인 사전이 아니라, 뷰 트리의 특정 지점을 기준으로 그 조상들이 등록해둔 값만 보인다.

이 특성 때문에 실제로 프리뷰가 깨지는 걸 겪었다.

```swift
#Preview {
    GenreSelectionView()   // AppSession을 등록해준 조상이 없음 → 크래시
}
```

`AppRootView`를 거치지 않고 `GenreSelectionView` 하나만 독립적으로 띄우면, 그 위치엔 `AppSession`을 등록해준 조상이 없어서 `@Environment(AppSession.self)`가 값을 못 찾고 런타임 에러가 난다. 프리뷰는 자기만의 독립된 짧은 트리이므로, 필요한 환경 값을 직접 다시 등록해줘야 한다.

```swift
#Preview {
    GenreSelectionView()
        .environment(AppSession())
}
```

## AppSession과 온보딩 완료 흐름

`AppSession`은 앱 전체의 로그인 상태를 들고 있는 단일 소스다.

```swift
@Observable
final class AppSession {
    var authState: AuthState = .unknown
}

enum AuthState {
    case unknown, signedOut, onboardingRequired, signedIn
}
```

`AppRootView`는 `appSession.authState` 값만 보고 Onboarding을 보여줄지 MainTab을 보여줄지 통째로 바꿔친다. 그래서 장르 선택 화면의 "완료" 버튼이 해야 할 일은 딱 하나, 이 상태값을 바꾸는 것뿐이다.

```swift
Button("완료") {
    appSession.authState = .signedIn
}
.buttonStyle(DSPrimaryButtonStyle())
```

`NavigationStack`에서 pop한다거나 화면을 직접 전환하는 코드는 필요 없다. `authState`가 `.signedIn`으로 바뀌는 순간, `AppRootView`의 `switch`가 이를 감지해서 루트 자체를 `MainTabView`로 바꿔친다 — 온보딩 화면 트리 전체가 통째로 사라지고 메인 탭이 새로 그려지는 것도, 결국 위에서 다룬 "body는 상태에 따라 매번 새로 계산되는 값"이라는 원리의 연장선이다.
