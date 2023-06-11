import { plainToInstance } from 'class-transformer';
import { Paginated } from '@common/pagination/paginated.schema';
import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Sch } from 'mongoose';
import { Compound } from './compound.schema';
import { Property } from './property.schema';
import { Condition, ConditionSchema } from './condition.schema';

@ObjectType()
@Schema()
export class CompoundPropertyData {
  static from(object: Document<CompoundPropertyData>): CompoundPropertyData {
    return plainToInstance(CompoundPropertyData, object.toObject());
  }

  @Prop({ type: Sch.Types.ObjectId, ref: Compound.name })
  compound: Compound;

  @Prop({ type: Sch.Types.ObjectId, ref: Property.name })
  property: Property;

  @Prop([ConditionSchema])
  conditions: Condition[];
}

@ObjectType()
export class PaginatedCompoundPropertyData extends Paginated(
  CompoundPropertyData,
) {}

export const CompoundPropertyDataSchema =
  SchemaFactory.createForClass(CompoundPropertyData);
