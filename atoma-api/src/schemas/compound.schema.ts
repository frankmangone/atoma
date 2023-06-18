import { Paginated } from '@common/graphql/pagination/paginated.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@common/graphql/base.schema';
import { Unique } from '@modules/neo4j/utils/decorators/unique.decorator';
import { NodeType } from '@modules/neo4j/utils/decorators/node-type.decorator';
import { NodeProperty } from '@modules/neo4j/utils/decorators/node-property.decorator';

@NodeType()
@ObjectType()
export class Compound extends BaseEntity {
  @Unique()
  @NodeProperty()
  @Field(() => String)
  name: string;

  @NodeProperty()
  @Field({ nullable: true })
  reducedFormula?: string;

  @NodeProperty()
  alternativeNames: string[];
}

@ObjectType()
export class PaginatedCompounds extends Paginated(Compound) {}
