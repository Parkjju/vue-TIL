(window.webpackJsonp=window.webpackJsonp||[]).push([[525],{1130:function(t,s,a){"use strict";a.r(s);var n=a(6),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("노마드코더의 타입스크립트 강의 요약본입니다.")]),t._v(" "),s("h2",{attrs:{id:"설치-및-실행"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#설치-및-실행"}},[t._v("#")]),t._v(" 설치 및 실행")]),t._v(" "),s("p",[t._v("다음 명령어를 터미널에 입력합니다.")]),t._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-g")]),t._v(" typescript\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 버전 정보 확인")]),t._v("\ntsc "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--version")]),t._v("\n")])])]),s("p",[t._v("작성한 타입스크립트 파일을 자바스크립트로 변환해주는 명령어는 다음과 같습니다.")]),t._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[t._v("tsc myfile.js\n")])])]),s("p",[t._v("자바스크립트로 컴파일 해도 되지만, 타입스크립트 내부적으로 돌아가는 보호 장치들도 있기 때문에 타입스크립트 파일 자체를 실행하는 방법도 사용하게 됩니다.")]),t._v(" "),s("p",[t._v("먼저 "),s("code",[t._v("ts-node")]),t._v("를 전역적으로 설치합니다.")]),t._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-g")]),t._v(" ts-node\n")])])]),s("p",[t._v("이후 타입스크립트 관련 작업을 진행할 폴더를 IDE에서 열어줍니다. 타입스크립트 설정파일을 먼저 생성해야합니다. "),s("code",[t._v("tsconfig.json")]),t._v("이라는 이름으로 생성합니다.")]),t._v(" "),s("p",[t._v("각종 설정들은 추후 정리 예정이며, 터미널을 폴더로 위치시킨 상태에서 "),s("code",[t._v("tsc --init")]),t._v("을 입력하면 자동으로 설정파일이 생성됩니다.")]),t._v(" "),s("p",[t._v("이후 파일 실행을 위해서 "),s("code",[t._v("ts-node myFile.ts")]),t._v("를 터미널에 입력하면 실행됩니다.")]),t._v(" "),s("p",[t._v("터미널에 "),s("code",[t._v("ts-node")]),t._v("만 입력하면 인터프리터 모드로 진입합니다.")]),t._v(" "),s("h2",{attrs:{id:"타입-안정성"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#타입-안정성"}},[t._v("#")]),t._v(" 타입 안정성")]),t._v(" "),s("p",[t._v("자바스크립트는 매우 유연한 언어이다.")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[t._v("console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// '1,2,3,4false'")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ??")]),t._v("\n")])])]),s("p",[t._v("위의 코드는 아무도 작성하지 않을 코드이다. 하지만 아래의 예시를 봐보자.")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("divide")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("a"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" b")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" a "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v(" b"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\nconsole"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("divide")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 0.6666666....")]),t._v("\nconsole"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'??'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// NaN")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ??")]),t._v("\n")])])]),s("p",[t._v("함수 호출 시 올바른 갑 입력에 대해서만 작동하는 것이 아니라 잘못된 입력에 대해서도 함수가 호출되고 실행까지 문제없이 이루어지게 된다.")]),t._v(" "),s("p",[t._v("문제는 런타임에 발생하는 에러이다.")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" me "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'jun'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nme"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("greet")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Uncaught TypeError...")]),t._v("\n")])])]),s("p",[t._v("위의 코드는 런타임에 발생하게 되는 에러이다. 위와 같이 심각한 오류는 사실상 런타임이 아닌 컴파일 이전에 처리되어야 하는 코드이다. 타입스크리트를 통해 위의 오류를 사전에 방지하는 것이 매우 중요하다.")]),t._v(" "),s("h2",{attrs:{id:"타입스크립트-시작하기"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#타입스크립트-시작하기"}},[t._v("#")]),t._v(" 타입스크립트 시작하기")]),t._v(" "),s("p",[t._v("타입스크립트 코드는 컴파일 시 자바스크립트 코드로 변환된다. 에러가 감지되면 컴파일 시도 자체가 이루어지지 않는다.")]),t._v(" "),s("p",[t._v("이러한 보호 조치가 이루어지는 것은 "),s("strong",[t._v("타입스크립트의 타입 추론이라는 특징 때문에 발생하게 된다.")])]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" name "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Jun'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 타입스크립트에서도 같은 타입으로의 값 변화는 가능하다.")]),t._v("\nname "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Park'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 다른 타입의 값으로는 변화가 불가능하다.")]),t._v("\nname "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 타입스크립트의 타입 선언")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("boolOne")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" boolean "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Type Checker로부터 에러 반환")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 서로 다른 타입으로의 값 할당")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("boolTwo")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" boolean "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'string'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// number로 이루어진 배열임을 선언")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("arr")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" number"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("위 코드 중 콜론을 사이에 두고 타입을 선언하는 것이 "),s("strong",[t._v("명시적 타입이고,")]),t._v(" 일반적인 자바스크립트 변수 선언 방식은 "),s("strong",[t._v("묵시적 타입이다.")]),t._v(" 특정 타입으로 선언된 변수는 묵시적 타입에 따라 다른 타입의 대입 연산이 이루어질 경우 Type Checker가 에러를 발생시킨다.")]),t._v(" "),s("h2",{attrs:{id:"reference"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#reference"}},[t._v("#")]),t._v(" Reference")]),t._v(" "),s("ol",[s("li",[s("a",{attrs:{href:"https://nomadcoders.co/typescript-for-beginners/lobby",target:"_blank",rel:"noopener noreferrer"}},[t._v("노마드코더 Typescript"),s("OutboundLink")],1)])])])}),[],!1,null,null,null);s.default=e.exports}}]);