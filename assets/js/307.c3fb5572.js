(window.webpackJsonp=window.webpackJsonp||[]).push([[307],{841:function(t,e,n){"use strict";n.r(e);var s=n(6),a=Object(s.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h2",{attrs:{id:"combine-개요"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#combine-개요"}},[t._v("#")]),t._v(" Combine 개요")]),t._v(" "),e("p",[t._v("컴바인은 앱 이벤트 처리를 선언형으로 작성할 수 있게 해주는 프레임워크이다. 컴플리션 핸들러와 같은 콜백이나 델리게이트 형태가 아닌 주어진 이벤트를 체인 형태로 처리하게 된다. 각 처리 단계는 컴바인에서 오퍼레이터에 해당한다.")]),t._v(" "),e("p",[t._v("텍스트필드로 입력받은 텍스트값을 기반으로 테이블뷰 컨텐츠를 필터링 해야하는 경우를 생각해보자. 컴바인은 애플에서 제공하는 퍼스트파티 API이기 때문에, 기본적으로 "),e("code",[t._v("NotificationCenter.default")]),t._v(" 객체에 "),e("code",[t._v(".publisher")]),t._v("라는 메서드를 제공하고 있다.")]),t._v(" "),e("div",{staticClass:"language-swift extra-class"},[e("pre",{pre:!0,attrs:{class:"language-swift"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 퍼블리셔 생성 후 구독")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("NotificationCenter")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("default")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("publisher")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UITextField")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("textDidChangeNotification"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" object"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("self")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("sink")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("receiveCompletion"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("print")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token short-argument"}},[t._v("$0")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" receiveValue"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("print")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token short-argument"}},[t._v("$0")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),e("ol",[e("li",[t._v("텍스트필드 입력값이 바뀔때마다 새로운 텍스트 문자열이 방출되는 퍼블리셔를 생성한다.")]),t._v(" "),e("li",[e("code",[t._v("RxSwift")]),t._v("에서 "),e("code",[t._v("subscribe")]),t._v("가 구독이라면, 컴바인에서는 "),e("code",[t._v("sink")]),t._v("가 구독 역할을 한다.")]),t._v(" "),e("li",[t._v("구독자는 퍼블리셔로부터 받아오는 값에 대한 대해 "),e("code",[t._v("associated type")]),t._v("으로 "),e("code",[t._v("Input")]),t._v(" 타입을 새로 정의하고, 퍼블리셔는 방출하는 값에 대해 "),e("code",[t._v("Output")]),t._v(" 타입으로 정의한다.")]),t._v(" "),e("li",[t._v("퍼블리셔와 구독자는 모두 "),e("code",[t._v("Failure")]),t._v("타입을 정의하며 에러를 방출했을 때에 대한 타입으로 사용한다.")]),t._v(" "),e("li",[t._v("구독자와 퍼블리셔를 연결하기 위해서는 반드시 "),e("code",[t._v("Output")]),t._v("과 "),e("code",[t._v("Input")]),t._v("타입이 일치해야 한다. 또한 두 대상에 대해 "),e("code",[t._v("Failure")]),t._v("타입도 일치해야 한다.")])]),t._v(" "),e("p",[t._v("컴바인은 퍼블리셔가 방출하는 값의 "),e("code",[t._v("Output")]),t._v("타입에 맞춰 자동으로 "),e("code",[t._v("Input")]),t._v("타입 정의를 해주는 기본 구독자들을 제공한다.")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("sink(receiveCompletion: receiveValue:)")]),t._v(": 두 개의 클로저를 받으며 첫번째 클로저는 "),e("code",[t._v("Subscribers.Completion")]),t._v("를 받을 때 실행된다. 이는 퍼블리셔가 정상 종료되었을 때 혹은 에러가 방출했을 때 전달된다. 두 번째 클로저는 퍼블리셔로부터 값을 전달받을 때 실행된다.")]),t._v(" "),e("li",[e("code",[t._v("assign(to: on:)")]),t._v(": "),e("code",[t._v("to")]),t._v("에 전달된 "),e("code",[t._v("KeyPath")]),t._v("를 통해 인스턴스 프로퍼티에 접근하여 퍼블리셔에서 방출된 값을 직접 할당해준다. RxSwift에서 "),e("code",[t._v("bind(to: )")]),t._v("와 동일하다.")])]),t._v(" "),e("p",[e("code",[t._v("sink")]),t._v(" 오퍼레이터는 퍼블리셔에서 방출하는 "),e("code",[t._v("Output")]),t._v("타입 데이터를 그대로 받아 처리하기 때문에, 해당 타입이 의미없이 무거울 경우 불필요한 연산이 반복적으로 일어나게 된다. 이때 각종 오퍼레이터들을 활용하여 필요한 데이터만 추출하여 구독자에게 전달하게 된다.")]),t._v(" "),e("p",[t._v("또한, 퍼블리셔는 정상적으로 종료되거나 에러 방출 전까지 값들을 계속해서 방출하기때문에 적절한 시점에 구독을 취소해주는 것이 중요하다. "),e("code",[t._v("assign")]),t._v("과 "),e("code",[t._v("sink")]),t._v("로 생성된 구독자는 모두 "),e("code",[t._v("Cancellable")]),t._v(" 프로토콜을 채택하며, 해당 프로토콜은 "),e("code",[t._v("cancel")]),t._v("메서드를 제공한다. 이 메서드를 호출하면 구독이 취소된다.")]),t._v(" "),e("h2",{attrs:{id:"reference"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#reference"}},[t._v("#")]),t._v(" Reference")]),t._v(" "),e("ol",[e("li",[e("a",{attrs:{href:"https://developer.apple.com/documentation/combine/receiving-and-handling-events-with-combine",target:"_blank",rel:"noopener noreferrer"}},[t._v("Apple Document - Combine"),e("OutboundLink")],1)]),t._v(" "),e("li",[e("a",{attrs:{href:"https://github.com/CombineCommunity/rxswift-to-combine-cheatsheet",target:"_blank",rel:"noopener noreferrer"}},[t._v("RxSwift to Combine cheatsheet"),e("OutboundLink")],1)])])])}),[],!1,null,null,null);e.default=a.exports}}]);