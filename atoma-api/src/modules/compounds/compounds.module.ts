import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Compound, CompoundSchema } from '@schemas/compound.schema';
import { CompoundsService } from './services/compounds.service';
import { CompoundDataService } from './services/compound-data.service';
import { CompoundPropertiesService } from './services/compound-properties.service';
import { CompoundsRepository } from './repositories/compounds.repository';
import { CompoundDataRepository } from './repositories/compound-data.repository';
import { CompoundPropertiesRepository } from './repositories/compound-properties.repository';
import { CompoundsResolver } from './resolvers/compounds.resolver';
import { CompoundDataResolver } from './resolvers/compound-data.resolver';
import { CompoundPropertiesResolver } from './resolvers/compound-properties.resolver';
import {
  CompoundData,
  CompoundDataSchema,
} from '@schemas/compound-data.schema';
import {
  CompoundProperty,
  CompoundPropertySchema,
} from '@schemas/compound-property.schema';
import { PropertiesModule } from '@modules/properties/properties.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Compound.name, schema: CompoundSchema },
      { name: CompoundData.name, schema: CompoundDataSchema },
      { name: CompoundProperty.name, schema: CompoundPropertySchema },
    ]),
    PropertiesModule,
  ],
  providers: [
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
