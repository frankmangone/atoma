import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class ConditionInput {
  @Field()
  variable: string;

  @Field(() => Float)
  value: number;
}

export type Condition = typeof ConditionInput;

export const ConditionSchema = {
  variable: { type: String },
  value: { type: Number },
};
