import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Compound } from '@schemas/compound.schema';
import { CreateCompoundInput } from './inputs/create-compound.input';
import { UserInputError } from '@nestjs/apollo';
import { CompoundsRepository } from './compounds.repository';
import { Paginated } from '@common/pagination/pagination.types';
import { FindPaginatedInput } from '@common/pagination/pagination.input';

@Injectable()
export class CompoundsService {
  private readonly _logger = new Logger(CompoundsService.name);

  constructor(private readonly _compoundsRepository: CompoundsRepository) {}

  /**
   * findPaginated
   *
   * Gets all compound records.
   * TODO: This should have pagination, and query options
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

      const compound = await this._compoundsRepository.create(payload);

      this._logger.log({
        message: 'Compound successfully created in database.',
        data: payload,
      });

      return compound;
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
