---
title: Snack - [SwiftUI] DragGesture로 릴스 스타일 스와이프 카드 만들기
tags: ['Swift', 'SwiftUI']
---

## 개요

피드 화면에 릴스/틱톡처럼 위아래로 스와이프해서 다음/이전 트랙으로 넘어가는 카드 인터랙션을 붙였다. `DragGesture` 하나로 끝날 줄 알았는데, 실제로는 상태 설계·애니메이션 합성·좌표계 문제가 순서대로 튀어나왔다. 특히 마지막에 겪은 "드래그 중 뷰가 부르르 떨리는" 버그는 원인이 꽤 의외였다.

## @GestureState는 편하지만, "확정 전환"엔 안 맞는다

처음엔 `@GestureState`로 시작했다.

```swift
@GestureState private var dragOffset: CGFloat = 0

.gesture(
    DragGesture()
        .updating($dragOffset) { value, state, _ in
            state = value.translation.height
        }
        .onEnded { value in
            // 임계값 판정
        }
)
.offset(y: dragOffset)
```

`@GestureState`의 장점은 제스처가 끝나는 순간 **자동으로 초기값(0)으로 리셋**된다는 것이다. 임계값을 못 넘겨서 원위치로 스냅백해야 하는 경우엔 이게 딱 맞는다 — 되돌리는 코드를 따로 안 짜도 된다.

문제는 "임계값을 넘어서 다음 트랙으로 완전히 화면 밖까지 밀어내야 하는" 경우다. `@GestureState`는 **오직 초기값으로만** 돌아갈 뿐, 임의의 목표값(예: 화면 높이만큼)으로 직접 조작하는 게 불가능하다. 그래서 별도로 `@State private var settledOffset`을 하나 더 만들고, 뷰에는 `dragOffset + settledOffset`을 합쳐서 적용하는 방식으로 우회했다.

```swift
.offset(y: dragOffset + settledOffset)
.animation(.spring(response: 0.35, dampingFraction: 0.7), value: dragOffset)

func goingNext() {
    withAnimation(.easeInOut(duration: 0.28)) {
        settledOffset = -containerHeight
    }
}
```

:::warning 두 개의 독립적인 애니메이션을 더하면 합성 결과가 매끄럽지 않다
손을 떼는 순간, `dragOffset`은 스프링 곡선을 타고 0으로 돌아가고, `settledOffset`은 동시에 easeInOut 곡선을 타고 목표값으로 움직인다. 이 둘은 "하나가 끝나야 다른 게 시작"하는 순차 관계가 아니라 **같은 트리거(손 뗌)에서 동시에 출발하는 독립적인 두 애니메이션**이다. 화면엔 이 둘의 합이 그려지는데, 스프링(물리 감쇠, 종료 시점 불확정)과 easeInOut(고정 0.28초)은 속도 곡선도 다르고 끝나는 타이밍도 안 맞아서, 합쳐진 결과가 미묘하게 출렁이거나 어긋나 보일 수 있다.
:::

결국 값을 두 개로 쪼개는 것 자체가 문제의 근원이라고 판단해서, `@GestureState` + `@State` 조합을 버리고 **`@State` 하나로 통일**했다.

```swift
@State private var offset: CGFloat = 0

.gesture(
    DragGesture()
        .onChanged { value in
            offset = value.translation.height   // 애니메이션 없이 1:1 추적
        }
        .onEnded { value in
            if value.translation.height >= geometry.size.height * 0.22 {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.7)) { offset = 0 }
            } else if value.translation.height <= -geometry.size.height * 0.22 {
                goingNext()
            } else {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.7)) { offset = 0 }
            }
        }
)
.offset(y: offset)
```

드래그 중엔 애니메이션 없이 손가락을 그대로 따라가고(`onChanged`), 손을 뗀 시점(`onEnded`)에야 **같은 변수**를 목표값으로 `withAnimation`으로 옮긴다. 값이 하나뿐이니 "지금 있던 위치에서 자연스럽게 이어서" 애니메이션되고, 두 곡선이 합쳐질 일도 없다.

## 레이아웃 컨테이너는 "그려진 영역"에만 반응한다

제스처를 뷰 계층 위쪽(`ZStack`/`VStack` 전체)에 붙였더니, 아트워크 이미지 위에서만 드래그가 되고 그 주변 여백(Spacer, 패딩 영역)에선 반응이 없었다.

:::tip contentShape로 히트테스트 영역 명시하기
SwiftUI의 레이아웃 컨테이너는 기본적으로 **실제로 뭔가 그려진 영역**에만 히트테스트가 걸린다. `Spacer`나 투명한 여백은 `.frame`으로 잡힌 크기와 상관없이 터치 인식 대상에서 빠진다. `.contentShape(Rectangle())`를 붙이면 "이 뷰의 히트테스트 영역은 이 도형(여기선 프레임 전체 사각형)이다"라고 명시적으로 선언할 수 있다.

```swift
.contentShape(Rectangle())
.gesture(DragGesture()...)
```
:::

## 실기기에서도 재현된 "부르르 떨림" — coordinateSpace 문제

시뮬레이터에서 드래그할 때 뷰가 미세하게 떨리는 현상이 있었다. 처음엔 시뮬레이터 성능(Debug 빌드, GPU 에뮬레이션) 문제로 의심했는데, **실기기에서도 똑같이 재현**되면서 진짜 로직 버그라는 게 확실해졌다.

`onChanged`에서 받은 `value`를 그대로 찍어보니 패턴이 보였다.

```
location: (182.0, 471.67)
location: (182.0, 483.67)
location: (182.33, 471.0)
location: (182.67, 483.0)
location: (182.67, 470.33)
location: (183.0, 482.33)
```

`y` 값이 한 방향으로 진행하는 게 아니라 **~470과 ~483 사이를 계속 핑퐁하듯 튕기고 있었다.** `velocity.height` 부호도 이벤트마다 뒤집혔다 — 좌표 자체가 오락가락 보고되고 있다는 뜻이다.

:::warning local 좌표계 + 같은 뷰에 offset을 걸면 피드백 루프가 생긴다
`DragGesture()`는 기본적으로 `.local` 좌표 공간을 쓴다 — 즉 제스처가 걸린 뷰 **자기 자신의 프레임을 기준**으로 터치 위치를 계산한다. 그런데 그 **같은 뷰**에 드래그 값 기반의 `.offset()`도 걸려 있으면:

1. 손가락이 움직여서 `offset`이 바뀐다
2. 뷰가 이동하면서 뷰의 로컬 좌표 원점도 같이 움직인다
3. 다음 프레임에 "로컬 좌표 기준" 터치 위치를 다시 계산하는데, 기준점 자체가 방금 이동해버려서 값이 튄다
4. 이게 반복되며 좌표가 두 값 사이를 오가는 피드백 루프가 생긴다

고정된 화면 기준으로 좌표를 계산하도록 좌표 공간을 명시적으로 바꾸면 해결된다.

```swift
DragGesture(coordinateSpace: .global)
```

`.global`은 뷰 자신이 아니라 화면 전체를 기준으로 삼기 때문에, 뷰가 움직여도 터치 위치 계산 기준이 흔들리지 않는다.
:::

이 버그는 코드만 읽어서는 확신하기 어려웠고, 실제로 `onChanged`의 `value`를 콘솔에 찍어서 **원시 좌표 데이터의 패턴을 직접 확인**하고 나서야 원인이 명확해졌다. "느낌상 이상하다"를 "숫자로 재현되는 패턴"으로 바꾸는 게 이런 종류의 버그에서 제일 빠른 지름길이었다.

## 정리

- `@GestureState`는 자동 리셋이 강점이지만, 리셋 목표가 "항상 초기값"으로 고정돼 있어서 "확정된 목표값으로 이동" 같은 케이스엔 안 맞는다. 이럴 땐 값을 쪼개서 더하기보다, `@State` 하나로 통일하고 `onChanged`/`withAnimation`으로 직접 제어하는 편이 애니메이션 합성 문제를 피할 수 있다.
- 레이아웃 컨테이너의 히트테스트는 "그려진 콘텐츠" 기준이라, 빈 공간까지 제스처 영역으로 만들려면 `.contentShape()`가 필요하다.
- `DragGesture` + `.offset()`을 같은 뷰에 걸 때는 기본 `.local` 좌표계가 피드백 루프를 만들 수 있다는 걸 기억해두고, `coordinateSpace: .global`로 명시하는 습관을 들이는 게 안전하다.
