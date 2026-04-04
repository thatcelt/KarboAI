import { KarboConfig } from '../schemas/configs';
import { MeResponse, MeResponseSchema } from '../schemas/responses';
import initLogger from '../utils/logger';
import { HttpToolKit } from './httptoolkit';

export class KarboAI {
  private readonly config: KarboConfig;
  private readonly httptoolkit: HttpToolKit;

  constructor(config: KarboConfig) {
    this.config = config;
    this.httptoolkit = new HttpToolKit(config.token);

    initLogger(!!config.enableLogging);
  }

  public me = async (): Promise<MeResponse> =>
    await this.httptoolkit.get<MeResponse>({
      path: '/bot/me',
      schema: MeResponseSchema,
    });
}
