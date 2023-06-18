import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/graphql/pagination/paginated.schema';
import { BaseEntity } from '@common/graphql/base.schema';
import { CompoundProperty } from './compound-property.schema';
import { NodeType } from '@modules/neo4j/utils/decorators/node-type.decorator';
import { CONDITIONS } from '@common/enums/conditions.enum';

@NodeType()
@ObjectType()
export class CompoundData extends BaseEntity {
  @Field(() => CompoundProperty)
  compoundProperty: CompoundProperty;

  @Field(() => String)
  value: number;

  @Field(() => Float, { nullable: true })
  [CONDITIONS.TEMPERATURE]: number;

  @Field(() => Float, { nullable: true })
  [CONDITIONS.PRESSURE]: number;
}

@ObjectType()
export class PaginatedCompoundData extends Paginated(CompoundData) {}
