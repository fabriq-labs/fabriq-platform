// @ts-nocheck
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Fabriq",
  tagline: "Warehouse - Native",
  favicon: "img/fabriq_helmet_logo.png",

  // Set the production url of your site here
  url: "https://community.getfabriq.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "fabriq-labs", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  stylesheets: ["/css/custom.css"],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
    [
      "@docusaurus/preset-classic",
      {
        gtag: {
          trackingID: "GTM-5BLNK4K9",
          anonymizeIP: true,
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      customCss: require.resolve("./src/css/custom.css"),
      gtag: {
        trackingID: "GTM-5BLNK4K9",
      },
      navbar: {
        title: "fabriq",
        logo: {
          alt: "Fabriq logo",
          src: "img/fabriq_logo.png",
          style: {
            width: "50px",
            height: "50px",
          },
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "right",
            label: "Read docs",
          },
          {
            to: "/#how-it-works",
            label: "How It Works",
            position: "left",
          },
          {
            to: "/#features",
            label: "Features",
            position: "left",
          },
          {
            type: "custom-getStartButton",
            position: "right",
            className: "navbar__item--hideOnMobile",
          },
          {
            href: "https://github.com/fabriq-labs/fabriq-platform",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Docs",
                to: "/docs/introduction",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/fabriq-labs/fabriq-platform",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} fabriq labs, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
