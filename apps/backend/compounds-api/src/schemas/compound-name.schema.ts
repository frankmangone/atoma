import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@common/graphql/base.schema';
import { NodeType } from '@modules/neo4j/utils/decorators/node-type.decorator';

@NodeType()
@ObjectType()
export class CompoundName extends BaseEntity {
  @Field(() => String)
  name: string;
}
