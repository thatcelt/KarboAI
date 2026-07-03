import z from 'zod';

import { MemberSchema } from '../entities/member';

export const MeResponseSchema = z.object({
  botId: z.string(),
  name: z.string(),
  status: z.union([z.literal('not_official'), z.literal('official'), z.literal('banned')]),
});

export const SendMessageResponseSchema = z.object({
  messageId: z.string(),
  createdTime: z.number(),
});

export const UploadMediaResponseSchema = z.object({
  url: z.string(),
});

export const GetMembersResponseSchema = z.object({
  items: z.array(MemberSchema),
});

export const ActionResponseSchema = z.object({
  ok: z.boolean(),
});

export type MeResponse = z.infer<typeof MeResponseSchema>;
export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;
export type UploadMediaResponse = z.infer<typeof UploadMediaResponseSchema>;
export type GetMembersResponse = z.infer<typeof GetMembersResponseSchema>;
export type ActionResponse = z.infer<typeof ActionResponseSchema>;
