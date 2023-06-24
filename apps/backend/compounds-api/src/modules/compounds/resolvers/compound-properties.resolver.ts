import {
  Args,
  Float,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { NotFoundError } from '@common/graphql/errors/not-found.error';
import {
  CompoundProperty,
  PaginatedCompoundProperties,
} from '@schemas/compound-property.schema';
import { CompoundPropertiesService } from '../services/compound-properties.service';
import { CompoundPropertyResult } from '../results/compound-property.result';
import { CompoundPropertiesInput } from '../inputs/compound-properties.input';
import { CompoundPropertyInput } from '../inputs/compound-property.input';
import { Compound } from '@schemas/compound.schema';
import { Property } from '@schemas/property.schema';
import { ConditionInput } from '@schemas/condition.schema';
import { CompoundDataService } from '../services/compound-data.service';

@Resolver(() => CompoundProperty)
export class CompoundPropertiesResolver {
  private readonly _logger = new Logger(CompoundPropertiesResolver.name);

  constructor(
    private readonly _compoundDataService: CompoundDataService,
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

    this._logger.log({
      message: 'Found compounds for query options.',
      data: { pageInfo: result.pageInfo },
    });

    return result;
  }

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
    @Args('input', { type: () => CompoundPropertyInput })
    input: CompoundPropertyInput,
  ): Promise<CompoundProperty | NotFoundError> {
    this._logger.log({
      message: 'Resolver `compoundProperty` called',
      data: input,
    });

    const compoundProperty =
      await this._compoundPropertiesService.findByCompoundAndPropertyUuid(
        input,
      );

    if (!compoundProperty) {
      return new NotFoundError(`Compound property not found.`);
    }

    this._logger.log({
      message: 'Property found for specified compound.',
      data: compoundProperty,
    });

    return compoundProperty;
  }

  /**
   * compound
   *
   * Resolves the field `compound` for a given CompoundProperty
   *
   * @param {CompoundProperty} compoundProperty
   * @returns {Promise<Compound>}
   */
  @ResolveField()
  async compound(
    @Parent() compoundProperty: CompoundProperty,
  ): Promise<Compound> {
    return this._compoundPropertiesService.findConnectedCompound(
      compoundProperty.uuid,
    );
  }

  /**
   * property
   *
   * Resolves the field `property` for a given CompoundProperty
   *
   * @param {CompoundProperty} compoundProperty
   * @returns {Promise<Property>}
   */
  @ResolveField()
  async property(
    @Parent() compoundProperty: CompoundProperty,
  ): Promise<Property> {
    return this._compoundPropertiesService.findConnectedProperty(
      compoundProperty.uuid,
    );
  }

  /**
   * value
   *
   * Resolves the field `value` for a given CompoundProperty,
   * by performing an estimation using the data stored in the DB.
   *
   * @param {CompoundProperty} compoundProperty
   * @returns {Promise<Property>}
   */
  @ResolveField('value', () => Float)
  async value(
    @Parent() _compoundProperty: CompoundProperty,
    @Args('conditions', { type: () => ConditionInput })
    conditions: ConditionInput,
  ): Promise<number> {
    const { temperature } = conditions;

    const data = await this._compoundDataService.findDataForValueEstimation(
      _compoundProperty.uuid,
      temperature,
    );

    // Interpolate using inverse distance weighting interpolation to begin with.
    // https://sci-hub.se/https://doi.org/10.1007/BF01601941

    // FIXME: To produce a first result, use linear interpolation
    // Only 2 values are used here!
    const { temperature: t1, value: v1 } = data[0];
    const { temperature: t2, value: v2 } = data[1];

    return v1 + ((v2 - v1) * (temperature - t1)) / (t2 - t1);
  }
}
