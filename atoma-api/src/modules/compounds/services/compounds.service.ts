import { Document } from 'mongoose';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Compound } from '@schemas/compound.schema';
import { CreateCompoundInput } from '../inputs/create-compound.input';
import { UserInputError } from '@nestjs/apollo';
import { CompoundsRepository } from '../repositories/compounds.repository';
import { Paginated } from '@common/pagination/pagination.types';
import { FindPaginatedInput } from '@common/pagination/pagination.input';
import { Neo4jService } from '@modules/database/neo.service';
import { NotFoundError } from '@common/errors/not-found.error';
import { v4 as uuidv4 } from 'uuid';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CompoundsService {
  private readonly _logger = new Logger(CompoundsService.name);

  constructor(
    private readonly _compoundsRepository: CompoundsRepository,
    private readonly _neo4jService: Neo4jService,
  ) {}

  /**
   * findPaginated
   *
   * Gets all compound records.
   *
   * @returns {Promise<Paginated<Compound>>}
   */
  async findPaginated(
    options?: FindPaginatedInput,
  ): Promise<Paginated<Compound>> {
    this._logger.log('Querying DB for compound records...');

    return this._compoundsRepository.findPaginated(options);
  }

  /**
   * findByConstraint
   *
   * Finds a compound record by providing a partial set of expected key values.
   *
   * @param {Partial<Record<keyof Compound, Compound[keyof Compound]>>} query
   * @returns {Promise<Compound | NotFoundError>}
   */
  async findByConstraint(
    query: Partial<Record<keyof Compound, Compound[keyof Compound]>>,
  ): Promise<Compound | NotFoundError> {
    // Build query fields
    let fields = '';
    Object.keys(query).forEach((key) => {
      fields += `${key}: $${key},`;
    });

    const queryResult = await this._neo4jService.read(
      `MATCH (type:Compound {${fields.slice(0, -1)}}) RETURN type`,
      query,
    );
    const compoundRecord = queryResult.records[0];

    if (!compoundRecord) {
      this._logger.error({
        message: 'No compound found for specified constraints.',
        data: query,
      });

      return new NotFoundError(`Compound not found.`);
    }

    const compound = compoundRecord.get('type').properties;

    this._logger.log({
      message: 'Compound found for specified constraints.',
      data: compound,
    });

    return plainToInstance(Compound, compound);
  }

  /**
   * create
   *
   * Creates a new compound record from the provided input.
   *
   * @returns {Promise<Compound>}
   */
  async create(payload: CreateCompoundInput): Promise<Compound> {
    // Transform name to lowercase
    // FIXME: Can we use `class-transformer` for this?
    payload.name = payload.name.toLowerCase();

    try {
      this._logger.log({
        message: 'Creating compound record in database...',
        data: payload,
      });

      // FIXME: Temporary Neo4j creation
      const result = await this._neo4jService.write(
        `CREATE
          (c:Compound {uuid: $uuid, name: $name, reducedFormula: $reducedFormula})
        RETURN c`,
        {
          uuid: uuidv4(),
          ...payload,
        },
      );

      this._logger.log({
        message: 'Compound successfully created in database.',
        data: payload,
      });

      return plainToInstance(Compound, result.records[0].get('c').properties);
    } catch (error) {
      this._logger.error('Failed to create record in database.');

      // TODO: Move error parsing to a shared utility
      if (error.code === 11000) {
        throw new UserInputError(`Name "${payload.name}" already exists`);
      }

      throw new InternalServerErrorException('Internal server error');
    }
  }
}
