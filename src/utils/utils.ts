export const clean = (body: Record<string, any>): Record<string, any> =>
  Object.fromEntries(
    Object.entries(body).filter(([_, value]) => value !== undefined),
  );
