import * as fs from 'fs';
import { Session } from 'neo4j-driver';
import {
  IS_NODE_TYPE,
  ANNOTATED_KEYS,
  IS_PROPERTY_UNIQUE,
  IS_FULL_TEXT_INDEXED,
} from '../constants';

/**
 * setConstraints
 *
 * Sets the appropriate constraints in the DB, by analyzing the metadata
 * added by decorator annotations on schema definitions.
 */
export const setConstraints = async (session: Session) => {
  // TODO: Use fs to detect all schema files.
  // Read files in the schemas directory

  const folder = '../../../../schemas';
  const files = fs
    .readdirSync(`${__dirname}/${folder}`)
    .filter((file) => !file.includes('.d.ts') && !file.includes('.js.map'));

  for (const file of files) {
    const module = await import(`${__dirname}/${folder}/${file}`);

    // Iterate over exports to find the ones marked as node types
    for (const class_ of Object.values(module) as any[]) {
      const isNodeSchema = Reflect.getMetadata(IS_NODE_TYPE, class_);

      if (!isNodeSchema) continue;

      // In case it is a node schema, we need to determine which constraints
      // are applied through annotations

      const keys = Reflect.getMetadata(ANNOTATED_KEYS, class_.prototype) ?? [];

      for (const key of keys) {
        // TODO: check more complex constraints. For now, it just checks UNIQUE
        const isPropertyUnique = Reflect.getMetadata(
          IS_PROPERTY_UNIQUE,
          class_.prototype,
          key,
        );

        const fullTextIndexName = Reflect.getMetadata(
          IS_FULL_TEXT_INDEXED,
          class_.prototype,
          key,
        );

        try {
          if (isPropertyUnique) {
            await session.run(
              `
                CREATE CONSTRAINT
                FOR (n:${class_.name})
                REQUIRE n.${key} IS UNIQUE
                IF NOT EXISTS
              `,
            );
          }
        } catch {
          // Constraint already exists; nothing should happen
        }

        try {
          if (fullTextIndexName) {
            await session.run(
              `
                CREATE FULLTEXT INDEX ${fullTextIndexName} IF NOT EXISTS
                FOR (n:${class_.name})
                ON EACH [n.${key}]
                
              `,
            );
          }
        } catch (err) {
          console.log(err);
          // Constraint already exists; nothing should happen
        }
      }
    }
  }
};
