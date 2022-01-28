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

## PWA 설치 및 적용

PWA의 핵심은 **서비스워커(service-worker)**와 **매니페스트(Manifest)**입니다. 매니페스트는 인스톨 배너 및 앱 아이콘에 대한 설정을 담당하게 됩니다.

`manifest.json`파일에 적용할 설정들은 다음과 같습니다.

1. `icons` - 설치 시 보여질 앱 아이콘 이미지를 설정합니다.
2. `start_url` - 앱 실행 시 처음 보여질 URL을 설정합니다.
3. `name` - 설치 시 배너에 표시되는 이름입니다.
4. `short_name` - 아이콘 이름으로 표시됩니다.
5. `display` - 미리 정의된 `standalone`, `fullscreen`, `minimal-ui`, `browser` 속성을 적용합니다. 앱 상에서 페이지가 어떻게 보여질지 설정합니다.
6. `background_color` - 모바일 앱 아이콘의 배경색을 지정합니다.
7. `theme_color` - 앱 환경의 시스템 바 (URL 입력창과 같이 각 환경에서 기본적으로 제공되는 UI, 사진의 상단 바 확인)  
   ![](/assets/bar.jpg)

플러그인 설치 코드는 다음과 같습니다.

```sh
yarn add -D @vuepress/plugin-pwa
```

플러그인 설치 후 `config.js`에 등록합니다.

```js
plugins: [
  // ....
  [
    "@vuepress/pwa",
    {
      serviceWorker: true,
      updatePopup: {
        message: "새 컨텐츠가 등록되었습니다. 새로고침 버튼을 눌러주세요😀",
        buttonText: "새로고침",
      },
    },
  ],
]
```

플러그인 속성으로 `serviceWorker`를 지정할 수 있는데, 서비스워커(serviceWorker)는 브라우저가 백그라운드에서 실행하는 스크립트로 웹페이지와 별개로 작동하여 사용자 상호작용이 필요하지 않은 기능에 대해 대신 수행하게 됩니다.

뷰프레스의 서비스워커는 깃헙에 새로 빌드 및 업데이트된 컨텐츠에 대해 팝업을 제공하여 컨텐츠가 새로 업로드 되었다는 것을 알려줍니다. 