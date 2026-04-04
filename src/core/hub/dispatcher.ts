import { io, Socket } from 'socket.io-client';

import { ConnectCallback, Listener, SocketEvent } from '../../schemas/sockets';
import { KARBO_API, SOCKET_TOPICS } from '../../constants';
import { MessageSchema } from '../../schemas/karboai/message';
import { Router } from './router';
import { LOGGER } from '../../utils/logger';
import { KarboAI } from '../karboai';

export class Dispatcher {
  private karbo: KarboAI;
  private socket?: Socket;

  private listeners: Map<SocketEvent, Set<Listener>> = new Map<
    SocketEvent,
    Set<Listener>
  >();

  constructor(karbo: KarboAI) {
    this.karbo = karbo;
  }

  private processListeners = () => {
    this.socket?.on('new_message', (data) => {
      const message = MessageSchema.parse(data);
      if (message.author.userId == this.karbo.id) return;

      const event = SOCKET_TOPICS[message.type as keyof typeof SOCKET_TOPICS];

      this.listeners.get(event)?.forEach(async (listener) => {
        for (const middleware of listener.middlewares) {
          if (!(await middleware({ karbo: this.karbo, message }))) return;
        }

        LOGGER.info({
          event,
          content: message.content,
          chatId: message.chatId,
          userId: message.author.userId,
        });

        listener.callback({ karbo: this.karbo, message });
      });
    });
  };

  public bind = (...routers: Router[]): void => {
    for (const router of routers) {
      for (const [event, listeners] of router.listeners) {
        if (!this.listeners.has(event)) this.listeners.set(event, new Set());
        for (const listener of listeners) {
          this.listeners.get(event)!.add(listener);
        }
      }

      LOGGER.info(`Bound router: ${router.name}`);
    }
  };

  public attach = (token: string, callback: ConnectCallback): void => {
    this.socket = io(KARBO_API, {
      path: '/bot/ws',
      transports: ['websocket'],
      auth: { bot_token: token },
    });

    this.socket.on('connect', async () => {
      LOGGER.info('Connected to KarboAI socket');

      await callback();
      this.processListeners();
    });
  };
}
