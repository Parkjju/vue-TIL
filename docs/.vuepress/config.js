const { description } = require('../../package');
// 배포 테스트용 주석
module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  base: '/vue-TIL/',
  title: 'Today I Learned',
  markdown: {
    lineNumbers: true,
  },
  locales: {
    '/': { lang: 'ko-KR' },
  },
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['link', { rel: 'shortcut icon', href: './favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['link', { rel: 'manifest', href: './manifest.json' }],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '192x192',
        href: 'images/maskable_icon_x192.png',
      },
    ],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    [
      'script',
      {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-QP5LL1SE8Q',
      },
    ],
    [
      'script',
      {},
      [
        "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-QP5LL1SE8Q');",
      ],
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'Parkjju/vue-TIL',
    docsrepo: 'Parkjju/vue-TIL',
    docsDir: 'docs',
    // editLinks: true,
    // editLinkText: "",
    lastUpdated: false,
    nav: [
      // {
      //   text: "Github",
      //   link: "https://github.com/Parkjju",
      // },
      {
        text: 'VuePress',
        link: 'https://v1.vuepress.vuejs.org',
      },
    ],
    sidebar: [
      '/introduction',
      {
        title: 'TIL',
        collapsable: true,
        children: [
          '/TIL/2021-09-13',
          '/TIL/2021-10',
          '/TIL/2021-11',
          '/TIL/2022-01',
          '/TIL/2022-02',
        ],
      },
      {
        title: 'DailyTech',
        collapsable: true,
        children: [
          '/daily/210918',
          '/daily/210921-http',
          '/daily/210921-rest',
          '/daily/210927-mongo',
          '/daily/210930-user',
          '/daily/211006-edit',
          '/daily/211006-upload',
          '/daily/210930-cookie',
          '/daily/211004-antipattern',
          '/daily/211004-githubLogin',
          '/daily/211004-Oauth',
          '/daily/211005-json',
          '/daily/211018-network',
          '/daily/220208-browser',
          '/daily/220208-DOM',
        ],
      },
      {
        title: 'Javascript',
        collapsable: true,
        children: [
          '/javascript/ecma',
          '/javascript/set',
          '/javascript/symbol',
          '/javascript/prototype',
          '/javascript/prototypeReal',
          '/javascript/constructor',
          '/javascript/generator',
          '/javascript/settime',
          '/javascript/promise',
          '/javascript/class',
          '/javascript/hoisting',
        ],
      },
      {
        title: 'Vue',
        collapsable: true,
        children: [
          '/vue/2021-07-10-mount',
          '/vue/2021-07-10-vueData',
          '/vue/2021-08-10-vueCaptain',
          '/vue/210930-vueTodo',
          '/vue/210930-directives',
        ],
      },
      {
        title: 'Vuepress',
        collapsable: true,
        children: [
          '/vuepress/seo.md',
          '/vuepress/pwa.md',
          '/vuepress/cms.md',
          '/vuepress/ga.md',
        ],
      },
      {
        title: 'Node JS',
        collapsable: true,
        children: [
          '/nodeJS/youtube',
          '/nodeJS/express',
          '/nodeJS/middleware',
          '/nodeJS/router',
          '/nodeJS/export',
          '/nodeJS/param',
          '/nodeJS/template',
        ],
      },
      {
        title: 'Computer Science',
        collapsable: true,
        children: ['/os/Operating-System'],
      },
      {
        title: 'Algorithm',
        collapsable: true,
        children: [
          '/algorithm/dp',
          '/algorithm/greedy',
          '/algorithm/graph',
          '/algorithm/graphAlgo',
          '/algorithm/mst',
          '/algorithm/backtrack',
        ],
      },
      {
        title: 'Git',
        collapsable: true,
        children: ['/git/gitSubmodule', '/git/open', '/git/GA'],
      },

      {
        title: 'etc',
        collapsable: true,
        children: [
          '/grow/openSource',
          '/grow/work',
          '/grow/cleancode',
          '/grow/Missing',
          '/grow/windows-zsh',
        ],
        sidebarDepth: 2,
      },
    ],
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    ['sitemap', { hostname: 'https://parkjju.github.io/vue-TIL/' }],
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    [
      'vuepress-plugin-code-copy',
      {
        backgroundColor: '#42b883',
        color: '#42b883',
        backgroundTransition: true,
        successText: 'copied!',
        staticIcon: false,
      },
    ],
    [
      '@vuepress/google-analytics',
      {
        ga: 'G-QP5LL1SE8Q',
      },
    ],
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: {
          message: '새 컨텐츠가 등록되었습니다. 새로고침 버튼을 눌러주세요😀',
          buttonText: '새로고침',
        },
      },
    ],
  ],
};
