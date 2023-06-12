import { Document } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { CompoundsService } from './compounds.service';
import { CompoundDataRepository } from '../repositories/compound-data.repository';
import { CreateCompoundDataInput } from '../inputs/create-compount-data.input';
import { Compound } from '@schemas/compound.schema';
import { NotFoundError } from '@common/errors/not-found.error';
import { CompoundData } from '@schemas/compound-data.schema';
import { PropertiesService } from '@modules/properties/properties.service';
import { Property } from '@schemas/property.schema';

@Injectable()
export class CompoundDataService {
  private readonly _logger = new Logger(CompoundDataService.name);

  constructor(
    private readonly _compoundDataRepository: CompoundDataRepository,
    private readonly _compoundsService: CompoundsService,
    private readonly _propertiesService: PropertiesService,
  ) {}

  /**
   * create
   *
   * Creates a new compound property data record. This record will be associated with both
   * a compound and a property, hence the `CompoundPropertyData` naming.
   * Queries for the provided `compound`
   * and `property` for existence; fails if either one does not exist.
   * Also, if the corresponding `compound-property` doesn't exist, it creates the
   * corresponding record.
   *
   * @param {CreateCompoundDataInput} payload
   * @returns {Promise<CompoundData | NotFoundError>}
   */
  async create(
    payload: CreateCompoundDataInput,
  ): Promise<CompoundData | NotFoundError> {
    const { compoundUuid, propertyUuid } = payload;
    const [compound, property] = await this._findCompoundAndProperty(
      compoundUuid,
      propertyUuid,
    );

    // TODO: Use transactions? Is it even worth it?

    if (compound === null) {
      return new NotFoundError(
        `Compound with uuid "${compoundUuid}" not found.`,
      );
    }

    if (property === null) {
      return new NotFoundError(
        `Property with uuid "${propertyUuid}" not found.`,
      );
    }

    this._logger.log({
      message: 'Creating compound property data record in database...',
      data: payload,
    });

    const compoundData = await this._compoundDataRepository.create({
      ...payload,
      compound: compound._id,
      property: property._id,
    });

    this._logger.log({
      message: 'Compound property data successfully created.',
      data: payload,
    });

    return CompoundData.from(compoundData as any); // How can I avoid this `any`?
  }

  /**
   * _findCompoundAndProperty
   *
   * Fetches both a property and a compound from the database. This will be used at
   * the time of `compound-property-data` record creation.
   *
   * @param {string} compoundUuid
   * @param {string} propertyUuid
   * @returns {Promise<[Document<Compound> | null, Document<Property> | null]>}
   */
  private async _findCompoundAndProperty(
    compoundUuid: string,
    propertyUuid: string,
  ): Promise<[Document<Compound> | null, Document<Property> | null]> {
    this._logger.log({
      message: 'Fetching compound and property records...',
      data: { compoundUuid, propertyUuid },
    });

    return Promise.all([
      this._compoundsService.findByUuid(compoundUuid),
      this._propertiesService.findByUuid(propertyUuid),
    ]);
  }
}
