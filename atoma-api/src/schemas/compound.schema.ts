import { plainToInstance } from 'class-transformer';
import { Paginated } from '@common/pagination/paginated.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '@common/repositories/base.schema';

@ObjectType()
@Schema()
export class Compound extends BaseEntity {
  static from(object: Document<Compound>): Compound {
    return plainToInstance(Compound, object);
  }

  @Field(() => String)
  @Prop({ unique: true })
  name: string;

  @Prop()
  @Field({ nullable: true })
  reducedFormula?: string;

  @Prop([String])
  alternativeNames: string[];
}

@ObjectType()
export class PaginatedCompounds extends Paginated(Compound) {}

export const CompoundSchema = SchemaFactory.createForClass(Compound);
