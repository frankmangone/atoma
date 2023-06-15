import { plainToInstance } from 'class-transformer';
import { Document, Schema as Sch } from 'mongoose';
import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Paginated } from '@common/pagination/paginated.schema';
import { BaseEntity } from '@common/repositories/base.schema';
import { Condition, ConditionSchema } from './condition.schema';
import { CompoundProperty } from './compound-property.schema';

@ObjectType()
@Schema({ collection: 'compound-property-data' })
export class CompoundData extends BaseEntity {
  static from(object: Document<CompoundData>): CompoundData {
    return plainToInstance(CompoundData, object.toObject());
  }

  @Prop({ type: Sch.Types.ObjectId, ref: CompoundProperty.name })
  compoundProperty: CompoundProperty;

  @Prop()
  value: number;

  @Prop({ type: [{ type: ConditionSchema }] })
  conditions: Condition[];
}

@ObjectType()
export class PaginatedCompoundData extends Paginated(CompoundData) {}

export const CompoundDataSchema = SchemaFactory.createForClass(CompoundData);
