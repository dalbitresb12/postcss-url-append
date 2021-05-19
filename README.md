# PostCSS URL Append

[PostCSS](https://github.com/postcss/postcss) plugin to append a raw block of CSS from a URL. Similar to [`postcss-import-url`](https://github.com/unlight/postcss-import-url), but the URLs are set in the configuration file.

```css
@append base;
@append theme;

.foo {}
```

```js
const opts = {
  urls: [
    {
      id: 'base',
      url: 'https://example.com/base.css',
    },
    {
      id: 'theme',
      url: 'https://example.com/theme.css',
    },
  ],
};
```

```css
/* content from https://example.com/base.css */
/* content from https://example.com/theme.css */

.foo {}
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

**Step 3:** Add the plugin to the plugins list and setup your appends:

```diff
module.exports = {
  plugins: [
+   require('postcss-url-append')({
+     urls: {
+       id: 'base',
+       url: 'https://example.com/base.css',
+     },
+   }),
    require('autoprefixer')
  ]
}
```

**Step 4:** Add `@append` rules to your CSS files:

```css
.foo {}

@append base;
```

## Options

- `urls` (`UrlOptions[]`): The list of URLs to append to the file. Default value: `[]`.
- `modernBrowser` (`boolean`): This will set the User-Agent header to `Mozilla/5.0 AppleWebKit/538.0 Chrome/88.0.0.0 Safari/538`. This can be useful to import from Google Fonts, as Google checks it and can respond differently. Default value: `false`.
- `userAgent` (`string`): Set a custom User-Agent header. Default value: `undefined`.

### UrlOptions

- `id` (`string`): The id to match `@append` rules in your CSS.
- `url` (`string`): The url from which to fetch the CSS file.
