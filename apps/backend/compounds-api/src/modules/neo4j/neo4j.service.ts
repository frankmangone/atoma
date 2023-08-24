import { Inject, Injectable } from '@nestjs/common';
import { Session, session, Result } from 'neo4j-driver';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './neo4j.module';
import { Direction, MatchBuilder } from './utils/builders/match.builder';

interface MatchOptions {
  limit?: number;
  node: {
    tag?: string;
    label?: string;
    fields?: Record<string, unknown>;
  };
  connections?: Array<{
    sourceNode?: {
      tag?: string;
      label?: string;
      fields?: Record<string, unknown>;
    };
    edge?: {
      direction?: Direction;
      tag?: string;
      label?: string;
      fields?: Record<string, unknown>;
    };
    targetNode?: {
      tag?: string;
      label?: string;
      fields?: Record<string, unknown>;
    };
  }>;
}

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

  //

  async match(options?: MatchOptions): Promise<any> {
    const { node, limit, connections } = options ?? {};

    let params = {};
    let cypher = '';

    const matchBuilder = new MatchBuilder(node);
    params = { ...params, ...(node.fields ?? {}) };

    connections?.forEach((connection) => {
      const { sourceNode, targetNode, edge } = connection;
      matchBuilder.addConnection({ sourceNode, targetNode, edge });
      params = { ...params, ...(node.fields ?? {}), ...(edge.fields ?? {}) };
    });

    cypher += matchBuilder.cypher;

    // TODO: Request what to return to the user.
    // In this context, `node.tag` may be undefined.
    cypher += `\nRETURN ${node.tag} `;

    if (limit) {
      cypher += `\nLIMIT ${limit}`;
    }

    const result = await this.read(cypher, params);
    return result.records.map((record) => record.get(node.tag).properties);
  }
}
