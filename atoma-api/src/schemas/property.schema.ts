import { Field, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/graphql/pagination/paginated.schema';
import { PropertyType } from '@common/enums';
import { BaseEntity } from '@common/graphql/base.schema';

@ObjectType()
export class Property extends BaseEntity {
  @Field(() => String)
  key: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  // TODO: Make this something more usable for conversions
  @Field(() => String)
  units: string;

  @Field(() => String)
  type: PropertyType;
}

@ObjectType()
export class PaginatedProperties extends Paginated(Property) {}
