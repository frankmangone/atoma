import { Paginated } from '@common/graphql/pagination/paginated.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@common/graphql/base.schema';

@ObjectType()
export class Compound extends BaseEntity {
  @Field(() => String)
  name: string;

  @Field({ nullable: true })
  reducedFormula?: string;

  alternativeNames: string[];
}

@ObjectType()
export class PaginatedCompounds extends Paginated(Compound) {}
