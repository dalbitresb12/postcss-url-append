import fetch from 'node-fetch';
import postcss from 'postcss';
import { mocked } from 'ts-jest/utils';
import { createFetchMock } from './utils';
import postcssUrlAppend, { Options } from '../src';

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

describe('PostCSS URL Append', () => {
  beforeAll(() => {
    const mock = createFetchMock();
    mockedFetch.mockImplementation(mock);
  });

  it('must return the same css when no url is set', async () => {
    await run('a {}', 'a {}', {});
  });

  it('must return the same css when an empty array is passed', async () => {
    await run('a {}', 'a {}', { urls: [] });
  });

  it('must append the result from the url', async () => {
    const opts = {
      urls: ['https://example.com/base.css'],
    };
    await run('a {}', 'a {}\nfoo {}', opts);
  });

  it('must append all the files passed', async () => {
    mockedFetch
      .mockImplementationOnce(createFetchMock())
      .mockImplementationOnce(createFetchMock({ body: 'bar {}' }));

    const opts = {
      urls: [
        'https://example.com/base.css',
        'https://example.com/theme.css',
      ]
    };
    await run('a {}', 'a {}\nfoo {}\nbar {}', opts);
  });

  describe('Errors', () => {
    it('must throw in case another value is passed in the urls option', async () => {
      // @ts-expect-error: This is a test and we expect it to fail
      expect(() => createProcessor({ urls: 1 })).toThrow({
        name: 'Error',
        message: 'Expected an array, received number in opts.urls.',
      });
    });
  
    it('must throw in case another value is passed inside the urls array', async () => {
      // @ts-expect-error: This is a test and we expect it to fail
      expect(() => createProcessor({ urls: [1] })).toThrow({
        name: 'Error',
        message: 'Expected an array of strings in opts.urls.',
      });
    });

    describe('Invalid URLs', () => {
      const invalidUrls = [
        'go gle.com',
        '/en-US/docs'
      ];

      test.each(invalidUrls)(`%s`, (url) => {
        expect(() => createProcessor({ urls: [url] })).toThrow('is not a valid URL.');
      });
    });
  });
});
