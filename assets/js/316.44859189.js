(window.webpackJsonp=window.webpackJsonp||[]).push([[316],{850:function(t,s,a){"use strict";a.r(s);var n=a(6),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("유저 모델을 생성하고 페이지 렌더링하는 과정은 mongoDB "),s("a",{attrs:{href:"./210927-mongo"}},[t._v("모델링 1편과")]),t._v(" 동일하다.")]),t._v(" "),s("h2",{attrs:{id:"패스워드-해싱"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#패스워드-해싱"}},[t._v("#")]),t._v(" 패스워드 해싱")]),t._v(" "),s("p",[t._v("패스워드나 민감한 개인정보같은 경우 암호화 작업 없이 DB에 저장하게 되면 데이터가 그대로 노출되게 된다. 암호화 처리를 추가하게 되면 DB상에서 식별될 수 없게 데이터가 바뀌지만 인증에는 문제가 없다.")]),t._v(" "),s("p",[t._v("노드 패키지의 "),s("code",[t._v("bcrypt")]),t._v("를 활용하면 된다. "),s("code",[t._v("npm i bcrypt")]),t._v(" 를 입력하여 설치한다.")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://parkjju.github.io/vue-TIL/daily/210927-mongo.html#mongoose-middleware",target:"_blank",rel:"noopener noreferrer"}},[t._v("몽구스 미들웨어 문서"),s("OutboundLink")],1),t._v("를 참조하여 유저 모델의 패스워드가 DB에 저장되기 전 패스워드 데이터를 해시해야한다.")]),t._v(" "),s("p",[t._v("다음은 "),s("code",[t._v("save")]),t._v(" 직전에 패스워드를 해시해주는 함수이다.")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// .. 스키마 정의")]),t._v("\nuserSchema"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("pre")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"save"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Users password: "')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("password"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("password "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("await")]),t._v(" bcrypt"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("hash")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("password"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Hashed password: "')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("password"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// mongoose.model로 저장")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 모델 익스포트 디폴트")]),t._v("\n")])])]),s("p",[s("code",[t._v("bcrypt.hash(data, saltRound, callback)")]),t._v("을 전달하면 된다. 어싱크 어웨이트 문법을 사용하면 콜백은 전달하지 않아도 되고 파라미터 중 "),s("code",[t._v("saltRound")]),t._v("의 경우 오리지널 데이터를 몇 번 해싱 할 것인지 라운드를 정하는 파라미터이다.")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),s("p",[t._v("로그인 기능 중 해시한 비밀번호와 입력된 값의 일치성을 검사하기 위해서는 입력된 패스워드를 "),s("strong",[t._v("saltRound")]),t._v("만큼 해시하여 일치하는지 확인해보면 된다. 직접 해당 기능을 구현해도 되지만 "),s("code",[t._v("bcrypt")]),t._v(" 패키지의 "),s("code",[t._v("compare")]),t._v("를 이용하면 된다.")]),t._v(" "),s("p",[s("code",[t._v('bcrypt.compare("myText", hashValue).then(callback);')])])]),t._v(" "),s("h2",{attrs:{id:"duplicate-key-error-처리"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#duplicate-key-error-처리"}},[t._v("#")]),t._v(" duplicate key error 처리")]),t._v(" "),s("p",[s("code",[t._v("duplicate key error")]),t._v("는 스키마의 데이터에 "),s("code",[t._v("unique")]),t._v("옵션을 부여했음에도 중복되는 값을 DB에 저장하려고 할 때 발생하는 에러이다.")]),t._v(" "),s("p",[t._v("중복 값을 포스트시 DB에서 에러 메세지를 띄우고 무한 로딩을 통해 유효성 검사에서 통과시키지 않지만 에러를 처리해야 사용자 경험이 향상된다.")]),t._v(" "),s("p",[t._v("애러의 처리는 "),s("code",[t._v("Model.exists")]),t._v(" 메서드를 활용하면 된다. 반환값은 불리언 값으로 이후 조건문을 통해 흐름을 제어하면 된다.")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" exists "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("await")]),t._v(" User"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("exists")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("$or")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" username "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" email "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),s("p",[s("code",[t._v("exists")]),t._v(" 메서드의 "),s("code",[t._v("$or")]),t._v("옵션을 지정하면 한꺼번에 여러 데이터에 대해 중복 검사를 진행할 수 있다.")])]),t._v(" "),s("div",{staticClass:"custom-block warning"},[s("p",{staticClass:"custom-block-title"},[t._v("WARNING")]),t._v(" "),s("p",[t._v("크롬 브라우저에서는 폼으로 유저네임과 패스워드를 입력받은 후 서버로부터 상태 코드를 200 OK를 받게되면 정상적인 입출력으로 판단하여 브라우저에 아이디 및 패스워드 자동완성 데이터로 저장하려고 한다.")]),t._v(" "),s("p",[s("code",[t._v("res.render")]),t._v("같은 메서드는 기본적으로 200 OK를 반환하기 때문에 렌더링이 되어도 잘못된 입력이 이루어졌을 경우 상태 코드를 다르게 반환받아야한다.")]),t._v(" "),s("p",[s("code",[t._v("render")]),t._v("에 상태코드를 보내는 방법은 "),s("code",[t._v('res.status(400).render("")')]),t._v(" 이다. 잘못된 페이지에 대해 올바른 상태 코드를 전달하게 되면 브라우저가 "),s("strong",[t._v("URL")]),t._v("을 히스토리에 저장하지 않는다.")])]),t._v(" "),s("h2",{attrs:{id:"세션과-쿠키"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#세션과-쿠키"}},[t._v("#")]),t._v(" 세션과 쿠키")]),t._v(" "),s("p",[t._v("세션이란 백엔드와 브라우저 간에 어떤 활동을 했는지 기억하는 것을 말한다. 특성 사이트에 로그인했다면 브라우저와 백엔드에 세션이 존재하는 상태이다. 세션 유지에 대한 작업을 추가하지 않은 상태에서 로그인을 하면 로그인 후 서버에서 전달해주는 HTML을 렌더링 한 뒤 세션이 끊어지게 된다. 이를 무상태(stateless)라고 한다.")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),s("p",[t._v("세션은 미들웨어, 쿠키는 쿠키! 세션이 쿠키를 전달한다 라고 이해하자.")])]),t._v(" "),s("p",[t._v("이러한 HTTP의 특성으로 인한 웹서비스 구현 한계를 극복하기 위해 세션과 쿠키를 활용하게 된다.")]),t._v(" "),s("p",[t._v("링크 참조 - "),s("a",{attrs:{href:"http://expressjs.com/en/resources/middleware/session.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("express session"),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("세션을 이용하기 위해서는 "),s("code",[t._v("express-session")]),t._v("을 설치하자. "),s("code",[t._v("npm i express-session")])]),t._v(" "),s("p",[t._v("미들웨어 정의를 통해 익스프레스의 세션을 사용할 수 있는데, 라우터 정의 이전에 사용해야한다.")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("app"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("use")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("session")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("secret")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Hello!"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("resave")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("saveUninitialized")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[s("code",[t._v("session")]),t._v("메서드는 세션을 생성하고 내부에 옵션들을 전달할 수 있다. 다양한 옵션들이 있지만 예제 코드로 작성된 옵션들만 정리해보면")]),t._v(" "),s("ol",[s("li",[t._v("resave - 모든 리퀘스트마다 기존에 있던 세션에 아무런 변경사항이 없을 시에도 해당 세션을 저장한다. (디폴트가 false로 바뀜)")]),t._v(" "),s("li",[t._v("saveUninitialized - 리퀘스트가 들어오면 해당 리퀘스트에서 새로 생성된 세션에 아무런 작업이 이루어지지 않은 상황을 Uninitialized라고 한다. default는 true이고 resave 옵션과 비슷한 의미를 지닌다.")]),t._v(" "),s("li",[t._v("secret - 세션 아이디를 담는 쿠키의 키값. 변경 시 현재 살아있는 세션들이 모두 무효화된다.")])]),t._v(" "),s("p",[t._v("세션 생성 이후 세션을 통해 다룰 정보를 우리가 직접 추가해줘야 한다. 세션은 브라우저 마다 다르게 생겼기 때문이다.")]),t._v(" "),s("p",[t._v("세션은 기본적으로 객체이기 때문에 정보를 추가하는 것은 어렵지 않다.")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("req"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("session"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("loggedIn "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nreq"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("session"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("user "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" user"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("리퀘스트의 세션에 프로퍼티를 추가해주면 된다.")]),t._v(" "),s("p",[t._v("세션에다가 우리가 다룰 정보들을 추가해줬는데 이를 렌더링할 때 사용하기 위해서는 다른 방식을 사용해야한다. 퍼그라는 프레임워크는 세션에 접근할 수 없기 때문이다.")]),t._v(" "),s("p",[t._v("미들웨어 함수들을 담을 자바스크립트 파일 생성 후 서버 자바스크립트 파일에 임포트 한 뒤 다음의 코드처럼 "),s("code",[t._v("locals")]),t._v("라는 리스폰스 오브젝트를 활용한다.")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("localsMiddleware")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("req"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" res"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  res"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("locals"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("siteName "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Wetube"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  res"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("locals"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("loggedIn "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("Boolean")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("req"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("session"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("loggedIn"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  res"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("locals"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("loggedInUser "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" req"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("session"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("user"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("res"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("locals"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[s("code",[t._v("locals")]),t._v("오브젝트를 통해 퍼그 템플릿과 익스프레스 둘 다 동시에 접근할 수 있게 된다. 퍼그에서 locals 오브젝트를 사용하기 위해서는 "),s("code",[t._v("#{localsVariable}")]),t._v("형태로 사용하면 된다.")]),t._v(" "),s("div",{staticClass:"language-pug extra-class"},[s("pre",{pre:!0,attrs:{class:"language-pug"}},[s("code",[s("span",{pre:!0,attrs:{class:"token flow-control"}},[s("span",{pre:!0,attrs:{class:"token branch keyword"}},[t._v("if")]),t._v(" loggedIn")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token tag"}},[t._v("li")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token tag"}},[t._v("a"),s("span",{pre:!0,attrs:{class:"token attributes"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("href")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/logout"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")])])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token plain-text"}},[t._v("Log out")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token tag"}},[t._v("li")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token tag"}},[t._v("a"),s("span",{pre:!0,attrs:{class:"token attributes"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("href")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/my-profile"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")])])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token plain-text"}},[t._v("#{loggedInUser.name}'s Profile")]),t._v("\n")])])]),s("h3",{attrs:{id:"mongostore"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#mongostore"}},[t._v("#")]),t._v(" MongoStore")]),t._v(" "),s("p",[t._v("쿠키에 저장되는 세션은 세션의 ID만 저장된다. 세션 내용을 데이터베이스에 저장하고싶다면 해당 데이터베이스에 맞는 모듈을 새로 설치해야한다.")]),t._v(" "),s("p",[t._v("몽고 DB의 경우 "),s("code",[t._v("connect-mongo")]),t._v("모듈이 해당한다. 세션을 데이터베이스에 저장하였기 때문에 서버 재시작 후에 데이터베이스만 연결되어 있다면 회원 로그인 상태를 잃어버리지 않고 유지할 수 있게 된다.")]),t._v(" "),s("p",[s("code",[t._v("connect-mongo")]),t._v(" 설치 및 임포트 후 익스프레스 세션 생성 시 사용했던 옵션에 "),s("code",[t._v("store")]),t._v("를 추가해준다. "),s("code",[t._v(".create")]),t._v("메서드에 몽고 데이터베이스 URL까지 전달하면 완료된다.")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" MongoStore "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"connect-mongo"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\napp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("use")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("session")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("secret")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Hello!"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("resave")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("saveUninitialized")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("store")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" MongoStore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("create")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("mongoUrl")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"mongodb://127.0.0.1:27017/wetube"')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("세션을 데이터베이스에 연결한 뒤 회원정보를 가지고 로그인을 하면 데이터베이스에 세션 데이터와 함께 회원 정보 객체가 기록된다. 따라서 데이터베이스가 삭제되지 않는 이상 백엔드를 재시작해도 로그인 상태를 기억하고 있게 된다.")]),t._v(" "),s("p",[t._v("문제는 "),s("code",[t._v("resave")]),t._v("와 "),s("code",[t._v("saveUninitialized")]),t._v(" 옵션을 "),s("code",[t._v("true")]),t._v("값으로 저장해두면 로그인 한 사용자와 로그인 하지 않은 사용자에 상관 없이 모든 세션을 DB에 저장하기 때문에 서버에 부하가 심하게 걸린다는 것이다.")]),t._v(" "),s("div",{staticClass:"custom-block warning"},[s("p",{staticClass:"custom-block-title"},[t._v("WARNING")]),t._v(" "),s("p",[s("code",[t._v("Uninitialized")]),t._v("는 세션 생성 후 수정된 적이 없는 상태를 말한다. 세션을 수정은 컨트롤러에서 "),s("code",[t._v("req.session")]),t._v("을 통해 처리하였고 해당 부분에서 실질적인 세션의 초기화가 이루어지는 것이다. "),s("code",[t._v("saveUninitialized")]),t._v("옵션을 "),s("code",[t._v("false")]),t._v("로 설정함으로써 세션의 초기화가 일어날 때만 해당 세션을 DB에 저장하겠다는 것이다.")])]),t._v(" "),s("h2",{attrs:{id:"cookie-property"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#cookie-property"}},[t._v("#")]),t._v(" Cookie property")]),t._v(" "),s("ol",[s("li",[t._v("secret : 쿠키에 서명할 때에 남기는 문자열이다. 쿠키에 서명하는 이유는 백엔드가 쿠키를 줬다는 것을 보이기 위함이다. (세션 하이잭 공격을 방어)")]),t._v(" "),s("li",[t._v("Domain : 쿠키를 만든 백엔드가 누구인지 알려준다. (예 - localhost) 도메인으로 쿠키를 보내고 도메인으로부터 쿠키를 받는다.")]),t._v(" "),s("li",[t._v("Expires : 쿠키의 만료 날짜이다.\n"),s("ul",[s("li",[t._v("만료 날짜를 설정해두지 않으면 브라우저가 닫히거나 컴퓨터를 재시작할 때 소멸된다.")]),t._v(" "),s("li",[t._v("maxAge는 밀리세컨드 단위이므로, 1/1000을 계산하여 고려하도록 하자.")])])])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("app"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("use")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("session")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("cookie")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("maxAge")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("5000")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("h2",{attrs:{id:"nodejs-환경변수-처리법"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#nodejs-환경변수-처리법"}},[t._v("#")]),t._v(" nodeJS 환경변수 처리법")]),t._v(" "),s("p",[t._v("기본적으로 세션의 "),s("code",[t._v("secret")]),t._v("옵션의 스트링과 "),s("code",[t._v("mongoDB")]),t._v("의 URL은 환경변수로 처리하여 깃에 업로드 해야한다.")]),t._v(" "),s("ol",[s("li",[s("code",[t._v("dotenv")]),t._v(" 모듈을 설치한 뒤"),s("code",[t._v(".env")]),t._v("파일을 생성한다.")]),t._v(" "),s("li",[s("strong",[t._v("As early as possible in your application, require and configure dotenv.")]),t._v(" 권고문에 따라 자신이 "),s("code",[t._v("dotenv")]),t._v(" 모듈을 사용할 모든 자바스크립트 파일에 "),s("code",[t._v("require('dotenv').config()")]),t._v(" 코드를 작성한다.\n"),s("ul",[s("li",[s("code",[t._v("require")]),t._v("가 아닌 "),s("code",[t._v("import")]),t._v("방식을 사용하려면 파일 흐름 상 가장 처음 실행되는 자바스크립트 파일 첫 줄에 "),s("code",[t._v('import "dotenv/config";')]),t._v("를 추가해준다.")])])]),t._v(" "),s("li",[t._v("관례적으로 환경변수 명은 전부 대문자로 작성하며 문자열의 경우에도 따옴표를 붙이지 않는다.\n"),s("ul",[s("li",[s("code",[t._v("COOKIE_SECRET=.....")])])])]),t._v(" "),s("li",[t._v("환경변수를 사용하는 코드를 "),s("code",[t._v("process.env.COOKIE_SECRET")]),t._v("로 대체한다.")])]),t._v(" "),s("h2",{attrs:{id:"로그아웃"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#로그아웃"}},[t._v("#")]),t._v(" 로그아웃")]),t._v(" "),s("p",[t._v("라우터, 컨트롤러 정의하고 "),s("code",[t._v("res.session.destroy()")]),t._v(" 호출하면 끝!")])])}),[],!1,null,null,null);s.default=e.exports}}]);