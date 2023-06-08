import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Compound } from '@schemas/compound.schema';
import { CompoundsService } from './compounds.service';
import { CreateCompoundInput } from './inputs/create-compound.input';
import { Payload } from '@common/decorators';
import { Logger } from '@nestjs/common';

@Resolver(() => Compound)
export class CompoundsResolver {
  private readonly _logger = new Logger(CompoundsResolver.name);

  constructor(private readonly _compoundsService: CompoundsService) {}

  /**
   * findManyCompounds
   *
   * Queries for multiple compounds.
   *
   * @returns {Promise<Compound[]>}
   */
  @Query(() => [Compound])
  async findManyCompounds(): Promise<Compound[]> {
    this._logger.log({ message: 'Resolver `findManyCompounds` called' });

    return this._compoundsService.findAll();
  }

  @Query(() => Compound)
  async findOneCompound() {
    //@Args('id', { type: () => Int }) id: number) {
    return {
      name: 'water',
      reducedFormula: 'H2O',
      alternativeNames: [],
    };
    // this.authorsService.findOneById(id);
  }

  /**
   * createCompound
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
