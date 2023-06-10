import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Property } from '@schemas/property.schema';
import { Model } from 'mongoose';

@Injectable()
export class PropertiesRepository extends BaseRepository<Property> {
  constructor(
    @InjectModel(Property.name) private readonly _property: Model<Property>,
  ) {
    super(_property);
  }
}
