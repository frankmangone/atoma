import { InputType, Field, Float } from '@nestjs/graphql';
import { Condition } from '@schemas/condition.schema';

@InputType()
export class CreateCompoundPropertyDataInput {
  @Field()
  propertyUuid: string;

  @Field()
  compoundUuid: string;

  @Field(() => Float)
  value: number;

  @Field() // TODO: ???
  conditions: Condition;
}
