import { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator';

export enum ErrorCodes {
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
}

export class CustomError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, ErrorCodes.NOT_FOUND, 404);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string) {
    super(message, ErrorCodes.INTERNAL_SERVER_ERROR, 500);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, ErrorCodes.BAD_REQUEST, 400);
  }
}
export const handleValidationError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const newError = new BadRequestError('Error while API input validation');
    res.status(newError.statusCode).emit('error', newError);
    res.status(newError.statusCode).json({ errors: errors.array() });
    return;
  }
  next();
};
