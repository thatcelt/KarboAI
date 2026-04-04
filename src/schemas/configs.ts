import { z, ZodType } from 'zod';

export const GetRequestConfigSchema = z.object({
  path: z.string(),
  schema: z.instanceof(ZodType),
});

export const PostRequestConfigSchema = z.object({
  ...GetRequestConfigSchema.shape,
  body: z.string(),
});

export const KarboConfigSchema = z.object({
  token: z.string(),
  id: z.string(),
  enableLogging: z.boolean().optional(),
});

export const SendMessageConfigSchema = z.object({
  chatId: z.string(),
  content: z.string().optional(),
  replyMessageId: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export type GetRequestConfig = z.Infer<typeof GetRequestConfigSchema>;
export type PostRequestConfig = z.Infer<typeof PostRequestConfigSchema>;
export type KarboConfig = z.Infer<typeof KarboConfigSchema>;
export type SendMessageConfig = z.Infer<typeof SendMessageConfigSchema>;
