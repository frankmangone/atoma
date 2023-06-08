import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { transports, defaultMeta } from './logger';

@Module({})
export class LoggingModule {
  static forRoot() {
    return WinstonModule.forRoot({
      transports,
      defaultMeta,
    });
  }
}
