import { BaseRepository } from '@modules/neo4j/utils/base.repository';
import { Neo4jService } from '@modules/neo4j/neo4j.service';
import { Injectable } from '@nestjs/common';
import { CompoundData } from '@schemas/compound-data.schema';

@Injectable()
export class CompoundDataRepository extends BaseRepository<CompoundData> {
  constructor(protected readonly _neo4jService: Neo4jService) {
    super(CompoundData, _neo4jService);
  }
}
