import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import questionConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schemas/question.schema';
import { Difficulty, DifficultySchema } from './schemas/difficulty.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import {
  QuestionCategory,
  QuestionCategorySchema,
} from './schemas/question-category.schema';

@Module({
  imports: [
    ConfigModule.loadConfiguration(questionConfiguration),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/peer-prep'),
    MongooseModule.forFeature([
      {
        name: Question.name,
        schema: QuestionSchema,
      },
      {
        name: Difficulty.name,
        schema: DifficultySchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: QuestionCategory.name,
        schema: QuestionCategorySchema,
      },
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
