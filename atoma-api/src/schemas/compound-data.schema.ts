import { Field, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/paginated.schema';
import { BaseEntity } from '@common/repositories/base.schema';
import { Condition } from './condition.schema';
import { CompoundProperty } from './compound-property.schema';

@ObjectType()
export class CompoundData extends BaseEntity {
  @Field(() => CompoundProperty)
  compoundProperty: CompoundProperty;

  @Field(() => String)
  value: number;

  // @Prop({ type: [{ type: ConditionSchema }] })
  conditions: Condition[];
}

@ObjectType()
export class PaginatedCompoundData extends Paginated(CompoundData) {}
