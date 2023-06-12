import { InputType, Field, Float } from '@nestjs/graphql';
import { Condition, ConditionInput } from '@schemas/condition.schema';

@InputType()
export class CreateCompoundDataInput {
  @Field()
  propertyUuid: string;

  @Field()
  compoundUuid: string;

  @Field(() => Float)
  value: number;

  @Field(() => [ConditionInput])
  conditions: Condition[];
}
