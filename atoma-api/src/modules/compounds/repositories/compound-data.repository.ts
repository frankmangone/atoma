import { BaseRepository } from '@modules/neo4j/utils/base.repository';
import { Neo4jService } from '@modules/neo4j/neo4j.service';
import { Injectable } from '@nestjs/common';
import { CompoundData } from '@schemas/compound-data.schema';
import { CreateCompoundDataInput } from '../inputs/create-compount-data.input';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CompoundDataRepository extends BaseRepository<CompoundData> {
  constructor(protected readonly _neo4jService: Neo4jService) {
    super(CompoundData, _neo4jService);
  }

  /**
   * _createConnected
   *
   * Creates a `CompoundData` node connected to a `CompoundProperty` record.`
   */
  async createConnected(
    compoundPropertyUuid: string,
    payload: CreateCompoundDataInput,
  ): Promise<CompoundData> {
    const uuid = uuidv4();

    const { records } = await this._neo4jService.write(
      `
      MATCH
        (compoundProperty:CompoundProperty {uuid: $compoundPropertyUuid})
      CREATE
        (compoundProperty)
        -[:HAS_DATA]->
        (compoundData:CompoundData {value: $value, uuid: $uuid})
      RETURN compoundData
      `,
      { ...payload, uuid, compoundPropertyUuid },
    );

    return plainToInstance(
      CompoundData,
      records[0].get('compoundData').properties,
    );
  }
}
