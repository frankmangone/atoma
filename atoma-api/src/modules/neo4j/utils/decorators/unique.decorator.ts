import { IS_PROPERTY_UNIQUE } from '../constants';

/**
 * Unique
 *
 * Marks a node property as unique, in order to add the appropriate constraint.
 *
 * @param typeOrOptions
 * @param options
 * @returns
 */
export const Unique = (): PropertyDecorator => {
  return (object: object, propertyName: string) => {
    Reflect.defineMetadata(IS_PROPERTY_UNIQUE, true, object, propertyName);
  };
};

// CREATE CONSTRAINT ON (n:NodeType) ASSERT n.propertyName IS UNIQUE
