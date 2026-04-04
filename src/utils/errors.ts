import { ErrorData } from '../schemas/error';
import { ERRORS } from '../constants';

export class KarboException extends Error {
  public readonly code: number;

  constructor(code: number, data: ErrorData) {
    super(data.message);
    this.code = code;
    this.name = data.name || `KarboAI.${code}`;
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KarboException);
    }
  }

  static get(code: number): KarboException {
    const errorData = ERRORS[code];

    return errorData
      ? new KarboException(code, errorData)
      : new KarboException(code, {
          name: 'UnknownError',
          message: 'Unknown error',
        });
  }

  static throw(code: number): void {
    throw this.get(code);
  }
}
