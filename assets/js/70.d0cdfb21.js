(window.webpackJsonp=window.webpackJsonp||[]).push([[70],{1092:function(t,s,a){"use strict";a.r(s);var n=a(6),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"테이블뷰-악세서리-뷰"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#테이블뷰-악세서리-뷰"}},[t._v("#")]),t._v(" 테이블뷰 악세서리 뷰")]),t._v(" "),s("p",[t._v("시계 앱 클론중에 아래와 같은 UI가 있었다."),s("br"),t._v(" "),s("img",{attrs:{src:a(511),alt:"setting"}})]),t._v(" "),s("p",[t._v("시계 앱의 세부 설정기능이 있는데, 각 세부 설정들을 모아서 관리하는 테이블 뷰가 있다. 이때 해당 테이블 뷰 각 셀마다 우측에 Chevron 이미지가 붙어있는 것을 확인할 수 있는데, 이는 스위프트 자체적으로 테이블 뷰 셀에 할당한 타입 중 하나이다.")]),t._v(" "),s("p",[t._v("스토리보드 상에서 우측 Attributes inspector 메뉴를 보면 중간에 Accessory라는 드롭다운 메뉴가 있다. 이를 None이 아닌 다른 값으로 설정하게 되면 테이블 뷰 셀 자체에 Accessory View라는 영역이 새롭게 할당되며 내부에 컨텐츠를 각 타입에 맞춰 자동으로 넣어준다.")]),t._v(" "),s("p",[s("img",{attrs:{src:a(512),alt:"acc"}})]),t._v(" "),s("h2",{attrs:{id:"악세서리-뷰-커스텀"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#악세서리-뷰-커스텀"}},[t._v("#")]),t._v(" 악세서리 뷰 커스텀")]),t._v(" "),s("p",[t._v("테이블 뷰 editing 모드 하에 햄버거 메뉴를 커스텀하는 것에 한계가 있었던 것 처럼 악세서리 뷰의 disclosure indicator같은 이미지들의 tintColor를 커스텀 하는 것은 애플에서 지원하지 않는다고 한다.")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://stackoverflow.com/questions/58023245/uitableviewcells-accessoryview-has-a-gray-background-color-on-ios-13",target:"_blank",rel:"noopener noreferrer"}},[t._v("다음 문서를"),s("OutboundLink")],1),t._v(" 참고하면 disclosure indicator 이미지의 컬러를 변경해줄 수 있다.")]),t._v(" "),s("p",[t._v("다음은 문서에 작성되어 있었던 코드이다.")]),t._v(" "),s("div",{staticClass:"language-swift extra-class"},[s("pre",{pre:!0,attrs:{class:"language-swift"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("extension")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UITableViewCell")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("func")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function-definition function"}},[t._v("createCustomCellDisclosureIndicator")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("chevronColor"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UIColor")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//MARK: Custom Accessory View")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//Chevron img")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token other-directive property"}},[t._v("#available")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("iOS "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("13.0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" chevronConfig "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UIImage")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SymbolConfiguration")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("pointSize"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("14")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" weight"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("medium"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("guard")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" chevronImg "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UIImage")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("systemName"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string-literal"}},[s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"chevron.right"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" withConfiguration"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" chevronConfig"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("withTintColor")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("chevronColor"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" renderingMode"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("alwaysTemplate"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("else")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" chevron "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UIImageView")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("image"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" chevronImg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n            chevron"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("tintColor "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" chevronColor\n\n            "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//chevron view")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" accessoryViewHeight "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("self")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("frame"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("height\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" customDisclosureIndicator "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UIView")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("frame"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CGRect")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("x"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" y"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" width"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("15")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" height"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" accessoryViewHeight"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n            customDisclosureIndicator"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("addSubview")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("chevron"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n            "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//chevron constraints")]),t._v("\n            chevron"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("translatesAutoresizingMaskIntoConstraints "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),t._v("\n            chevron"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("trailingAnchor"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("constraint")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("equalTo"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" customDisclosureIndicator"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("trailingAnchor"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("constant"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("isActive "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n            chevron"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("centerYAnchor"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("constraint")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("equalTo"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" customDisclosureIndicator"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("centerYAnchor"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("isActive "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n\n            "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//Assign the custom accessory view to the cell")]),t._v("\n            customDisclosureIndicator"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("backgroundColor "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("clear\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("self")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("accessoryView "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" customDisclosureIndicator\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("else")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("self")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("accessoryType "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("disclosureIndicator\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("self")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("accessoryView"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("tintColor "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" chevronColor\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("disclosure indicator를 커스텀하고자 하는 테이블 뷰 셀에 대해 커스텀 클래스 파일을 cocoa touch class 파일로 하나 생성 및 연결한 뒤, 해당 클래스의 확장에 위의 함수를 붙여넣으면 된다.")]),t._v(" "),s("p",[t._v("이후 테이블 뷰 셀 "),s("code",[t._v("awakeFromNib()")]),t._v(" 함수 호출단계에서 위의 확장 함수를 호출하면 된다.")]),t._v(" "),s("h2",{attrs:{id:"reference"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#reference"}},[t._v("#")]),t._v(" Reference")]),t._v(" "),s("ol",[s("li",[s("a",{attrs:{href:"https://stackoverflow.com/questions/58023245/uitableviewcells-accessoryview-has-a-gray-background-color-on-ios-13",target:"_blank",rel:"noopener noreferrer"}},[t._v("stackoverflow - UITableViewCell's accessoryView has a gray background color on iOS 13"),s("OutboundLink")],1)])])])}),[],!1,null,null,null);s.default=e.exports},511:function(t,s,a){t.exports=a.p+"assets/img/settingg.a4b7fe6a.png"},512:function(t,s,a){t.exports=a.p+"assets/img/accessory.480eed9d.jpg"}}]);