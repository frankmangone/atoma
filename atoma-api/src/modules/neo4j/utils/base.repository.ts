import { Neo4jService } from '@modules/neo4j/neo4j.service';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Query } from './types';
import { Paginated } from '@common/graphql/pagination/pagination.types';

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
   * @returns {Promise<T | undefined>}
   */
  async findNodes(
    query: Query<T>,
    paginationOptions: any,
  ): Promise<Paginated<T>> {
    const { limit, after, before } = paginationOptions;
    const fields = this._buildQueryFields(query);

    let where = '';
    let orderBy = `LIMIT ${limit}`;
    const cursorParam: Record<string, unknown> = {};

    if (before) {
      where = 'WHERE id(type) < toInteger($before)';
      orderBy = `ORDER BY id(type) DESC LIMIT ${limit}`;
      cursorParam.before = before;
    }

    if (after) {
      where = 'WHERE id(r) > toInteger($after)';
      orderBy = `ORDER BY id(r) ASC ${orderBy}`;
      cursorParam.after = after;
    }

    const cypher = `
      MATCH 
        (r:${this._schema.name} {${fields}})
      ${where}
      RETURN r
      ${orderBy}
    `;

    const { records } = await this._neo4jService.read(cypher, {
      ...query,
      ...cursorParam,
    });

    const data = records.map((record) => {
      const recordProperties = record.get('r').properties;
      return plainToInstance(this._schema, recordProperties);
    });

    // After:
    let nextCursor = null;
    if (records.length === limit) {
      const lastCompound = records.at(-1);
      nextCursor = lastCompound.get('r').identity.toString();
    }

    // Before: TODO: improve
    const prevCursor = after;

    return { data, nextCursor, prevCursor };
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
