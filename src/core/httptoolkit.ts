import { ZodType } from 'zod';
import { fetch, FormData, Response } from 'undici';
import _ from 'lodash';

import { BASIC_HEADERS, KARBO_API } from '../constants';
import {
  GetRequestConfig,
  MultipartRequestConfig,
  PostRequestConfig,
} from '../schemas/configs';
import { LOGGER } from '../utils/logger';
import { KarboException } from '../utils/errors';

export class HttpToolKit {
  private readonly headers = { ...BASIC_HEADERS };

  constructor(token: string) {
    this.headers = {
      ...this.headers,
      'Bot-Token': token,
    };
  }

  private handle = async <T>(
    response: Response,
    path: string,
    schema: ZodType<T>,
  ): Promise<T> => {
    if (!response.ok) {
      LOGGER.child({ path }).error(response.status);
      KarboException.throw(response.status);
    }

    LOGGER.child({ path }).info(response.status);

    return schema.parse(await response.json());
  };

  public get = async <T>(config: GetRequestConfig): Promise<T> => {
    const response = await fetch(`${KARBO_API}${config.path}`, {
      method: 'GET',
      headers: this.headers,
    });

    return (await this.handle(response, config.path, config.schema)) as T;
  };

  public post = async <T>(config: PostRequestConfig): Promise<T> => {
    const response = await fetch(`${KARBO_API}${config.path}`, {
      method: 'GET',
      body: config.body,
      headers: this.headers,
    });

    return (await this.handle(response, config.path, config.schema)) as T;
  };

  public multipart = async <T>(config: MultipartRequestConfig): Promise<T> => {
    const blob = new Blob([config.buffer] as BlobPart[], {
      type: `image/${config.fileName.split('.').pop()}`,
    });

    const form = new FormData();
    form.append('file', blob, config.fileName);

    const response = await fetch(`${KARBO_API}${config.path}`, {
      method: 'POST',
      body: form,
      headers: _.omit(this.headers, ['Content-Type']),
    });

    return (await this.handle(response, config.path, config.schema)) as T;
  };
}
