import { Injectable, Logger } from '@nestjs/common';
import { Document } from 'mongoose';
import { CompoundPropertiesRepository } from '../repositories/compound-properties.repository';
import { Compound } from '@schemas/compound.schema';
import { Property } from '@schemas/property.schema';
import { CompoundProperty } from '@schemas/compound-property.schema';
import { Paginated } from '@common/pagination/pagination.types';

interface FindOneParms {
  compoundUuid: string;
  propertyUuid: string;
}

interface FindPaginatedParms {
  compoundUuid?: string;
  propertyUuid?: string;
  limit?: number;
  before?: string;
  after?: string;
}

const COMPOUND_AGGREGATION = {
  $lookup: {
    from: 'compounds',
    localField: 'compound',
    foreignField: '_id',
    as: 'compound',
  },
  $addField: { $arrayElemAt: ['$compound', 0] },
};

const PROPERTY_AGGREGATION = {
  $lookup: {
    from: 'properties',
    localField: 'property',
    foreignField: '_id',
    as: 'property',
  },
  $addField: { $arrayElemAt: ['$property', 0] },
};

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
   * findOne
   *
   * Finds one `compound-property` record by providing the `compoundUuid`
   * and `propertyUuid`.
   *
   * @param {FindOneParms} params
   * @returns {Promise<Document<CompoundProperty>>}
   */
  async find(params: FindOneParms): Promise<Document<CompoundProperty>[]> {
    const { compoundUuid, propertyUuid } = params;

    const lookups = [];
    const $addFields: Record<string, unknown> = {};
    const $match: Record<string, unknown> = {};

    if (compoundUuid) {
      lookups.push({ $lookup: COMPOUND_AGGREGATION.$lookup });
      $addFields.compound = COMPOUND_AGGREGATION.$addField;
      $match['compound.uuid'] = compoundUuid;
    }

    if (propertyUuid) {
      lookups.push({ $lookup: PROPERTY_AGGREGATION.$lookup });
      $addFields.property = PROPERTY_AGGREGATION.$addField;
      $match['compound.uuid'] = compoundUuid;
    }

    const result = await this._compoundPropertiesRepository
      .model()
      .aggregate([...lookups, { $addFields }, { $match }])
      .exec();

    return result[0];
  }

  /**
   * findPaginated
   *
   * Finds `compound-property` records by providing the appropriate query parameters.
   * The available ones are:
   * - `compoundUuid`
   * - `propertyUuid`
   *
   * @param {FindParms} params
   * @returns {Promise<Document<CompoundProperty>[]>}
   */
  async findPaginated(
    params: FindPaginatedParms,
  ): Promise<Paginated<CompoundProperty>> {
    const { compoundUuid, propertyUuid, limit, before, after } = params;

    const lookups = [];
    const $addFields: Record<string, unknown> = {};
    const $match: Record<string, unknown> = {};

    if (compoundUuid) {
      lookups.push({ $lookup: COMPOUND_AGGREGATION.$lookup });
      $addFields.compound = COMPOUND_AGGREGATION.$addField;
      $match['compound.uuid'] = compoundUuid;
    }

    if (propertyUuid) {
      lookups.push({ $lookup: PROPERTY_AGGREGATION.$lookup });
      $addFields.property = PROPERTY_AGGREGATION.$addField;
      $match['property.uuid'] = propertyUuid;
    }

    const result =
      await this._compoundPropertiesRepository.findPaginatedWithQuery<CompoundProperty>(
        {
          aggregate: [...lookups, { $addFields }, { $match }],
          limit,
          before,
          after,
        },
      );

    return result;
  }
}
