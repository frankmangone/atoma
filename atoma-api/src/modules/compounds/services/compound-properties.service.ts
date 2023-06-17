import { Injectable, Logger } from '@nestjs/common';
import { Document } from 'mongoose';
import { CompoundPropertiesRepository } from '../repositories/compound-properties.repository';
import { Compound } from '@schemas/compound.schema';
import { Property } from '@schemas/property.schema';
import { CompoundProperty } from '@schemas/compound-property.schema';
import { Paginated } from '@common/pagination/pagination.types';
import { Neo4jService } from '@modules/database/neo.service';
import { v4 as uuidv4 } from 'uuid';

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
    private readonly _neo4jService: Neo4jService,
    private readonly _compoundPropertiesRepository: CompoundPropertiesRepository,
  ) {}

  /**
   * idempotentCreateConnection
   *
   * Creates a new HAS_PROPERTY_DATA connection between the specified compound
   * and property if it doesn't already exist.
   * Returns the connection's uuid
   *
   * @param {string} compoundUuid
   * @param {string} propertyUuid
   * @returns {Promise<string>}
   */
  async idempotentCreateConnection(
    compoundUuid: string,
    propertyUuid: string,
  ): Promise<string> {
    const existingConnection = await this._neo4jService.read(
      `MATCH
        (:Compound {uuid: $compoundUuid})
        -[c:HAS_PROPERTY_DATA]->
        (:Property {uuid: $propertyUuid})
      RETURN c`,
      { compoundUuid, propertyUuid },
    );

    if (existingConnection.records.length !== 0) {
      return existingConnection.records[0].get('c').properties.uuid;
    }

    const compoundPropertyUuid = uuidv4();

    await this._neo4jService.write(
      `
      MATCH
        (c:Compound {uuid: $compoundUuid}),
        (p:Property {uuid: $propertyUuid})
      CREATE (c)-[:HAS_PROPERTY_DATA {uuid: $compoundPropertyUuid}]->(p)
      `,
      { compoundUuid, propertyUuid, compoundPropertyUuid },
    );

    await this._neo4jService.write('CREATE (:CompoundProperty {uuid: $uuid})', {
      uuid: compoundPropertyUuid,
    });

    return compoundPropertyUuid;
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
  async findOne(params: FindOneParms): Promise<Document<CompoundProperty>> {
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
      $match['property.uuid'] = propertyUuid;
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

    const lookups = [
      { $lookup: COMPOUND_AGGREGATION.$lookup },
      { $lookup: PROPERTY_AGGREGATION.$lookup },
    ];
    const $addFields: Record<string, unknown> = {
      compound: COMPOUND_AGGREGATION.$addField,
      property: PROPERTY_AGGREGATION.$addField,
    };
    const $match: Record<string, unknown> = {};

    if (compoundUuid) $match['compound.uuid'] = compoundUuid;
    if (propertyUuid) $match['property.uuid'] = propertyUuid;

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
