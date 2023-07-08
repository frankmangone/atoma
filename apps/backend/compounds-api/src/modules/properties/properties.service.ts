import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PaginatedProperties, Property } from '@schemas/property.schema';
import { PropertiesRepository } from './properties.repository';
import { NotFoundError } from '@common/graphql/errors/not-found.error';
import { Query } from '@modules/neo4j/utils';
import { v4 as uuidv4 } from 'uuid';
import { FindManyPropertiesInput } from './inputs/find-many-properties.input';
import { Neo4jService } from '@modules/neo4j/neo4j.service';

@Injectable()
export class PropertiesService {
  private readonly _logger = new Logger(PropertiesService.name);

  constructor(
    private readonly _propertiesRepository: PropertiesRepository,
    private readonly _neo4jService: Neo4jService,
  ) {}

  /**
   * find
   *
   * Gets all property records, paginated.
   *
   * @param {FindManyPropertiesInput} options
   * @returns {Promise<PaginatedProperties>}
   */
  async find(options?: FindManyPropertiesInput): Promise<PaginatedProperties> {
    this._logger.log('Querying DB for compound records...');

    const { name } = options;

    if (name) {
      // Use full text search for this query.
      return this._findManyByName(options);
    }

    return this._propertiesRepository.findNodes({}, options);
  }

  /**
   * findOne
   *
   * Finds a property record by providing a partial set of expected key values.
   *
   * @param {Query<Property>} query
   * @returns {Promise<Property | NotFoundError>}
   */
  async findOne(query: Query<Property>): Promise<Property | NotFoundError> {
    const property = await this._propertiesRepository.findOneNode(query);

    if (!property) {
      this._logger.error({
        message: 'No property found for specified constraints.',
        data: query,
      });

      return new NotFoundError(`Property not found.`);
    }

    this._logger.log({
      message: 'Property found for specified constraints.',
      data: property,
    });

    return property;
  }

  /**
   * create
   *
   * Finds a property record by providing a partial set of expected key values.
   *
   * @param {Partial<Property>} query
   * @returns {Promise<Property>}
   */
  async create(payload: Partial<Property>): Promise<Property> {
    try {
      this._logger.log({
        message: 'Creating property record in database...',
        data: payload,
      });

      const result = await this._propertiesRepository.createNode({
        uuid: uuidv4(),
        ...payload,
      });

      this._logger.log({
        message: 'Property successfully created in database.',
        data: payload,
      });

      return result;
    } catch (error) {
      this._logger.error('Failed to create property record in database.');

      // TODO: Discriminate validation errors - unique name!!
      // throw new UserInputError(`Name "${payload.name}" already exists.`);

      // TODO: Better error type
      throw new InternalServerErrorException('Internal server error.');
    }
  }

  /**
   * _findManyByName
   *
   * Builds a fulltext search query to find compounds with the requested name.
   *
   * @param {FindManyPropertiesInput} options
   * @returns {Promise<PaginatedProperties>}
   */
  private async _findManyByName(
    options: FindManyPropertiesInput,
  ): Promise<PaginatedProperties> {
    const { first = 5, name, after: afterCursor } = options;

    let where = '';
    let after;

    if (afterCursor) {
      // Decode cursor from base64
      after = atob(afterCursor);
      where = `WHERE id(node) > ${after}`;
    }

    // Use full text search for this query.
    // Notice the ~3 after the `name` value. This is what indicates the
    // query to use fuzzy search. The number indicates the allowed edit distance
    // for results. Lower values yield less results but with better scores.
    //
    // We also want to order by relevance (score), which is not compatible with the DISTINCT clause;
    // hence the subquery.
    const cypher = `
      CALL db.index.fulltext.queryNodes("propertyName", "${name}~3") YIELD node, score
      ${where}
      WITH DISTINCT node
      ORDER BY score DESC
      RETURN node
      LIMIT toInteger($first)
    `;

    const { records } = await this._neo4jService.read(cypher, {
      first: first + 1,
      after,
    });

    // Parse page info
    const hasNextPage = records.length > first;

    // If there's a next page, slice the last element of the records array, since it was
    // not really requested with the `first` parameter.
    const recordsToReturn = hasNextPage ? records?.slice(0, -1) : records;

    const totalCount = recordsToReturn.length;
    const lastRecordId = recordsToReturn
      .at(-1)
      ?.get('node')
      .identity.toString();
    const endCursor = lastRecordId ? btoa(lastRecordId) : null;

    // Finally, map nodes and edges
    const nodes = [];
    const edges = [];

    recordsToReturn.forEach((record) => {
      const id = record.get('node').identity;
      const node = record.get('node').properties;

      nodes.push(node);
      edges.push({
        node,
        cursor: btoa(id),
      });
    });

    return {
      edges,
      nodes,
      pageInfo: {
        endCursor,
        hasNextPage,
        totalCount,
      },
    };
  }
}
