import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { Paginated } from '@common/pagination/paginated.schema';
import { PropertyType } from '@common/enums';

@ObjectType()
@Schema()
export class Property {
  static from(object: Document<Property>): Property {
    return plainToInstance(Property, object.toObject());
  }

  @Field(() => String)
  @Prop({ unique: true })
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
