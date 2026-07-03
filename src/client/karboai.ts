import decamelize from 'decamelize-keys';
import type { Logger } from 'pino';

import { Http } from './http';
import { configureLogger } from '../util/logger';
import { clean } from '../util/helpers';
import { Dispatcher } from './dispatcher';
import { MessageSchema, type Message } from '../entities/message';
import { UserSchema, type User } from '../entities/user';
import {
  MeResponseSchema,
  type SendMessageResponse,
  SendMessageResponseSchema,
  type UploadMediaResponse,
  UploadMediaResponseSchema,
  type MeResponse,
  type GetMembersResponse,
  GetMembersResponseSchema,
  type ActionResponse,
  ActionResponseSchema,
} from '../dto/common.dto';
import type { ImageBuilder, KarboConfig, MessageBuilder, TextBuilder } from '../types/usable';
import type { Member } from '../entities/member';
import type { Router } from '../features/router';

export class KarboAI {
  private config: KarboConfig;
  private logger: Logger;
  private http: Http;
  private dispatcher: Dispatcher;

  constructor(config: KarboConfig) {
    this.config = config;
    this.logger = configureLogger(!!this.config.enableLogging);
    this.http = new Http(this.logger, this.config.token);
    this.dispatcher = new Dispatcher(this, this.logger);
  }

  get id(): string {
    return this.config.id;
  }

  private _message = async (builder: MessageBuilder): Promise<string> =>
    (
      await this.http.post<SendMessageResponse>(
        {
          path: '/bot/send-message',
          body: JSON.stringify(
            decamelize(
              clean({
                chat_id: builder.chatId,
                content: builder.content,
                reply_message_id: builder.replyMessageId,
                images: builder.images,
                inline_buttons: builder.inlineButtons,
              }),
              { deep: true }
            )
          ),
        },
        SendMessageResponseSchema
      )
    ).messageId;

  public me = async (): Promise<MeResponse> =>
    await this.http.get<MeResponse>('/bot/me', MeResponseSchema);

  public text = async ({
    chatId,
    content,
    replyMessageId,
    inlineButtons,
  }: TextBuilder): Promise<string> =>
    await this._message({ chatId, content, replyMessageId, inlineButtons });

  public image = async ({
    chatId,
    caption,
    replyMessageId,
    images,
    inlineButtons,
  }: ImageBuilder): Promise<string> =>
    await this._message({
      chatId,
      content: caption,
      replyMessageId,
      images,
      inlineButtons,
    });

  public upload = async (
    buffer: Buffer | Uint8Array,
    fileName: string = 'file.png'
  ): Promise<string> =>
    (
      await this.http.multipart<UploadMediaResponse>(
        { path: '/bot/upload/image', buffer, fileName },
        UploadMediaResponseSchema
      )
    ).url;

  public message = async (chatId: string, messageId: string): Promise<Message> =>
    await this.http.get<Message>(`/bot/chat/${chatId}/message/${messageId}`, MessageSchema);

  public members = async (
    chatId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<Member[]> =>
    (
      await this.http.get<GetMembersResponse>(
        `/bot/chat/${chatId}/members?limit=${limit}&offset=${offset}`,
        GetMembersResponseSchema
      )
    ).items;

  public user = async (userId: string, communityId: number = 0): Promise<User> =>
    await this.http.get<User>(
      `/bot/user/${userId}${communityId ? `/community/${communityId}` : ''}`,
      UserSchema
    );

  public leave = async (chatId: string): Promise<boolean> =>
    (
      await this.http.post<ActionResponse>(
        {
          path: `/bot/leave-chat/${chatId}`,
          body: JSON.stringify({}),
        },
        ActionResponseSchema
      )
    ).ok;

  public kick = async (chatId: string, userId: string): Promise<boolean> =>
    (
      await this.http.post<ActionResponse>(
        {
          path: `/bot/chat/${chatId}/kick`,
          body: JSON.stringify({ user_id: userId }),
        },
        ActionResponseSchema
      )
    ).ok;

  public attach = (): void => this.dispatcher.attach(this.config.token);

  public bind = (...routers: Router[]): void => this.dispatcher.bind(...routers);
}
