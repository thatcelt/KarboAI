import z from 'zod';

export const BotStatusEnum = z
  .enum(['not_official', 'official', 'banned'])
  .transform((data) => data.toUpperCase());
