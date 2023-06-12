import { Injectable, Logger } from '@nestjs/common';
import { CompoundPropertiesRepository } from '../repositories/compound-properties.repository';
import { Compound } from '@schemas/compound.schema';
import { Property } from '@schemas/property.schema';

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
   * the given `compound` and `property` ids. If it exists, nothing happens. That's why
   * it's an idempotent action.
   *
   * @param {Compound} compound
   * @param {Property} property
   * @returns {Promise<void>}
   */
  async idempotentCreate(
    compoundId: Compound,
    propertyId: Property,
  ): Promise<void> {
    try {
      await this._compoundPropertiesRepository.create({
        compoundId,
        propertyId,
      });

      this._logger.log({
        message: 'Compound property created successfully.',
        data: { compoundId, propertyId },
      });
    } catch {
      // Do nothing. No need to log either as this may happen a lot.
    }
  }
}
