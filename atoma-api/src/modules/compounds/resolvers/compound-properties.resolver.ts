import { Mutation, Resolver } from '@nestjs/graphql';
import { Compound } from '@schemas/compound.schema';
import { CompoundsService } from '../compounds.service';
import { CreateCompoundInput } from '../inputs/create-compound.input';
import { Payload } from '@common/decorators';
import { Logger } from '@nestjs/common';

@Resolver(() => Compound)
export class CompoundsResolver {
  private readonly _logger = new Logger(CompoundsResolver.name);

  constructor(private readonly _compoundsService: CompoundsService) {}

  /**
   * createComponentPropertyData
   *
   * Creates a compound in the database.
   *
   * @param {CreateCompoundInput} payload
   * @returns {Promise<Compound>}
   */
  @Mutation(() => Compound)
  async createCompound(
    @Payload() payload: CreateCompoundInput,
  ): Promise<Compound> {
    this._logger.log({
      message: 'Resolver `createCompound` called',
      data: payload,
    });

    return this._compoundsService.create(payload);
  }
}
