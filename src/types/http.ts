export type Payload = Record<string, any>;

export type Headers = Record<string, string>;

export type CallOptions = {
  path: string;
  method?: string;
  body?: string | FormData;
  headers?: Headers;
};

export type PostOptions = {
  path: string;
  body: string;
};

export type MultipartOptions = {
  path: string;
  buffer: Buffer | Uint8Array;
  fileName: string;
};
