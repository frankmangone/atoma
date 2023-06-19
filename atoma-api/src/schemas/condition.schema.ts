import { CONDITIONS } from '@common/enums/conditions.enum';
import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class ConditionInput {
  @Field(() => Float, { nullable: true })
  [CONDITIONS.TEMPERATURE]: number;

  @Field(() => Float, { nullable: true })
  [CONDITIONS.PRESSURE]: number;
}
