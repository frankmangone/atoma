import { Condition } from '@common/enums/conditions.enum';
import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class ConditionInput {
  // TODO: restrict to scalar condition?
  @Field()
  variable: Condition;

  @Field(() => Float)
  value: number;
}
