import { Module } from '@nestjs/common';
import { PropertiesResolver } from './properties.resolver';
import { PropertiesService } from './properties.service';
import { PropertiesRepository } from './properties.repository';
import { Neo4jService } from '@modules/neo4j/neo4j.service';

@Module({
  providers: [
    Neo4jService,
    PropertiesResolver,
    PropertiesService,
    PropertiesRepository,
  ],
  exports: [PropertiesResolver, PropertiesService],
})
export class PropertiesModule {}
