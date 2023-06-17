import { FindPaginatedInput } from '@common/graphql/pagination/pagination.input';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CompoundPropertiesInput extends FindPaginatedInput {
  @Field()
  compoundUuid: string;
}
