import { Args, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { NotFoundError } from '@common/errors/not-found.error';
import { CompoundProperty } from '@schemas/compound-property.schema';
import { CompoundPropertiesService } from '../services/compound-properties.service';
import { CompoundPropertyResult } from '../results/compound-property.result';

@Resolver(() => CompoundProperty)
export class CompoundPropertiesResolver {
  private readonly _logger = new Logger(CompoundPropertiesResolver.name);

  constructor(
    private readonly _compoundPropertiesService: CompoundPropertiesService,
  ) {}

  /**
   * findOneCompound
   *
   * Queries for a single compound, by name, for now.
   *
   * @param {string} compoundUuid
   * @param {string} propertyUuid
   * @returns {Promise<CompoundPropertyResult>}
   */
  @Query(() => CompoundPropertyResult, { name: 'compoundProperty' })
  async findOneCompoundProperty(
    @Args('compoundUuid', { type: () => String }) compoundUuid: string,
    @Args('propertyUuid', { type: () => String }) propertyUuid: string,
  ) {
    this._logger.log({
      message: 'Resolver `compoundProperty` called',
      data: { compoundUuid },
    });

    const compoundProperty =
      await this._compoundPropertiesService.findByCompoundAndPropertyUuid(
        compoundUuid,
        propertyUuid,
      );

    if (compoundProperty === null) {
      this._logger.error({
        message: 'No data for compound & property combination.',
        data: { compoundUuid, propertyUuid },
      });

      return new NotFoundError(`Compound property not found.`);
    }

    this._logger.log({
      message: 'Property found for specified compound.',
      data: compoundProperty,
    });

    return CompoundProperty.from(compoundProperty);
  }
}
