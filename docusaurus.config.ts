import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Fungi",
  tagline: "Run apps on any device, and access them securely from anywhere.",
  favicon: "img/favicon.ico",
  scripts: [
    {
      src: "https://gc.zgo.at/count.v5.js",
      async: true,
      crossorigin: "anonymous",
      integrity:
        "sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYElFmeR6EmLP5bYeoRVQ",
      "data-goatcounter": "https://fungi.goatcounter.com/count",
      "data-goatcounter-settings": JSON.stringify({ no_onload: true }),
    },
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://fungi.rs",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "enbop", // Usually your GitHub org/user name.
  projectName: "fungi-site", // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/enbop/fungi-site/tree/master/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Fungi",
      logo: {
        alt: "Fungi Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "/docs/install",
          position: "left",
          label: "Install",
        },
        {
          to: "/docs/intro",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://discord.gg/A2vUXXB726",
          label: "Discord",
          position: "right",
        },
        {
          href: "https://github.com/enbop/fungi",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Get Started",
          items: [
            {
              label: "Install",
              to: "/docs/install",
            },
            {
              label: "Connect Devices",
              to: "/docs/quick-start/connect-devices",
            },
            {
              label: "Docs",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/A2vUXXB726",
            },
            {
              label: "GitHub",
              href: "https://github.com/enbop/fungi",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Fungi`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
