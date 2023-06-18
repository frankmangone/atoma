import { IS_NODE_PROPERTY, ANNOTATED_KEYS } from '../constants';

/**
 * NodeProperty
 *
 * Marks a class property as belonging to a node as per defined in a schema.
 *
 * @returns {PropertyDecorator}
 */
export const NodeProperty = (): PropertyDecorator => {
  return (object: object, propertyName: string) => {
    Reflect.defineMetadata(IS_NODE_PROPERTY, true, object, propertyName);

    const annotatedKeys = Reflect.getMetadata(ANNOTATED_KEYS, object) ?? [];

    Reflect.defineMetadata(
      ANNOTATED_KEYS,
      [...annotatedKeys, propertyName],
      object,
    );
  };
};
