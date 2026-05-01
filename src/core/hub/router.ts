import { Message } from '../../schemas/karboai/message';
import {
  KarboContext,
  Listener,
  SocketCallback,
  SocketEvent,
  SocketMiddleware,
} from '../../schemas/sockets';
import { generateRouterName } from '../../utils/utils';

const commandMiddleware =
  (content: string) =>
  async (context: KarboContext): Promise<boolean> => {
    if (!context.message.content.toLowerCase().startsWith(content))
      return false;
    return true;
  };

export class Router {
  private _name: string;
  private _listeners: Map<SocketEvent, Set<Listener>> = new Map<
    SocketEvent,
    Set<Listener>
  >();
  private middlewares: SocketMiddleware[] = [];

  constructor(name: string = generateRouterName()) {
    this._name = name;
  }

  get listeners() {
    return this._listeners;
  }

  get name() {
    return this._name;
  }

  public pre = (middleware: SocketMiddleware) =>
    this.middlewares.push(middleware);

  public on = (event: SocketEvent, callback: SocketCallback): void => {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());

    this._listeners
      .get(event)!
      .add({ middlewares: this.middlewares, callback });
  };

  public command = async (
    startsWith: string,
    callback: SocketCallback,
  ): Promise<void> => {
    if (!this._listeners.has('message'))
      this._listeners.set('message', new Set());

    this._listeners.get('message')!.add({
      middlewares: [commandMiddleware(startsWith), ...this.middlewares],
      callback,
    });
  };
}
