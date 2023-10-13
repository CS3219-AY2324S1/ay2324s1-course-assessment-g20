import { Controller } from '@nestjs/common';
import { QuestionService } from './question.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Difficulty } from './schemas/difficulty.schema';
import { Category } from './schemas/category.schema';
import { QuestionWithCategoryAndDifficulty } from './interface';

const QuestionServiceGrpcMethod: MethodDecorator =
  GrpcMethod('QuestionService');

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // QUESTIONS

  @QuestionServiceGrpcMethod
  getQuestions({}): Promise<{
    questions: QuestionWithCategoryAndDifficulty[];
  }> {
    return this.questionService
      .getQuestions()
      .then((questions) => ({ questions }));
  }

  @QuestionServiceGrpcMethod
  addQuestion(
    question: QuestionWithCategoryAndDifficulty,
  ): Promise<QuestionWithCategoryAndDifficulty> {
    return this.questionService.addQuestion(question);
  }

  @QuestionServiceGrpcMethod
  deleteQuestionWithId({ id }: { id: string }): Promise<{ id: string }> {
    return this.questionService.deleteQuestionWithId(id).then((id) => ({ id }));
  }

  @QuestionServiceGrpcMethod
  getQuestionWithId({
    id,
  }: {
    id: string;
  }): Promise<QuestionWithCategoryAndDifficulty> {
    return this.questionService.getQuestionWithId(id);
  }

  // DIFFICULTIES

  @QuestionServiceGrpcMethod
  getDifficulties({}): Promise<{ difficulties: Difficulty[] }> {
    return this.questionService
      .getDifficulties()
      .then((difficulties) => ({ difficulties }));
  }

  @QuestionServiceGrpcMethod
  addDifficulty(difficulty: Difficulty): Promise<Difficulty> {
    return this.questionService.addDifficulty(difficulty);
  }

  @QuestionServiceGrpcMethod
  deleteDifficultyWithId({ id }: { id: string }): Promise<{ id: string }> {
    return this.questionService
      .deleteDifficultyWithId(id)
      .then((id) => ({ id }));
  }

  // CATEGORIES

  @QuestionServiceGrpcMethod
  getCategories({}): Promise<{ categories: Category[] }> {
    return this.questionService
      .getCategories()
      .then((categories) => ({ categories }));
  }

  @QuestionServiceGrpcMethod
  addCategory(category: Category): Promise<Category> {
    return this.questionService.addCategory(category);
  }

  @QuestionServiceGrpcMethod
  deleteCategoryWithId({ id }: { id: string }): Promise<{ id: string }> {
    return this.questionService.deleteCategoryWithId(id).then((id) => ({ id }));
  }
}
