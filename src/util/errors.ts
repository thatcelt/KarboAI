import { ERRORS } from '../constants';
import type { ErrorData } from '../types/errors';

export class KarboError extends Error {
  public readonly code: number;

  constructor(code: number, data: ErrorData) {
    super(data.message);
    this.code = code;
    this.name = data.name || `KarboAI.${code}`;
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KarboError);
    }
  }

  static get(code: number): KarboError {
    const errorData = ERRORS[code];

    return errorData
      ? new KarboError(code, errorData)
      : new KarboError(code, {
          name: 'UnknownError',
          message: 'Unknown error',
        });
  }

  static throw(code: number): void {
    throw this.get(code);
  }
}
