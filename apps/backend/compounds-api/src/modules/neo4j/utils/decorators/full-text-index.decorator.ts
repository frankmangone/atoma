import { ANNOTATED_KEYS, IS_FULL_TEXT_INDEXED } from '../constants';

interface FullTextIndexParams {
  name: string;
}

/**
 * FullTextIndex
 *
 * Marks a node property as full text indexed, in order to add the appropriate constraint.
 *
 * @returns {PropertyDecorator}
 */
export const FullTextIndex = (
  params: FullTextIndexParams,
): PropertyDecorator => {
  const { name } = params;

  return (object: object, propertyName: string) => {
    Reflect.defineMetadata(IS_FULL_TEXT_INDEXED, name, object, propertyName);

    const annotatedKeys = Reflect.getMetadata(ANNOTATED_KEYS, object) ?? [];

    Reflect.defineMetadata(
      ANNOTATED_KEYS,
      [...annotatedKeys, propertyName],
      object,
    );
  };
};
