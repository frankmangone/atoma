import { Field, Float, InputType } from '@nestjs/graphql';
import { raw } from '@nestjs/mongoose';

@InputType()
export class ConditionInput {
  @Field()
  variable: string;

  @Field(() => Float)
  value: number;
}

export type Condition = typeof ConditionInput;

export const ConditionSchema = raw({
  variable: { type: String },
  value: { type: Number },
});
