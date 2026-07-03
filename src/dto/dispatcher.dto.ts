import z from 'zod';

import { ChatType } from '../types/usable';
import { InteractionTypeSchema } from '../entities/inline-button';

export const InteractionCallbackQuerySchema = z.object({
  chatId: z.string(),
  messageId: z.string(),
  buttonId: z.string(),
  userId: z.string(),
  communityId: z.number(),
  chatType: z.enum(ChatType),
  interaction: InteractionTypeSchema,
});

export type InteractionCallbackQuery = z.infer<typeof InteractionCallbackQuerySchema>;
