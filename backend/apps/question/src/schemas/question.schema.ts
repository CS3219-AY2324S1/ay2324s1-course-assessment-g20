import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Difficulty } from './difficulty.schema';
import { Category } from './category.schema';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  _id: string;

  @Prop({ required: false })
  id?: string;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Difficulty',
  })
  difficulty: Difficulty;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
  })
  categories: Category[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
