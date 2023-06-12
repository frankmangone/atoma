import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CompoundData } from '@schemas/compound-data.schema';
import { Model } from 'mongoose';

@Injectable()
export class CompoundDataRepository extends BaseRepository<CompoundData> {
  constructor(
    @InjectModel(CompoundData.name)
    private readonly _compoundData: Model<CompoundData>,
  ) {
    super(_compoundData);
  }
}
