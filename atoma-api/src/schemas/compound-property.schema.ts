import { Paginated } from '@common/graphql/pagination/paginated.schema';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@common/graphql/base.schema';
import { Compound } from './compound.schema';
import { Property } from './property.schema';
import { NodeType } from '@modules/neo4j/utils/decorators/node-type.decorator';

@NodeType()
@ObjectType()
export class CompoundProperty extends BaseEntity {
  @Field(() => String)
  compoundUuid: string;

  @Field(() => String)
  propertyUuid: string;

  @Field(() => Compound)
  compound: Compound;

  @Field(() => Property)
  property: Property;
}

@ObjectType()
export class PaginatedCompoundProperties extends Paginated(CompoundProperty) {}
