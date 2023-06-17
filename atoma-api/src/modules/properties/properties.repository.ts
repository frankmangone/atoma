import { BaseRepository } from '@common/neo4j-utils/base.repository';
import { Neo4jService } from '@modules/database/neo.service';
import { Injectable } from '@nestjs/common';
import { Property } from '@schemas/property.schema';

@Injectable()
export class PropertiesRepository extends BaseRepository<Property> {
  constructor(protected readonly _neo4jService: Neo4jService) {
    super(Property, _neo4jService);
  }
}
