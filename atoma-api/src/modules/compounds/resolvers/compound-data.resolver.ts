import { Mutation, Resolver } from '@nestjs/graphql';
import { CompoundData } from '@schemas/compound-data.schema';
import { Payload } from '@common/decorators';
import { Logger } from '@nestjs/common';
import { CreateCompoundDataInput } from '../inputs/create-compount-data.input';
import { CompoundDataService } from '../services/compound-data.service';

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
   * @returns {Promise<Compound>}
   */
  @Mutation(() => CompoundData)
  async createCompoundData(
    @Payload() payload: CreateCompoundDataInput,
  ): Promise<any> {
    this._logger.log({
      message: 'Resolver `createCompoundPropertyData` called',
      data: payload,
    });

    return this._compoundDataService.create(payload);
  }
}