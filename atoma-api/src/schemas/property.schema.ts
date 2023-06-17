import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { Paginated } from '@common/pagination/paginated.schema';
import { PropertyType } from '@common/enums';
import { BaseEntity } from '@common/repositories/base.schema';

@ObjectType()
@Schema()
export class Property extends BaseEntity {
  static from(object: Document<Property>): Property {
    return plainToInstance(Property, object.toObject());
  }

  id?: number;

  @Field(() => String)
  @Prop({ unique: true })
  key: string;

  @Field(() => String)
  @Prop()
  name: string;

  @Prop()
  @Field(() => String)
  description: string;

  // TODO: Make this something more usable for conversions
  @Prop()
  @Field(() => String)
  units: string;

  @Prop() // TODO: Specify type 'PropertyType'
  @Field(() => String)
  type: PropertyType;
}

@ObjectType()
export class PaginatedProperties extends Paginated(Property) {}

export const PropertySchema = SchemaFactory.createForClass(Property);
