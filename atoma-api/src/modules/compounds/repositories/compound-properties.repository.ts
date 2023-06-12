import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CompoundProperty } from '@schemas/compound-property.schema';
import { Model } from 'mongoose';

@Injectable()
export class CompoundPropertiesRepository extends BaseRepository<CompoundProperty> {
  constructor(
    @InjectModel(CompoundProperty.name)
    private readonly _compoundProperty: Model<CompoundProperty>,
  ) {
    super(_compoundProperty);
  }
}
