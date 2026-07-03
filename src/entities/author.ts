import z from 'zod';

import { Role } from '../types/usable';
import { FrameSchema } from './frame';

export const AuthorSchema = z.object({
  userId: z.string(),
  nickname: z.string(),
  avatarUrl: z.string(),
  role: z.enum(Role),
  appRole: z.number(),
  panelColor: z.string().optional().nullable(),
  level: z.number(),
  nicknameColor: z.string().optional().nullable(),
  nicknameEmoji: z.string().optional().nullable(),
  avatarFrame: FrameSchema.nullable(),
  isApiBot: z.boolean().optional(),
});

export type Author = z.infer<typeof AuthorSchema>;
