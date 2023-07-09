import { Inject, Injectable } from '@nestjs/common';
import { Session, session, Result } from 'neo4j-driver';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './neo4j.module';
import { Query } from './utils';

interface MatchOptions<T> {
  label?: string;
  fields?: Query<T>;
  limit?: number;
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

  async match<T>(options?: MatchOptions<T>): Promise<any> {
    const { label, limit, fields } = options ?? {};

    let params = {};
    let cypher = '';

    cypher += `MATCH (${label ? `node:${label}` : 'node'}`;

    if (fields) {
      const fieldsString = this._buildQueryFields(fields);
      params = { ...params, ...fields };
      cypher += ` {${fieldsString}}) `;
    } else {
      cypher += ')';
    }

    cypher += 'RETURN node ';

    if (limit) {
      cypher += `LIMIT ${limit}`;
    }

    const result = await this.read(cypher, params);
    return result.records.map((record) => record.get('node').properties);
  }

  /**
   * _buildQueryFields
   *
   * Builds query fields for a given payload.
   *
   * @param {Query<T>} query
   * @returns {string}
   */
  private _buildQueryFields<T>(query: Query<T>): string {
    let fields = '';

    Object.keys(query).forEach((key) => {
      fields += `${key}: $${key},`;
    });

    return fields.slice(0, -1);
  }
}
