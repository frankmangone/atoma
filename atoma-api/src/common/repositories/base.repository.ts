import { Neo4jService } from '@modules/database/neo.service';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Query } from './types';

export abstract class BaseRepository<T> {
  constructor(
    protected readonly _schema: ClassConstructor<T>,
    protected readonly _neo4jService: Neo4jService,
  ) {}

  /**
   * findOne
   *
   * Finds one record that matches the specified query.
   *
   * @param {Query<T>} query
   * @returns {Promise<T | undefined>}
   */
  async findOne(query: Query<T>): Promise<T | undefined> {
    // Build query fields
    let fields = '';
    Object.keys(query).forEach((key) => {
      fields += `${key}: $${key},`;
    });

    const queryResult = await this._neo4jService.read(
      `MATCH (r:${this._schema.name} {${fields.slice(0, -1)}}) RETURN r`,
      query,
    );
    const record = queryResult.records[0];

    if (!record) return undefined;

    const recordProperties = record.get('r').properties;

    return plainToInstance(this._schema, recordProperties) as T;
  }

  // /**
  //  * model
  //  *
  //  * Getter for the internal _model property
  //  */
  // model(): Model<T> {
  //   return this._model;
  // }

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

  // /**
  //  * create
  //  *
  //  * Creates a record for the specified model, provided that the
  //  * payload is valid.
  //  *
  //  * TODO: validation
  //  *
  //  * @param {Record<string, any>} payload
  //  * @returns {Promise<T>}
  //  */
  // async create(payload: Record<string, any>): Promise<Document<T>> {
  //   const record = await this._model.create(payload);
  //   return record as Document<T>;
  // }
}
