---
title: Snack - [SwiftUI] 화면은 멀쩡한데 터치가 전부 죽는다 — AttributeGraph 사이클과 gesture gate timeout
tags: ['Swift', 'SwiftUI']
---

## 개요

릴스 스타일 피드에 prev/next 카드를 미리 뷰로 띄우는 3-카드 윈도우 구조를 붙이다가, 화면은 정상적으로 그려지는데 **드래그·버튼·검색바 등 모든 인터랙션이 완전히 죽는** 버그를 만났다. 스크린샷상 레이아웃은 완벽했기 때문에 처음엔 원인을 엉뚱한 곳(프레임, 여백, 제스처 우선순위)에서 찾느라 한참을 헤맸다. 결국 결정적 단서는 콘솔 로그 두 줄이었다.

```
=== AttributeGraph: cycle detected through attribute 111784 ===
<0x11222da40> Gesture: System gesture gate timed out.
```

"화면은 멀쩡한데 터치가 안 먹는다"는 증상은 대부분 **메인 렌더 루프가 막혀서 UIKit 제스처 시스템이 앱의 응답을 기다리다 타임아웃**하는 상황이다. 즉 레이아웃 버그가 아니라 런타임 그래프 버그다.

## 증상 1: 배경 번짐과 하단 여백 — 페이징 높이와 배경 높이의 불일치

먼저 순수 레이아웃 문제부터. 풀블리드(full-bleed) 배경을 깔았는데 카드 아래로 앨범 아트의 색이 번지고 탭바 주변에 흰 여백이 남았다.

원인은 **페이징 거리와 배경 높이가 서로 다른 값**이었다는 것.

```swift
// 페이징은 세이프에어리어를 뺀 높이로
.offset(y: CGFloat(slot) * safeContentSize.height + offset)

// 배경은 세이프에어리어를 무시한 풀스크린으로
backgroundArtwork.ignoresSafeArea()
```

한쪽은 "화면 − 인셋", 다른 쪽은 "화면 전체"로 계산되니 그 차이만큼 빈틈이 생겼고, 그 빈틈을 `extraTop`/`extraBottom`/검은 오버레이 같은 땜빵으로 덮으려다 오히려 번짐이 더 심해졌다.

:::tip 풀스크린 페이저는 "하나의 크기 소스"로 통일한다
페이징 오프셋, 슬롯 프레임, 배경 크기를 **전부 같은 값**으로 맞춰야 한다. 세이프에어리어를 무시하는 화면 전체 크기를 하나 정하고, 페이징·프레임·배경 모두 그 값을 쓰면 빈틈 자체가 생기지 않는다. 크기를 얻을 땐 `GeometryReader`를 `.ignoresSafeArea()`로 감싸면 `geo.size`가 세이프에어리어를 무시한 실제 풀스크린 크기를 준다.

```swift
GeometryReader { geo in
    let size = geo.size            // 세이프에어리어 무시한 풀스크린
    ZStack {
        ForEach(windowedFeeds) { item in
            feedSlot(for: item.feed, size: size)
                .offset(y: CGFloat(item.slot) * size.height + offset)
        }
    }
    .frame(width: size.width, height: size.height)
}
.ignoresSafeArea()
```
:::

## 증상 2: 모든 인터랙션이 죽음 — AttributeGraph 사이클

레이아웃을 고치고 나니 이번엔 **아무것도 안 눌렸다.** 버튼도, 검색바도, 드래그도. 그리고 콘솔에 `AttributeGraph: cycle detected`가 찍혔다.

범인은 `body` 평가 도중 UIKit 윈도우의 세이프에어리어 인셋을 읽는 코드였다.

```swift
private var keyWindow: UIWindow? {
    UIApplication.shared.connectedScenes
        .compactMap { $0 as? UIWindowScene }
        .first?.windows.first { $0.isKeyWindow }
}

var body: some View {
    ...
    DSSearchBar(...)
        .padding(.top, keyWindow?.safeAreaInsets.top ?? 0 + 8)  // ← body에서 UIKit 접근
    ...
}
```

:::danger body에서 UIKit 전역 상태(window safeAreaInsets)를 읽으면 교차 프레임워크 사이클이 생긴다
SwiftUI가 `body`를 평가하는 도중 `UIWindow.safeAreaInsets`를 읽으면, 그 접근이 UIKit 레이아웃 패스를 건드리고 → 그게 다시 SwiftUI 업데이트를 유발하고 → 다시 `body`가 평가되는 **UIKit ↔ SwiftUI 순환**이 만들어질 수 있다. AttributeGraph는 이걸 사이클로 감지하고 그래프 계산을 멈춰버리는데, 그 순간 메인 렌더 루프가 막히면서 터치 입력까지 전부 얼어붙는다.
:::

해결은 간단하다. **인셋을 매 프레임 읽지 말고, `onAppear`에서 딱 한 번 읽어 `@State`에 스냅샷**해두고 body에선 그 값만 쓴다.

```swift
@State private var safeInsets = EdgeInsets()

private func resolveSafeInsets() {
    let i = keyWindow?.safeAreaInsets ?? .zero
    safeInsets = EdgeInsets(top: i.top, leading: i.left, bottom: i.bottom, trailing: i.right)
}

var body: some View {
    GeometryReader { geo in
        ...
        DSSearchBar(...)
            .padding(.top, safeInsets.top + 8)   // @State 스냅샷만 참조
    }
    .ignoresSafeArea()
    .onAppear(perform: resolveSafeInsets)
}
```

이걸 적용하자 `cycle detected` 로그는 사라졌다. 하지만 인터랙션은 **여전히** 죽어 있었고, 로그엔 `System gesture gate timed out`만 남았다.

## 증상 3: gesture gate timeout — 겹친 뷰마다 제스처를 달지 마라

`cycle detected`가 사라졌는데도 제스처 게이트 타임아웃이 남았다는 건, 사이클과는 별개인 제스처 자체의 문제라는 뜻이었다.

문제의 구조는 이랬다. prev/current/next 세 슬롯을 `ForEach`로 그리면서, **각 슬롯마다** 제스처를 붙였다.

```swift
ForEach(windowedFeeds) { item in
    feedSlot(for: item.feed, size: size)
        .offset(y: CGFloat(item.slot) * size.height + offset)
        .contentShape(Rectangle())
        .gesture(dragGesture(for: item, height: size.height))          // 슬롯마다
        .simultaneousGesture(doubleTapGesture(for: item))              // 슬롯마다
}
```

여기서 핵심은 **세 슬롯이 레이아웃상 전부 화면 최상단에 풀스크린으로 겹쳐 있다**는 점이다. `.offset`은 렌더/히트테스트 위치만 옮길 뿐 레이아웃 프레임은 그대로라, 결과적으로 화면 같은 자리에 제스처 recognizer가 여러 개 쌓였다.

:::warning 겹쳐 배치되는 뷰에 제스처를 각각 달면 시스템 게이트 중재가 실패한다
UIKit의 제스처 게이트는 앱 제스처와 시스템 제스처(엣지 스와이프 등) 사이를 중재하는데, 같은 위치에 여러 recognizer가 경쟁하면 어느 것을 우선할지 결정이 지연되다 타임아웃(`System gesture gate timed out`)이 나고, 그 사이 터치가 전부 삼켜진다. off-screen 슬롯의 제스처가 `guard slot == 0`으로 터치를 소비만 하고 아무 동작도 안 하는 것도 문제를 키운다.
:::

해결은 **제스처를 슬롯마다가 아니라, 슬롯들을 감싼 페이징 레이어 하나에만** 다는 것.

```swift
ZStack(alignment: .top) {
    // 페이징 레이어 — 제스처는 여기 한 곳에만
    ZStack {
        ForEach(windowedFeeds) { item in
            feedSlot(for: item.feed, size: size)
                .offset(y: CGFloat(item.slot) * size.height + offset)
        }
    }
    .frame(width: size.width, height: size.height)
    .contentShape(Rectangle())
    .gesture(dragGesture(height: size.height))       // 단 하나
    .simultaneousGesture(doubleTapGesture())          // 단 하나

    // 검색바는 페이징 레이어의 "형제"로 위에 올린다 → 제스처 간섭 없음
    DSSearchBar(...)
        .padding(.horizontal, 16)
        .padding(.top, safeInsets.top + 8)
}
```

recognizer 세트가 하나로 줄면서 게이트 중재가 정상화됐고, 검색바를 페이징 레이어의 형제(위 z-order)로 분리한 덕에 드래그가 검색바 탭을 가로채지 않는다. 하입/액션 버튼은 페이징 레이어의 **자식**이라, 기본 우선순위상 컨트롤이 부모의 `.gesture`보다 우선권을 가져서 정상적으로 눌린다.

## 마무리: 경계에서 흰 화면

마지막으로 0번 인덱스에서 prev, 마지막 인덱스에서 next를 시도하면 빈 슬롯 자리에 기본 흰 배경이 비쳤다. 이건 페이징 컨테이너 뒤에 검은 레이어 한 장으로 끝.

```swift
.frame(width: size.width, height: size.height)
.background(Color.black)
```

## 정리

- "화면은 정상인데 터치가 전부 죽는다"는 십중팔구 레이아웃이 아니라 **메인 루프가 막힌 것**이다. 프레임/여백을 붙잡고 씨름하기 전에 콘솔에서 `AttributeGraph: cycle detected`와 `System gesture gate timed out`을 먼저 확인하는 게 훨씬 빠르다.
- SwiftUI `body`에서 `UIWindow.safeAreaInsets` 같은 **UIKit 전역 상태를 읽지 마라.** 교차 프레임워크 사이클을 만든다. 꼭 필요하면 `onAppear`에서 한 번 읽어 `@State`에 스냅샷한다.
- 풀스크린 페이저는 **페이징 오프셋·슬롯 프레임·배경 크기를 하나의 크기 소스로 통일**해야 빈틈(번짐/여백)이 안 생긴다. `GeometryReader`를 `.ignoresSafeArea()`로 감싸면 풀스크린 크기를 얻을 수 있다.
- 겹쳐 배치되는 뷰들에는 제스처를 **각각 달지 말고 감싼 레이어 하나에** 단다. recognizer가 여러 개 경쟁하면 게이트 타임아웃으로 터치 전체가 죽을 수 있다.
