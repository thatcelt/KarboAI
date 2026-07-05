import { SOCKETIO_TOPICS } from '../constants';
import type { KarboAI } from '../client/karboai';
import type { InteractionCallbackQuery } from '../dto/dispatcher.dto';
import type { Message } from '../entities/message';

export type MessageContext = { karbo: KarboAI; message: Message };
export type SocketMessageEvent = (typeof SOCKETIO_TOPICS)[keyof typeof SOCKETIO_TOPICS];
export type MessageCallback = (context: MessageContext) => Promise<void>;
export type MessageMiddleware = (context: MessageContext) => Promise<boolean | undefined>;

export type InteractionContext = { karbo: KarboAI; query: InteractionCallbackQuery };
export type InteractionCallback = (context: InteractionContext) => Promise<void>;
export type InteractionMiddleware = (context: InteractionContext) => Promise<boolean | undefined>;

export type MessageListener = {
  callback: MessageCallback;
  middlewares: MessageMiddleware[];
};

export type InteractionListener = {
  callback: InteractionCallback;
  middlewares: InteractionMiddleware[];
  regex?: RegExp;
};
