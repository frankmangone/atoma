import { Module } from '@nestjs/common';
import { CompoundsService } from './services/compounds.service';
import { CompoundDataService } from './services/compound-data.service';
import { CompoundPropertiesService } from './services/compound-properties.service';
import { CompoundsRepository } from './repositories/compounds.repository';
import { CompoundDataRepository } from './repositories/compound-data.repository';
import { CompoundPropertiesRepository } from './repositories/compound-properties.repository';
import { CompoundsResolver } from './resolvers/compounds.resolver';
import { CompoundDataResolver } from './resolvers/compound-data.resolver';
import { CompoundPropertiesResolver } from './resolvers/compound-properties.resolver';
import { PropertiesModule } from '@modules/properties/properties.module';
import { Neo4jService } from '@modules/neo4j/neo4j.service';

@Module({
  imports: [PropertiesModule],
  providers: [
    Neo4jService,
    CompoundDataResolver,
    CompoundDataService,
    CompoundDataRepository,
    CompoundsResolver,
    CompoundsService,
    CompoundsRepository,
    CompoundPropertiesResolver,
    CompoundPropertiesService,
    CompoundPropertiesRepository,
  ],
  exports: [
    CompoundsResolver,
    CompoundDataResolver,
    CompoundPropertiesResolver,
  ],
})
export class CompoundsModule {}
