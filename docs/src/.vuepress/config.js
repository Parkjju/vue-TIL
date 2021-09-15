const { description } = require('../../package');

module.exports = {
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#title
     */
    base: '/vue-TIL/',
    title: "Parkjju's TIL",
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
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        [
            'meta',
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        ],
    ],

    /**
     * Theme configuration, here is the default theme configuration for VuePress.
     *
     * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
     */
    themeConfig: {
        repo: '',
        editLinks: false,
        docsDir: '',
        editLinkText: '',
        lastUpdated: false,
        nav: [
            {
                text: 'Github',
                link: 'https://github.com/Parkjju',
            },
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
                children: ['/TIL/2021-09-13'],
            },
            {
                title: 'Node JS',
                collapsable: true,
                children: [
                    '/nodeJS/youtube',
                    '/nodeJS/express',
                    '/nodeJS/middleware',
                ],
            },
            {
                title: 'Computer Science',
                collapsable: true,
                children: ['/os/Operating-System'],
            },
        ],
    },

    /**
     * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
     */
    plugins: [
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
        '@vuepress/google-analytics',
        {
            ga: 'G-CWTQ8X81BJ',
        },
    ],
};
