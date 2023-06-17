import { Paginated } from '@common/pagination/paginated.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@common/repositories/base.schema';
import { Compound } from './compound.schema';
import { Property } from './property.schema';

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
