import { join } from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { CompoundsModule } from './modules/compounds/compounds.module';
import { CompoundsResolver } from './modules/compounds/compounds.resolver';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    CompoundsModule,
  ],
  providers: [CompoundsResolver],
})
export class AppModule {}
