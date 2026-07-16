import z from 'zod';

import { ChatType, MessageType } from '../types/usable';
import { ReactionSchema } from './reaction';
import { AuthorSchema } from './author';

export const MessageSchema = z.object({
  messageId: z.string(),
  chatId: z.string(),
  content: z.string(),
  createdTime: z.number(),
  type: z.enum(MessageType),
  communityId: z.number().optional(),
  chatType: z.number(),
  replyMessageId: z.string().optional().nullable(),
  audio: z.string().optional().nullable(),
  audioDurationMs: z.number().optional().nullable(),
  waveform: z.array(z.float32()).optional().nullable(),
  videoNote: z.string().optional().nullable(),
  videoNoteDurationMs: z.number().optional().nullable(),
  sticker: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  transparent: z.boolean().optional(),
  bubbleId: z.string().optional().nullable(),
  bubbleVersion: z.number().optional(),
  reactions: z.array(ReactionSchema).optional(),
  author: AuthorSchema,
});

export type Message = z.infer<typeof MessageSchema>;
