import { PropertyType } from '@common/enums';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePropertyInput {
  @Field(() => String)
  key: string; // TODO: Generate `PropertyKey` type

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  units: string;

  @Field(() => String)
  type: PropertyType;
}
