import { Injectable, Logger } from '@nestjs/common';
import { CompoundPropertiesRepository } from '../repositories/compound-properties.repository';
import { CompoundProperty } from '@schemas/compound-property.schema';
import { Neo4jService } from '@modules/database/neo.service';
import { v4 as uuidv4 } from 'uuid';
import { FindPaginatedInput } from '@common/pagination/pagination.input';
import { Paginated } from '@common/pagination/pagination.types';

// interface FindOneParms {
//   compoundUuid: string;
//   propertyUuid: string;
// }

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
   * find
   *
   * Gets all compound property records, paginated.
   *
   * @returns {Promise<Paginated<CompoundProperty>>}
   */
  async find(
    options?: FindPaginatedInput,
  ): Promise<Paginated<CompoundProperty>> {
    this._logger.log('Querying DB for compound records...');
    return this._compoundPropertiesRepository.findNodes({}, options);
  }
}
