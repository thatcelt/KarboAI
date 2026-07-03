import z from 'zod';

import { ChatType, MessageType } from '../types/usable';
import { MemberStatusUnion } from './member';

export const ChatSchema = z.object({
  chatId: z.string(),
  type: z.enum(ChatType),
  title: z.string(),
  background: z.string(),
  icon: z.string(),
  chatDescription: z.string(),
  communityId: z.number(),
  pinnedMessage: z.string(),
  everyoneCanInvite: z.boolean(),
  voiceInviteOnly: z.boolean(),
  isVoiceActive: z.boolean(),
  isCinemaActive: z.boolean(),
  isHidden: z.number(),
  createdTime: z.number(),
  creatorUserId: z.string(),
  creatorNickname: z.string(),
  creatorAvatarUrl: z.string(),
  usersCount: z.number(),
  isChatMember: z.boolean(),
  memberStatus: MemberStatusUnion,
  isMutedChat: z.boolean(),
  lastReadedMessageId: z.number(),
  helpersIds: z.array(z.string()),
  otherUserId: z.string().optional(),
  otherUserNickname: z.string().optional(),
  otherUserAvatarUrl: z.string().optional(),
  lastMessage: z
    .object({
      messageId: z.string(),
      content: z.string(),
      createdTime: z.number(),
      type: z.enum(MessageType),
      userId: z.string(),
      hasImages: z.boolean(),
      audio: z.string().optional(),
      sticker: z.string().optional(),
      videoNote: z.string().optional(),
      author: z.object({
        userId: z.string(),
        nickname: z.string(),
        avatarUrl: z.string(),
      }),
    })
    .optional(),
});
