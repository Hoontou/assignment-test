import { Response } from 'express';
import { CustomError, InternalServerError } from './custom-errors';

class SingletonClass {
  static getInstance(...rest): SingletonClass {
    throw new Error('getInstance method must be implemented by subclass');
  }
}

export class CustomController extends SingletonClass {
  protected handleResponseError(res: Response, error: CustomError | any) {
    res.status(error.statusCode || 500).emit('error', error);
    res.json({ message: error.message, code: error.code });
  }
}

export class CustomService extends SingletonClass {
  protected handleError(error: unknown | CustomError, errorMessage: string) {
    if (error instanceof CustomError) {
      console.log(error);
      return error;
    }

    console.log(errorMessage, error);
    return new InternalServerError(errorMessage);
  }
}
