import { plainToInstance } from 'class-transformer';
import { Paginated } from '@common/pagination/paginated.schema';
import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Sch } from 'mongoose';
import { BaseEntity } from '@common/repositories/base.schema';
import { Compound } from './compound.schema';
import { Property } from './property.schema';

@ObjectType()
@Schema({
  collection: 'compound-properties',
})
export class CompoundProperty extends BaseEntity {
  static from(object: Document<CompoundProperty>): CompoundProperty {
    return plainToInstance(CompoundProperty, object.toObject());
  }

  _id: string;

  @Prop({ type: Sch.Types.ObjectId, ref: Compound.name })
  compoundId: Compound;

  @Prop({ type: Sch.Types.ObjectId, ref: Property.name })
  propertyId: Property;
}

@ObjectType()
export class PaginatedCompoundProperties extends Paginated(CompoundProperty) {}

export const CompoundPropertySchema =
  SchemaFactory.createForClass(CompoundProperty);

// Compound indexes
CompoundPropertySchema.index(
  { compound: 1, property: 1 },
  { name: 'UNIQUE_COMPOUND_PROPERTY', unique: true },
);
