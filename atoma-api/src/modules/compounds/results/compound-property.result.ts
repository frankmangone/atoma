import { NotFoundError } from '@common/graphql/errors/not-found.error';
import { createUnionType } from '@nestjs/graphql';
import { CompoundProperty } from '@schemas/compound-property.schema';

export const CompoundPropertyResult = createUnionType({
  name: 'CompoundPropertyResult',
  types: () => [CompoundProperty, NotFoundError] as const,
});
