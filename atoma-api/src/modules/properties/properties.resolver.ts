import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Property, PaginatedProperties } from '@schemas/property.schema';
import { PropertiesService } from './properties.service';
import { Logger } from '@nestjs/common';
import { FindPaginatedInput } from '@common/pagination/pagination.input';
import { CreatePropertyInput } from './inputs/create-property.input';
import { v4 as uuidv4 } from 'uuid';

@Resolver(() => Property)
export class PropertiesResolver {
  private readonly _logger = new Logger(PropertiesResolver.name);

  constructor(private readonly _propertiesService: PropertiesService) {}

  /**
   * findManyProperties
   *
   * Queries for multiple properties.
   *
   * @returns {Promise<PaginatedProperties>}
   */
  @Query(() => PaginatedProperties, { name: 'properties' })
  async findManyProperties(
    @Args('options') options: FindPaginatedInput,
  ): Promise<PaginatedProperties> {
    this._logger.log('Resolver `properties` called');

    const result = await this._propertiesService.find(options);

    this._logger.log({
      message: 'Found properties for query options.',
      data: { nextCursor: result.nextCursor, prevCursor: result.prevCursor },
    });

    return result;
  }

  /**
   * createProperty
   *
   * Creates a property.
   *
   * @param {CreatePropertyInput} payload
   * @returns {Promise<Property>}
   */
  @Mutation(() => Property, { name: 'createProperty' })
  async createProperty(
    @Args('payload') payload: CreatePropertyInput,
  ): Promise<Property> {
    this._logger.log('Resolver `createProperty` called');

    const recordData = {
      uuid: uuidv4(),
      ...payload,
    };

    const record = await this._propertiesService.create(recordData);

    return record;
  }
}
