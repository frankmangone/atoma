import { BaseRepository } from '@modules/neo4j/utils/base.repository';
import { Neo4jService } from '@modules/neo4j/neo4j.service';
import { Injectable } from '@nestjs/common';
import { Compound } from '@schemas/compound.schema';

@Injectable()
export class CompoundsRepository extends BaseRepository<Compound> {
  constructor(protected readonly _neo4jService: Neo4jService) {
    super(Compound, _neo4jService);
  }
}
