import { ObjectType } from '@nestjs/graphql';
import { BaseError } from './base.error';
import { ERROR_CODES } from './error-codes';

@ObjectType()
export class NotFoundError extends BaseError {
  constructor(message: string, code?: string) {
    super();
    this.message = message;
    this.code = code ?? ERROR_CODES.NOT_FOUND;
  }
}
