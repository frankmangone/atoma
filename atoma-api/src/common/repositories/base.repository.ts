import { Model } from 'mongoose';

export abstract class BaseRepository<T> {
  constructor(protected readonly _model: Model<T>) {}

  async findPaginated(): Promise<T[]> {
    return this._model.find({}, undefined, { limit: 3 }).exec();
  }

  async create(payload: Record<string, any>): Promise<T> {
    return this._model.create(payload);
  }
}
