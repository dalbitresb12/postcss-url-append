# PostCSS URL Append

**This plugin has not been published to the registry yet.**

[PostCSS](https://github.com/postcss/postcss) plugin to append a raw block of CSS from a URL.

```css
.foo {}
```

```js
const opts = {
  urls: ["https://example.com/base.css"],
};
```

```css
.foo {}

/* content from https://example.com/base.css */
```

## Usage

**Step 1:** Install plugin:

```sh
$ npm install --save-dev postcss postcss-url-append
or
$ yarn add --dev postcss postcss-url-append
```

**Step 2:** Check your project for an existing PostCSS config: `postcss.config.js` in the project root, `"postcss"` section in `package.json` or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs](https://github.com/postcss/postcss#usage) and set this plugin in settings.

**Step 3:** Add the plugin to the plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-url-append')({
+     urls: ['https://example.com/base.css'],
+   }),
    require('autoprefixer')
  ]
}
```
