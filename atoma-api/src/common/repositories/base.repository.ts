import { FindPaginatedInput } from '@common/pagination/pagination.input';
import { Paginated } from '@common/pagination/pagination.types';
import { Document, Model } from 'mongoose';

export abstract class BaseRepository<T> {
  constructor(protected readonly _model: Model<T>) {}

  /**
   * findPaginated
   *
   * Find a list of paginated records for the specified model, using cursor pagination.
   *
   * @returns {Promise<Paginated<T>>}
   */
  async findPaginated(options?: FindPaginatedInput): Promise<Paginated<T>> {
    const { limit = 3, before, after } = options ?? {};

    let query;

    if (before) query = { _id: { $lt: before } };
    if (after) query = { _id: { $gt: after } };

    const data = await this._model.find(query, undefined, { limit }).exec();

    if (!data.length) {
      return { data, nextCursor: null, prevCursor: null };
    }

    const lastItem = data.at(-1)._id;
    const firstItem = data[0]._id;

    // If there is an item with id greater than lastItem, then there's a
    // next page. TODO: Revisit this
    const hasNextQuery = { _id: { $gt: lastItem } };
    const hasNextResult = await this._model.findOne(hasNextQuery);

    // If there is an item with id less than firstItem, then there's
    // a previous page. TODO: Revisit this
    const hasPrevQuery = { _id: { $lt: firstItem } };
    const hasPrevResult = await this._model.findOne(hasPrevQuery);

    return {
      data,
      nextCursor: hasNextResult ? `${lastItem}` : null,
      prevCursor: hasPrevResult ? `${firstItem}` : null,
    };
  }

  /**
   * findOne
   *
   * Finds one record that matches the specified query.
   *
   * @returns {Promise<Document<T> | null>}
   */
  async findOne(query: Record<string, unknown>): Promise<Document<T> | null> {
    return this._model.findOne(query);
  }

  /**
   * create
   *
   * Creates a record for the specified model, provided that the
   * payload is valid.
   *
   * TODO: validation
   *
   * @param {Record<string, any>} payload
   * @returns {Promise<T>}
   */
  async create(payload: Record<string, any>): Promise<Document<T>> {
    const record = await this._model.create(payload);
    return record as Document<T>;
  }
}
