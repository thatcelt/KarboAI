import type { Payload } from '../types/http';

export const clean = (payload: Payload): Payload =>
  Object.fromEntries(Object.entries(payload).filter(([_, value]) => value));

export const generateRouterName = (): string =>
  `router-${Math.random().toString(36).substring(2, 9)}`;

export const bold = (text: string) => `**${text}**`;
export const italic = (text: string) => `__${text}__`;
export const centralize = (text: string) => `[C]${text}`;
export const code = (text: string) => `\`${text}\``;
export const strikethrough = (text: string) => `~~${text}~~`;
export const underline = (text: string) => `++${text}++`;
export const hyperlink = (text: string, url: string) => `[${text}](${url})`;
