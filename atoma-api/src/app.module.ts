import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { DatabaseModule } from './modules/database/neo.module';
import { LoggingModule } from './modules/logging/logging.module';
import { CompoundsModule } from './modules/compounds/compounds.module';
import { PropertiesModule } from './modules/properties/properties.module';

import { CONFIG } from './common';

@Module({
  imports: [
    LoggingModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      // validate: validateEnvironmentVariables,
    }),
    // MongooseModule.forRootAsync({
    //   useFactory: async (_config: ConfigService) => {
    //     const COMPOUNDS_DB_NAME = _config.get(CONFIG.COMPOUNDS_DB_NAME);

    //     const MONGO_PROTOCOL = _config.get(CONFIG.MONGO_PROTOCOL);
    //     const MONGO_USERNAME = _config.get(CONFIG.MONGO_USERNAME);
    //     const MONGO_PASSWORD = _config.get(CONFIG.MONGO_PASSWORD);
    //     const MONGO_HOST = _config.get(CONFIG.MONGO_HOST);
    //     const MONGO_PORT = _config.get(CONFIG.MONGO_PORT);

    //     const mongoUri = `${MONGO_PROTOCOL}://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${COMPOUNDS_DB_NAME}?authSource=admin`;

    //     return {
    //       uri: mongoUri,
    //       useNewUrlParser: true,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    DatabaseModule.forRoot({
      scheme: 'neo4j',
      host: 'localhost',
      port: 7687,
      username: 'neo4j',
      password: 'password',
    }),
    //
    CompoundsModule,
    PropertiesModule,
  ],
})
export class AppModule {}
