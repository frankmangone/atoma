import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompoundDocument = HydratedDocument<Compound>;

@Schema()
@ObjectType()
export class Compound {
  @Prop()
  id: number;

  @Field(() => String)
  @Prop()
  name: string;

  @Prop()
  @Field({ nullable: true })
  reducedFormula?: string;

  @Prop([String])
  alternativeNames: string[];
}

export const CompoundSchema = SchemaFactory.createForClass(Compound);
