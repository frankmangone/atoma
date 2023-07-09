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
    const result = await this._neo4jService.match({
      label: this._schema.name,
      fields: query,
      limit: 1,
    });

    return plainToInstance(this._schema, result[0]);
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
    const { first = 10, after: afterCursor } = paginationOptions;
    const fields = this._buildQueryFields(query);

    let where = '';
    let after;

    if (afterCursor) {
      // Decode cursor from base64
      after = atob(afterCursor);
      where = `WHERE id(node) > ${after}`;
    }

    const cypher = `
      MATCH 
        (node:${this._schema.name} {${fields}})
      ${where}
      RETURN node
      ORDER BY id(node) ASC LIMIT toInteger($first)
    `;

    // Query for 1 more than the requested records to know if there's an additional page
    const { records } = await this._neo4jService.read(cypher, {
      first: paginationOptions.first + 1,
      ...query,
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
