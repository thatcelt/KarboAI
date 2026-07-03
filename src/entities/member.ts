import z from 'zod';

import { BaseUserSchema } from './base-user';

export const MemberStatusUnion = z.union([z.literal('joined'), z.literal('invited')]);

export const MemberSchema = z.object({
  ...BaseUserSchema.shape,
  avatarUrl: z.string(),
  memberStatus: MemberStatusUnion,
  isApiBot: z.boolean(),
});

export type MemberStatus = z.infer<typeof MemberStatusUnion>;
export type Member = z.infer<typeof MemberSchema>;
