import { Injectable, Logger } from '@nestjs/common';
import { Property } from '@schemas/property.schema';
import { PropertiesRepository } from './properties.repository';
import { Paginated } from '@common/pagination/pagination.types';
import { FindPaginatedInput } from '@common/pagination/pagination.input';
import { NotFoundError } from '@common/errors/not-found.error';
import { Neo4jService } from '@modules/database/neo.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PropertiesService {
  private readonly _logger = new Logger(PropertiesService.name);

  constructor(
    private readonly _propertiesRepository: PropertiesRepository,
    private readonly _neo4jService: Neo4jService,
  ) {}

  /**
   * findPaginated
   *
   * Gets all property records.
   *
   * @param {FindPaginatedInput | undefined} options
   * @returns {Promise<Paginated<Property>>}
   */
  async findPaginated(
    options?: FindPaginatedInput,
  ): Promise<Paginated<Property>> {
    this._logger.log('Querying DB for compound records...');

    return this._propertiesRepository.findPaginated(options);
  }

  /**
   * findByConstraint
   *
   * Finds a property record by providing a partial set of expected key values.
   *
   * @param {Partial<Record<keyof Property, Property[keyof Property]>>} query
   * @returns {Promise<Property | NotFoundError>}
   */
  async findByConstraint(
    query: Partial<Record<keyof Property, Property[keyof Property]>>,
  ): Promise<Property | NotFoundError> {
    // Build query fields
    let fields = '';
    Object.keys(query).forEach((key) => {
      fields += `${key}: $${key},`;
    });

    const queryResult = await this._neo4jService.read(
      `MATCH (p:Property {${fields.slice(0, -1)}}) RETURN p`,
      query,
    );
    const record = queryResult.records[0];

    if (!record) {
      this._logger.error({
        message: 'No property found for specified constraints.',
        data: query,
      });

      return new NotFoundError(`Property not found.`);
    }

    const property = record.get('p').properties;

    this._logger.log({
      message: 'Property found for specified constraints.',
      data: property,
    });

    return plainToInstance(Property, property);
  }
}
