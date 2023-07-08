import { FindPaginatedInput } from '@common/graphql/pagination/pagination.input';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FindManyPropertiesInput extends FindPaginatedInput {
  @Field(() => String, { nullable: true })
  name?: string;
}
