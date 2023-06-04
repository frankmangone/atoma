import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompoundsModule } from './modules/compounds/compounds.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost'), CompoundsModule],
})
export class AppModule {}
