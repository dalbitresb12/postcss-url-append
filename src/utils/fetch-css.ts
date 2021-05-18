import fetch, { Headers } from 'node-fetch';
import mimeTypes from 'mime-types';
import { parse, Root } from 'postcss';
import type { Options } from '../typings';

export class CssFile {
  url: string;
  raw: string;
  #parsed: Root;

  constructor(url: string, content: string) {
    this.url = url;
    this.raw = content;
    this.#parsed = parse(content, { from: url });
  }

  get root(): Root {
    return this.#parsed.clone();
  }
}

export class CssFetcher {
  processing: Record<string, boolean>;
  promises: Record<string, Promise<CssFile>>;
  files: Record<string, CssFile>;
  headers: Headers;
  contentType: string | false;

  constructor(opts: Options) {
    this.processing = {};
    this.promises = {};
    this.files = {};
    this.headers = new Headers();
    if (opts.modernBrowser) {
      this.headers.set('User-Agent', 'Mozilla/5.0 AppleWebKit/538.0 Chrome/88.0.0.0 Safari/538');
    }
    if (opts.userAgent) {
      this.headers.set('User-Agent', opts.userAgent);
    }
    this.contentType = mimeTypes.contentType('css');
  }

  get(url: string): Promise<CssFile> {
    if (this.files[url] instanceof CssFile) {
      return Promise.resolve(this.files[url]);
    }

    if (this.promises[url]) {
      return this.promises[url];
    }

    const promise = new Promise<CssFile>((resolve, reject) => {
      fetch(url)
        .then(res => {
          if (res.headers.get('content-type') !== this.contentType) {
            throw new Error(`${url} doesn't return a CSS file.`);
          }
          return res.text();
        })
        .then(css => {
          const file = new CssFile(url, css);
          this.files[url] = file;
          delete this.promises[url];
          resolve(file);
        })
        .catch(err => reject(err));
    });

    this.promises[url] = promise;
    return promise;
  }
}
