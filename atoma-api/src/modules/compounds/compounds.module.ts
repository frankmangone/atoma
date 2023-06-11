import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompoundsResolver } from './resolvers/compounds.resolver';
import { Compound, CompoundSchema } from '@schemas/compound.schema';
import { CompoundsService } from './services/compounds.service';
import { CompoundsRepository } from './compounds.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Compound.name, schema: CompoundSchema },
    ]),
  ],
  providers: [CompoundsResolver, CompoundsService, CompoundsRepository],
  exports: [CompoundsResolver],
})
export class CompoundsModule {}
