import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Compound } from '@schemas/compound.schema';
import { CreateCompoundInput } from './inputs/create-compound.input';

@Injectable()
export class CompoundsService {
  constructor(
    @InjectModel(Compound.name) private readonly _compound: Model<Compound>,
  ) {}

  /**
   * findAll
   *
   * Gets all compound records.
   * TODO: This should have pagination, and query options
   *
   * @returns {Promise<Compound[]>}
   */
  async findAll(): Promise<Compound[]> {
    return this._compound.find().exec();
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

    return this._compound.create(payload);
  }
}
