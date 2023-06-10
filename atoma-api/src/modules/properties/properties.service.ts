import { Injectable, Logger } from '@nestjs/common';
import { Property } from '@schemas/property.schema';
import { PropertiesRepository } from './properties.repository';
import { Paginated } from '@common/pagination/pagination.types';
import { FindPaginatedInput } from '@common/pagination/pagination.input';

@Injectable()
export class PropertiesService {
  private readonly _logger = new Logger(PropertiesService.name);

  constructor(private readonly _propertiesRepository: PropertiesRepository) {}

  /**
   * findPaginated
   *
   * Gets all property records.
   *
   * @returns {Promise<Paginated<Property>>}
   */
  async findPaginated(
    options?: FindPaginatedInput,
  ): Promise<Paginated<Property>> {
    this._logger.log('Querying DB for compound records...');

    return this._propertiesRepository.findPaginated(options);
  }
}
