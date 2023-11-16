import { Controller } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Difficulty } from './schemas/difficulty.schema';
import { Category } from './schemas/category.schema';
import {
  GetCategoriesResponse,
  GetDifficultiesResponse,
  GetQuestionsResponse,
  Question,
  QuestionServiceController,
  QuestionServiceControllerMethods,
} from '@app/microservice/interfaces/question';
import { ID } from '@app/microservice/interfaces/common';

@Controller()
@QuestionServiceControllerMethods()
export class QuestionController implements QuestionServiceController {
  constructor(private readonly questionService: QuestionService) {}

  // QUESTIONS

  getQuestions(): Promise<GetQuestionsResponse> {
    return this.questionService
      .getQuestions()
      .then((questions) => ({ questions }));
  }

  addQuestion(question: Question): Promise<Question> {
    return this.questionService.addQuestion(question);
  }

  deleteQuestionWithId({ id }: ID): Promise<ID> {
    return this.questionService.deleteQuestionWithId(id).then((id) => ({ id }));
  }

  getQuestionWithId({ id }: ID): Promise<Question> {
    return this.questionService.getQuestionWithId(id);
  }

  updateQuestionWithId(question: Question): Promise<Question> {
    return this.questionService.updateQuestionWithId(question);
  }

  getQuestionsByDifficultyId({ id }: ID): Promise<GetQuestionsResponse> {
    return this.questionService
      .getQuestionsByDifficulty(id)
      .then((questions) => ({ questions }));
  }

  // DIFFICULTIES

  getDifficulties(): Promise<GetDifficultiesResponse> {
    return this.questionService
      .getDifficulties()
      .then((difficulties) => ({ difficulties }));
  }

  addDifficulty(difficulty: Difficulty): Promise<Difficulty> {
    return this.questionService.addDifficulty(difficulty);
  }

  deleteDifficultyWithId({ id }: ID): Promise<ID> {
    return this.questionService
      .deleteDifficultyWithId(id)
      .then((id) => ({ id }));
  }

  // CATEGORIES
  getCategories(): Promise<GetCategoriesResponse> {
    return this.questionService
      .getCategories()
      .then((categories) => ({ categories }));
  }

  addCategory(category: Category): Promise<Category> {
    return this.questionService.addCategory(category);
  }

  deleteCategoryWithId({ id }: ID): Promise<ID> {
    return this.questionService.deleteCategoryWithId(id).then((id) => ({ id }));
  }
}
