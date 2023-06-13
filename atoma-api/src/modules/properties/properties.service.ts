import { Injectable, Logger } from '@nestjs/common';
import { Document } from 'mongoose';
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
   * findByUuid
   *
   * Gets a property record by its uuid.
   *
   * @param {string} uuid
   * @returns {Promise<Document<Property> | null>}
   */
  async findByUuid(uuid: string): Promise<Document<Property> | null> {
    this._logger.log(`Querying DB for property with uuid "${uuid}"...`);

    return this._propertiesRepository.findOne({ uuid });
  }
}
