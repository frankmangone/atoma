import { plainToInstance } from 'class-transformer';
import { Paginated } from '@common/pagination/paginated.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Sch } from 'mongoose';
import { BaseEntity } from '@common/repositories/base.schema';
import { Compound } from './compound.schema';
import { Property } from './property.schema';

@ObjectType()
@Schema()
export class CompoundProperty extends BaseEntity {
  static from(object: Document<CompoundProperty>): CompoundProperty {
    return plainToInstance(CompoundProperty, object.toObject());
  }

  @Prop({ type: Sch.Types.ObjectId, ref: Compound.name })
  compound: Compound;

  @Prop({ type: Sch.Types.ObjectId, ref: Property.name })
  property: Property;
}

@ObjectType()
export class PaginatedCompoundProperties extends Paginated(CompoundProperty) {}

export const CompoundPropertySchema =
  SchemaFactory.createForClass(CompoundProperty);
