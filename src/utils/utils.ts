export const clean = (body: Record<string, any>): Record<string, any> =>
  Object.fromEntries(
    Object.entries(body).filter(([_, value]) => value !== undefined),
  );

export const generateRouterName = (): string =>
  `router-${Math.random().toString(36).substring(2, 9)}`;
