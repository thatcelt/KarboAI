import { readFile } from 'fs/promises';

import { KarboConfig, SendMessageConfig } from '../schemas/configs';
import {
  MembersResponse,
  MembersResponseSchema,
  MeResponse,
  MeResponseSchema,
  MessageResponse,
  MessageResponseSchema,
  OkResponse,
  OkResponseSchema,
  UploadResponse,
  UploadResponseSchema,
} from '../schemas/responses';
import initLogger from '../utils/logger';
import { clean } from '../utils/utils';
import { HttpToolKit } from './httptoolkit';
import { Message, MessageSchema } from '../schemas/karboai/message';
import { User, UserSchema } from '../schemas/karboai/users';
import { Dispatcher } from './hub/dispatcher';
import { ConnectCallback } from '../schemas/sockets';
import { Router } from './hub/router';

export class KarboAI {
  private readonly config: KarboConfig;
  private readonly httptoolkit: HttpToolKit;
  private readonly dispatcher: Dispatcher;

  constructor(config: KarboConfig) {
    this.config = config;
    this.httptoolkit = new HttpToolKit(this.config.token);
    this.dispatcher = new Dispatcher(this);

    initLogger(!!this.config.enableLogging);
  }

  get id() {
    return this.config.id;
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

  public message = async (
    chatId: string,
    messageId: string,
  ): Promise<Message> =>
    await this.httptoolkit.get<Message>({
      path: `/bot/chat/${chatId}/message/${messageId}`,
      schema: MessageSchema,
    });

  public members = async (
    chatId: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<MembersResponse> =>
    await this.httptoolkit.get<MembersResponse>({
      path: `/bot/chat/${chatId}/members?limit=${limit}&offset=${offset}`,
      schema: MembersResponseSchema,
    });

  public user = async (userId: string): Promise<User> =>
    await this.httptoolkit.get<User>({
      path: `/bot/user/${userId}`,
      schema: UserSchema,
    });

  public leave = async (chatId: string): Promise<boolean> =>
    (
      await this.httptoolkit.post<OkResponse>({
        path: `/bot/leave-chat/${chatId}`,
        body: JSON.stringify({}),
        schema: OkResponseSchema,
      })
    ).ok;

  public kick = async (chatId: string, userId: string): Promise<boolean> =>
    (
      await this.httptoolkit.post<OkResponse>({
        path: `/bot/chat/${chatId}/kick`,
        body: JSON.stringify({ user_id: userId }),
        schema: OkResponseSchema,
      })
    ).ok;

  public attach = (callback: ConnectCallback = async () => {}): void =>
    this.dispatcher.attach(this.config.token, callback);

  public bind = (...routers: Router[]): void =>
    this.dispatcher.bind(...routers);
}
