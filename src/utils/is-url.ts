import { URL } from 'url';

export const isUrl = (input: string): boolean => {
  if (typeof input !== "string") {
    throw new TypeError(`Expected an string, received ${typeof input}`);
  }

  try {
    new URL(input);
    return true;
  } catch (err) {
    return false;
  }
};
