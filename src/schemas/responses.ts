import z from 'zod';
import { BotStatusEnum } from './enums';

export const MeResponseSchema = z
  .object({
    bot_id: z.string(),
    name: z.string(),
    status: BotStatusEnum,
  })
  .transform((data) => {
    return {
      botId: data.bot_id,
      name: data.name,
      status: data.status,
    };
  });

export type MeResponse = z.Infer<typeof MeResponseSchema>;
