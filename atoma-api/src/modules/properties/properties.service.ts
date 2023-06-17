import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Property } from '@schemas/property.schema';
import { PropertiesRepository } from './properties.repository';
import { NotFoundError } from '@common/errors/not-found.error';
import { Query } from '@common/repositories';
import { v4 as uuidv4 } from 'uuid';

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
    const property = await this._propertiesRepository.findOneNode(query);

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

  /**
   * create
   *
   * Finds a property record by providing a partial set of expected key values.
   *
   * @param {Partial<Property>} query
   * @returns {Promise<Property>}
   */
  async create(payload: Partial<Property>): Promise<Property> {
    try {
      this._logger.log({
        message: 'Creating property record in database...',
        data: payload,
      });

      const result = await this._propertiesRepository.createNode({
        uuid: uuidv4(),
        ...payload,
      });

      this._logger.log({
        message: 'Property successfully created in database.',
        data: payload,
      });

      return result;
    } catch (error) {
      this._logger.error('Failed to create property record in database.');

      // TODO: Discriminate validation errors - unique name!!
      // throw new UserInputError(`Name "${payload.name}" already exists.`);

      // TODO: Better error type
      throw new InternalServerErrorException('Internal server error.');
    }
  }
}
