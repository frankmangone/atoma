import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompoundsResolver } from './compounds.resolver';
import { Compound, CompoundSchema } from '@schemas/compound.schema';
import { CompoundsService } from './compounds.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Compound.name, schema: CompoundSchema },
    ]),
  ],
  providers: [CompoundsResolver, CompoundsService],
  exports: [CompoundsResolver, CompoundsService],
})
export class CompoundsModule {}
