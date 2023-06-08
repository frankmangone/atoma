import { Args } from '@nestjs/graphql';

/**
 * Payload
 *
 * A simple alias for `@Args('payload')`, no keep things slightly less verbose and more consistent.
 */
export const Payload = () => Args('payload');
