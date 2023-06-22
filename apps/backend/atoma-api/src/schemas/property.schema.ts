import { Field, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/graphql/pagination/paginated.schema';
import { PropertyType } from '@common/enums';
import { BaseEntity } from '@common/graphql/base.schema';
import { NodeType } from '@modules/neo4j/utils/decorators/node-type.decorator';
import { Unique } from '@modules/neo4j/utils/decorators/unique.decorator';

@NodeType()
@ObjectType()
export class Property extends BaseEntity {
  @Unique()
  @Field(() => String)
  key: string;

  @Unique()
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
