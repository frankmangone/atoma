import { Document } from 'mongoose';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Compound } from '@schemas/compound.schema';
import { UserInputError } from '@nestjs/apollo';
import { CompoundsRepository } from '../compounds.repository';
import { CreateCompoundDataInput } from '../inputs/create-compount-data.input';

@Injectable()
export class CompoundPropertyDataService {
  private readonly _logger = new Logger(CompoundPropertyDataService.name);

  constructor(private readonly _compoundsRepository: CompoundsRepository) {}

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
    // TODO: Implement
  }
}
