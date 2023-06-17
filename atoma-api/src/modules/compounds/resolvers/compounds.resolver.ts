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
import { plainToInstance } from 'class-transformer';

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
    const { after, limit } = options;
    this._logger.log('Resolver `findManyCompounds` called');

    // FIXME: Temporary Neo4j read
    let query = 'MATCH (type:Compound)';
    if (options.after) {
      query += ' WHERE id(type) > toInteger($after)';
    }
    query += ` RETURN type ORDER BY id(type) ASC LIMIT ${limit}`;

    const { records } = await this._neo4jService.read(query, {
      after: after,
    });

    const data = await records.map((record) => record.get('type').properties);

    const prevCursor = after;

    let nextCursor = null;
    if (records.length === limit) {
      const lastCompound = records.at(-1);
      nextCursor = lastCompound.get('type').identity.toString();
    }

    // const result = await this._compoundsService.sfindPaginated(options);

    this._logger.log({
      message: 'Found compounds for query options.',
      data: { nextCursor, prevCursor },
    });

    return { data, nextCursor, prevCursor };
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

    return this._compoundsService.findByConstraint({ name });
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
      'CREATE (type:Compound {uuid: $uuid, name: $name, reducedFormula: $reducedFormula})',
      {
        uuid: uuidv4(),
        ...payload,
      },
    );

    return this._compoundsService.create(payload);
  }
}
