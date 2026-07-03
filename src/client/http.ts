import _ from 'lodash';
import camelize from 'camelize';
import type { Logger } from 'pino';
import type { ZodType } from 'zod';
import type { BlobPart } from 'bun';

import { BASE_URL, BASIC_HEADERS } from '../constants';
import { KarboError } from '../util/errors';
import type { CallOptions, Headers, MultipartOptions, PostOptions } from '../types/http';

export class Http {
  private headers: Headers = { ...BASIC_HEADERS };

  private logger: Logger;

  constructor(logger: Logger, token: string) {
    this.logger = logger;
    this.headers = { ...this.headers, 'Bot-Token': token };
  }

  private handle = async <T>(response: Response, schema: ZodType<T>, path: string): Promise<T> => {
    if (!response.ok) {
      this.logger.child({ path }).error(response.status);
      KarboError.throw(response.status);
    }

    this.logger.child({ path }).info(response.status);

    return schema.parse(camelize(JSON.parse(await response.text())));
  };

  private call = async <T>(
    { path, method, body, headers }: CallOptions,
    schema: ZodType<T>
  ): Promise<T> => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      body,
      headers: headers ?? this.headers,
    });

    return await this.handle(response, schema, path);
  };

  public get = async <T>(path: string, schema: ZodType<T>): Promise<T> =>
    await this.call({ path, method: 'GET' }, schema);

  public post = async <T>({ path, body }: PostOptions, schema: ZodType<T>): Promise<T> =>
    await this.call({ path, method: 'POST', body }, schema);

  public multipart = async <T>(
    { path, buffer, fileName }: MultipartOptions,
    schema: ZodType<T>
  ): Promise<T> => {
    const blob = new Blob([buffer] as BlobPart[], {
      type: `image/${fileName.split('.').pop()}`,
    });

    const form = new FormData();
    form.append('file', blob, fileName);

    return await this.call(
      { path, method: 'POST', body: form, headers: _.omit(this.headers, ['Content-Type']) },
      schema
    );
  };
}
