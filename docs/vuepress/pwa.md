---
title: Vuepress pwa
tags: ['VuePress']
---

## PWA란?

[프로그레시브 웹 앱](https://developer.mozilla.org/ko/docs/Web/Progressive_web_apps/Introduction)(Progressive Web App, PWA)은 웹과 앱의 장점만을 섞어 놓은 웹 앱입니다. 웹의 접근성이라는 장점과 앱의 부드러움을 섞어놓았습니다. 네이티브 앱은 기본적으로 설치가 가능하므로 **오프라인에서 동작한다**는 장점이 있고 **모바일 환경에서의 접근성이 비약적으로 상승하게 됩니다.** (홈 화면에서 아이콘 클릭을 통해 바로 접근)

PWA에 대한 자세한 내용은 [MDN](https://developer.mozilla.org/ko/docs/Web/Progressive_web_apps/Introduction)문서를 참조해주세요.

## PWA 플러그인

저희가 사용하는 Vuepress에서는 PWA구현을 도와주는 플러그인을 제공합니다. PWA 플러그인 설치 및 적용을 통해 얻을 수 있는 장점으로는

1. 모바일 환경, 웹 환경 모두에서 설치가 가능해집니다. (오프라인 환경에서 실행이 가능해집니다.)
2. 모바일 환경의 API를 통해 페이지를 더 우아하게 만들 수 있습니다.

PWA 적용 시 주소창에 웹 앱으로 설치할 수 있는 아이콘이 추가됩니다.

![](../.vuepress/assets/vuepress/download.png)

컨텐츠 업데이트 감지 시 팝업을 띄워주기도 합니다.

![](../.vuepress/assets/vuepress/service.png)

## PWA 설치 및 적용

PWA의 핵심은 **서비스워커(service-worker) 매니페스트(Manifest)** 입니다. 매니페스트는 인스톨 배너 및 앱 아이콘에 대한 설정을 담당하게 됩니다.

`manifest.json`파일에 적용할 설정들은 다음과 같습니다.

1. `icons` - 설치 시 보여질 앱 아이콘 이미지를 설정합니다.
2. `start_url` - 앱 실행 시 처음 보여질 URL을 설정합니다.
3. `name` - 설치 시 배너에 표시되는 이름입니다.
4. `short_name` - 아이콘 이름으로 표시됩니다.
5. `display` - 미리 정의된 `standalone`, `fullscreen`, `minimal-ui`, `browser` 속성을 적용합니다. 앱 상에서 페이지가 어떻게 보여질지 설정합니다.
6. `background_color` - 모바일 앱 아이콘의 배경색을 지정합니다.
7. `theme_color` - 앱 환경의 시스템 바 (URL 입력창과 같이 각 환경에서 기본적으로 제공되는 UI, 사진의 상단 바 확인)

    ![](../.vuepress/assets/vuepress/bar.jpg)

플러그인 설치 코드는 다음과 같습니다.

```sh
yarn add -D @vuepress/plugin-pwa
```

플러그인 설치 후 `config.js`에 등록합니다.

```js
plugins: [
    // ....
    [
        '@vuepress/pwa',
        {
            serviceWorker: true,
            updatePopup: {
                message:
                    '새 컨텐츠가 등록되었습니다. 새로고침 버튼을 눌러주세요😀',
                buttonText: '새로고침',
            },
        },
    ],
];
```

플러그인 속성으로 `serviceWorker`를 지정할 수 있는데, 서비스워커(serviceWorker)는 브라우저가 백그라운드에서 실행하는 스크립트로 웹페이지와 별개로 작동하여 사용자 상호작용이 필요하지 않은 기능에 대해 대신 수행하게 됩니다.

뷰프레스의 서비스워커는 깃헙에 새로 빌드 및 업데이트된 컨텐츠에 대해 팝업을 제공하여 컨텐츠가 새로 업로드 되었다는 것을 알려줍니다.

현재 제 사이트에 적용해놓은 `manifest.json` 설정들은 다음과 같습니다.

```js
// manifest.json
{
  "name": "Parkjju's TIL",
  "short_name": "Parkjju's TIL",
  "start_url": "/vue-TIL/",
  "icons": [
    {
      "src": "images/maskable_icon_x48.png",
      "type": "image/png",
      "sizes": "48x48"
    },
    {
      "src": "images/maskable_icon_x72.png",
      "type": "image/png",
      "sizes": "72x72"
    },
    {
      "src": "images/maskable_icon_x96.png",
      "type": "image/png",
      "sizes": "96x96"
    },
    {
      "src": "images/maskable_icon_x128.png",
      "type": "image/png",
      "sizes": "128x128"
    },
    {
      "src": "images/maskable_icon_x192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "images/maskable_icon_x384.png",
      "type": "image/png",
      "sizes": "384x384"
    },
    {
      "src": "images/maskable_icon_x512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "theme_color": "#3eaf7c",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

`icons`에 다양한 사이즈 이미지가 필요한 이유는 다양한 모바일 환경에서 아이콘이 깨지지 않도록 하기 위해서 입니다.

**추후 스플래시 이미지 설정법에 대한 내용을 추가하도록 하겠습니다.**

`manifest.json`설정이 끝났으면 `config.js`의 `head`영역에 메타데이터를 삽입합니다.

:::tip Vupress 메타데이터 핸들링

배포하는 뷰프레스 블로그 페이지 전체에 적용될 메타데이터를 설정하기 위해서는 `config.js`파일의 `head`영역을 수정하면 됩니다. 인덱스 페이지를 기준으로 상속받는 모든 페이지에 메타데이터가 포함되게 됩니다.

```js
head: [
    ['link', { rel: 'shortcut icon', href: './favicon.ico' }],
    // ....
];
```

위 코드를 `config.js`에 추가하면 전체 페이지에 해당 `link`태그가 삽입되게 됩니다.

:::

`config.js`에 등록해야할 설정으로는 다음과 같은 것들이 있습니다.

1. 앱 아이콘 위치
2. `manifest.json`파일위치
3. 그 외 설정들

```js
  // config.js
  head: [
    ["link", { rel: "shortcut icon", href: "/favicon.ico" }],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "192x192",
        href: "images/maskable_icon_x192.png",
      },
    ],
  ],
```

:::warning Vuepress public 관리에 대해

뷰프레스 빌드 시에 주의해야할 점이 있습니다. 각종 애셋 파일들은 임의로 생성한 파일에 저장 후 적절한 상대경로 지정으로도 문제없이 접근이 가능합니다.

하지만 `html`의 메타데이터로 들어가는 파일들, 가령 `favicon.ico`, `robots.txt`, `manifest.json`등의 파일들은 빌드 결과물을 모아두는 `dist`폴더에 `html`파일로 변환되어 저장되기 때문에 경로 설정 시 이를 고려해야합니다.

위의 `config.js`파일에서 `manifest.json`파일의 경로가 `/manifest.json`으로 설정되어 있는 이유가 바로 위의 현상때문입니다. 빌드 이후의 `index.html` 파일 기준으로 `manifest.json`이 같은 위치에 있기 때문에 위와 같이 경로 설정을 해야합니다.

`config.js`에 설정해놓은 `base`속성에 따라 `manifest.json` 경로가 변경됩니다.

정리하자면 빌드 과정에서 특정 파일은 그대로 둔 상태로 빌드를 하고싶을때 `public`폴더에 넣어두고, **경로 설정은 index.html** 기준으로 하면 됩니다.

:::

PWA 적용 뒤 모바일 환경에서 실행하는 모습입니다.

![](../.vuepress/assets/vuepress/pwa.gif)

:::warning
아이콘 이미지는 jpg가 아닌 png를 이용해야 pwa 앱 설치가 가능해집니다.
:::
