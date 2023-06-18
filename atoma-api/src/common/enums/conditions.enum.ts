export const CONDITIONS = {
  TEMPERATURE: 'temperature',
  PRESSURE: 'pressure',
} as const;

export type Condition = (typeof CONDITIONS)[keyof typeof CONDITIONS];
