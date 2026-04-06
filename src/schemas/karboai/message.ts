import { z } from 'zod';

import { AuthorSchema } from './users';
import { ReactionSchema } from './reaction';

export const MessageSchema = z
  .object({
    message_id: z.string(),
    chat_id: z.string(),
    content: z.string(),
    created_time: z.number(),
    type: z.number(),
    reply_message_id: z.string().nullable(),
    audio: z.string().optional().nullable(),
    sticker: z.string().nullable().optional(),
    images: z.array(z.string()),
    audio_duration_ms: z.number().nullable().optional(),
    waveform: z.array(z.any()).nullable().optional(),
    video_note: z.string().nullable().optional(),
    video_note_duration_ms: z.number().nullable().optional(),
    transparent: z.boolean().optional(),
    bubble_id: z.string().nullable().optional(),
    bubble_version: z.number().nullable().optional(),
    reactions: z.array(ReactionSchema).optional(),
    author: AuthorSchema,
  })
  .transform((data) => {
    return {
      messageId: data.message_id,
      chatId: data.chat_id,
      content: data.content,
      createdTime: data.created_time,
      type: data.type,
      replyMessageId: data.reply_message_id,
      audio: data.audio,
      sticker: data.sticker,
      images: data.images,
      author: data.author,
    };
  });

export type Message = z.infer<typeof MessageSchema>;
