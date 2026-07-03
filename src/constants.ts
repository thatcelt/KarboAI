import type { ErrorData } from './types/errors';
import type { Headers } from './types/http';

export const BASE_URL = 'https://api.karboai.com';

export const BASIC_HEADERS: Headers = {
  'Content-Type': 'application/json',
};

export const ERRORS: Record<number, ErrorData> = {
  400: {
    name: 'KarboAI.BadRequest',
    message: 'May empty message, content too long, too many images',
  },
  401: {
    name: 'KarboAI.Unauthorized',
    message: 'Invalid bot token',
  },
  403: {
    name: 'KarboAI.Forbidden',
    message: 'Access denied',
  },
  404: {
    name: 'KarboAI.NotFound',
    message: "Content doesn't exist",
  },
  413: {
    name: 'KarboAI.FileTooLarge',
    message: 'Please upload files smaller than some bytes length',
  },
  429: {
    name: 'KarboAI.TooManyRequests',
    message: 'Rate limit exceeded',
  },
};

export const SOCKETIO_TOPICS = {
  0: 'message',
  1: 'join',
  2: 'leave',
  3: 'kicked',
  4: 'dm',
  5: 'messageDeleted',
  6: 'messageDeletedByAdmin',
  7: 'voiceStart',
  8: 'voiceEnd',
  9: 'backgroundChanged',
  10: 'userInvited',
  11: 'botInvited',
  21: 'actionBeer',
  22: 'actionKicked',
  23: 'actionFight',
  24: 'dmCallStarted',
  25: 'dmCallDeclined',
  26: 'dmCallMissed',
  27: 'dmCallEnded',
  28: 'cinemaStarted',
  29: 'cinemaEnded',
};
