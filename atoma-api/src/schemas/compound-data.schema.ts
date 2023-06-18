import { Field, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/graphql/pagination/paginated.schema';
import { BaseEntity } from '@common/graphql/base.schema';
import { Condition } from './condition.schema';
import { CompoundProperty } from './compound-property.schema';
import { NodeType } from '@modules/neo4j/utils/decorators/node-type.decorator';

@NodeType()
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
