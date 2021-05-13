import { Response, RequestInfo, Headers } from 'node-fetch';
import { Readable } from 'stream';

type CreateFetchMockOptions = {
  body?: string,
  contentType?: string,
  status?: number,
  statusText?: string,
  ok?: boolean,
};

type MockedFetchFn = (url: RequestInfo) => Promise<Response>;

const extractUrl = (input: RequestInfo): string => {
  if (typeof input === "string") {
    return input;
  }

  if ('href' in input) {
    return input.href;
  }

  return input.url;
};

type MockedObject<T> = {
  [P in keyof T]: jest.Mock
};

export const createMock = <T>(obj: T): MockedObject<T> => {
  const mocked = Object.create(null);
  const keys = Object.keys(obj);
  for (const prop of keys) {
    mocked[prop] = jest.fn();
  }
  return mocked;
};

export const createFetchMock = (opts: CreateFetchMockOptions = {}): MockedFetchFn => {
  const body = opts.body || "foo {}";
  const contentType = opts.contentType || "text/css; charset=utf-8";
  const status = opts.status || 200;
  const statusText = opts.statusText || "ok";
  const ok = opts.ok ?? true;

  return async (url) => {
    return {
      ...createMock(Response.prototype),
      body: {
        ...createMock(Readable.prototype),
        readable: true,
        [Symbol.asyncIterator]: jest.fn(),
      },
      headers: {
        ...createMock(Headers.prototype),
        get: jest.fn(() => contentType),
        [Symbol.iterator]: jest.fn(),
      },
      text: jest.fn(async () => body),
      bodyUsed: true,
      size: 0,
      timeout: 100,
      redirected: false,
      type: 'basic',
      url: extractUrl(url),
      statusText,
      status,
      ok,
    };
  };
};
