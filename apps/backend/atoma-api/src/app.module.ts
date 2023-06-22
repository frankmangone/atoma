import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { Neo4jModule } from './modules/neo4j/neo4j.module';
import { LoggingModule } from './modules/logging/logging.module';
import { CompoundsModule } from './modules/compounds/compounds.module';
import { PropertiesModule } from './modules/properties/properties.module';

@Module({
  imports: [
    LoggingModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      // validate: validateEnvironmentVariables,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    Neo4jModule.forRoot(),
    //
    CompoundsModule,
    PropertiesModule,
  ],
})
export class AppModule {}
