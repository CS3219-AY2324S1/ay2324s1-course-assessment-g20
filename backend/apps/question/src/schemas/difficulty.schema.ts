import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DifficultyDocument = HydratedDocument<Difficulty>;

@Schema()
export class Difficulty {
  _id: string;

  @Prop({ required: false })
  id?: string;

  @Prop({ required: true, unique: true })
  name: string;
}

export const DifficultySchema = SchemaFactory.createForClass(Difficulty);
