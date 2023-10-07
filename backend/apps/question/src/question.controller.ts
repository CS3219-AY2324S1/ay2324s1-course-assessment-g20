import { Controller } from '@nestjs/common';
import { QuestionService } from './question.service';
import { MessagePattern } from '@nestjs/microservices';
import { Difficulty } from './schemas/difficulty.schema';
import { Category } from './schemas/category.schema';
import { QuestionWithCategoryAndDifficulty } from './interface';
import { QuestionServiceApi } from '@app/microservice/interservice-api/question';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // QUESTIONS

  @MessagePattern(QuestionServiceApi.GET_QUESTIONS)
  getQuestions(): Promise<QuestionWithCategoryAndDifficulty[]> {
    return this.questionService.getQuestions();
  }

  @MessagePattern(QuestionServiceApi.ADD_QUESTION)
  addQuestion(
    question: QuestionWithCategoryAndDifficulty,
  ): Promise<QuestionWithCategoryAndDifficulty> {
    return this.questionService.addQuestion(question);
  }

  @MessagePattern(QuestionServiceApi.DELETE_QUESTION_WITH_ID)
  deleteQuestionWithId(questionId: string): Promise<string> {
    return this.questionService.deleteQuestionWithId(questionId);
  }

  @MessagePattern(QuestionServiceApi.GET_QUESTION_WITH_ID)
  getQuestionWithId(
    questionId: string,
  ): Promise<QuestionWithCategoryAndDifficulty> {
    return this.questionService.getQuestionWithId(questionId);
  }

  @MessagePattern(QuestionServiceApi.GET_QUESTIONS_OF_DIFFICULTY)
  getQuestionsOfDifficulty(difficulty: string) {
    return this.questionService.getQuestionsOfDifficulty(difficulty);
  }

  // DIFFICULTIES

  @MessagePattern(QuestionServiceApi.GET_DIFFICULTIES)
  getDifficulties(): Promise<Difficulty[]> {
    return this.questionService.getDifficulties();
  }

  @MessagePattern(QuestionServiceApi.ADD_DIFFICULTY)
  addDifficulty(difficulty: Difficulty): Promise<Difficulty> {
    return this.questionService.addDifficulty(difficulty);
  }

  @MessagePattern(QuestionServiceApi.DELETE_DIFFICULTY_WITH_ID)
  deleteDifficultyWithId(difficultyId: string): Promise<string> {
    return this.questionService.deleteDifficultyWithId(difficultyId);
  }

  // CATEGORIES

  @MessagePattern(QuestionServiceApi.GET_CATEGORIES)
  getCategories(): Promise<Category[]> {
    return this.questionService.getCategories();
  }

  @MessagePattern(QuestionServiceApi.ADD_CATEGORY)
  addCategory(category: Category): Promise<Category> {
    return this.questionService.addCategory(category);
  }

  @MessagePattern(QuestionServiceApi.DELETE_CATEGORY_WITH_ID)
  deleteCategoryWithId(categoryId: string): Promise<string> {
    return this.questionService.deleteCategoryWithId(categoryId);
  }
}
