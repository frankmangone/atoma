import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Compound, PaginatedCompounds } from '@schemas/compound.schema';
import { CreateCompoundInput } from '../inputs/create-compound.input';
import { CompoundsRepository } from '../repositories/compounds.repository';
import { NotFoundError } from '@common/graphql/errors/not-found.error';
import { v4 as uuidv4 } from 'uuid';
import { PaginatedType } from '@common/graphql/pagination/paginated.schema';
import { FindManyCompoundsInput } from '../inputs/find-many-compounds.input';
import { Neo4jService } from '@modules/neo4j/neo4j.service';

@Injectable()
export class CompoundsService {
  private readonly _logger = new Logger(CompoundsService.name);

  constructor(
    private readonly _compoundsRepository: CompoundsRepository,
    private readonly _neo4jService: Neo4jService,
  ) {}

  /**
   * find
   *
   * Gets all compound records, paginated.
   *
   * @param {FindManyCompoundsInput} options
   * @returns {Promise<PaginatedType<Compound>>}
   */
  async find(
    options?: FindManyCompoundsInput,
  ): Promise<PaginatedType<Compound>> {
    this._logger.log('Querying DB for compound records...');

    const { name } = options;

    if (name) {
      // Use full text search for this query.
      return this._findManyByName(name);
    }

    return this._compoundsRepository.findNodes({}, options);
  }

  /**
   * findOne
   *
   * Finds a compound record by providing a partial set of expected key values.
   *
   * @param {Partial<Record<keyof Compound, Compound[keyof Compound]>>} query
   * @returns {Promise<Compound | NotFoundError>}
   */
  async findOne(
    query: Partial<Record<keyof Compound, Compound[keyof Compound]>>,
  ): Promise<Compound | NotFoundError> {
    const compound = await this._compoundsRepository.findOneNode(query);

    if (!compound) {
      this._logger.error({
        message: 'No compound found for specified constraints.',
        data: query,
      });

      return new NotFoundError(`Compound not found.`);
    }

    this._logger.log({
      message: 'Compound found for specified constraints.',
      data: compound,
    });

    return compound;
  }

  /**
   * create
   *
   * Creates a new compound record from the provided input.
   *
   * @returns {Promise<Compound>}
   */
  async create(payload: CreateCompoundInput): Promise<Compound> {
    // Transform name to lowercase
    // FIXME: Can we use `class-transformer` for this?
    payload.name = payload.name.toLowerCase();

    try {
      this._logger.log({
        message: 'Creating compound record in database...',
        data: payload,
      });

      const result = await this._compoundsRepository.createNode({
        uuid: uuidv4(),
        ...payload,
      });

      this._logger.log({
        message: 'Compound successfully created in database.',
        data: payload,
      });

      return result;
    } catch (error) {
      this._logger.error('Failed to create record in database.');

      // TODO: Discriminate validation errors - unique name!!
      // throw new UserInputError(`Name "${payload.name}" already exists.`);

      throw new InternalServerErrorException('Internal server error.');
    }
  }

  /**
   * _findManyByName
   *
   * Builds a fulltext search query to find compounds with the requested name.
   */
  private async _findManyByName(name: string): Promise<PaginatedCompounds> {
    // Use full text search for this query.
    const cypher = `
    CALL db.index.fulltext.queryNodes("compoundName", "${name}") YIELD node, score
    RETURN node
  `;

    const { records } = await this._neo4jService.read(cypher, {});

    // TODO: Add actual pagination!
    return {
      edges: [],
      nodes: records.map((record) => record.get('node').properties),
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
        totalCount: records.length,
      },
    };
  }
}
