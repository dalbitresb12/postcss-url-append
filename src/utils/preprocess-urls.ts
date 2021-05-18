import prependHttp from 'prepend-http';
import { isUrl } from './is-url';
import type { UrlOptions } from '../typings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidInput = (input: any): input is UrlOptions => {
  if (typeof input !== "object") return false;
  if (typeof input.id !== "string") return false;
  if (typeof input.url !== "string") return false;
  return true;
};

export const preprocessUrls = (name: string, input?: UrlOptions[]): UrlOptions[] => {
  // In case the user didn't set it, just return an empty array
  if (typeof input === "undefined") {
    return [];
  }

  // We must receive an array
  if (!Array.isArray(input)) {
    throw new Error(`Expected an array, received ${typeof input} in 'opts.${name}'.`);
  }

  // If we have an empty array, return it as-is
  if (input.length === 0) {
    return input;
  }

  // Check the type of each element
  if (input.some(item => !isValidInput(item))) {
    throw new Error(`An invalid value was passed to 'opts.${name}'. Please, check your configuration.`);
  }

  // Prepend every URL with the protocol if needed
  const withHttp = input.map<UrlOptions>(item => ({
    ...item,
    url: prependHttp(item.url),
  }));
  
  // Prevent build from running if any URL is invalid
  withHttp.forEach(item => {
    if (!isUrl(item.url)) {
      throw new Error(`'${item.url}' is not a valid URL.`);
    }
  });
  return withHttp;
};
