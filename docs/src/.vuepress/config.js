const { description } = require("../../package");

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  base: "/vue-TIL/",
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
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: "",
    editLinks: false,
    docsDir: "",
    editLinkText: "",
    lastUpdated: false,
    nav: [
      {
        text: "Github",
        link: "https://github.com/Parkjju",
      },
      {
        text: "VuePress",
        link: "https://v1.vuepress.vuejs.org",
      },
    ],
    sidebar: [
      "/introduction",
      {
        title: "TIL",
        collapsable: true,
        children: ["/TIL/2021-09-13"],
      },
      {
        title: "DailyTech",
        collapsable: true,
        children: [
          "/daily/210918",
          "/daily/210921-http",
          "/daily/210921-rest",
          "/daily/210927-mongo",
          "/daily/210930-user",
          "/daily/210930-cookie",
        ],
      },
      {
        title: "Vue",
        collapsable: true,
        children: [
          "/vue/2021-07-10-mount",
          "/vue/2021-07-10-vueData",
          "/vue/2021-08-10-vueCaptain",
          "/vue/210930-vueTodo",
          "/vue/210930-directives",
        ],
      },
      {
        title: "Node JS",
        collapsable: true,
        children: [
          "/nodeJS/youtube",
          "/nodeJS/express",
          "/nodeJS/middleware",
          "/nodeJS/router",
          "/nodeJS/export",
          "nodeJS/param",
          "nodeJS/template",
        ],
      },
      {
        title: "Computer Science",
        collapsable: true,
        children: ["/os/Operating-System"],
      },
      {
        title: "성장일지",
        collapsable: true,
        children: ["/grow/openSource", "/grow/comento"],
      },
    ],
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    "@vuepress/plugin-back-to-top",
    "@vuepress/plugin-medium-zoom",
    [
      "vuepress-plugin-code-copy",
      {
        backgroundColor: "#42b883",
        color: "#42b883",
        backgroundTransition: true,
        successText: "copied!",
        staticIcon: false,
      },
    ],
    "@vuepress/google-analytics",
    {
      ga: "G-CWTQ8X81BJ",
    },
  ],
};
