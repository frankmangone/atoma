import { Inject, Injectable } from '@nestjs/common';
import { Session, session, Result } from 'neo4j-driver';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './neo4j.module';

@Injectable()
export class Neo4jService {
  constructor(
    @Inject(NEO4J_CONFIG) private readonly _config,
    @Inject(NEO4J_DRIVER) private readonly _driver,
  ) {}

  read(cypher: string, params: Record<string, any>, database?: string): Result {
    const session = this.getReadSession(database);
    return session.run(cypher, params);
  }

  write(
    cypher: string,
    params: Record<string, any>,
    database?: string,
  ): Result {
    const session = this.getWriteSession(database);
    return session.run(cypher, params);
  }

  getReadSession(database?: string): Session {
    return this._driver.session({
      database: database || this._config.database,
      defaultAccessMode: session.READ,
    });
  }

  getWriteSession(database?: string): Session {
    return this._driver.session({
      database: database || this._config.database,
      defaultAccessMode: session.WRITE,
    });
  }
}
