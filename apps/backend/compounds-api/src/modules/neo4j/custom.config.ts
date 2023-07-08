// TODO: Make this declarative through some sort of helper.
export const customIndexes = [
  `CREATE FULLTEXT INDEX compoundName IF NOT EXISTS
  FOR (node:Compound|CompoundName)
  ON EACH [node.name]
  `,
  `CREATE FULLTEXT INDEX propertyName IF NOT EXISTS
  FOR (node:Property)
  ON EACH [node.name]
  `,
];
