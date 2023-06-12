import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@ObjectType()
@Schema()
export abstract class BaseEntity {
  @Field(() => String)
  @Prop({ default: uuidv4, index: true })
  uuid: string;
}
