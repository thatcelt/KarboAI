import type { InlineButton } from '../entities/inline-button';

export enum Role {
  Regular = 0,
}

export enum MessageType {
  Text = 0,
  Join = 1,
  Leave = 2,
  Kicked = 3,
  DM = 4,
  Deleted = 5,
  AdminDeleted = 6,
  VoiceStart = 7,
  VoiceEnd = 8,
  Background = 9,
  InvitedUser = 10,
  InvitedBot = 11,
  ActionBeer = 21,
  ActionKicked = 22,
  ActionFight = 23,
  DMCallStarted = 24,
  DMCallDeclined = 25,
  DMCallMissed = 26,
  DMCallEnded = 27,
  CinemaStarted = 28,
  CinemaEnded = 29,
}

export enum ChatType {
  Public = 0,
  DM = 1,
  PM = 2,
  Private = 3,
}

export type KarboConfig = {
  token: string;
  id: string;
  enableLogging?: boolean;
};

export type MessageBuilder = {
  chatId: string;
  content?: string;
  replyMessageId?: string;
  images?: string[];
  inlineButtons?: InlineButton[][];
};

export type TextBuilder = {
  content: string;
  chatId: string;
  replyMessageId?: string;
  inlineButtons?: InlineButton[][];
};

export type ImageBuilder = {
  chatId: string;
  images: string[];
  caption?: string;
  replyMessageId?: string;
  inlineButtons?: InlineButton[][];
};
