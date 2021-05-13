import type { PluginCreator } from 'postcss';
import prependHttp from 'prepend-http';
import isUrl from 'is-url-superb';
import fetch, { Headers } from 'node-fetch';
import mimeTypes from 'mime-types';

export type Options = {
  urls?: string[],
  modernBrowser?: boolean,
  userAgent?: string,
};

const preprocessUrls = (name: string, input?: string[]): string[] => {
  // In case the user didn't set it, just return an empty array
  if (typeof input === "undefined") {
    return [];
  }

  // We must receive an array
  if (!Array.isArray(input)) {
    throw new Error(`Expected an array, received ${typeof input} in opts.${name}.`);
  }

  // If we have an empty array, return it as-is
  if (input.length === 0) {
    return input;
  }

  // Prepend every URL with the protocol if needed
  const withHttp = input.map(url => prependHttp(url));
  // Prevent build from running if any URL is invalid
  withHttp.forEach(url => {
    if (!isUrl(url)) {
      throw new Error(`${url} is not a valid URL.`);
    }
  });
  return withHttp;
};

const createPromises = (urls: string[], opts: Options): Promise<string>[] => {
  const contentType = mimeTypes.contentType('css');
  const headers = new Headers();
  if (opts.modernBrowser) {
    headers.set('User-Agent', 'Mozilla/5.0 AppleWebKit/538.0 Chrome/88.0.0.0 Safari/538');
  }
  if (opts.userAgent) {
    headers.set('User-Agent', opts.userAgent);
  }

  return urls.map(async url => {
    const res = await fetch(url, { headers });
    if (contentType !== res.headers.get('content-type')) {
      throw new Error(`${url} doesn't return a CSS file.`);
    }
    return await res.text();
  });
};

const postcssUrlAppend: PluginCreator<Options> = (opts = {}) => {
  const urls = preprocessUrls("urls", opts.urls);

  return {
    postcssPlugin: 'postcss-url-append',
    async Once(root, postcss) {
      if (urls.length === 0) {
        return;
      }

      const promises = createPromises(urls, opts);
      const results = await Promise.all(promises);
      for (const result of results) {
        const ast = postcss.parse(`\n${result}`);
        root.append(ast);
      }
    }
  };
};

postcssUrlAppend.postcss = true;

export default postcssUrlAppend;
