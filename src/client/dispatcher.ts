import { io, Socket } from 'socket.io-client';
import camelize from 'camelize';
import type { Logger } from 'pino';

import { MessageSchema } from '../entities/message';
import { BASE_URL, SOCKETIO_TOPICS } from '../constants';
import { InteractionCallbackQuerySchema } from '../dto/dispatcher.dto';
import type { Router } from '../features/router';
import type { KarboAI } from './karboai';
import type { InteractionListener, MessageListener, SocketMessageEvent } from '../types/dispatcher';

export class Dispatcher {
  private karbo: KarboAI;
  private logger: Logger;

  private socket?: Socket;

  private messageListeners: Map<SocketMessageEvent, MessageListener[]> = new Map();
  private interactionListeners: Map<string, InteractionListener[]> = new Map();

  constructor(karbo: KarboAI, logger: Logger) {
    this.karbo = karbo;
    this.logger = logger;
  }

  private messages = () => {
    this.socket?.on('new_message', (data) => {
      const message = MessageSchema.parse(camelize(data));
      if (message.author.userId == this.karbo.id) return;

      const event = SOCKETIO_TOPICS[message.type as keyof typeof SOCKETIO_TOPICS];

      this.logger.info(
        {
          event,
          content: message.content,
          chatId: message.chatId,
          userId: message.author.userId,
          type: message.type,
        },
        'message received'
      );

      this.messageListeners.get(event)?.forEach(async (listener) => {
        for (const middleware of listener.middlewares) {
          if (!(await middleware({ karbo: this.karbo, message }))) return;
        }

        listener.callback({ karbo: this.karbo, message });
      });
    });
  };

  private interactions = () => {
    this.socket?.on('button_pressed', (data) => {
      const query = InteractionCallbackQuerySchema.parse(camelize(data));

      this.logger.info(
        {
          buttonId: query.buttonId,
          chatId: query.chatId,
          userId: query.userId,
        },
        'button pressed'
      );

      this.interactionListeners.get(query.buttonId)?.forEach(async (listener) => {
        for (const middleware of listener.middlewares) {
          if (!(await middleware({ karbo: this.karbo, query }))) return;
        }

        listener.callback({ karbo: this.karbo, query });
      });
    });
  };

  public bind = (...routers: Router[]): void => {
    for (const router of routers) {
      for (const [event, listeners] of router.messageListeners) {
        if (!this.messageListeners.has(event)) this.messageListeners.set(event, []);
        for (const listener of listeners) {
          this.messageListeners.get(event)!.push(listener);
        }
      }

      for (const [buttonId, listeners] of router.interactionListeners) {
        if (!this.interactionListeners.has(buttonId)) this.interactionListeners.set(buttonId, []);
        for (const listener of listeners) {
          this.interactionListeners.get(buttonId)!.push(listener);
        }
      }

      this.logger.info(`bound router: ${router.name}`);
    }
  };

  public attach = (token: string): void => {
    this.socket = io(BASE_URL, {
      path: '/bot/ws',
      transports: ['websocket'],
      auth: { bot_token: token },
    });

    this.messages();
    this.interactions();

    this.socket.on('connect', async () => {
      this.logger.info('connected to KarboAI socket');
    });
  };
}
