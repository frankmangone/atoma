import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class BaseEntity {
  @Field(() => String)
  uuid: string;
}
