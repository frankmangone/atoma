import { Mutation, Resolver } from '@nestjs/graphql';
import { Compound } from '@schemas/compound.schema';
import { Payload } from '@common/decorators';
import { Logger } from '@nestjs/common';
import { CreateCompoundPropertyDataInput } from '../inputs/create-compount-property-data.input';
import { CompoundPropertyDataService } from '../services/compound-property-data.service';

@Resolver(() => Compound)
export class CompoundsResolver {
  private readonly _logger = new Logger(CompoundsResolver.name);

  constructor(
    private readonly _compoundPropertyDataService: CompoundPropertyDataService,
  ) {}

  /**
   * createComponentPropertyData
   *
   * Creates a compound property data record in the database.
   *
   * @param {CreateCompoundPropertyDataInput} payload
   * @returns {Promise<Compound>}
   */
  @Mutation(() => Compound)
  async createCompoundPropertyData(
    @Payload() payload: CreateCompoundPropertyDataInput,
  ): Promise<Compound> {
    this._logger.log({
      message: 'Resolver `createCompoundPropertyData` called',
      data: payload,
    });

    return this._compoundPropertyDataService.create(payload);
  }
}
