export enum ErrorCodes {
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export class CustomError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }

  // log() {
  //   console.error(
  //     `Error: ${this.message}, Code: ${this.code}, Status: ${this.statusCode}`
  //   );
  // }
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
