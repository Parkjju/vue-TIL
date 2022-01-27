---
title: Vuepress pwa

---
## PWA란?

[프로그레시브 웹 앱](https://developer.mozilla.org/ko/docs/Web/Progressive_web_apps/Introduction)(Progressive Web App, PWA)은 웹과 앱의 장점만을 섞어 놓은 웹 앱입니다. 웹의 접근성이라는 장점과 앱의 부드러움을 섞어놓았습니다. 네이티브 앱은 기본적으로 설치가 가능하므로 **오프라인에서 동작한다**는 장점이 있고 **모바일 환경에서의 접근성이 비약적으로 상승하게 됩니다.** (홈 화면에서 아이콘 클릭을 통해 바로 접근)

PWA에 대한 자세한 내용은 [MDN](https://developer.mozilla.org/ko/docs/Web/Progressive_web_apps/Introduction)문서를 참조해주세요.

## PWA 플러그인

저희가 사용하는 Vuepress에서는 PWA구현을 도와주는 플러그인을 제공합니다. PWA 플러그인 설치 및 적용을 통해 얻을 수 있는 장점으로는

1. 모바일 환경, 웹 환경 모두에서 설치가 가능해집니다. (오프라인 환경에서 실행이 가능해집니다.)
2. 모바일 환경의 API를 통해 페이지를 더 우아하게 만들 수 있습니다.

![hello](/assets/download.png)

PWA 적용 시 주소창에 웹 앱으로 설치할 수 있는 아이콘이 추가됩니다.

![](/assets/service.png)

**서비스워커**를 통해 서버로부터 변경사항이 생겼을때 이를 감지하여 반영해줍니다.

플러그인 설치를 하는 코드는 다음과 같습니다.

\`\`\`sh

yarn add -D @vuepress/plugin-pwa

\`\`\`