# vuepress-plugin-export

[![NPM version](https://badgen.net/npm/v/vuepress-plugin-export)](https://npmjs.com/package/vuepress-plugin-export) [![NPM downloads](https://badgen.net/npm/dm/vuepress-plugin-export)](https://npmjs.com/package/vuepress-plugin-export)

> This plugin requires VuePress >= **1.0.0-alpha.44**.

## Features

- Merge all of your pages automatically.

## TODO

- Support default and confurable front cover.
- Inject Table of Contents.
- Inject Page Numbers.
- Generate different PDF files per locale.
- Transform all of links.

## Install

```bash
npm i vuepress-plugin-export
```

## Usage

Using this plugin:

```javascript
// .vuepress/config.js
module.exports = {
  plugins: ['vuepress-plugin-export']
}
```

Then run:

```bash
vuepress export [path/to/your/docs]
```

## Generating multiple output files

You can configure this plugin to export multiple files.
Add config options:

```javascript
module.exports: ['vuepress-plugin-export', {
  theme: '@vuepress/default',
  puppeteer: { args: ['--no-sandbox'] },
  bundles: [{
    filter: (location) => !location.includes('export'),
    dest: () => 'docs/public/export.pdf',
  }, {
    filter: /\/en\///,
    dest: (siteConfig) => `docs/public/${siteConfig.title}.en.pdf`,
  }]
}]
```

Then run:

```bash
vuepress export [path/to/your/docs]
```

### Config options
- theme: String
- puppeteer: Object
- bundles: Array | Function(Array[PageConfig]) => Array[bundle]
- bundles[].filter: RegExp | Function(location: string, page: PageConfig) => boolean
- bundles[].dest: (config: VuepressPluginConfig(https://vuepress.vuejs.org/config/#basic-config)) => string
- bundles[].sorter: Function(PageConfig, PageConfig) => -1, 0, 1

with PageConfig:
```
url: string
location: string
title: string
path: string
```

## Development

```bash
git clone https://github.com/ulivz/vuepress-plugin-export
cd vuepress-plugin-export
yarn
yarn export
```

> Note that this package is powered by [puppeteer](https://github.com/GoogleChrome/puppeteer), if you are in a mysterious wall, consider setting [environment variables](https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md#environment-variables) before installation.

```bash
PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors
```

> Note that this pavkage is powered by [easy-pdf-merge](https://github.com/karuppiah7890/easy-pdf-merge), Java 6 or higher must be present.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**vuepress-plugin-export** © [ULVIZ](https://github.com/ulivz), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by ULVIZ with help from contributors ([list](https://github.com/ulivz/vuepress-plugin-export/contributors)).

> [github.com/ulivz](https://github.com/ulivz) · GitHub [@ULVIZ](https://github.com/ulivz) · Twitter [@_ulivz](https://twitter.com/_ulivz)
