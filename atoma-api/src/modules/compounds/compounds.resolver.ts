import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Compound, PaginatedCompounds } from '@schemas/compound.schema';
import { CompoundsService } from './compounds.service';
import { CreateCompoundInput } from './inputs/create-compound.input';
import { Payload } from '@common/decorators';
import { Logger } from '@nestjs/common';
import { FindPaginatedInput } from '@common/pagination/pagination.input';
import { FindCompoundResult } from './results/find-compound.result';
import { NotFoundError } from '@common/errors/not-found.error';

@Resolver(() => Compound)
export class CompoundsResolver {
  private readonly _logger = new Logger(CompoundsResolver.name);

  constructor(private readonly _compoundsService: CompoundsService) {}

  /**
   * findManyCompounds
   *
   * Queries for multiple compounds.
   *
   * @returns {Promise<PaginatedCompounds>}
   */
  @Query(() => PaginatedCompounds)
  async findManyCompounds(
    @Args('options') options: FindPaginatedInput,
  ): Promise<PaginatedCompounds> {
    this._logger.log('Resolver `findManyCompounds` called');

    const result = await this._compoundsService.findPaginated(options);

    this._logger.log({
      message: 'Found compounds for query options.',
      data: { nextCursor: result.nextCursor, prevCursor: result.prevCursor },
    });

    return result;
  }

  /**
   * findOneCompound
   *
   * Queries for a single compound, by name, for now.
   *
   * @returns {Promise<FindCompoundResult>}
   */
  @Query(() => FindCompoundResult)
  async findOneCompound(@Args('name', { type: () => String }) name: string) {
    this._logger.log({
      message: 'Resolver `findOneCompound` called',
      data: { name },
    });

    const compound = await this._compoundsService.findOne({ name });

    if (compound === null) {
      this._logger.error({
        message: 'No compound found for specified name.',
        data: { name },
      });

      return new NotFoundError(`Compound "${name}" not found.`);
    }

    this._logger.error({
      message: 'Compound found for specified name.',
      data: compound,
    });

    return Compound.from(compound);
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
