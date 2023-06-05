import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { CompoundsModule } from './modules/compounds/compounds.module';
import { CompoundsResolver } from './modules/compounds/compounds.resolver';

import { CONFIG } from './common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validate: validateEnvironmentVariables,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (_config: ConfigService) => {
        const COMPOUNDS_DB_NAME = _config.get(CONFIG.COMPOUNDS_DB_NAME);
        const MONGO_USERNAME = _config.get(CONFIG.MONGO_USERNAME);
        const MONGO_PASSWORD = _config.get(CONFIG.MONGO_PASSWORD);
        const MONGO_PORT = _config.get(CONFIG.MONGO_PORT);
        const mongoUri = `mongodb://localhost:${MONGO_PORT}/${COMPOUNDS_DB_NAME}`;

        return {
          uri: mongoUri,
          useNewUrlParser: true,
        };
      },
      inject: [ConfigService],
    }),
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
