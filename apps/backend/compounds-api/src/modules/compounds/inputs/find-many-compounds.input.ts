import { FindPaginatedInput } from '@common/graphql/pagination/pagination.input';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FindManyCompoundsInput extends FindPaginatedInput {
  @Field(() => String, { nullable: true })
  name?: string;
}
