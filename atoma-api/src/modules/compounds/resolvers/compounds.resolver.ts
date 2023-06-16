import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Document } from 'mongoose';
import { Compound, PaginatedCompounds } from '@schemas/compound.schema';
import { CompoundsService } from '../services/compounds.service';
import { CreateCompoundInput } from '../inputs/create-compound.input';
import { Payload } from '@common/decorators';
import { Logger } from '@nestjs/common';
import { FindPaginatedInput } from '@common/pagination/pagination.input';
import { FindCompoundResult } from '../results/find-compound.result';
import { NotFoundError } from '@common/errors/not-found.error';
import { Neo4jService } from '@modules/database/neo.service';
import { v4 as uuidv4 } from 'uuid';

@Resolver(() => Compound)
export class CompoundsResolver {
  private readonly _logger = new Logger(CompoundsResolver.name);

  constructor(
    private readonly _compoundsService: CompoundsService,
    private readonly _neo4jService: Neo4jService,
  ) {}

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
    this._logger.log('Resolver `findManyCompounds` called');

    // FIXME: Temporary Neo4j read
    const graphResult = await this._neo4jService.read(
      'MATCH (c:Compound) RETURN c',
      {},
    );
    const graphData = await graphResult.records.map(
      (record) => record.get('c').properties,
    );

    const result = await this._compoundsService.findPaginated(options);

    this._logger.log({
      message: 'Found compounds for query options.',
      data: { nextCursor: result.nextCursor, prevCursor: result.prevCursor },
    });

    return { ...result, data: graphData };
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

    this._logger.log({
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
  ): Promise<Document<Compound>> {
    this._logger.log({
      message: 'Resolver `createCompound` called',
      data: payload,
    });

    // FIXME: Temporary Neo4j creation
    await this._neo4jService.write(
      'CREATE (c:Compound {uuid: $uuid, name: $name, reducedFormula: $reducedFormula})',
      {
        uuid: uuidv4(),
        ...payload,
      },
    );

    return this._compoundsService.create(payload);
  }
}
