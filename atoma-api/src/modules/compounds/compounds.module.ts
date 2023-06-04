import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Compound, CompoundSchema } from '@schemas/compound.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Compound.name, schema: CompoundSchema },
    ]),
  ],
})
export class CompoundsModule {}
