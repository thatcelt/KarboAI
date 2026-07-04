import { generateRouterName } from '../util/helpers';
import type {
  InteractionCallback,
  InteractionListener,
  InteractionMiddleware,
  MessageCallback,
  MessageContext,
  MessageListener,
  MessageMiddleware,
  SocketMessageEvent,
} from '../types/dispatcher';
import type {
  ButtonFunctionOverload,
  ButtonOptions,
  CommandFunctionOverload,
  CommandOptions,
} from '../types/router';

const commandMiddleware =
  (content: string) =>
  async (context: MessageContext): Promise<boolean> => {
    if (!context.message.content.toLowerCase().startsWith(content)) return false;
    return true;
  };

const isInteractionMiddleware = (
  callback: MessageMiddleware | InteractionMiddleware
): callback is InteractionMiddleware => {
  return typeof callback == 'function';
};

export class Router {
  private _name: string;
  private _messageListeners: Map<SocketMessageEvent, MessageListener[]> = new Map();
  private _interactionListeners: Map<string, InteractionListener[]> = new Map();
  private messageMiddlewares: MessageMiddleware[] = [];
  private interactionMiddlewares: InteractionMiddleware[] = [];

  constructor(name: string = generateRouterName()) {
    this._name = name;
  }

  get messageListeners() {
    return this._messageListeners;
  }

  get interactionListeners() {
    return this._interactionListeners;
  }

  get name() {
    return this._name;
  }

  public pipe = (middleware: MessageMiddleware | InteractionMiddleware) =>
    isInteractionMiddleware(middleware)
      ? this.interactionMiddlewares.push(middleware)
      : this.messageMiddlewares.push(middleware);

  public on = (event: SocketMessageEvent, callback: MessageCallback): void => {
    if (!this._messageListeners.has(event)) this._messageListeners.set(event, []);

    this._messageListeners.get(event)!.push({ middlewares: this.messageMiddlewares, callback });
  };

  public command: CommandFunctionOverload = async (
    startsWith: string,
    callbackOrOptions: MessageCallback | CommandOptions,
    callback?: MessageCallback
  ): Promise<void> => {
    if (typeof callbackOrOptions !== 'function' && !callback)
      throw new Error('callbackOrOptions must be a function or ButtonOptions with a callback');

    if (!this._messageListeners.has('message')) this._messageListeners.set('message', []);

    if (typeof callbackOrOptions === 'function') {
      this._messageListeners.get('message')!.push({
        middlewares: [commandMiddleware(startsWith), ...this.messageMiddlewares],
        callback: callbackOrOptions,
      });
    } else {
      this._messageListeners.get('message')!.push({
        middlewares: [
          commandMiddleware(startsWith),
          ...this.messageMiddlewares,
          ...callbackOrOptions.pipes,
        ],
        callback: callback!,
      });
    }
  };

  public button: ButtonFunctionOverload = async (
    buttonId: string,
    callbackOrOptions: InteractionCallback | ButtonOptions,
    callback?: InteractionCallback
  ): Promise<void> => {
    if (typeof callbackOrOptions !== 'function' && !callback)
      throw new Error('callbackOrOptions must be a function or ButtonOptions with a callback');

    if (!this._interactionListeners.has(buttonId)) this._interactionListeners.set(buttonId, []);

    if (typeof callbackOrOptions === 'function') {
      this._interactionListeners
        .get(buttonId)!
        .push({ middlewares: this.interactionMiddlewares, callback: callbackOrOptions });
    } else {
      this._interactionListeners.get(buttonId)!.push({
        middlewares: [...this.interactionMiddlewares, ...callbackOrOptions.pipes],
        callback: callback!,
      });
    }
  };
}
