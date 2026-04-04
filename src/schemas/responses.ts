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

export const MessageResponseSchema = z
  .object({
    message_id: z.string(),
    created_time: z.number(),
  })
  .transform((data) => {
    return {
      messageId: data.message_id,
      createdAt: data.created_time,
    };
  });

export const UploadResponseSchema = z.object({
  url: z.string(),
});

export type MeResponse = z.Infer<typeof MeResponseSchema>;
export type MessageResponse = z.Infer<typeof MessageResponseSchema>;
export type UploadResponse = z.Infer<typeof UploadResponseSchema>;
