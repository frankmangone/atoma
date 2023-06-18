import { ANNOTATED_KEYS, IS_PROPERTY_UNIQUE } from '../constants';

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

    const annotatedKeys = Reflect.getMetadata(ANNOTATED_KEYS, object) ?? [];

    Reflect.defineMetadata(
      ANNOTATED_KEYS,
      [...annotatedKeys, propertyName],
      object,
    );
  };
};
