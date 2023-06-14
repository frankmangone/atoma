import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CompoundPropertyInput {
  @Field()
  compoundUuid: string;

  @Field()
  propertyUuid: string;
}
