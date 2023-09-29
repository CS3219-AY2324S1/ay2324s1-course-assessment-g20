import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Question } from './question.schema';
import { Category } from './category.schema';

export type QuestionCategoryDocument = HydratedDocument<QuestionCategory>;

@Schema()
export class QuestionCategory {
  @Prop({ required: false })
  id?: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    unique: false,
  })
  question: Question;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    unique: false,
  })
  category: Category;
}

export const QuestionCategorySchema =
  SchemaFactory.createForClass(QuestionCategory);
