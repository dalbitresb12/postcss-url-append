import fetch from 'node-fetch';
import postcss from 'postcss';
import { mocked } from 'ts-jest/utils';
import { createFetchMock } from './utils';
import postcssUrlAppend from '../src';
import type { Options } from '../src/typings';

// Mock the node-fetch module
jest.mock('node-fetch');
const mockedFetch = mocked(fetch, true);

const createProcessor = (opts: Options) => {
  const plugin = postcssUrlAppend(opts);
  return postcss([plugin]);
};

// Utility function for each test
const run = async (input: string, output: string, opts: Options) => {
  const result = await createProcessor(opts).process(input, { from: undefined });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
};

const files = {
  base: {
    id: 'base',
    url: 'https://example.com/base.css',
  },
  theme: {
    id: 'theme',
    url: 'https://example.com/theme.css',
  },
};

describe('postcss-url-append', () => {
  beforeEach(() => {
    const mock = createFetchMock();
    mockedFetch.mockReset();
    mockedFetch.mockImplementation(mock);
  });

  it('must return the same css when no url is set', async () => {
    await run('a {}', 'a {}', {});
  });

  it('must return the same css when an empty array is passed', async () => {
    await run('a {}', 'a {}', { urls: [] });
  });

  it('must append the result from the url', async () => {
    const opts: Options = { urls: [files.base] };
    await run('a {}\n@append base;', 'a {}\nfoo {}', opts);
  });

  it('must ignore @append rules without definition', async () => {
    await run('@append base;\na {}', 'a {}', {});
  });

  it('must replace all the @append rules', async () => {
    const opts: Options = { urls: [files.base] };
    await run('@append base;\na {}\n@append base;', 'foo {}\na {}\nfoo {}', opts);
  });

  it('must use the saved contents and not refetch', async () => {
    mockedFetch
      .mockImplementationOnce(createFetchMock({ body: 'foo {}' }))
      .mockImplementationOnce(createFetchMock({ body: 'bar {}' }));

    const opts: Options = { urls: [files.base] };
    await run('@append base;\na {}\n@append base;', 'foo {}\na {}\nfoo {}', opts);
  });

  it('must append all the files passed', async () => {
    mockedFetch
      .mockImplementationOnce(createFetchMock({ body: 'foo {}' }))
      .mockImplementationOnce(createFetchMock({ body: 'bar {}' }));

    const opts: Options = { urls: [files.base, files.theme] };
    await run('@append base;\na {}\n@append theme;', 'foo {}\na {}\nbar {}', opts);
  });

  describe('Errors', () => {
    it('must throw in case another value is passed in the urls option', async () => {
      // @ts-expect-error: This is a test and we expect it to fail
      expect(() => createProcessor({ urls: 1 })).toThrow({
        name: 'Error',
        message: `Expected an array, received number in 'opts.urls'.`,
      });
    });
  
    it('must throw in case another value is passed inside the urls array', async () => {
      // @ts-expect-error: This is a test and we expect it to fail
      expect(() => createProcessor({ urls: [1] })).toThrow({
        name: 'Error',
        message: `An invalid value was passed to 'opts.urls'. Please, check your configuration.`,
      });
    });

    describe('Invalid URLs', () => {
      const invalidUrls = [
        'go gle.com',
        '/en-US/docs'
      ];

      test.each(invalidUrls)(`%s`, (url) => {
        expect(() => createProcessor({ urls: [{ id: 'test', url }] })).toThrow('is not a valid URL.');
      });
    });
  });
});
