import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseError {
  @Field(() => String)
  message: string;

  @Field(() => String)
  code: string;
}
