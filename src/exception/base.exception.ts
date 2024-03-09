import { HttpException, HttpStatus } from "@nestjs/common";

export enum errorName {
  VALIDATION_EXCEPTION = "validation_exception",
}

export class BaseException extends HttpException {
  errorName: errorName;

  constructor(
    message: string | Record<string, any>,
    errorName: errorName,
    status: number
  ) {
    super(message, status);

    this.errorName = errorName;
  }
}

export class ValidationException extends BaseException {
  constructor(message: string | Record<string, any>, code: string) {
    super(
      { message, code },
      errorName.VALIDATION_EXCEPTION,
      HttpStatus.BAD_REQUEST
    );
  }
}
