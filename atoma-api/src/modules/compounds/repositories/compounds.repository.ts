import { BaseRepository } from '@common/repositories/base.repository';
import { Neo4jService } from '@modules/database/neo.service';
import { Injectable } from '@nestjs/common';
import { Compound } from '@schemas/compound.schema';

@Injectable()
export class CompoundsRepository extends BaseRepository<Compound> {
  constructor(protected readonly _neo4jService: Neo4jService) {
    super(Compound, _neo4jService);
  }
}
