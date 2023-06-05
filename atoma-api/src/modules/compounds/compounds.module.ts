import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompoundsResolver } from './compounds.resolver';
import { Compound, CompoundSchema } from '@schemas/compound.schema';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: Compound.name, schema: CompoundSchema },
    // ]),
  ],
  providers: [CompoundsResolver],
  exports: [CompoundsResolver],
})
export class CompoundsModule {}
