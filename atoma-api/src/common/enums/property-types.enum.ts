export const PROPERTY_TYPES = {
  PHYSICAL: 'PHYSICAL',
  CHEMICAL: 'CHEMICAL',
  KINETIC: 'KINETIC',
  MIXTURE: 'MIXTURE',
} as const;

export type PropertyType = keyof typeof PROPERTY_TYPES;
