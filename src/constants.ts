import { UndiciHeaders } from 'undici/types/dispatcher';
import { ErrorData } from './schemas/error';

export const KARBO_API = 'https://api.karboai.com';

export const BASIC_HEADERS: UndiciHeaders = {
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
    message: 'Please upload files smaller than XX bytes length', // TODO: rewrite to accurate length
  },
  429: {
    name: 'KarboAI.TooManyRequests',
    message: 'Rate limit exceeded',
  },
};
