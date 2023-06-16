import { DynamicModule, Global, Module } from '@nestjs/common';
import { createDriver } from './driver.provider';
import { Neo4jConfig } from './neo.config';

export const NEO4J_CONFIG = 'NEO4J_CONFIG';
export const NEO4J_DRIVER = 'NEO4J_DRIVER';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(config: Neo4jConfig): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: NEO4J_CONFIG,
          useValue: config,
        },
        {
          provide: NEO4J_DRIVER,
          useFactory: async () => createDriver(config),
        },
      ],
    };
  }
}
