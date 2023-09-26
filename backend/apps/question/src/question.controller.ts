import { Controller } from '@nestjs/common';
import { QuestionService } from './question.service';
import { MessagePattern } from '@nestjs/microservices';
import { Question } from './schemas/question.schema';
import { Difficulty } from './schemas/difficulty.schema';
import { Category } from './schemas/category.schema';
import { QuestionWithCategoryAndDifficulty } from './interface';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // QUESTIONS

  @MessagePattern('get_questions')
  getQuestions(): Promise<QuestionWithCategoryAndDifficulty[]> {
    return this.questionService.getQuestions();
  }

  @MessagePattern('add_question')
  addQuestion(question: QuestionWithCategoryAndDifficulty): Promise<Question> {
    return this.questionService.addQuestion(question);
  }

  @MessagePattern('get_question_with_id')
  getQuestionWithId(
    questionId: string,
  ): Promise<QuestionWithCategoryAndDifficulty> {
    return this.questionService.getQuestionWithId(questionId);
  }

  @MessagePattern('delete_question_with_id')
  deleteQuestionWithId(questionId: string): Promise<string> {
    return this.questionService.deleteQuestionWithId(questionId);
  }

  // DIFFICULTIES

  @MessagePattern('get_difficulties')
  getDifficulties(): Promise<Difficulty[]> {
    return this.questionService.getDifficulties();
  }

  // CATEGORIES

  @MessagePattern('get_categories')
  getCategories(): Promise<Category[]> {
    return this.questionService.getCategories();
  }
}
