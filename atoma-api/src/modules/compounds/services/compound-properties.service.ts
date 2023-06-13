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
  ): Promise<CompoundProperty> {
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

      return existingCompoundProperty as any as CompoundProperty; // TODO: make it so that they return the same type
    }

    const newCompoundProperty = await this._compoundPropertiesRepository.create(
      {
        compoundId,
        propertyId,
      },
    );

    this._logger.log({
      message: 'Compound property created successfully.',
      data: { compoundId, propertyId },
    });

    return newCompoundProperty;
  }
}
