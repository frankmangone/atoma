import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertiesResolver } from './properties.resolver';
import { Property, PropertySchema } from '@schemas/property.schema';
import { PropertiesService } from './properties.service';
import { PropertiesRepository } from './properties.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
  ],
  providers: [PropertiesResolver, PropertiesService, PropertiesRepository],
  exports: [PropertiesResolver],
})
export class PropertiesModule {}
