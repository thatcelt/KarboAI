import { z } from 'zod';

const BasicUserSchema = z.object({
  user_id: z.string(),
  nickname: z.string(),
  avatar: z.string(),
  role: z.number(),
  short_info: z.string(),
});

export const UserSchema = BasicUserSchema.transform((data) => {
  return {
    userId: data.user_id,
    nickname: data.nickname,
    avatar: data.avatar,
    role: data.role,
    shortInfo: data.short_info,
  };
});

export const MemberSchema = BasicUserSchema.transform((data) => {
  return {
    userId: data.user_id,
    nickname: data.nickname,
    avatar: data.avatar,
    role: data.role,
  };
});

export const AuthorSchema = BasicUserSchema.transform((data) => {
  return {
    userId: data.user_id,
    nickname: data.nickname,
    avatar: data.avatar,
  };
});

export type User = z.infer<typeof UserSchema>;
export type Member = z.infer<typeof MemberSchema>;
export type Author = z.infer<typeof AuthorSchema>;
