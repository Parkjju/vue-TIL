(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{411:function(s,a,t){s.exports=t.p+"assets/img/finder.9ac930e5.png"},412:function(s,a,t){s.exports=t.p+"assets/img/firefox.225aacdb.png"},413:function(s,a,t){s.exports=t.p+"assets/img/firefoxApp.12a762dc.png"},414:function(s,a,t){s.exports=t.p+"assets/img/itemcolor.fd23ec10.png"},415:function(s,a,t){s.exports=t.p+"assets/img/color.65b20a83.png"},416:function(s,a,t){s.exports=t.p+"assets/img/snazzy.b2a9ed14.png"},417:function(s,a,t){s.exports=t.p+"assets/img/bash.d4147e4b.png"},418:function(s,a,t){s.exports=t.p+"assets/img/zsh.ec8b8c1e.png"},419:function(s,a,t){s.exports=t.p+"assets/img/tab.b3ae7ac2.gif"},420:function(s,a,t){s.exports=t.p+"assets/img/gitwork.ac527a5e.gif"},421:function(s,a,t){s.exports=t.p+"assets/img/cd.b3912b9f.gif"},876:function(s,a,t){"use strict";t.r(a);var e=t(6),r=Object(e.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("p",[s._v("한국외대가 SW 중심대학으로 선정되며 기획된 Hufs Missing Semester라는 프로그램의 발표를 이번에 맡게 되었습니다. MacOS 터미널 사용법과 개발환경 세팅, 비주얼 스튜디오 코드의 유용한 익스텐션 소개 등 기초적인 부분에 대해 발표를 진행하게 됩니다. 발표 준비 과정에서 필요한 지식들을 정리하고 추후 한 시간 가량의 발표를 마무리 지은 뒤 후기 내용은 새롭게 추가하도록 하겠습니다 😃")]),s._v(" "),a("h2",{attrs:{id:"reference"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#reference"}},[s._v("#")]),s._v(" Reference")]),s._v(" "),a("ol",[a("li",[a("a",{attrs:{href:"https://velog.io/@haje/macOS-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0",target:"_blank",rel:"noopener noreferrer"}},[s._v("MAC 개발환경 세팅 velog"),a("OutboundLink")],1)])]),s._v(" "),a("h2",{attrs:{id:"시스템-설정"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#시스템-설정"}},[s._v("#")]),s._v(" 시스템 설정")]),s._v(" "),a("ol",[a("li",[s._v("파인더 설정"),a("br"),s._v("\n파인더 최초 실행 시 버벅임을 줄이기 위해 루트 폴더 설정을 자신의 이름으로 된 유저 폴더로 지정합니다."),a("br"),s._v(" "),a("img",{attrs:{src:t(411),alt:"finder"}})]),s._v(" "),a("li",[s._v("원화 대신 백틱 입력하기"),a("br"),s._v(" "),a("a",{attrs:{href:"https://ss64.com/osx/syntax-keybindings.html",target:"_blank",rel:"noopener noreferrer"}},[s._v("ss64 페이지 참조"),a("OutboundLink")],1)])]),s._v(" "),a("blockquote",[a("p",[s._v("If they are not already in place - just create the file & directory.")])]),s._v(" "),a("p",[a("code",[s._v("~/Library/KeyBindings/DefaultKeyBinding.dict")]),s._v(" 위치에 해당 파일을 생성합니다. 만약 라이브러리 폴더에 "),a("code",[s._v("KeyBindings")]),s._v(" 폴더가 없거나 파일이 존재하지 않으면 새로 생성하면 됩니다.")]),s._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("TIP")]),s._v(" "),a("p",[s._v("맥은 우클릭으로 빈 파일 생성하는 기능이 없기 때문에 텍스트 편집기를 통해 빈 파일 생성 후 확장자를 변경하던 터미널을 통해 생성하던 해야합니다.")])]),s._v(" "),a("p",[s._v("파일 생성 뒤 해당 파일에 다음 코드를 삽입합니다.")]),s._v(" "),a("div",{staticClass:"language-text extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('{\n    "₩" = ("insertText:", "`");\n}\n')])])]),a("p",[s._v("저장 후 재부팅하면 한글 상태에서도 백틱이 입력됩니다.")]),s._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("TIP")]),s._v(" "),a("p",[s._v("모든 과정을 자동화 해둔 쉘 스크립트가 있습니다. "),a("a",{attrs:{href:"https://gist.github.com/redism/43bc51cab62269fa97a220a7bb5e1103",target:"_blank",rel:"noopener noreferrer"}},[s._v("링크"),a("OutboundLink")],1)]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-sSL")]),s._v(" https://gist.githubusercontent.com/redism/43bc51cab62269fa97a220a7bb5e1103/raw/0d55b37b60e0e0bd3d0d7f53995de0a722f9820c/kr_won_to_backquote.sh "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sh")]),s._v("\n")])])]),a("p",[s._v("다음 코드를 실행하면 자동으로 모든 과정이 진행되고 재부팅 시 한글 상태에서도 백틱 입력이 됩니다.")])]),s._v(" "),a("h2",{attrs:{id:"homebrew-설치"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#homebrew-설치"}},[s._v("#")]),s._v(" Homebrew 설치")]),s._v(" "),a("p",[s._v("홈브루(Homebrew)는 맥 OS의 패키지 매니저입니다. 윈도우에서 깃, 파이썬, mySQL등 여러 프로그래밍 언어나 어플리케이션을 설치할 때 수동으로 설치하는 경우가 대부분이지만 맥에서 홈브루 패키지 매니저를 사용하면 터미널 상에서 편리하게 설치할 수가 있게 됩니다. 오픈소스에 대한 접근까지도 쉽게 이루어집니다.")]),s._v(" "),a("p",[s._v("홈브루 설치 명령어는 다음과 같습니다.")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("/bin/bash "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-c")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"'),a("span",{pre:!0,attrs:{class:"token variable"}},[a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$(")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-fsSL")]),s._v(" https://raw.githubusercontent.com/Homebrew/install/master/install.sh"),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v(")")])]),s._v('"')]),s._v("\n")])])]),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("패키지 매니저란?")]),s._v(" "),a("p",[s._v("패키지 매니저는 컴퓨터 OS를 위해 일정한 방식으로 컴퓨터 프로그램의 설치, 업그레이드, 구성, 제거 과정을 자동화하는 소프트웨어 도구들의 모임입니다. 소프트웨어에 대한 수동 설치 및 수동 업데이트 필요성을 근절하기 위해 설계되었습니다.")])]),s._v(" "),a("p",[s._v("일반적으로 저희가 맥으로 어플리케이션을 다운로드 받을 때 겪게되는 과정들을 (웹사이트로 가서 "),a("code",[s._v("dmg")]),s._v("파일을 받고 어플리케이션 위치를 앱으로 직접 이동시켜주는 등) 자동화시켜준다고 생각하시면 됩니다.")]),s._v(" "),a("p",[s._v("이후 여러 소프트웨어 설치 시 홈브루 매니저를 이용하기 위해서는 "),a("code",[s._v("brew")]),s._v(" 키워드를 붙여 사용하면 됩니다.")]),s._v(" "),a("h2",{attrs:{id:"git-설치"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#git-설치"}},[s._v("#")]),s._v(" git 설치")]),s._v(" "),a("p",[s._v("버전관리 시스템인 git을 설치합니다.")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("brew "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" git-lfs\n\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" config "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--global")]),s._v(" user.name "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Your name"')]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" config "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--global")]),s._v(" user.email "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"you@your.com"')]),s._v("\n")])])]),a("p",[a("code",[s._v("git-lfs")]),s._v("는 깃헙에서 다루지 못하는 대용량 파일을 다룰 수 있게 해주는 오픈소스 소프트웨어입니다."),a("br"),s._v("\n사용법은 "),a("a",{attrs:{href:"https://wellbell.tistory.com/247",target:"_blank",rel:"noopener noreferrer"}},[s._v("다음의 링크"),a("OutboundLink")],1),s._v("를 참조해주세요.")]),s._v(" "),a("h2",{attrs:{id:"cask-설치"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#cask-설치"}},[s._v("#")]),s._v(" Cask 설치")]),s._v(" "),a("p",[s._v("cask는 홈브루 확장입니다. 비주얼 스튜디오 코드 익스텐션과 비슷한 개념이라고 생각하시면 될 것 같습니다. 기존 홈브루에서는 없는 기능인 Mac전용 GUI 프로그램 설치를 지원합니다.")]),s._v(" "),a("p",[s._v("cask 설치 명령어는 다음과 같습니다.")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("brew "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" cask\n")])])]),a("p",[s._v("cask를 설치한 뒤 "),a("a",{attrs:{href:"https://formulae.brew.sh/cask/",target:"_blank",rel:"noopener noreferrer"}},[s._v("cask에서 설치를 지원하는 프로그램 목록"),a("OutboundLink")],1),s._v("을 보고 프로그램을 설치해주시면 됩니다. cask를 활용한 프로그램 설치 명령어는 다음과 같습니다.")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("brew "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--cask")]),s._v(" 설치할 프로그램명\n")])])]),a("p",[s._v("실제로 cask를 통해 "),a("code",[s._v("firefox")]),s._v(" 앱을 설치해보았습니다."),a("br"),s._v(" "),a("img",{attrs:{src:t(412),alt:"firefox"}}),a("br"),s._v(" "),a("img",{attrs:{src:t(413),alt:"firefoxApp"}})]),s._v(" "),a("p",[s._v("정상적으로 구동되는 모습을 볼 수 있습니다.")]),s._v(" "),a("h2",{attrs:{id:"iterm2-설치"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#iterm2-설치"}},[s._v("#")]),s._v(" ITerm2 설치")]),s._v(" "),a("p",[s._v("우아한 개발환경 구축을 위해 필수적이라고 할 수 있는 ITerm2를 설치합니다.")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("brew "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--cask")]),s._v(" iterm2\n")])])]),a("p",[s._v("ITerm2의 인기있는 테마로는 "),a("a",{attrs:{href:"https://github.com/sindresorhus/iterm2-snazzy/",target:"_blank",rel:"noopener noreferrer"}},[s._v("snazzy"),a("OutboundLink")],1),s._v("와 "),a("a",{attrs:{href:"https://github.com/hukl/Smyck-Color-Scheme/",target:"_blank",rel:"noopener noreferrer"}},[s._v("Smyck-color-Scheme"),a("OutboundLink")],1),s._v("이 있습니다. 저는 "),a("code",[s._v("snazzy")]),s._v(" 테마를 적용해보겠습니다. 테마 적용 방법은 다음과 같습니다.")]),s._v(" "),a("ol",[a("li",[s._v("깃헙 레포지토리로 이동하여 클론하거나, 파일을 직접 다운받는다.")]),s._v(" "),a("li",[s._v("다운로드 받은 폴더 내에 "),a("code",[s._v(".itemcolors")]),s._v(" 확장자 파일을 실행합니다.")]),s._v(" "),a("li",[s._v("ITerm2가 자동으로 테마를 인식하여 임포트를 진행합니다.")])]),s._v(" "),a("figure",[a("p",[a("img",{attrs:{src:t(414),alt:"itemcolors"}})]),s._v(" "),a("figcaption",[s._v("itemcolor 확장자의 파일을 클릭하여 실행합니다.")]),s._v(" "),a("p",[a("img",{attrs:{src:t(415),alt:"color-preset"}})]),s._v(" "),a("figcaption",[s._v("ITerm2에서 자동 인식하여 컬러 프리셋을 자동 임포트합니다.")])]),s._v(" "),a("p",[s._v("임포트한 컬러 프리셋을 불러옵니다.")]),s._v(" "),a("ol",[a("li",[s._v("ITerm2 실행")]),s._v(" "),a("li",[s._v("Command + , (Comma) -> 설정메뉴 (ITerm2 - Preference)")]),s._v(" "),a("li",[s._v("Profiles 탭 - colors - 우측 하단의 Color Preset 드롭다운 메뉴에서 임포트된 Snazzy 체크")])]),s._v(" "),a("p",[a("img",{attrs:{src:t(416),alt:"snazzy"}})]),s._v(" "),a("h2",{attrs:{id:"oh-my-zsh-설치"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#oh-my-zsh-설치"}},[s._v("#")]),s._v(" oh-my-zsh 설치")]),s._v(" "),a("p",[s._v("oh-my-zsh 설치에 앞서서 zsh 설치를 진행합니다.")]),s._v(" "),a("p",[s._v("맥은 기본 터미널 세팅이 "),a("code",[s._v("bash")]),s._v(", 배시 쉘로 설정되어 있습니다. 기본 설정된 쉘 스크립트가 무엇인지 확인하기 위해서는 "),a("code",[s._v("echo $0")]),s._v(" 명령어를 입력하면 됩니다.")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("bash-3.2$ "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("echo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$0")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("bash")]),s._v("\n")])])]),a("p",[s._v("배시 쉘을 "),a("code",[s._v("zsh")]),s._v("로 변경하기 위해서는 "),a("code",[s._v("zsh")]),s._v(" 명령어만 입력하면 됩니다.")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("bash-3.2$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("zsh")]),s._v("\n❯ "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("echo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$0")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("zsh")]),s._v("\n")])])]),a("p",[s._v("zsh 설치가 되어 있지 않았다면 "),a("code",[s._v("No such file or directory")]),s._v(" 경고가 나타납니다. 홈브루를 통해 설치할 수 있습니다.")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("❯ brew "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("zsh")]),s._v("\nRunning "),a("span",{pre:!0,attrs:{class:"token variable"}},[a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("`")]),s._v("brew update "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--preinstall")]),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("`")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v(".\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" Auto-updated Homebrew"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("\nUpdated "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" tap "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("homebrew/core"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(".\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" Updated Formulae\nUpdated "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v(" formulae.\n\nWarning: "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("zsh")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("5")]),s._v(".8_1 is already installed and up-to-date.\nTo reinstall "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("5")]),s._v(".8_1, run:\n  brew reinstall "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("zsh")]),s._v("\n")])])]),a("p",[s._v("이미 설치가 되어 있었기 때문에 "),a("code",[s._v("already installed..")]),s._v("경고가 나타납니다.")]),s._v(" "),a("details",{staticClass:"custom-block details"},[a("summary",[s._v("zsh vs bash")]),s._v(" "),a("p",[s._v("zsh와 bash에는 어떤 차이가 있는 지 알아봅니다.")]),s._v(" "),a("ol",[a("li",[a("code",[s._v("cd")]),s._v(" + Tab 키 입력 시 디렉토리 표기가 숨김 폴더를 포함하는 지 여부에서 차이가 존재합니다.")])]),s._v(" "),a("p",[a("img",{attrs:{src:t(417),alt:"bash"}}),a("br"),s._v(" "),a("img",{attrs:{src:t(418),alt:"zsh"}})]),s._v(" "),a("p",[s._v("배시 쉘은 숨김 폴더 표기를 선택할 수 있는 반면 zsh은 일반 폴더를 표기하는 것으로 끝납니다.")]),s._v(" "),a("ol",[a("li",[s._v("절대경로를 통해 홈 디렉토리로 이동하는 방법에 차이가 존재합니다."),a("br"),s._v("\n배시 쉘은 직접 입력하여 이동해야 하는 반면, zsh는 홈 디렉토리 경로가 "),a("code",[s._v("/home/ubuntu")]),s._v("라고 가정했을 때 "),a("code",[s._v("cd /h/u")]),s._v("를 입력한 뒤 탭 키를 입력하면 절대경로를 자동완성 해줍니다."),a("br"),s._v(" "),a("img",{attrs:{src:t(419),alt:"tab"}})]),s._v(" "),a("li",[s._v("디렉토리 이동과 디렉토리 위치 변경이 zsh에서는 더 편리합니다.")])]),s._v(" "),a("p",[s._v("2번에서 소개드렸던 자동완성 기능이 홈 디렉토리 뿐만 아니라 전체 디렉토리에 적용됩니다. 다만 디렉토리 첫 글자와 중복되는 디렉토리들이 몇 가지 존재하게 될텐데, 이러한 경우 탭 키를 여러번 눌러서 다른 디렉토리를 선택할 수 있습니다."),a("br"),s._v(" "),a("img",{attrs:{src:t(420),alt:"gitwork"}})]),s._v(" "),a("p",[s._v("zsh상에서 디렉토리 위치 변경이 편리한 점은 현재 내가 속한 디렉토리의 위치와 동등한 위치의 디렉토리로의 위치변경이 쉽습니다. 잠시 디렉토리 구조를 보면,")]),s._v(" "),a("div",{staticClass:"language-text extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("Users - parkgyeongjun - vue-TIL\n                     |- gitWork\n")])])]),a("p",[a("code",[s._v("parkgyeongjun")]),s._v(" 디렉토리 하위에는 "),a("code",[s._v("vue-TIL")]),s._v(", "),a("code",[s._v("gitWork")]),s._v(" 디렉토리가 존재합니다. "),a("code",[s._v("cd /u/p/g")]),s._v(" 자동완성 기능을 통해 "),a("code",[s._v("gitWork")]),s._v(" 디렉토리로 이동한 뒤 배시 상에서 "),a("code",[s._v("vue-TIL")]),s._v("로 이동하기 위해서는 "),a("code",[s._v("cd ..")]),s._v(", "),a("code",[s._v("cd vue-TIL")]),s._v(" 명령어를 입력해야하지만 zsh에서는 "),a("code",[s._v("cd (현재 디렉토리명) (이동할 디렉토리명)")]),s._v("을 입력하면 됩니다.")]),s._v(" "),a("p",[a("img",{attrs:{src:t(421),alt:"cd"}})])]),s._v(" "),a("p",[s._v("기본적으로 zsh이 더 편리한 기능을 더 많이 갖고 있습니다. 이제 설치하게 될 "),a("strong",[s._v("oh-my-zsh")]),s._v("은 바로 zsh 환경설정을 다루는 프레임워크이며 다양한 테마와 플러그인들을 가지고 있습니다.")]),s._v(" "),a("p",[s._v("oh-my-zsh 설치 명령어는 다음과 같습니다.")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# zsh --version을 통해 zsh 설치 여부를 먼저 확인한 뒤 설치를 진행합니다.")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# git도 설치되어 있어야 합니다.")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sh")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-c")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"'),a("span",{pre:!0,attrs:{class:"token variable"}},[a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$(")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-fsSL")]),s._v(" https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh"),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v(")")])]),s._v('"')]),s._v("\n")])])])])}),[],!1,null,null,null);a.default=r.exports}}]);