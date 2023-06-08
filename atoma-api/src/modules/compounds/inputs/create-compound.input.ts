import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCompoundInput {
  @Field()
  name: string;

  @Field()
  reducedFormula: string;
}
