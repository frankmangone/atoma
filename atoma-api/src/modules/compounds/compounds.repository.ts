import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Compound } from '@schemas/compound.schema';
import { Model } from 'mongoose';

@Injectable()
export class CompoundsRepository extends BaseRepository<Compound> {
  constructor(
    @InjectModel(Compound.name) private readonly _compound: Model<Compound>,
  ) {
    super(_compound);
  }
}
