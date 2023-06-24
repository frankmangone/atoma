import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class FindPaginatedInput {
  @Field(() => Int)
  first: number;

  @Field(() => String, { nullable: true })
  after?: string;
}
