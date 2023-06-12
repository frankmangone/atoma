import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Compound, CompoundSchema } from '@schemas/compound.schema';
import { CompoundsService } from './services/compounds.service';
import { CompoundDataService } from './services/compound-data.service';
import { CompoundsRepository } from './repositories/compounds.repository';
import { CompoundDataRepository } from './repositories/compound-data.repository';
import { CompoundsResolver } from './resolvers/compounds.resolver';
import { CompoundDataResolver } from './resolvers/compound-data.resolver';
import {
  CompoundData,
  CompoundDataSchema,
} from '@schemas/compound-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Compound.name, schema: CompoundSchema },
      { name: CompoundData.name, schema: CompoundDataSchema },
    ]),
  ],
  providers: [
    CompoundDataResolver,
    CompoundDataService,
    CompoundDataRepository,
    CompoundsResolver,
    CompoundsService,
    CompoundsRepository,
  ],
  exports: [CompoundsResolver, CompoundDataResolver],
})
export class CompoundsModule {}
