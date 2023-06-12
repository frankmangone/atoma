import { Document } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { CompoundDataRepository } from '../repositories/compound-data.repository';
import { CreateCompoundDataInput } from '../inputs/create-compount-data.input';

@Injectable()
export class CompoundDataService {
  private readonly _logger = new Logger(CompoundDataService.name);

  constructor(
    private readonly _compoundDataRepository: CompoundDataRepository,
  ) {}

  /**
   * create
   *
   * Creates a new compound property data record. This record will be associated with both
   * a compound and a property, hence the `CompoundPropertyData` naming.
   *
   * @param {CreateCompoundDataInput} payload
   * @returns {Promise<any>}
   */
  async create(payload: CreateCompoundDataInput): Promise<any> {
    this._logger.log({
      message: 'Creating compound property data record in database...',
      data: payload,
    });

    const compoundData = await this._compoundDataRepository.create(payload);

    this._logger.log({
      message: 'Compound property data successfully created.',
      data: payload,
    });

    console.log('hola');

    return compoundData;
  }
}
