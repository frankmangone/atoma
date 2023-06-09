import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface PaginatedType<T> {
  data: T[];
  nextCursor: string | null;
  prevCursor: string | null;
}

export function Paginated<T>(classRef: Type<T>): Type<PaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedModel implements PaginatedType<T> {
    @Field(() => [classRef], { nullable: true })
    data: T[];

    @Field(() => String, { nullable: true })
    nextCursor: string | null;

    @Field(() => String, { nullable: true })
    prevCursor: string | null;
  }
  return PaginatedModel as Type<PaginatedType<T>>;
}
