import { NotFoundError } from '@common/errors/not-found.error';
import { createUnionType } from '@nestjs/graphql';
import { CompoundData } from '@schemas/compound-data.schema';

export const CreateCompoundDataResult = createUnionType({
  name: 'CreateCompoundDataResult',
  types: () => [CompoundData, NotFoundError] as const,
});
