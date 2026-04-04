import { SOCKET_TOPICS } from '../constants';
import { KarboAI } from '../core/karboai';
import { Message } from './karboai/message';

export type KarboContext = { karbo: KarboAI; message: Message };

export type SocketCallback = (context: KarboContext) => Promise<void>;
export type SocketMiddleware = (
  context: KarboContext,
) => Promise<boolean | undefined>;
export type ConnectCallback = () => Promise<void>;
export type SocketEvent = (typeof SOCKET_TOPICS)[keyof typeof SOCKET_TOPICS];

export type Listener = {
  callback: SocketCallback;
  middlewares: SocketMiddleware[];
};
