import { Args, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { NotFoundError } from '@common/errors/not-found.error';
import {
  CompoundProperty,
  PaginatedCompoundProperties,
} from '@schemas/compound-property.schema';
import { CompoundPropertiesService } from '../services/compound-properties.service';
import { CompoundPropertyResult } from '../results/compound-property.result';
import { CompoundPropertiesInput } from '../inputs/compound-properties.input';
import { CompoundPropertyInput } from '../inputs/compound-property.input';

@Resolver(() => CompoundProperty)
export class CompoundPropertiesResolver {
  private readonly _logger = new Logger(CompoundPropertiesResolver.name);

  constructor(
    private readonly _compoundPropertiesService: CompoundPropertiesService,
  ) {}

  /**
   * findManyCompoundProperties
   *
   * Queries for a single compound, by name, for now.
   *
   * @param {CompoundPropertiesInput} input
   * @returns {Promise<PaginatedCompoundProperties>}
   */
  @Query(() => PaginatedCompoundProperties, { name: 'compoundProperties' })
  async findManyCompoundProperties(
    @Args('input', { type: () => CompoundPropertiesInput })
    input: CompoundPropertiesInput,
  ): Promise<PaginatedCompoundProperties> {
    this._logger.log({
      message: 'Resolver `compoundProperties` called',
      data: input,
    });

    const result = await this._compoundPropertiesService.find(input);

    console.log(result);

    this._logger.log({
      message: 'Found compounds for query options.',
      data: { nextCursor: result.nextCursor, prevCursor: result.prevCursor },
    });

    return result;
  }

  // /**
  //  * findOneCompound
  //  *
  //  * Queries for a single compound, by name, for now.
  //  *
  //  * @param {string} compoundUuid
  //  * @param {string} propertyUuid
  //  * @returns {Promise<CompoundPropertyResult>}
  //  */
  // @Query(() => CompoundPropertyResult, { name: 'compoundProperty' })
  // async findOneCompoundProperty(
  //   @Args('input', { type: () => CompoundPropertyInput })
  //   input: CompoundPropertyInput,
  // ): Promise<CompoundProperty | NotFoundError> {
  //   this._logger.log({
  //     message: 'Resolver `compoundProperty` called',
  //     data: input,
  //   });

  //   const compoundProperty = await this._compoundPropertiesService.findOne(
  //     input,
  //   );

  //   if (!compoundProperty) {
  //     this._logger.error({
  //       message: 'No data for compound & property combination.',
  //       data: input,
  //     });

  //     return new NotFoundError(`Compound property not found.`);
  //   }

  //   this._logger.log({
  //     message: 'Property found for specified compound.',
  //     data: compoundProperty,
  //   });

  //   return CompoundProperty.from(compoundProperty);
  // }
}
