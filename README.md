# vuepress-plugin-export

[![NPM version](https://badgen.net/npm/v/vuepress-plugin-export)](https://npmjs.com/package/vuepress-plugin-export) [![NPM downloads](https://badgen.net/npm/dm/vuepress-plugin-export)](https://npmjs.com/package/vuepress-plugin-export) [![CircleCI](https://badgen.net/circleci/github/ulivz/vuepress-plugin-export/master)](https://circleci.com/gh/ulivz/vuepress-plugin-export/tree/master) 

> This plugin requires VuePress >= 1.0.0-alpha.33.

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
