import { DynamicModule, Global, Module } from '@nestjs/common';
import { createDriver } from './driver.provider';
import { Neo4jConfig } from './neo4j.config';
import { ConfigService } from '@nestjs/config';
import { CONFIG } from '@common/enums';
import { setConstraints } from './utils/actions/set-constraints';
import { session as sess } from 'neo4j-driver';

export const NEO4J_CONFIG = 'NEO4J_CONFIG';
export const NEO4J_DRIVER = 'NEO4J_DRIVER';

@Global()
@Module({})
export class Neo4jModule {
  static forRoot(): DynamicModule {
    return {
      module: Neo4jModule,
      providers: [
        {
          provide: NEO4J_CONFIG,
          useFactory: (configService: ConfigService) =>
            ({
              scheme: configService.get(CONFIG.NEO_PROTOCOL),
              host: configService.get(CONFIG.NEO_HOST),
              port: Number(configService.get(CONFIG.NEO_PORT)),
              username: configService.get(CONFIG.NEO_USERNAME),
              password: configService.get(CONFIG.NEO_PASSWORD),
              database: configService.get(CONFIG.DATABASE_NAME),
            } as Neo4jConfig),
          inject: [ConfigService],
        },
        {
          provide: NEO4J_DRIVER,
          useFactory: async (neo4jConfig: Neo4jConfig) => {
            const driver = await createDriver(neo4jConfig);
            const session = await driver.session({
              database: neo4jConfig.database,
              defaultAccessMode: sess.WRITE,
            });
            await setConstraints(session);

            return driver;
          },
          inject: [NEO4J_CONFIG],
        },
      ],
      exports: [NEO4J_CONFIG, NEO4J_DRIVER],
    };
  }
}
