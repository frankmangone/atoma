import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Compound } from '@schemas/compound.schema';

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
}
