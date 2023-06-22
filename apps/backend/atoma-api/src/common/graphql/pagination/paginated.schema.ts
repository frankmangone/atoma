import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

interface EdgeType<T> {
  cursor: string;
  node: T;
}

export interface PaginatedType<T> {
  edges: EdgeType<T>[];
  nodes: T[];
  pageInfo: PageInfo;
}

@ObjectType()
class PageInfo {
  @Field(() => String, { nullable: true })
  endCursor: string;

  @Field()
  hasNextPage: boolean;

  @Field(() => Int)
  totalCount: number;
}

export function Paginated<T>(classRef: Type<T>): Type<PaginatedType<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedSchema implements PaginatedType<T> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => [classRef], { nullable: true })
    nodes: T[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
  }
  return PaginatedSchema as Type<PaginatedType<T>>;
}
