import { Paginated } from '@common/graphql/pagination/paginated.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@common/graphql/base.schema';
import { Unique } from '@modules/neo4j/utils/decorators/unique.decorator';
import { NodeType } from '@modules/neo4j/utils/decorators/node-type.decorator';

@NodeType()
@ObjectType()
export class Compound extends BaseEntity {
  @Unique()
  @Field(() => String)
  name: string;

  @Field({ nullable: true })
  reducedFormula?: string;

  alternativeNames: string[];
}

@ObjectType()
export class PaginatedCompounds extends Paginated(Compound) {}
