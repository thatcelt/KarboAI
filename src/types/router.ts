import type {
  InteractionCallback,
  InteractionMiddleware,
  MessageCallback,
  MessageMiddleware,
} from './dispatcher';

export type CommandOptions = {
  pipes: MessageMiddleware[];
};

export type CommandFunctionOverload = {
  (startsWith: string, callback: MessageCallback): Promise<void>;
  (startsWith: string, options: CommandOptions, callback: MessageCallback): Promise<void>;
};

export type ButtonOptions = {
  pipes: InteractionMiddleware[];
};

export type ButtonFunctionOverload = {
  (buttonId: string, callback: InteractionCallback): Promise<void>;
  (buttonId: string, options: ButtonOptions, callback: InteractionCallback): Promise<void>;
};
