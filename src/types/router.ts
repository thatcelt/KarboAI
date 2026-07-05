import type { KarboAI } from '../client/karboai';
import type {
  InteractionCallback,
  InteractionMiddleware,
  MessageCallback,
  MessageMiddleware,
} from './dispatcher';

export type CommonMiddleware = (context: { karbo: KarboAI }) => Promise<boolean>;

export type CommandOptions = {
  middlewares: MessageMiddleware[];
};

export type CommandFunctionOverload = {
  (startsWith: string, callback: MessageCallback): Promise<void>;
  (startsWith: string, options: CommandOptions, callback: MessageCallback): Promise<void>;
};

export type ButtonOptions = {
  middlewares?: InteractionMiddleware[];
  regex?: RegExp;
};

export type ButtonFunctionOverload = {
  (buttonId: string, callback: InteractionCallback): Promise<void>;
  (buttonId: string, options: ButtonOptions, callback: InteractionCallback): Promise<void>;
};

export type MiddlewareMap = {
  message: MessageMiddleware;
  interaction: InteractionMiddleware;
  common: CommonMiddleware;
};

export type MiddlewareKeys = keyof MiddlewareMap;
