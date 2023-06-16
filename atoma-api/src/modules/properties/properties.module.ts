import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertiesResolver } from './properties.resolver';
import { Property, PropertySchema } from '@schemas/property.schema';
import { PropertiesService } from './properties.service';
import { PropertiesRepository } from './properties.repository';
import { Neo4jService } from '@modules/database/neo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
  ],
  providers: [
    Neo4jService,
    PropertiesResolver,
    PropertiesService,
    PropertiesRepository,
  ],
  exports: [PropertiesResolver, PropertiesService],
})
export class PropertiesModule {}
