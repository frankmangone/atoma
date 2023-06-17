import { Injectable, Logger } from '@nestjs/common';
import { Property } from '@schemas/property.schema';
import { PropertiesRepository } from './properties.repository';
import { NotFoundError } from '@common/errors/not-found.error';
import { Query } from '@common/repositories';

@Injectable()
export class PropertiesService {
  private readonly _logger = new Logger(PropertiesService.name);

  constructor(private readonly _propertiesRepository: PropertiesRepository) {}

  // /**
  //  * findPaginated
  //  *
  //  * Gets all property records.
  //  *
  //  * @param {FindPaginatedInput | undefined} options
  //  * @returns {Promise<Paginated<Property>>}
  //  */
  // async findPaginated(
  //   options?: FindPaginatedInput,
  // ): Promise<Paginated<Property>> {
  //   this._logger.log('Querying DB for compound records...');

  //   return this._propertiesRepository.findPaginated(options);
  // }

  /**
   * findOne
   *
   * Finds a property record by providing a partial set of expected key values.
   *
   * @param {Query<Property>} query
   * @returns {Promise<Property | NotFoundError>}
   */
  async findOne(query: Query<Property>): Promise<Property | NotFoundError> {
    const property = this._propertiesRepository.findOne(query);

    if (!property) {
      this._logger.error({
        message: 'No property found for specified constraints.',
        data: query,
      });

      return new NotFoundError(`Property not found.`);
    }

    this._logger.log({
      message: 'Property found for specified constraints.',
      data: property,
    });

    return property;
  }
}
