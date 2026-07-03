import z from 'zod';

import { BaseUserSchema } from './base-user';

export const UserSchema = z.object({
  ...BaseUserSchema.shape,
  avatar: z.string(),
  shortInfo: z.string(),
  bubbleId: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
