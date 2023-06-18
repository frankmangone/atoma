import { IS_NODE_TYPE } from '../constants';

/**
 * NodeType
 *
 * Marks a class as being a valid schema for node types.
 *
 * @returns {ClassDecorator}
 */
export const NodeType = (): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(IS_NODE_TYPE, true, target);
  };
};
