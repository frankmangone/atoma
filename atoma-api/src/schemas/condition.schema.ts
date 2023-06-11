import { raw } from '@nestjs/mongoose';

export interface Condition {
  variable: string;
  value: number;
}

export const ConditionSchema = raw({
  variable: { type: String },
  value: { type: Number },
});
