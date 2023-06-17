import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class FindPaginatedInput {
  @Field(() => Int)
  limit: number;

  @Field(() => String, { nullable: true })
  before?: string;

  @Field(() => String, { nullable: true })
  after?: string;
}
