export const clean = (body: Record<string, any>): Record<string, any> =>
  Object.fromEntries(
    Object.entries(body).filter(([_, value]) => value !== undefined),
  );

export const generateRouterName = (): string =>
  `router-${Math.random().toString(36).substring(2, 9)}`;

export const bold = (text: string) => `**${text}**`;
export const italic = (text: string) => `__${text}__`;
export const centralize = (text: string) => `[C]${text}`;
export const code = (text: string) => `\`${text}\``;
export const strikethrough = (text: string) => `~~${text}~~`;
export const underline = (text: string) => `++${text}++`;
export const hyperlink = (text: string, url: string) => `[${text}](${url})`;
