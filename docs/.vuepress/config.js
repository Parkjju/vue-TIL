const { description } = require('../../package');
// 배포 테스트용 주석
module.exports = {
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#title
     */
    base: '/vue-TIL/',
    title: 'Today I Learned',
    // markdown: {
    //     lineNumbers: true,
    // },
    extendMarkdown: (md) => {
        md.set({ breaks: true });
        md.use(require('markdown-it-katex'));
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
        ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
        [
            'link',
            {
                rel: 'stylesheet',
                href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css',
            },
        ],
        [
            'link',
            {
                rel: 'stylesheet',
                href: 'https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css',
            },
        ],
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
        searchMaxSuggestions: 10,
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
                title: 'Snack',
                collapsable: true,
                children: [
                    '/trash/220715-async.md',
                    '/trash/220717-api.md',
                    '/trash/220719-native',
                    '/trash/220720-dark',
                    '/trash/220722-rntypes',
                    'trash/220727-embed',
                    'trash/220727-share',
                    'trash/220831-image',
                    'trash/230207-textview',
                    'trash/230209-timezone',
                    'trash/230213-navigationBar',
                    'trash/230215-12',
                    'trash/230215-13',
                    'trash/230217-14',
                    'trash/230219-15',
                    'trash/230223-16',
                    'trash/230223-17',
                    'trash/230318-18',
                    'trash/230319-19',
                    'trash/230326-20',
                    'trash/230402-21',
                    'trash/230419-22',
                    'trash/230419-23',
                    'trash/230503-24',
                    'trash/230504-25',
                    'trash/230509-26',
                    'trash/230512-27',
                    'trash/230627-28',
                    'trash/230704-29',
                    'trash/230801-30',
                    'trash/230918-31',
                    'trash/230918-32',
                    'trash/231019-33',
                    'trash/231123-34',
                    'trash/231125-35',
                    'trash/231128-36',
                    'trash/231129-37',
                    'trash/231202-38',
                    'trash/231205-39',
                ],
            },
            {
                title: 'DailyTech',
                collapsable: true,
                children: [
                    '/daily/220208-DOM',
                    '/daily/220208-browser',
                    '/daily/220224-shadow',
                    '/daily/220223-virtualDom',
                    '/daily/220420-api',
                    '/daily/220605-regex',
                    '/daily/220701-grid',
                    '/daily/220703-recoil',
                ],
            },
            {
                title: 'Swift',
                collapsable: true,
                children: [
                    'swift/221030-basic',
                    'swift/221101-repeat',
                    'swift/221102-function',
                    'swift/221104-optional',
                    'swift/221105-collection',
                    'swift/221106-enumeration',
                    'swift/221107-app',
                    'swift/221108-class',
                    'swift/221109-inherit',
                    'swift/221110-type',
                    'swift/221111-extension',
                    'swift/221112-protocol',
                    'swift/221114-nested',
                    'swift/221115-closure',
                    'swift/221115-higher',
                    'swift/221116-arc',
                    'swift/221117-error',
                    'swift/221119-network',
                    'swift/221121-async',
                    'swift/221122-generic',
                    'swift/221123-result',
                    'swift/221123-date',
                    'swift/221124-access',
                    'swift/221128-string',
                    'swift/221214-operator',
                    'swift/221214-advance',
                    'swift/221220-draw',
                    'swift/230108-move',
                    'swift/230109-pattern',
                    'swift/230111-lifecycle',
                    'swift/230112-navigation',
                    'swift/230112-table',
                    'swift/230118-picker',
                    'swift/230119-network',
                    'swift/230131-search',
                    'swift/230201-collection',
                    'swift/230201-core',
                    'swift/230210-auto',
                    'swift/230322-gcd',
                    'swift/230501-operation',
                    'swift/230325-scrollView',
                    'swift/230509-firebase',
                    'swift/230704-keychain',
                    'swift/230801-mvvm',
                    'swift/231222-keypath',
                    'swift/231223-opaque',
                ],
                sidebarDepth: 2,
            },
            {
                title: 'SwiftUI',
                collapsable: true,
                children: [
                    '/swiftuiOpen/231226-1',
                    'swiftuiOpen/231227-2',
                    'swiftuiOpen/240101-3',
                ],
                sidebarDepth: 2,
            },
            {
                title: 'Javascript Fundamental',
                collapsable: true,
                children: [
                    '/js/scope',
                    '/js/this',
                    '/js/execution',
                    '/javascript/hoisting',
                    '/js/closure',
                    '/js/event',
                    '/js/json',
                    '/js/ajax',
                    '/js/axios',
                    '/js/spa',
                ],
            },
            {
                title: 'ES6+',
                collapsable: true,
                children: [
                    '/javascript/ecma',
                    '/javascript/set',
                    '/javascript/symbol',
                    // '/javascript/prototype',
                    '/javascript/prototypeReal',
                    '/javascript/constructor',
                    '/javascript/generator',
                    '/javascript/settime',
                    '/javascript/promise',
                    '/javascript/class',
                ],
            },
            // {
            //     title: 'Typescript',
            //     collapsable: true,
            //     children: [
            //         'typescript/typescript',
            //         'typescript/ts-type',
            //         'typescript/why',
            //         'typescript/220628-types',
            //         'typescript/220630-function',
            //         'typescript/220702-class',
            //         'typescript/220708-project',
            //     ],
            // },
            {
                title: 'React',
                collapsable: true,
                children: [
                    'react/react-18',
                    'react/start',
                    'react/jsx',
                    'react/fragment',
                    'react/state',
                    'react/props',
                    'react/cra',
                    'react/effect',
                    'react/reducer',
                    'react/callback',
                    'react/todo',
                    'react/router',
                    'react/styled',
                    'react/query',
                    'react/220903-context',
                    'react/state-manage',
                    'react/hook',
                    'react/hooks',
                    'react/dnd',
                    'react/framer',
                    'react/framer2',
                    'react/220727-Auth',
                    'react/220924-deploy',
                ],
            },
            {
                title: 'Redux',
                collapsable: true,
                children: [
                    'redux/state-manage2',
                    'redux/220923-reactredux',
                    'redux/220923-toolkit',
                    'redux/220924-async',
                ],
            },
            {
                title: 'React Native',
                collapsable: true,
                children: [
                    'react-native/fast',
                    'react-native/220711-layout',
                    'react-native/220712-touch',
                    'react-native/220719-apploading',
                    'react-native/220720-navigation',
                    'react-native/220721-style',
                    'react-native/220723-flat',
                    'react-native/220727-infinite',
                ],
            },
            {
                title: 'Vuepress',
                collapsable: true,
                children: [
                    '/vuepress/start.md',
                    '/vuepress/seo.md',
                    '/vuepress/pwa.md',
                    '/vuepress/cms.md',
                    '/vuepress/ga.md',
                ],
            },
            // {
            //     title: 'Node JS',
            //     collapsable: true,
            //     children: [
            //         '/nodeJS/youtube',
            //         '/nodeJS/express',
            //         '/nodeJS/middleware',
            //         '/nodeJS/router',
            //         '/nodeJS/export',
            //         '/nodeJS/param',
            //         '/nodeJS/template',
            //     ],
            // },
            //   {
            //     title: 'Computer Science',
            //     collapsable: true,
            //     children: ['/os/Operating-System'],
            //   },
            {
                title: 'Algorithm',
                sidebarDepth: 2,
                collapsable: true,
                children: [
                    // '/algorithm/cpp/230620-summary',
                    '/algorithm/230115-swift-algorithm-club',
                    '/algorithm/230112-swift',
                    '/algorithm/baekjoon',
                    '/algorithm/graph',
                    '/algorithm/backtrack',
                    // '/algorithm/method',
                    // '/algorithm/bigO',
                    // '/algorithm/dp',
                    // '/algorithm/greedy',
                    // '/algorithm/graphAlgo',
                    // '/algorithm/mst',
                    // '/algorithm/220701-pattern',
                    // '/algorithm/220714-recursion',
                ],
            },
            {
                title: 'Git',
                collapsable: true,
                children: [
                    '/git/gitSubmodule',
                    '/git/open',
                    '/git/GA',
                    '/git/pr',
                ],
            },
            {
                title: 'RxSwift',
                collapsable: true,
                children: [
                    'rxSwift/230802-basic',
                    'rxSwift/230802-2',
                    'rxSwift/230802-3',
                    'rxSwift/230802-4',
                    'rxSwift/230804-5',
                    'rxSwift/230804-6',
                    'rxSwift/230808-7',
                    'rxSwift/230808-8',
                    'rxSwift/230808-9',
                    'rxSwift/230808-10',
                    'rxSwift/230808-11',
                    'rxSwift/230809-12',
                    'rxSwift/230810-13',
                ],
                sidebarDepth: 2,
            },
            {
                title: 'SwiftUI',
                collapsable: true,
                children: [
                    'swiftui/231220-1',
                    'swiftui/231226-2',
                    'swiftui/231227-3',
                    'swiftui/240102-4',
                    'swiftui/240102-5',
                    'swiftui/240105-6',
                    'swiftui/240125-7',
                    'swiftui/240125-8',
                    'swiftui/240127-9',
                ],
                sidebarDepth: 2,
            },
            // {
            //     title: 'etc',
            //     collapsable: true,
            //     children: [
            //         '/grow/openSource',
            //         '/grow/work',
            //         '/grow/cleancode',
            //         '/grow/Missing',
            //         '/grow/windows-zsh',
            //         '/grow/gg',
            //     ],
            //     sidebarDepth: 2,
            // },
        ],
    },

    /**
     * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
     */
    plugins: [
        ['sitemap', { hostname: 'https://parkjju.github.io/vue-TIL/' }],
        [
            'vuepress-plugin-mathjax',
            {
                target: 'svg',
                macros: {
                    '*': '\\times',
                },
            },
        ],
        'reading-progress',
        '@vuepress/plugin-back-to-top',
        'vuepress-plugin-smooth-scroll',
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
                    message:
                        '새 컨텐츠가 등록되었습니다. 새로고침 버튼을 눌러주세요😀',
                    buttonText: '새로고침',
                },
            },
        ],
        [
            'register-components',
            {
                components: [
                    {
                        name: 'Comment',
                        path: '../.vuepress/components/Comment.vue',
                    },
                ],
            },
        ],
    ],
};
