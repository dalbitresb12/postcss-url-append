import type { PluginCreator } from 'postcss';
import type { Options } from './typings';
import { preprocessUrls, CssFetcher } from './utils';

const postcssUrlAppend: PluginCreator<Options> = (opts = {}) => {
  const files = preprocessUrls('urls', opts.urls);
  const fetcher = new CssFetcher(opts);

  return {
    postcssPlugin: 'postcss-url-append',
    AtRule: {
      append: async (atRule) => {
        // We just remove all @append AtRules if we don't have files to match
        if (files.length === 0) {
          atRule.remove();
          return;
        }

        // Find an item with the same id, remove it if not found
        const file = files.find(item => item.id === atRule.params);
        if (!file) {
          atRule.remove();
          return;
        }

        // Finally, fetch and replace this AtRule with the contents of the file
        const css = await fetcher.get(file.url);
        atRule.replaceWith(css.root);
      },
    },
  };
};

postcssUrlAppend.postcss = true;

export = postcssUrlAppend;
