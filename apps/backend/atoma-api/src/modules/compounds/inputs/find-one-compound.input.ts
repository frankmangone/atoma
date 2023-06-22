import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FindOneCompoundInput {
  @Field()
  name: string;
}
