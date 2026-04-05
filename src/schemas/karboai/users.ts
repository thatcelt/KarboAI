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

export const AuthorSchema = z
  .object({
    user_id: z.string(),
    nickname: z.string(),
    avatar_url: z.string(),
    avatar_frame: z.object().nullable().optional(),
    role: z.number().optional(),
    app_role: z.number().optional(),
    panel_color: z.string().nullable().optional(),
    level: z.number().optional(),
    nickname_color: z.string().nullable().optional(),
    nickname_emoji: z.string().nullable().optional(),
  })
  .transform((data) => {
    return {
      userId: data.user_id,
      nickname: data.nickname,
      avatarUrl: data.avatar_url,
      avatarFrame: data.avatar_frame,
      role: data.role,
      appRole: data.app_role,
      panelColor: data.panel_color,
      level: data.level,
      nicknameColor: data.nickname_color,
      nicknameEmoji: data.nickname_emoji,
    };
  });

export type User = z.infer<typeof UserSchema>;
export type Member = z.infer<typeof MemberSchema>;
export type Author = z.infer<typeof AuthorSchema>;
