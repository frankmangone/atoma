import { Injectable, Logger } from '@nestjs/common';
import { CompoundsService } from './compounds.service';
import { CompoundPropertiesService } from './compound-properties.service';
import { CreateCompoundDataInput } from '../inputs/create-compount-data.input';
import { Compound } from '@schemas/compound.schema';
import { NotFoundError } from '@common/graphql/errors/not-found.error';
import { PropertiesService } from '@modules/properties/properties.service';
import { Property } from '@schemas/property.schema';
import { CompoundDataRepository } from '../repositories/compound-data.repository';
import { CompoundData } from '@schemas/compound-data.schema';
import { Neo4jService } from '@modules/neo4j/neo4j.service';

@Injectable()
export class CompoundDataService {
  private readonly _logger = new Logger(CompoundDataService.name);

  constructor(
    private readonly _neo4jService: Neo4jService,
    private readonly _compoundDataRepository: CompoundDataRepository,
    private readonly _compoundsService: CompoundsService,
    private readonly _compoundPropertiesService: CompoundPropertiesService,
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

    if (compound instanceof NotFoundError) {
      return new NotFoundError(
        `Compound with uuid "${compoundUuid}" not found.`,
      );
    }

    if (property instanceof NotFoundError) {
      return new NotFoundError(
        `Property with uuid "${propertyUuid}" not found.`,
      );
    }

    this._logger.log({
      message: 'Creating compound property record in database...',
      data: payload,
    });

    const compoundPropertyUuid =
      await this._compoundPropertiesService.idempotentCreateCompoundProperty(
        compoundUuid,
        propertyUuid,
      );

    this._logger.log({
      message: 'Creating compound data record in database...',
      data: payload,
    });

    const compoundData = await this._compoundDataRepository.createConnected(
      compoundPropertyUuid,
      payload,
    );

    this._logger.log({
      message: 'Compound property data successfully created.',
      data: payload,
    });

    return compoundData;
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
  ): Promise<[Compound | NotFoundError, Property | NotFoundError]> {
    this._logger.log({
      message: 'Fetching compound and property records...',
      data: { compoundUuid, propertyUuid },
    });

    return Promise.all([
      this._compoundsService.findOne({ uuid: compoundUuid }),
      this._propertiesService.findOne({ uuid: propertyUuid }),
    ]);
  }

  /**
   * findDataForValueEstimation
   *
   *
   */
  async findDataForValueEstimation(
    compoundPropertyUuid: string,
    temperature: number,
  ): Promise<any> {
    // FIXME: Improve this with more conditions
    const { records } = await this._neo4jService.read(
      `
      MATCH
        (cp:CompoundProperty {uuid: $uuid})-[:HAS_DATA]->(cd:CompoundData)
        WHERE cd.temperature IS NOT NULL
        WITH cd
      ORDER BY (cd.temperature - $temperature)^2 ASC
      LIMIT 4
      RETURN cd
      `,
      { uuid: compoundPropertyUuid, temperature },
    );

    // Interpolate using inverse distance weighting interpolation to begin with.
    // https://sci-hub.se/https://doi.org/10.1007/BF01601941

    console.log(records);

    // TODO: Perform interpolation in another method
    return records[0].get('cd').properties.value;
  }
}
