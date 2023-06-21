import { Injectable, Logger } from '@nestjs/common';
import { CompoundPropertiesRepository } from '../repositories/compound-properties.repository';
import { CompoundProperty } from '@schemas/compound-property.schema';
import { Neo4jService } from '@modules/neo4j/neo4j.service';
import { v4 as uuidv4 } from 'uuid';
import { FindPaginatedInput } from '@common/graphql/pagination/pagination.input';
import { PaginatedType } from '@common/graphql/pagination/paginated.schema';
import { NotFoundError } from '@common/graphql/errors/not-found.error';
import { plainToInstance } from 'class-transformer';
import { Compound } from '@schemas/compound.schema';
import { Property } from '@schemas/property.schema';
import { CompoundPropertiesInput } from '../inputs/compound-properties.input';

interface FindOneParms {
  compoundUuid: string;
  propertyUuid: string;
}

@Injectable()
export class CompoundPropertiesService {
  private readonly _logger = new Logger(CompoundPropertiesService.name);

  constructor(
    private readonly _neo4jService: Neo4jService,
    private readonly _compoundPropertiesRepository: CompoundPropertiesRepository,
  ) {}

  /**
   * idempotentCreateCompoundProperty
   *
   * Tries creating a new `CommpoundProperty` node, connected to a `Compound`
   * node through a `BELONGS_TO` edge, and to a `Property` node through a
   * `IS_PROPERTY` edge.
   *
   * This could be done with constraints like:
   * CREATE CONSTRAINT ON (a:A)-[:CONNECTED_1]->(b:B), (a)-[:CONNECTED_2]->(c:C)
   * ASSERT (a)-[:CONNECTED_1]->(b) AND (a)-[:CONNECTED_2]->(c) IS UNIQUE
   *
   * But that's only available in the enterprise edition of Neo4j. So, we just perform
   * a query first!\, to check if the record already exists!
   *
   * @param {string} compoundUuid
   * @param {string} propertyUuid
   * @returns {Promise<string>}
   */
  async idempotentCreateCompoundProperty(
    compoundUuid: string,
    propertyUuid: string,
  ): Promise<string> {
    const existingCompoundProperty = await this._neo4jService.read(
      `
      MATCH 
        (:Compound {uuid: $compoundUuid})
        <-[:BELONGS_TO]-
        (compoundProperty:CompoundProperty)
        -[:IS_PROPERTY]->
        (:Property {uuid: $propertyUuid})
      RETURN compoundProperty`,
      { compoundUuid, propertyUuid },
    );

    if (existingCompoundProperty.records.length !== 0) {
      // Compound property already exists, stop execution.
      return existingCompoundProperty.records[0].get('compoundProperty')
        .properties.uuid;
    }

    const compoundPropertyUuid = uuidv4();

    await this._neo4jService.write(
      `
      MATCH
        (compound:Compound {uuid: $compoundUuid}),
        (property:Property {uuid: $propertyUuid})
      CREATE
        (compound)
        <-[:BELONGS_TO]-
        (compoundProperty:CompoundProperty {
          uuid: $compoundPropertyUuid,
          name: property.name,
          compound: compound.name
        })
        -[:IS_PROPERTY]->
        (property)
      `,
      { compoundUuid, propertyUuid, compoundPropertyUuid },
    );

    return compoundPropertyUuid;
  }

  /**
   * find
   *
   * Gets all compound property records, paginated.
   *
   * @param {CompoundPropertiesInput} options
   * @returns {Promise<PaginatedType<CompoundProperty>>}
   */
  async find(
    options: CompoundPropertiesInput,
  ): Promise<PaginatedType<CompoundProperty>> {
    this._logger.log('Querying DB for compound records...');

    // TODO: Build a query that actually uses the compound uuid here!
    const { compoundUuid, ...paginationOptions } = options;

    return this._compoundPropertiesRepository.findNodes({}, paginationOptions);
  }

  /**
   * findByCompoundAndPropertyUuid
   *
   * Finds a compound property by providing a both a compound and a property uuid.
   *
   * @param {FindOneParms} params
   * @returns {Promise<CompoundProperty | NotFoundError>}
   */
  async findByCompoundAndPropertyUuid(
    params: FindOneParms,
  ): Promise<CompoundProperty | NotFoundError> {
    const { records } = await this._neo4jService.read(
      `
      MATCH
        (compound:Compound {uuid: $compoundUuid})
        <-[:BELONGS_TO]-
        (compoundProperty:CompoundProperty)
        -[:IS_PROPERTY]->
        (property:Property {uuid: $propertyUuid})
      RETURN compoundProperty
      `,
      params,
    );

    const compoundProperty = records[0]?.get('compoundProperty')?.properties;

    if (!compoundProperty) {
      this._logger.error({
        message: 'No compound property found for specified constraints.',
        data: params,
      });

      return new NotFoundError(`Compound property not found.`);
    }

    this._logger.log({
      message: 'Compound found for specified constraints.',
      data: compoundProperty,
    });

    return plainToInstance(CompoundProperty, compoundProperty);
  }

  /**
   * findConnectedCompound
   *
   * Gets the compound connected to the specified compound property, through a
   * :BELONGS_TO edge.
   *
   * @param {string} compoundPropertyUuid
   * @returns {Promise<Compound>}
   */
  async findConnectedCompound(compoundPropertyUuid: string): Promise<Compound> {
    const { records } = await this._neo4jService.read(
      `
      MATCH (cp:CompoundProperty {uuid: $uuid})-[:BELONGS_TO]->(c:Compound)
      RETURN c
      `,
      { uuid: compoundPropertyUuid },
    );

    return plainToInstance(Compound, records[0].get('c').properties);
  }

  /**
   * findConnectedProperty
   *
   * Gets the property connected to the specified compound property, through a
   * :IS_PROPERTY edge.
   *
   * @param {string} compoundPropertyUuid
   * @returns {Promise<Property>}
   */
  async findConnectedProperty(compoundPropertyUuid: string): Promise<Property> {
    const { records } = await this._neo4jService.read(
      `
      MATCH (cp:CompoundProperty {uuid: $uuid})-[:IS_PROPERTY]->(p:Property)
      RETURN p
      `,
      { uuid: compoundPropertyUuid },
    );

    return plainToInstance(Property, records[0].get('p').properties);
  }
}
