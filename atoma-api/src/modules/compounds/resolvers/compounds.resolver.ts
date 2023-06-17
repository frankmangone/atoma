import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Compound, PaginatedCompounds } from '@schemas/compound.schema';
import { CompoundsService } from '../services/compounds.service';
import { CreateCompoundInput } from '../inputs/create-compound.input';
import { Payload } from '@common/decorators';
import { Logger } from '@nestjs/common';
import { FindPaginatedInput } from '@common/graphql/pagination/pagination.input';
import { FindCompoundResult } from '../results/find-compound.result';

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
  @Query(() => PaginatedCompounds, { name: 'compounds' })
  async findManyCompounds(
    @Args('options') options: FindPaginatedInput,
  ): Promise<PaginatedCompounds> {
    this._logger.log({
      message: 'Resolver `compounds` called',
      data: options,
    });

    return this._compoundsService.find(options);
  }

  /**
   * findOneCompound
   *
   * Queries for a single compound, by name, for now.
   *
   * @param {string} name
   * @returns {Promise<FindCompoundResult>}
   */
  @Query(() => FindCompoundResult, { name: 'compound' })
  async findOneCompound(@Args('name', { type: () => String }) name: string) {
    this._logger.log({
      message: 'Resolver `compound` called',
      data: { name },
    });

    return this._compoundsService.findOne({ name });
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
