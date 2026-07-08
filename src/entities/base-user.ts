import z from 'zod';

import { Role } from '../types/usable';
import { FrameSchema } from './frame';

export const BaseUserSchema = z.object({
  userId: z.string(),
  nickname: z.string(),
  role: z.union([z.enum(Role), z.number()]),
  appRole: z.number(),
  panelColor: z.string().optional(),
  level: z.number(),
  nicknameColor: z.string().optional(),
  nicknameEmoji: z.string().optional(),
  avatarFrame: FrameSchema,
});

export type BaseUser = z.infer<typeof BaseUserSchema>;
