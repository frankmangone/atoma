import { NotFoundError } from '@common/graphql/errors/not-found.error';
import { createUnionType } from '@nestjs/graphql';
import { Compound } from '@schemas/compound.schema';

export const FindCompoundResult = createUnionType({
  name: 'FindCompoundResult',
  types: () => [Compound, NotFoundError] as const,
});
