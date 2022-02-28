// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Shuffle.js',
  tagline: 'Categorize, sort, and filter a responsive grid of items',
  url: 'https://vestride.github.io/',
  baseUrl: '/Shuffle/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'Vestride',
  projectName: 'Shuffle',
  trailingSlash: false,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/Vestride/Shuffle/tree/main/apps/website/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'UA-39355642-1',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
        switchConfig: {
          darkIcon: '🌕',
          lightIcon: '️☀️',
        },
      },
      navbar: {
        title: 'Shuffle.js',
        logo: {
          alt: 'Shuffle.js Logo',
          src: 'img/favicon.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'install',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://www.buymeacoffee.com/glen.cheney',
            label: 'Buy me a coffee',
            position: 'right',
          },
          {
            href: 'https://github.com/Vestride/Shuffle',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/install',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Vestride/Shuffle',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ShuffleJS. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      image: 'img/shuffle-open-graph.png',
    }),
};

module.exports = config;
