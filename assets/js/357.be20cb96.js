(window.webpackJsonp=window.webpackJsonp||[]).push([[357],{909:function(t,s,a){"use strict";a.r(s);var n=a(6),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"import-express"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#import-express"}},[t._v("#")]),t._v(" import express")]),t._v(" "),s("ol",[s("li",[s("code",[t._v("npm i express")])]),t._v(" "),s("li",[t._v("서버를 구축할 "),s("code",[t._v(".js")]),t._v("파일 생성")]),t._v(" "),s("li",[s("code",[t._v("express")]),t._v(" 모듈 임포트")]),t._v(" "),s("li",[t._v("익스프레스 함수를 통해 객체 생성")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" express "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'express'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" app "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("express")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("handleListening")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Server listening on port 4000 !!'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\napp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("listen")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("4000")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" handleListening"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("h2",{attrs:{id:"서버-구축"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#서버-구축"}},[t._v("#")]),t._v(" 서버 구축")]),t._v(" "),s("p",[t._v("서버는 클라이언트의 리퀘스트(request)를 리스닝(listening)하고있다.")]),t._v(" "),s("p",[t._v("클라이언트로부터 행동이 감지될 때까지 기다리도록 해야한다."),s("br"),t._v("\n익스프레스 함수로 생성한 객체의 "),s("code",[t._v(".listen()")]),t._v(" 메소드를 호출함으로써 위의 기능이 구현된다."),s("br"),t._v(" "),s("code",[t._v(".listen()")]),t._v(" 메소드에는 콜백이 전달된다.")]),t._v(" "),s("p",[t._v("콜백 전달 이전에 "),s("strong",[t._v("서버에게 어떤 포트를 리스닝할지 알려줘야한다.")])]),t._v(" "),s("h2",{attrs:{id:"요청-처리"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#요청-처리"}},[t._v("#")]),t._v(" 요청 처리")]),t._v(" "),s("p",[t._v("익스프레스로 객체 생성 후 다른 페이지 생성 없이 바로 서버를 돌리게 되면 "),s("code",[t._v("Cannot GET /")]),t._v("라는 메세지가 출력되어있다."),s("br"),t._v(" "),s("code",[t._v("/")]),t._v("는 루트 페이지를 의미하며, 루트 페이지를 얻어올 수 없다고 말하는 것이다. (GET 메서드)")]),t._v(" "),s("p",[t._v("마찬가지로 "),s("code",[t._v("Cannot GET /page")]),t._v("라고 한다면 page라는 이름의 페이지를 GET 할 수 없다는 의미이다.")]),t._v(" "),s("ol",[s("li",[t._v("익스프레스 함수로 앱을 생성한다.")]),t._v(" "),s("li",[s("code",[t._v(".listen")]),t._v("메서드로 요청을 감지한다.")]),t._v(" "),s("li",[s("strong",[t._v("요청에 대한 처리 코드 작성은 앱 생성과 listen 메서드 사이에 작성한다")])])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// express()로 app객체 생성하는 코드")]),t._v("\napp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Somebody is trying to go home.'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// app객체 listen메서드로 요청 리스닝하는 코드")]),t._v("\n")])])]),s("p",[s("code",[t._v(".get()")]),t._v(" 메서드는 다음과 같은 인자들을 받는다.")]),t._v(" "),s("ol",[s("li",[t._v("라우트(요청할 페이지 링크) 설정")]),t._v(" "),s("li",[t._v("요청 성공시 콜백 함수")])]),t._v(" "),s("p",[t._v("겟 메서드를 통해 브라우저에서 요청을 하기는 했지만 이에 대한 서버의 응답처리를 마련하지 않은 상태이다. (무한 로딩상태)")]),t._v(" "),s("h2",{attrs:{id:"응답-처리"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#응답-처리"}},[t._v("#")]),t._v(" 응답 처리")]),t._v(" "),s("p",[t._v("리퀘스트(request) 객체를 찍어보자.")]),t._v(" "),s("p",[t._v("해당 작업 진행 전 JS 이벤트 리스너에 대해 복습해보면")]),t._v(" "),s("ol",[s("li",[s("code",[t._v('button.addEventListener("click", handleClick);')]),t._v(" - 버튼 요소에 이벤트 추가")]),t._v(" "),s("li",[t._v("클릭 이벤트 발생 시 콜백함수인 "),s("code",[t._v("handleClick")]),t._v(" 함수로 "),s("code",[t._v("event")]),t._v("객체가 전달된다.")])]),t._v(" "),s("p",[t._v("위의 두 과정처럼 익스프레스 객체의 "),s("code",[t._v(".get")]),t._v(" 메서드도 동일하게 처리된다.")]),t._v(" "),s("ol",[s("li",[s("code",[t._v("app.get('/', handleHome)")]),t._v("으로 GET 요청을 보낸다.")]),t._v(" "),s("li",[t._v("GET 요청이 정상적으로 이루어지면 콜백에 인자를 전달하는데 여기서는 "),s("strong",[t._v("response, request")]),t._v(" 객체 두 개를 전달하게 된다.")]),t._v(" "),s("li",[s("code",[t._v("request, response")]),t._v(" 객체들을 출력해보자.")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// express로 객체 생성")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("handleHome")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("req"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" res")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("req"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("res"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\napp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" handleHome"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// .listen으로 요청 리스닝")]),t._v("\n")])])]),s("p",[s("code",[t._v("response.end()")]),t._v(" 메서드로 요청을 종료할 수도 있다.")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ..")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("handleHome")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("req"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" res")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" res"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("end")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//here!!")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\napp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" handleHome"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n")])])])])}),[],!1,null,null,null);s.default=e.exports}}]);