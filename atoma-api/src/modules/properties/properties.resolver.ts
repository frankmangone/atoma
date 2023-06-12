import { Args, Query, Resolver } from '@nestjs/graphql';
import { Property, PaginatedProperties } from '@schemas/property.schema';
import { PropertiesService } from './properties.service';
import { Logger } from '@nestjs/common';
import { FindPaginatedInput } from '@common/pagination/pagination.input';

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
  @Query(() => PaginatedProperties)
  async findManyProperties(
    @Args('options') options: FindPaginatedInput,
  ): Promise<PaginatedProperties> {
    this._logger.log('Resolver `findManyProperties` called');

    const result = await this._propertiesService.findPaginated(options);

    this._logger.log({
      message: 'Found properties for query options.',
      data: { nextCursor: result.nextCursor, prevCursor: result.prevCursor },
    });

    return result;
  }
}
