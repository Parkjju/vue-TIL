(window.webpackJsonp=window.webpackJsonp||[]).push([[54],{1142:function(s,t,a){"use strict";a.r(t);var e=a(6),r=Object(e.a)({},(function(){var s=this,t=s._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h2",{attrs:{id:"static-site-generator"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#static-site-generator"}},[s._v("#")]),s._v(" Static Site Generator")]),s._v(" "),t("p",[s._v("뷰프레스는 "),t("code",[s._v("Vue")]),s._v(" 기반의 정적 사이트 생성기입니다. 하나부터 열까지 페이지를 직접 제작할 수도 있지만 현실적으로 어려운 경우가 많기 때문에 다양한 장점을 갖는 정적 사이트 생성기들을 이용하게 됩니다.")]),s._v(" "),t("ol",[t("li",[s._v("마크다운 문법을 빌드 시에 html파일로 변환해줍니다.")]),s._v(" "),t("li",[s._v("빌트인 레이아웃, 템플릿들이 많습니다.")]),s._v(" "),t("li",[s._v("빌트인 SEO 기능이 있습니다.")]),s._v(" "),t("li",[s._v("다양한 라이브러리, 플러그인들을 통해 확장성을 키울 수 있습니다.")])]),s._v(" "),t("p",[s._v("Gatsby, Jekyll 등 종류가 매우 다양하지만, 이번 문서에서는 뷰프레스를 어떻게 활용하면 되는지 기초부터 알아보도록 하겠습니다 🗣")]),s._v(" "),t("h2",{attrs:{id:"vuepress-설치"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#vuepress-설치"}},[s._v("#")]),s._v(" Vuepress 설치")]),s._v(" "),t("p",[s._v("뷰프레스 사이트를 배포할 레포지토리를 생성합니다. "),t("code",[s._v("<Yourname>.github.io")]),s._v("로 생성하면 깃헙에서 제공하는 Github pages의 홈 URL로 연결되며, 그 외의 레포지토리로 생성할 경우 "),t("code",[s._v("<Yourname>.github.io.<YourRepository>")]),s._v("로 연결이 됩니다. "),t("strong",[s._v("추후 베이스 URL을 설정해야 404페이지가 뜨지 않습니다.")])]),s._v(" "),t("div",{staticClass:"language-sh extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" create vuepress-site\n")])])]),t("p",[s._v("위 명령어를 실행하면 뷰프레스 기본 테마로 사이트 하나를 생성하게 됩니다. 기본 세팅 질문들이 몇 가지 정도 되는데, 가장 처음에 묻는 프로젝트 명을 "),t("code",[s._v("docs")]),s._v("라고 설정해줍시다. 설치가 끝나면 "),t("code",[s._v("docs")]),s._v("폴더 밑에 "),t("code",[s._v("src")]),s._v("를 비롯한 뷰프레스 기본 파일들이 생성됩니다.")]),s._v(" "),t("ol",[t("li",[t("code",[s._v(".vuepress")]),s._v(" - 뷰프레스 "),t("code",[s._v("configure")]),s._v(", 설정파일들과 빌드 결과물이 모이는 장소입니다.")]),s._v(" "),t("li",[t("code",[s._v("config")]),s._v(", "),t("code",[s._v("guide")]),s._v(", "),t("code",[s._v("index.md")]),s._v(" - 디폴트 테마의 뷰프레스 페이지를 나타내는 기본 마크다운 파일들입니다.")]),s._v(" "),t("li",[t("code",[s._v(".gitignore")]),s._v(", "),t("code",[s._v("package.json")]),s._v(" - 이그노어 파일, 패키지 설정파일입니다. 이 파일들은 루트 위치에 이동시킵니다.")])]),s._v(" "),t("p",[t("code",[s._v("package.json")]),s._v("을 루트에 옮겼으니, 뷰프레스 빌드를 위한 스크립트 명령어를 "),t("code",[s._v("src")]),s._v("에서 "),t("code",[s._v("docs")]),s._v("로 변경합니다. "),t("code",[s._v("docs")]),s._v(" 폴더를 빌드하며 자동으로 "),t("code",[s._v(".vuepress")]),s._v(" 폴더를 생성하게 될텐데, "),t("code",[s._v("yarn create vuepress-site")]),s._v(" 명령어를 실행하며 생성되었던 "),t("code",[s._v(".vuepress")]),s._v("폴더를 "),t("code",[s._v("docs")]),s._v(" 폴더 하위에 옮겨놓았으므로 빌드 결과물은 자동으로 해당 위치에 생성됩니다.")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"docs"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"version"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"0.0.1"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"description"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"main"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"index.js"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"authors"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"name"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"email"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"repository"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/docs"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"scripts"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"dev"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"vuepress dev docs"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 수정!")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"build"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"vuepress build docs"')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 수정!")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"license"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"MIT"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"devDependencies"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"vuepress"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"^1.5.3"')]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("p",[t("code",[s._v("src")]),s._v(" 폴더에서 모든 파일들을 꺼내 "),t("strong",[s._v("docs")]),s._v(" 하위에 위치시킵니다. "),t("code",[s._v("src")]),s._v(" 폴더는 삭제합니다. 그후 레포지토리 루트 위치에서 다음 명령어를 실행합니다.")]),s._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[s._v("폴더 구조 짚어보기")]),s._v(" "),t("p",[t("code",[s._v("yarn create vuepress-site")]),s._v(" 직후 폴더 구조는 다음과 같습니다.")]),s._v(" "),t("div",{staticClass:"language-text extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("docs-\n    |-- package.json\n    |-- .gitignore\n    |-- src\n         |-- .vuepress\n         \t\t |-- components\n                 |-- styles\n                 |-- config.js\n                 |-- enhanceApp.js\n         |-- config\n         |-- guide\n")])])]),t("p",[s._v("폴더구조 개편 이후는 다음과 같습니다.")]),s._v(" "),t("div",{staticClass:"language-text extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("package.json\n.gitignore\ndocs-\n\t|-- .vuepress\n    \t\t|-- components\n            |-- styles\n            |-- config.js\n            |-- enhanceApp.js\n    |-- config\n    |-- guide\n")])])])]),s._v(" "),t("div",{staticClass:"language-sh extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-D")]),s._v(" vuepress\n")])])]),t("p",[s._v("위 명령어를 실행하면 폴더 루트 위치에 뷰프레스 패키지의 디펜던시들이 "),t("code",[s._v("node_modules")]),s._v("에 모이게 됩니다.")]),s._v(" "),t("p",[s._v("이후 다음의 명령어를 실행해봅니다. "),t("strong",[s._v("package.json")]),s._v(' 루트에 위치해야하고, 스크립트 명령어의 "vuepress dev src", "vuepress build src"의 '),t("code",[s._v("src")]),s._v("도 "),t("code",[s._v("docs")]),s._v("로 변경한 상태여야 합니다.")]),s._v(" "),t("div",{staticClass:"language-sh extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" build\n")])])]),t("p",[s._v("위 명령어를 실행하면 "),t("code",[s._v("docs/.vuepress")]),s._v("폴더 하위에 "),t("code",[s._v("dist")]),s._v("폴더가 생성되며 마크다운 파일 및 정적 파일들이 html로 변환되어 생성됩니다.")]),s._v(" "),t("div",{staticClass:"language-sh extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" dev\n")])])]),t("p",[s._v("위 명령어를 이후 실행하면 로컬호스트에서 "),t("code",[s._v("dist")]),s._v("폴더 내용을 렌더링하게 됩니다.")]),s._v(" "),t("div",{staticClass:"custom-block warning"},[t("p",{staticClass:"custom-block-title"},[s._v("Base URL")]),s._v(" "),t("p",[s._v("뷰프레스 사이트 배포를 위한 레포지토리를 "),t("code",[s._v("<Username>.github.io")]),s._v("로 생성하지 않고 개별 레포지토리로 생성한 분들은 "),t("strong",[s._v("반드시")]),s._v(" "),t("code",[s._v(".vuepress")]),s._v(" 폴더의 "),t("code",[s._v("config.js")]),s._v("의 "),t("code",[s._v("base")]),s._v(" 값을 설정해야합니다. 베이스 페이지를 설정하지 않으면 "),t("strong",[s._v("스타일 임포트도 안되며 404페이지만 뜨게 됩니다.")])]),s._v(" "),t("div",{staticClass:"language-js extra-class"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[s._v("module"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("base")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'/repositoryName/'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//...")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])])]),s._v(" "),t("h2",{attrs:{id:"vuepress-배포"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#vuepress-배포"}},[s._v("#")]),s._v(" Vuepress 배포")]),s._v(" "),t("p",[s._v("설치가 끝났으니 이제 배포를 할 차례입니다. 자동 배포와 같은 것들은 "),t("code",[s._v("Github Actions")]),s._v("를 활용한 자동 배포 글에 작성해두었으니, "),t("a",{attrs:{href:"https://parkjju.github.io/vue-TIL/git/GA.html",target:"_blank",rel:"noopener noreferrer"}},[s._v("다음의 링크를"),t("OutboundLink")],1),s._v(" 참조해주세요.")]),s._v(" "),t("p",[s._v("먼저 "),t("code",[s._v("docs")]),s._v(" 폴더 하위에 쉘 스크립트 "),t("code",[s._v("deploy.sh")]),s._v("를 생성해줍니다. 파일 명은 아무거나 해도 상관없습니다. 이후 다음 코드를 복사하여 붙여넣어줍니다.")]),s._v(" "),t("div",{staticClass:"language-sh extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[t("span",{pre:!0,attrs:{class:"token shebang important"}},[s._v("#!/usr/bin/env sh")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# abort on errors")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("set")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-e")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# build commands")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" build\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# navigate into the build output directory")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" .vuepress/dist\n\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" init\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-A")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" commit "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-m")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"deploy with vuepress script"')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" push "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-f")]),s._v(" https://github.com/"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("Username"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("/"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("Repository"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(".git main:gh-pages\n\n"),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" -\n")])])]),t("p",[s._v("위 코드를 뜯어보겠습니다.")]),s._v(" "),t("ol",[t("li",[t("code",[s._v("set -e")]),s._v(" : "),t("a",{attrs:{href:"https://frankler.tistory.com/59",target:"_blank",rel:"noopener noreferrer"}},[s._v("다음의 링크를"),t("OutboundLink")],1),s._v(" 참조해주세요.")]),s._v(" "),t("li",[t("code",[s._v("yarn build")]),s._v(" : 뷰프레스 빌드를 명령합니다.")]),s._v(" "),t("li",[t("code",[s._v("cd .vuepress/dist")]),s._v(" : 뷰프레스 빌드 결과물이 모여있는 위치로 이동합니다. "),t("strong",[s._v("현재 디렉토리는 deploy.sh가 위치한 곳을 기준으로 합니다.")])]),s._v(" "),t("li",[t("code",[s._v("git init")]),s._v(" ~ "),t("code",[s._v("git push -f ..")]),s._v(" - 배포 대상 레포지토리에 푸시하는 작업을 진행합니다. "),t("code",[s._v("gh-pages")]),s._v(" 브랜치에 배포하게 되며, 푸시 링크는 레포지토리 링크를 복사하여 붙여넣어줍니다. "),t("strong",[s._v("배포 레포지토리의 디폴트 브랜치가 Main인지 master인지 확인합시다.")])]),s._v(" "),t("li",[t("code",[s._v("cd -")]),s._v(" : 이전 경로로 이동합니다.")])]),s._v(" "),t("p",[t("code",[s._v("deploy.sh")]),s._v("를 생성하였으면 해당 파일이 있는 위치로 터미널을 이동시킨 후 다음 명령어를 실행합니다.")]),s._v(" "),t("div",{staticClass:"language-sh extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[s._v("sh")]),s._v(" deploy.sh\n")])])]),t("p",[s._v("이후 자동으로 빌드 및 배포를 진행하게 됩니다.")]),s._v(" "),t("h2",{attrs:{id:"vuepress-문서-작성하기"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#vuepress-문서-작성하기"}},[s._v("#")]),s._v(" Vuepress 문서 작성하기")]),s._v(" "),t("p",[s._v("뷰프레스에서 문서를 작성하는 방법은 다음과 같습니다. "),t("code",[s._v("docs")]),s._v(" 폴더 아래에 작성할 문서를 주제별로 폴더를 생성하여 묶어줍니다. "),t("code",[s._v("javascript")]),s._v(", "),t("code",[s._v("react")]),s._v("폴더를 생성한다고 가정하겠습니다. ES6, hoisting 문서를 자바스크립트 폴더에 넣고 JSX, useState내용을 리액트 폴더에 넣겠습니다.")]),s._v(" "),t("p",[s._v("폴더 구조는 다음과 같아집니다.")]),s._v(" "),t("div",{staticClass:"language-text extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("docs\n  |-- .vuepress/\n  |-- javascript\n  \t\t  |-- es6.md\n          |-- hoisting.md\n  |-- react\n  \t\t  |-- jsx.md\n          |-- usestate.md\n")])])]),t("p",[s._v("마크다운 기반으로 문서를 먼저 작성합니다. 마크다운 문법은 "),t("a",{attrs:{href:"https://gist.github.com/ihoneymon/652be052a0727ad59601",target:"_blank",rel:"noopener noreferrer"}},[s._v("다음을 참고"),t("OutboundLink")],1),s._v("해주세요.")]),s._v(" "),t("p",[s._v("문서 작성이 완료되었으면 "),t("strong",[s._v("문서를 등록해줘야 합니다.")]),s._v(" 등록은 "),t("code",[s._v("config.js")]),s._v(" 파일에 진행합니다. "),t("code",[s._v("config.js")]),s._v("의 "),t("code",[s._v("sidebar")]),s._v("를 보겠습니다.")]),s._v(" "),t("div",{staticClass:"language-js extra-class"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[s._v("module"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("themeConfig")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//.. 각종 설정")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("sidebar")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("title")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'Javascript'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("collapsable")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("children")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'/javascript/es6'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'/javascript/hoisting'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("title")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'React'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("collapsable")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("children")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'/react/jsx'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'/react/usestate'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),t("p",[s._v("위와 같이 등록하게 됩니다.")]),s._v(" "),t("ol",[t("li",[t("code",[s._v("title")]),s._v(": 사이드바에 문서들을 모아둘 카테고리 명 입니다.")]),s._v(" "),t("li",[t("code",[s._v("collapsable")]),s._v(": "),t("code",[s._v("Boolean")]),s._v("값을 받으며, "),t("code",[s._v("false")]),s._v("로 설정할 경우 사이드바 카테고리 내의 문서 목록이 오픈된 채로 사이트가 열립니다.")]),s._v(" "),t("li",[t("code",[s._v("children")]),s._v(" : 카테고리 내부 문서 목록들을 등록합니다. 확장자는 필요 없고, 폴더 명과 파일 명만 입력하면 됩니다.")])]),s._v(" "),t("h2",{attrs:{id:"플러그인-설치"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#플러그인-설치"}},[s._v("#")]),s._v(" 플러그인 설치")]),s._v(" "),t("p",[s._v("뷰프레스는 각종 플러그인들을 설치하여 더 기능적으로 우수한 블로그를 만들어갈 수 있습니다. 뷰프레스 버전 1 플러그인 목록은 "),t("a",{attrs:{href:"https://github.com/vuepress/awesome-vuepress/blob/main/v1.md",target:"_blank",rel:"noopener noreferrer"}},[s._v("다음의 링크"),t("OutboundLink")],1),s._v("에서 확인하실 수 있습니다. 현재 블로그에 설치해둔 유용한 플러그인 몇가지를 소개해드리겠습니다.")]),s._v(" "),t("h3",{attrs:{id:"_0-설치와-등록"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_0-설치와-등록"}},[s._v("#")]),s._v(" 0. 설치와 등록")]),s._v(" "),t("p",[s._v("먼저 플러그인 설치와 등록 방법입니다. "),t("code",[s._v("yarn add")]),s._v(" 또는 "),t("code",[s._v("npm install")]),s._v(" 명령어를 통해 설치합니다. 뷰프레스 플러그인들은 "),t("code",[s._v("devDependencies")]),s._v("로 분류가 되기 때문에 "),t("code",[s._v("yarn add -D")]),s._v(" 옵션으로 설치하도록 합시다.")]),s._v(" "),t("p",[t("code",[s._v("config.js")]),s._v(" 파일의 "),t("code",[s._v("module.exports = {}")]),s._v("에 "),t("code",[s._v("plugins:[]")]),s._v(" 로 플러그인 목록을 등록할 공간을 생성합니다. 패키지 매니저를 통해 설치한 플러그인을 위 공간에 등록하는 것입니다.")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("module"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("plugins")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'reading-progress'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'@vuepress/plugins-back-to-top'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// ... 플러그인 등록")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),t("h3",{attrs:{id:"_1-reading-progress"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-reading-progress"}},[s._v("#")]),s._v(" 1. reading-progress")]),s._v(" "),t("p",[t("code",[s._v("reading-progress")]),s._v("는 문서 스크롤 시 얼마나 읽었는지 상단 게이지 바를 통해 알려주는 플러그인입니다.")]),s._v(" "),t("img",{attrs:{src:a(623)}}),s._v(" "),t("div",{staticClass:"language-sh extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-D")]),s._v(" vuepress-plugin-reading-progress\n")])])]),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("module"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("plugins")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'reading-progress'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),t("h3",{attrs:{id:"_2-smooth-scroll"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-smooth-scroll"}},[s._v("#")]),s._v(" 2. smooth-scroll")]),s._v(" "),t("p",[t("code",[s._v("smooth-scroll")]),s._v("은 문서 이동 시 스크롤을 부드럽게 해줍니다.")]),s._v(" "),t("figure",[t("img",{attrs:{src:a(624)}}),s._v(" "),t("figcaption",[s._v("출처 - "),t("a",{attrs:{href:"https://github.com/joshua1988/vue-camp/pull/141"}},[s._v("Joshua Cracking vue.js Github PR")])])]),s._v(" "),t("div",{staticClass:"language-sh extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-D")]),s._v(" vuepress-plugin-smooth-scroll\n")])])]),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("module"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("plugins")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'vuepress-plguin-smooth-scroll'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),t("h3",{attrs:{id:"_3-code-copy"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-code-copy"}},[s._v("#")]),s._v(" 3. code-copy")]),s._v(" "),t("p",[t("code",[s._v("code-copy")]),s._v(" 플러그인은 코드블럭 복사 기능을 추가해줍니다.")]),s._v(" "),t("figure",[t("img",{attrs:{src:a(625)}}),s._v(" "),t("figcaption",[t("a",{attrs:{href:"https://github.com/joshua1988/vue-camp/pull/84"}},[s._v("Joshua Cracking vue.js Github PR")])])]),s._v(" "),t("div",{staticClass:"language-sh extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-D")]),s._v(" vuepress-plugin-code-copy\n")])])]),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("module"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("plugins")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'vuepress-plugin-code-copy'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("backgroundColor")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'#42b883'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("color")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'#42b883'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("backgroundTransition")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("successText")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'copied!'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n                "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("staticIcon")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),t("p",[s._v("아이콘 색, 코드블럭 카피 아이콘 클릭 시 배경색 변화 효과 등 몇 가지 옵션들을 추가하였습니다.")]),s._v(" "),t("h2",{attrs:{id:"마무리"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#마무리"}},[s._v("#")]),s._v(" 마무리")]),s._v(" "),t("p",[s._v("뷰프레스 정적 사이트 생성기를 이용하여 기술 블로그의 기본 세팅을 진행해보았습니다. 추후 작성되는 문서들을 보며 더 블로그를 확장시켜보세요 👍")]),s._v(" "),t("h2",{attrs:{id:"reference"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#reference"}},[s._v("#")]),s._v(" Reference")]),s._v(" "),t("ol",[t("li",[t("a",{attrs:{href:"https://kinsta.com/blog/static-site-generator/",target:"_blank",rel:"noopener noreferrer"}},[s._v("Top 5 static site generators in 2022"),t("OutboundLink")],1)]),s._v(" "),t("li",[t("a",{attrs:{href:"https://frankler.tistory.com/59",target:"_blank",rel:"noopener noreferrer"}},[s._v("Bash shell set -e 옵션과 set -x 옵션 사용 방법"),t("OutboundLink")],1)]),s._v(" "),t("li",[t("a",{attrs:{href:"https://gist.github.com/ihoneymon/652be052a0727ad59601",target:"_blank",rel:"noopener noreferrer"}},[s._v("how-to-write-by-markdown"),t("OutboundLink")],1)]),s._v(" "),t("li",[t("a",{attrs:{href:"https://github.com/vuepress/awesome-vuepress/blob/main/v1.md",target:"_blank",rel:"noopener noreferrer"}},[s._v("github - awesome-vuepress/v1"),t("OutboundLink")],1)])])])}),[],!1,null,null,null);t.default=r.exports},623:function(s,t,a){s.exports=a.p+"assets/img/progress.c94e6415.gif"},624:function(s,t,a){s.exports=a.p+"assets/img/scroll.accb15dc.gif"},625:function(s,t,a){s.exports=a.p+"assets/img/code-copy.4ad6a947.gif"}}]);