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

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Difficulty',
  })
  difficulty: Difficulty;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
  })
  categories: Category[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.Date,
    default: null,
  })
  deletedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
QuestionSchema.index(
  { title: 1, isDeleted: 1, deletedAt: 1 },
  { unique: true },
);
