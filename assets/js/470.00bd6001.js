(window.webpackJsonp=window.webpackJsonp||[]).push([[470],{1034:function(t,s,a){"use strict";a.r(s);var n=a(6),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"접근제어-개념"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#접근제어-개념"}},[t._v("#")]),t._v(" 접근제어 개념")]),t._v(" "),s("p",[t._v("객체지향에서의 개념 중 은닉화 구현을 위해 접근제어 키워드를 사용한다.")]),t._v(" "),s("p",[t._v("스위프트 접근제어 수준은 5가지가 있다.")]),t._v(" "),s("ol",[s("li",[t._v("open - 다른 모듈에서도 접근 가능, 상속 및 재정의까지 가능 (클래스 )")]),t._v(" "),s("li",[t._v("public - 다른 모듈에서도 접근 가능, 상속 및 재정의는 불가 (구조체)")]),t._v(" "),s("li",[t._v("internal - 같은 모듈 내에서만 접근 가능 (디폴트)")]),t._v(" "),s("li",[t._v("fileprivate - 같은 파일에서만 접근 가능")]),t._v(" "),s("li",[t._v("private - 같은 스코프 내에서만 접근 가능")])]),t._v(" "),s("p",[t._v("클래스 속성에서만 접근제어를 사용할 수 있는 것은 아니다.")]),t._v(" "),s("ol",[s("li",[t._v("타입(클래스/구조체/열거형/스위프트 기본타입 등)")]),t._v(" "),s("li",[t._v("변수/속성")]),t._v(" "),s("li",[t._v("함수/메서드(생성자, 서브스크립트 포함)")]),t._v(" "),s("li",[t._v("프로토콜도 특정영역으로 제한될 수 있음")])]),t._v(" "),s("h2",{attrs:{id:"원칙"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#원칙"}},[t._v("#")]),t._v(" 원칙")]),t._v(" "),s("p",[t._v("타입은 해당 타입을 사용하는 변수나 함수보다 더 퍼블릭한 수준으로 선언해야한다. 함수의 경우 파라미터와 리턴타입의 접근제어 수준이 더 퍼블릭해야한다.")]),t._v(" "),s("p",[t._v("아래는 접근제어를 사용하는 관습적 패턴이다.")]),t._v(" "),s("ol",[s("li",[t._v("프라이빗 속성명은 앞에 언더바를 붙인다.")]),t._v(" "),s("li",[t._v("저장속성의 setter는 프라이빗으로 제한한다.")])]),t._v(" "),s("div",{staticClass:"language-swift extra-class"},[s("pre",{pre:!0,attrs:{class:"language-swift"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SomeOtherClass")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" _name "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string-literal"}},[s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"이름"')])]),t._v("         "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 쓰기 - private")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" name"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("                "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 읽기 - internal")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" _name\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 저장속성의 (외부에서) 쓰기를 제한하기 ⭐️")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SomeAnotherClass")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" name "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string-literal"}},[s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"이름"')])]),t._v("      "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 읽기 - internal / 쓰기 - private")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("div",{staticClass:"custom-block warning"},[s("p",{staticClass:"custom-block-title"},[t._v("커스텀 타입 접근제어")]),t._v(" "),s("p",[t._v("클래스 및 구조체와 같은 커스텀 타입의 접근 제어 수준은 내부 멤버의 접근제어 수준에 영향을 준다. 즉 커스텀타입 자체의 타입 접근 수준이 internal이라면 멤버는 public이나 open으로 선언하더라도 멤버 접근 수준도 internal로 작동한다.")]),t._v(" "),s("p",[t._v("내부 멤버를 명시적으로 선언하지 않는다면 접근 수준은 internal로 세팅된다.")]),t._v(" "),s("p",[t._v("커스텀 타입을 private으로 설정하는 것은 사실상 의미가 없다. 자동으로 fileprivate과 동일하게 동작한다.")])]),t._v(" "),s("p",[t._v("A 접근수준이 B보다 높다는 것은 A 접근수준이 B보다 퍼블릭하다는 것을 의미한다.")]),t._v(" "),s("p",[t._v("클래스 상속시 자식 클래스가 상위 클래스보다 접근수준이 높으면 안된다. 반면 부모클래스를 상속한 자식클래스의 멤버에서 상위클래스 메서드를 재정의할때 접근 수준을 더 높여도 된다.")]),t._v(" "),s("p",[t._v("확장의 경우 본체 타입의 동일한 접근 수준을 유지한다. 본체 타입이 private 멤버이더라도 확장에서는 접근 가능하다.")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("쓰기 제한 접근수준 낮추기")]),t._v(" "),s("div",{staticClass:"language-swift extra-class"},[s("pre",{pre:!0,attrs:{class:"language-swift"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("struct")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TrackedString")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" numberOfEdits "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// setter에 대해서만 private 선언")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 속성 관찰자")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" value"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string-literal"}},[s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"시작"')])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("didSet")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            numberOfEdits "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("위 코드에서 "),s("code",[t._v("numberOfEdits")]),t._v(" 멤버의 읽기는 문제없이 이루어진다.")])]),t._v(" "),s("h2",{attrs:{id:"reference"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#reference"}},[t._v("#")]),t._v(" Reference")]),t._v(" "),s("ol",[s("li",[s("a",{attrs:{href:"https://www.inflearn.com/course/%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EB%AC%B8%EB%B2%95-%EB%A7%88%EC%8A%A4%ED%84%B0-%EC%8A%A4%EC%BF%A8/dashboard",target:"_blank",rel:"noopener noreferrer"}},[t._v("인프런 - 앨런 swift 문법 마스터 스쿨"),s("OutboundLink")],1)])])])}),[],!1,null,null,null);s.default=e.exports}}]);