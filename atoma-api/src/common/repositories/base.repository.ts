import { Neo4jService } from '@modules/database/neo.service';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Query } from './types';
import { Paginated } from '@common/pagination/pagination.types';

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
        (r:${this._schema.name} {${fields.slice(0, -1)}})
      RETURN r
      LIMIT 1
    `;

    const queryResult = await this._neo4jService.read(cypher, query);

    return queryResult.records[0]?.get('r').properties;
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

    // if (before) {
    //   where = 'WHERE id(type) < toInteger($before)';
    //   orderBy = `ORDER BY id(type) DESC LIMIT ${limit}`;
    //   cursorParam.before = before;
    // }

    if (after) {
      where = 'WHERE id(r) > toInteger($after)';
      orderBy = `ORDER BY id(r) ASC ${orderBy}`;
      cursorParam.after = after;
    }

    const cypher = `
      MATCH 
        (r:${this._schema.name} {${fields.slice(0, -1)}})
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

    // Before: TODO:
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
   * @param {T} payload
   * @returns {Promise<T>}
   */
  async create(payload: T): Promise<T> {
    const fields = this._buildQueryFields(payload);

    const queryResult = await this._neo4jService.read(
      `CREATE (r:${this._schema.name} {${fields.slice(0, -1)}}) RETURN r`,
      payload,
    );

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

  // /**
  //  * findPaginatedWithQuery
  //  *
  //  * Performs a query to get a `limit` amount of elements, paginated by cursor.
  //  * Takes an extra `aggregate` parameter that is passed as query arguments to
  //  * the `aggregate()` method from mongoose.
  //  *
  //  * @param {FindPaginatedWithQueryParams | undefined} options
  //  * @returns {Promise<Paginated<T>>}
  //  */
  // async findPaginatedWithQuery<T>(
  //   options?: FindPaginatedWithQueryParams,
  // ): Promise<Paginated<T>> {
  //   const { aggregate = [], limit = 3, before, after } = options ?? {};

  //   let query;

  //   if (before) query = { $match: { _id: { $lt: before } } };
  //   if (after) query = { $match: { _id: { $gt: after } } };

  //   const data = await this._model
  //     .aggregate([...aggregate, ...(query ?? []), { $limit: limit }])
  //     .exec();

  //   if (!data.length) {
  //     return { data, nextCursor: null, prevCursor: null };
  //   }

  //   const lastItem = data.at(-1)._id;
  //   const firstItem = data[0]._id;

  //   // If there is an item with id greater than lastItem, then there's a
  //   // next page. TODO: Revisit this
  //   const hasNextQuery = { _id: { $gt: lastItem } };
  //   const nextResults = await this._model
  //     .aggregate([...aggregate, { $match: hasNextQuery }, { $limit: 1 }])
  //     .exec();

  //   // If there is an item with id less than firstItem, then there's
  //   // a previous page. TODO: Revisit this
  //   const hasPrevQuery = { _id: { $lt: firstItem } };
  //   const prevResult = await this._model
  //     .aggregate([...aggregate, { $match: hasPrevQuery }, { $limit: 1 }])
  //     .exec();

  //   return {
  //     data,
  //     nextCursor: nextResults.length > 0 ? `${lastItem}` : null,
  //     prevCursor: prevResult.length > 0 ? `${firstItem}` : null,
  //   };
  // }

  // /**
  //  * findPaginated
  //  *
  //  * Find a list of paginated records for the specified model, using cursor pagination.
  //  *
  //  * @returns {Promise<Paginated<T>>}
  //  */
  // async findPaginated(options?: FindPaginatedInput): Promise<Paginated<T>> {
  //   const { limit = 3, before, after } = options ?? {};

  //   let query;

  //   if (before) query = { _id: { $lt: before } };
  //   if (after) query = { _id: { $gt: after } };

  //   const data = await this._model.find(query, undefined, { limit }).exec();

  //   if (!data.length) {
  //     return { data, nextCursor: null, prevCursor: null };
  //   }

  //   const lastItem = data.at(-1)._id;
  //   const firstItem = data[0]._id;

  //   // If there is an item with id greater than lastItem, then there's a
  //   // next page. TODO: Revisit this
  //   const hasNextQuery = { _id: { $gt: lastItem } };
  //   const hasNextResult = await this._model.findOne(hasNextQuery);

  //   // If there is an item with id less than firstItem, then there's
  //   // a previous page. TODO: Revisit this
  //   const hasPrevQuery = { _id: { $lt: firstItem } };
  //   const hasPrevResult = await this._model.findOne(hasPrevQuery);

  //   return {
  //     data,
  //     nextCursor: hasNextResult ? `${lastItem}` : null,
  //     prevCursor: hasPrevResult ? `${firstItem}` : null,
  //   };
  // }
}
