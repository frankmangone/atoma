import { BaseRepository } from '@common/repositories/base.repository';
import { Neo4jService } from '@modules/database/neo.service';
import { Injectable } from '@nestjs/common';
import { CompoundData } from '@schemas/compound-data.schema';

@Injectable()
export class CompoundDataRepository extends BaseRepository<CompoundData> {
  constructor(protected readonly _neo4jService: Neo4jService) {
    super(CompoundData, _neo4jService);
  }
}
