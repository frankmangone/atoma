import { BaseRepository } from '@common/neo4j-utils/base.repository';
import { Neo4jService } from '@modules/database/neo.service';
import { Injectable } from '@nestjs/common';
import { CompoundProperty } from '@schemas/compound-property.schema';

@Injectable()
export class CompoundPropertiesRepository extends BaseRepository<CompoundProperty> {
  constructor(protected readonly _neo4jService: Neo4jService) {
    super(CompoundProperty, _neo4jService);
  }
}
