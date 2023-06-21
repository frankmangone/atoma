import { Neo4jService } from '@modules/neo4j/neo4j.service';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Query } from './types';
import {
  Paginated,
  PaginatedType,
} from '@common/graphql/pagination/paginated.schema';
import { FindPaginatedInput } from '@common/graphql/pagination/pagination.input';

export abstract class BaseRepository<T> {
  constructor(
    protected readonly _schema: ClassConstructor<T>,
    protected readonly _neo4jService: Neo4jService,
  ) {}

  /**
   * findOneNode
   *
   * Finds the first record that matches the specified query.
   *
   * @param {Query<T>} query
   * @returns {Promise<T | undefined>}
   */
  async findOneNode(query: Query<T>): Promise<T | undefined> {
    const fields = this._buildQueryFields(query);

    const cypher = `
      MATCH 
        (r:${this._schema.name} {${fields}})
      RETURN r
      LIMIT 1
    `;

    const queryResult = await this._neo4jService.read(cypher, query);
    const recordProperties = queryResult.records[0]?.get('r').properties;

    return plainToInstance(this._schema, recordProperties);
  }

  /**
   * findNodes
   *
   * Finds all the nodes that match the specified query.
   * TODO: Pagination
   *
   * @param {Query<T>} query
   * @returns {PaginatedType<T>}
   */
  async findNodes(
    query: Query<T>,
    paginationOptions: FindPaginatedInput,
  ): Promise<PaginatedType<T>> {
    const { first, after } = paginationOptions;
    const fields = this._buildQueryFields(query);

    let where = '';
    let orderBy = `LIMIT toInteger($first)`;

    if (after) {
      where = 'WHERE id(node) > toInteger($after)';
      orderBy = `ORDER BY id(node) ASC ${orderBy}`;
    }

    const cypher = `
      MATCH 
        (node:${this._schema.name} {${fields}})
      ${where}
      RETURN node
      ${orderBy}
    `;

    const { records } = await this._neo4jService.read(cypher, {
      ...query,
      ...paginationOptions,
    });

    const nodes = [];
    const edges = [];

    records?.forEach((record) => {
      const id = record.get('node').identity;
      const node = record.get('node').properties;

      nodes.push(node);
      edges.push({
        node,
        cursor: id.toString(),
      });
    });

    // Parse page info
    const totalCount = records.length;
    const hasNextPage = records.length === first;
    const endCursor = records.at(-1)?.get('node').identity.toString() ?? null;

    return plainToInstance(Paginated(this._schema), {
      nodes,
      edges,
      pageInfo: { totalCount, hasNextPage, endCursor },
    });
  }

  /**
   * createNode
   *
   * Creates a node for the specified model, provided that the
   * payload is valid.
   *
   * TODO: validation
   *
   * @param {Partial<T>} payload
   * @returns {Promise<T>}
   */
  async createNode(payload: Partial<T>): Promise<T> {
    const fields = this._buildQueryFields(payload);

    const cypher = `CREATE (r:${this._schema.name} {${fields}}) RETURN r`;
    const queryResult = await this._neo4jService.write(cypher, payload);
    const record = queryResult.records[0].get('r').properties;

    return plainToInstance(this._schema, record);
  }

  /**
   * _buildQueryFields
   *
   * Builds query fields for a given payload.
   *
   * @param {Query<T>} query
   * @returns {string}
   */
  private _buildQueryFields(query: Query<T>): string {
    let fields = '';

    Object.keys(query).forEach((key) => {
      fields += `${key}: $${key},`;
    });

    return fields.slice(0, -1);
  }
}
