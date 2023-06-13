import { Injectable, Logger } from '@nestjs/common';
import { Document } from 'mongoose';
import { CompoundPropertiesRepository } from '../repositories/compound-properties.repository';
import { Compound } from '@schemas/compound.schema';
import { Property } from '@schemas/property.schema';
import { CompoundProperty } from '@schemas/compound-property.schema';

@Injectable()
export class CompoundPropertiesService {
  private readonly _logger = new Logger(CompoundPropertiesService.name);

  constructor(
    private readonly _compoundPropertiesRepository: CompoundPropertiesRepository,
  ) {}

  /**
   * idempotentCreate
   *
   * Creates a new `compound-property` record if it doesn't already exist for
   * the given `compound` and `property` ids. If it exists, it returns the existing value.
   * That's why it's an idempotent action.
   *
   * @param {Compound} compound
   * @param {Property} property
   * @returns {Promise<CompoundProperty>}
   */
  async idempotentCreate(
    compoundId: Compound,
    propertyId: Property,
  ): Promise<Document<CompoundProperty>> {
    const existingCompoundProperty =
      await this._compoundPropertiesRepository.findOne({
        compoundId,
        propertyId,
      });

    if (existingCompoundProperty) {
      this._logger.log({
        message: 'Compound property already exists, returning value...',
        data: { compoundId, propertyId },
      });

      return existingCompoundProperty;
    }

    const newCompoundProperty = await this._compoundPropertiesRepository.create(
      {
        compound: compoundId,
        property: propertyId,
      },
    );

    this._logger.log({
      message: 'Compound property created successfully.',
      data: { compoundId, propertyId },
    });

    return newCompoundProperty;
  }

  /**
   * findByCompoundAndPropertyId
   *
   * Finds one `compound-property` by providing both a compound and a
   * property's ids.
   *
   * @param {string} compoundUuid
   * @param {string} propertyUuid
   * @returns {Promise<CompoundProperty>}
   */
  async findByCompoundAndPropertyUuid(
    compoundUuid: string,
    propertyUuid: string,
  ): Promise<Document<CompoundProperty>> {
    const result = await this._compoundPropertiesRepository
      .model()
      .aggregate([
        {
          $lookup: {
            from: 'compounds',
            localField: 'compound',
            foreignField: '_id',
            as: 'compound',
          },
        },
        {
          $lookup: {
            from: 'properties',
            localField: 'property',
            foreignField: '_id',
            as: 'property',
          },
        },
        {
          $addFields: {
            compound: { $arrayElemAt: ['$compound', 0] },
            property: { $arrayElemAt: ['$property', 0] },
          },
        },
        {
          $match: {
            'compound.uuid': compoundUuid,
            'property.uuid': propertyUuid,
          },
        },
      ])
      .exec();

    return result[0];
  }
}
