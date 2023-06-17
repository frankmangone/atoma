import { Mutation, Resolver } from '@nestjs/graphql';
import { CompoundData } from '@schemas/compound-data.schema';
import { Payload } from '@common/decorators';
import { NotFoundError } from '@common/errors/not-found.error';
import { Logger } from '@nestjs/common';
import { CreateCompoundDataInput } from '../inputs/create-compount-data.input';
import { CompoundDataService } from '../services/compound-data.service';
import { CreateCompoundDataResult } from '../results/create-compound-data.result';

@Resolver(() => CompoundData)
export class CompoundDataResolver {
  private readonly _logger = new Logger(CompoundDataResolver.name);

  constructor(private readonly _compoundDataService: CompoundDataService) {}

  /**
   * createCompoundData
   *
   * Creates a compound property data record in the database.
   *
   * @param {CreateCompoundDataInput} payload
   * @returns {Promise<CreateCompoundDataResult>}
   */
  @Mutation(() => CreateCompoundDataResult)
  async createCompoundData(
    @Payload() payload: CreateCompoundDataInput,
  ): Promise<void | NotFoundError> {
    // Promise<CompoundData | NotFoundError> {
    this._logger.log({
      message: 'Resolver `createCompoundPropertyData` called',
      data: payload,
    });

    return this._compoundDataService.create(payload);
  }
}
