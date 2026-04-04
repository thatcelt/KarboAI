import { readFile } from 'fs/promises';

import { KarboConfig, SendMessageConfig } from '../schemas/configs';
import {
  MeResponse,
  MeResponseSchema,
  MessageResponse,
  MessageResponseSchema,
  UploadResponse,
  UploadResponseSchema,
} from '../schemas/responses';
import initLogger from '../utils/logger';
import { clean } from '../utils/utils';
import { HttpToolKit } from './httptoolkit';

export class KarboAI {
  private readonly config: KarboConfig;
  private readonly httptoolkit: HttpToolKit;

  constructor(config: KarboConfig) {
    this.config = config;
    this.httptoolkit = new HttpToolKit(config.token);

    initLogger(!!config.enableLogging);
  }

  private sendMessage = async (
    config: SendMessageConfig,
  ): Promise<MessageResponse> =>
    await this.httptoolkit.post<MessageResponse>({
      path: '/bot/send-message',
      body: JSON.stringify(
        clean({
          chat_id: config.chatId,
          content: config.content,
          reply_message_id: config.replyMessageId,
          images: config.images,
        }),
      ),
      schema: MessageResponseSchema,
    });

  public me = async (): Promise<MeResponse> =>
    await this.httptoolkit.get<MeResponse>({
      path: '/bot/me',
      schema: MeResponseSchema,
    });

  public text = async (
    chatId: string,
    content: string,
    replyMessageId?: string,
  ) =>
    await this.sendMessage({
      chatId,
      content,
      replyMessageId,
    });

  public image = async (
    chatId: string,
    images: string[],
    replyMessageId?: string,
  ) =>
    await this.sendMessage({
      chatId,
      images,
      replyMessageId,
    });

  public upload = async (path: string): Promise<string> => {
    const file = await readFile(path);

    return (
      await this.httptoolkit.multipart<UploadResponse>({
        path: '/bot/upload/image',
        buffer: file,
        fileName: path.split('/').pop()!,
        schema: UploadResponseSchema,
      })
    ).url;
  };
}
