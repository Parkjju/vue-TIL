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
        ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
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
                    //   '/daily/211004-antipattern',
                    '/daily/211004-githubLogin',
                    '/daily/211004-Oauth',
                    '/daily/211018-network',
                    '/daily/220208-DOM',
                    '/daily/220208-browser',
                    '/daily/220224-shadow',
                    '/daily/220223-virtualDom',
                    '/daily/220420-api',
                    '/daily/220605-regex',
                    '/daily/220701-grid',
                    '/daily/220703-recoil',
                    '/daily/220707-https',
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
                ],
                sidebarDepth: 2,
            },
            {
                title: 'Frontend',
                collapsable: true,
                children: [
                    'frontend/220924-lint',
                    'frontend/220924-prettier',
                    'frontend/221011-auth',
                    'frontend/221025-test',
                ],
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
            {
                title: 'Typescript',
                collapsable: true,
                children: [
                    'typescript/typescript',
                    'typescript/ts-type',
                    'typescript/why',
                    'typescript/220628-types',
                    'typescript/220630-function',
                    'typescript/220702-class',
                    'typescript/220708-project',
                ],
            },
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
                title: 'Next JS',
                collapsable: true,
                children: ['nextJS/220924-intro'],
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
                title: 'AWS',
                collapsable: true,
                children: ['/aws/220812-IAM', '/aws/220812-start'],
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
                    '/vuepress/start.md',
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
            //   {
            //     title: 'Computer Science',
            //     collapsable: true,
            //     children: ['/os/Operating-System'],
            //   },
            {
                title: 'Algorithm',
                collapsable: true,
                children: [
                    '/algorithm/baekjoon',
                    '/algorithm/method',
                    '/algorithm/bigO',
                    '/algorithm/dp',
                    '/algorithm/greedy',
                    '/algorithm/graph',
                    '/algorithm/graphAlgo',
                    '/algorithm/mst',
                    '/algorithm/backtrack',
                    '/algorithm/220701-pattern',
                    '/algorithm/220714-recursion',
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
                title: 'etc',
                collapsable: true,
                children: [
                    '/grow/openSource',
                    '/grow/work',
                    '/grow/cleancode',
                    '/grow/Missing',
                    '/grow/windows-zsh',
                    '/grow/gg',
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
