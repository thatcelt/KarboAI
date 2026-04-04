import { ZodType } from 'zod';
import { fetch, Response } from 'undici';

import { BASIC_HEADERS, KARBO_API } from '../constants';
import { GetRequestConfig, PostRequestConfig } from '../schemas/configs';
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
}
