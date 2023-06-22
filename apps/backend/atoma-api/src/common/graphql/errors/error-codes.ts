export const ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
