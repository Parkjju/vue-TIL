(window.webpackJsonp=window.webpackJsonp||[]).push([[68],{1088:function(t,a,s){"use strict";s.r(a);var n=s(6),e=Object(n.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"네비게이션-바-커스텀"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#네비게이션-바-커스텀"}},[t._v("#")]),t._v(" 네비게이션 바 커스텀")]),t._v(" "),a("p",[a("img",{attrs:{src:s(500),alt:"scrollEdge"}})]),t._v(" "),a("p",[t._v("아이폰 시계 어플리케이션에 들어간 뒤 세계시간 탭에서 + 버튼을 누르면 iOS에서 관리하는 타임존 목록에 접근할 수 있다.")]),t._v(" "),a("p",[t._v("이때 해당 목록들을 스크롤링 하면 네비게이션 바의 배경색이 살짝 바뀌는 것을 볼 수 있는데, 이를 커스텀하기 위해서는 몇 가지 과정이 필요하다.")]),t._v(" "),a("p",[t._v("먼저 알아둬야 할 것으로 네비게이션 바 커스텀이 필요한 상황을 나누어 생각해봐야 하는데, 이는 xcode에서도 확인할 수 있듯 몇 가지 되지 않는다. xcode에서 확인하려면 네비게이션 바를 스토리보드상에서 선택한 뒤 인스펙터에서 확인하면 된다.")]),t._v(" "),a("p",[t._v("커스텀 할 수 있는 상황이라고 하면 Appearance 섹션을 확인해보면 된다.")]),t._v(" "),a("ol",[a("li",[t._v("Standard - 스크롤 된 이후의 네비게이션 바")]),t._v(" "),a("li",[t._v("Compact - "),a("a",{attrs:{href:"https://stackoverflow.com/questions/58296535/ios-13-new-pagesheet-formsheet-navigationbar-height",target:"_blank",rel:"noopener noreferrer"}},[t._v("다음 이미지를"),a("OutboundLink")],1),t._v("참고하자.")]),t._v(" "),a("li",[t._v("ScrollEdge - 네비게이션 바 내에서 스크롤 기반의 뷰가 부착되어 있을때, 스크롤 가장 끝단에 위치하는 경우")]),t._v(" "),a("li",[t._v("compactScrollEdge - 스크롤 엣지 상황에서 컴팩트 효과를 덤으로 붙인 상황.")])]),t._v(" "),a("p",[t._v("위의 캡처 사진에서는 Standard시 네비게이션 바의 배경색이 잠깐 옅어지고, scrollEdge시 네비게이션 바의 배경색이 다시 원래대로 돌아오는 것으로 정리해볼 수 있다.")]),t._v(" "),a("p",[t._v("실제 커스텀하기 위한 예시 코드는 아래와 같다.")]),t._v(" "),a("div",{staticClass:"language-swift extra-class"},[a("pre",{pre:!0,attrs:{class:"language-swift"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("func")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function-definition function"}},[t._v("setupUI")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" appearance "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UINavigationBarAppearance")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n    appearance"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("titleTextAttributes "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("NSAttributedString")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Key")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("foregroundColor"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UIColor")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("white\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n\n    appearance"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("backgroundColor "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UIColor")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("named"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string-literal"}},[a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ModalWithScrollColor"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("self")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("navigationBar"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("standardAppearance "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" appearance\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("ol",[a("li",[a("code",[t._v("UINavigationAppearance")]),t._v(" 인스턴스를 생성한다.")]),t._v(" "),a("li",[t._v("네비게이션 커스텀 상황에 맞게 스타일링을 한다. 텍스트 커스텀은 아래에서 추가 설명")]),t._v(" "),a("li",[a("code",[t._v("navigationController?.navigationBar")]),t._v("속성에 접근하여 appearance 인스턴스를 할당한다. 스탠다드, 스크롤 엣지 등에 맞게 속성이 마련되어 있으므로 해당 속성에 할당하면 된다.")])]),t._v(" "),a("p",[t._v("backgroundColor 속성은 일반적으로 세팅하는것처럼 진행하면 되지만 타이틀의 경우 조금 다르다.")]),t._v(" "),a("p",[a("code",[t._v("UINavigationBarAppearance")]),t._v(" 인스턴스는 titleTextAttributes 속성을 갖는데, 딕셔너리 타입이며 key값의 타입은 "),a("code",[t._v("NSAttributedString.Key")]),t._v("이며, 구조체 타입이고 내부 속성을 원하는대로 커스텀 하면 된다.")]),t._v(" "),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[t._v("타이틀 색 설정")]),t._v(" "),a("p",[t._v("타이틀 컬러는 일반적으로 알고 있는 tintColor나 textColor라는 이름의 속성을 갖지 않고 "),a("code",[t._v("NSAttributedString.Key.foregroundColor")]),t._v("라는 이름을 갖는다.")])]),t._v(" "),a("p",[t._v("스토리보드에서는 어트리뷰트 인스펙터에서 scroll edge, standard 등 Appearances에서 선택을 먼저 한 뒤 Text Attributes 섹션에서 Title을 Inherited가 아닌 Custom으로 설정하면 타이틀 컬러나 폰트 등을 커스텀 할 수 있다.")]),t._v(" "),a("p",[a("img",{attrs:{src:s(501),alt:"attribute"}})]),t._v(" "),a("h2",{attrs:{id:"uinavigationbar-커스텀"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#uinavigationbar-커스텀"}},[t._v("#")]),t._v(" UINavigationBar 커스텀")]),t._v(" "),a("p",[t._v("네비게이션 컨트롤러를 사용하지 않고 커스텀 "),a("code",[t._v("UIView")]),t._v("에 네비게이션 바를 삽입할 수 있다.")]),t._v(" "),a("div",{staticClass:"language-swift extra-class"},[a("pre",{pre:!0,attrs:{class:"language-swift"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CustomView")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UIView")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 커스텀 네비게이션 바")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" navBar"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UINavigationBar")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" bar "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UINavigationBar")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 네비게이션 바 타이틀 설정")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" navItem "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UINavigationItem")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("title"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string-literal"}},[a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"라이브러리"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" leftBarButton "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UIBarButtonItem")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("title"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string-literal"}},[a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"취소"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" style"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("plain"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" target"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("self")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" action"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token other-directive property"}},[t._v("#selector")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("handleBackButtonTapped"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" rightBarButton "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UIBarButtonItem")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("title"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string-literal"}},[a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"완료"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" style"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("done"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" target"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("self")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" action"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token other-directive property"}},[t._v("#selector")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("handleCompletionButtonTapped"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// UINavigationItem 속성을 통해 바 버튼 인스턴스 전달")]),t._v("\n        navItem"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("leftBarButtonItem "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" leftBarButton\n        navItem"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("rightBarButtonItem "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" rightBarButton\n\n        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// UINavigationBar의 setItems에 UINavigationItem 전달")]),t._v("\n        bar"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("setItems")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("navItem"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" animated"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" bar\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("p",[a("code",[t._v("UINavgationItem")]),t._v(" 인스턴스를 생성한 뒤 타이틀 속성값을 지정해준다. 네비게이션 바 중단에 삽입될 문자열에 해당한다.")]),t._v(" "),a("p",[a("code",[t._v("UINavigationBar")]),t._v(" 인스턴스에는 "),a("code",[t._v("setItems")]),t._v(" 메서드가 있는데, 이곳 배열 아규먼트에 "),a("code",[t._v("UINavigationItem")]),t._v(" 인스턴스를 전달하면 된다.")]),t._v(" "),a("p",[t._v("나머지 "),a("code",[t._v("leftBarButtonItem")]),t._v("과 "),a("code",[t._v("rightBarButtonItem")]),t._v("은 "),a("code",[t._v("UINavigationItem")]),t._v("의 속성을 통해 정의할 수 있다.")]),t._v(" "),a("h2",{attrs:{id:"reference"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#reference"}},[t._v("#")]),t._v(" Reference")]),t._v(" "),a("ol",[a("li",[a("a",{attrs:{href:"https://stackoverflow.com/questions/26868847/changing-titletextattribute-in-swift",target:"_blank",rel:"noopener noreferrer"}},[t._v("stackoverflow - Changing textTitleAttribute in Swift"),a("OutboundLink")],1)]),t._v(" "),a("li",[a("a",{attrs:{href:"https://velog.io/@haanwave/scroll-%EC%9C%84%EC%B9%98%EC%97%90-%EB%94%B0%EB%A5%B8-NavigatonBar-%EC%84%A4%EC%A0%95",target:"_blank",rel:"noopener noreferrer"}},[t._v("scroll 위치에 따른 네비게이션 바 설정"),a("OutboundLink")],1)]),t._v(" "),a("li",[a("a",{attrs:{href:"https://stackoverflow.com/questions/58296535/ios-13-new-pagesheet-formsheet-navigationbar-height",target:"_blank",rel:"noopener noreferrer"}},[t._v("stackoverflow - iOS 13 new pageSheet/formSheet navigationBar Height"),a("OutboundLink")],1)])])])}),[],!1,null,null,null);a.default=e.exports},500:function(t,a,s){t.exports=s.p+"assets/img/scroll-edge.27d5b13b.gif"},501:function(t,a,s){t.exports=s.p+"assets/img/attribute.5398d6a9.png"}}]);