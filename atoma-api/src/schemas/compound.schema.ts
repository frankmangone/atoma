import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompoundDocument = HydratedDocument<Compound>;

@Schema()
export class Compound {
  @Prop()
  name: string;

  @Prop()
  reducedFormula: string;

  @Prop([String])
  alternativeNames: string[];
}

export const CompoundSchema = SchemaFactory.createForClass(Compound);
