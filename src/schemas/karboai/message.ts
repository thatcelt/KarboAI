import { z } from 'zod';

import { AuthorSchema } from './users';

export const MessageSchema = z.object({
  message_id: z.string(),
  chat_id: z.string(),
  user_id: z.string(),
  content: z.string(),
  created_time: z.string(),
  type: z.number(),
  reply_message_id: z.string().nullable(),
  audio: z.string().nullable(),
  sticker: z.string().nullable(),
  images: z.array(z.string()),
  author: AuthorSchema,
});

export type Message = z.infer<typeof MessageSchema>;
