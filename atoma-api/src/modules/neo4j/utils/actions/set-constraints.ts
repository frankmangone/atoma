// import * as fs from 'fs';

import { IS_NODE_TYPE, ANNOTATED_KEYS, IS_PROPERTY_UNIQUE } from '../constants';

/**
 * setConstraints
 *
 * Sets the appropriate constraints in the DB, by analyzing the metadata
 * added by decorator annotations on schema definitions.
 */
export const setConstraints = async () => {
  // TODO: Use fs to detect all schema files.

  const module = await import(
    __dirname + '/../../../../schemas/compound.schema.js'
  );

  // Iterate over exports to find the ones marked as node types
  Object.values(module).forEach((class_: any) => {
    const isNodeSchema = Reflect.getMetadata(IS_NODE_TYPE, class_);
    if (!isNodeSchema) return;

    // In case it is a node schema, we need to determine which constraints
    // are applied through annotations

    const keys = Reflect.getMetadata(ANNOTATED_KEYS, class_.prototype);

    keys.forEach((key) => {
      // TODO: check more complex constraints. For now, it just checks UNIQUE
      const isPropertyUnique = Reflect.getMetadata(
        IS_PROPERTY_UNIQUE,
        class_.prototype,
        key,
      );

      if (!isPropertyUnique) return;

      // TODO: Get session and run queries
      console.log(key, isPropertyUnique);

      // CREATE CONSTRAINT ON (n:NodeType) ASSERT n.propertyName IS UNIQUE
    });
  });
};
