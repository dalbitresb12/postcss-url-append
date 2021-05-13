import fetch from 'node-fetch';
import postcss from 'postcss';
import { mocked } from 'ts-jest/utils';
import { createFetchMock } from './utils';
import postcssUrlAppend, { Options } from '../src';

// Mock the node-fetch module
jest.mock('node-fetch');
const mockedFetch = mocked(fetch, true);

beforeAll(() => {
  const mock = createFetchMock();
  mockedFetch.mockImplementation(mock);
});

// Utility function for each test
const run = async (input: string, output: string, opts: Options) => {
  const plugin = postcssUrlAppend(opts);
  const result = await postcss([plugin]).process(input, { from: undefined });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
};

it('must return the same css when no url is set', async () => {
  await run('a {}', 'a {}', {});
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
