export type UrlOptions = {
  id: string,
  url: string,
};

export type Options = {
  urls?: UrlOptions[],
  modernBrowser?: boolean,
  userAgent?: string,
};
