import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Param,
  Delete,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Public } from '../jwt/jwtPublic.decorator';
import QuestionDto from '../dtos/question/question.dto';
import DifficultyDto from '../dtos/question/difficulty.dto';
import CategoryDto from '../dtos/question/category.dto';
import { QuestionController as QuestionService } from 'apps/question/src/question.controller';
import { getPromisifiedGrpcService } from '@app/microservice/utils';
import { Service } from '@app/microservice/interservice-api/services';

@Controller('question')
export class AppController implements OnModuleInit {
  private questionService: QuestionService;

  constructor(
    @Inject(Service.QUESTION_SERVICE) private questionServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.questionService = getPromisifiedGrpcService<QuestionService>(
      this.questionServiceClient,
      'QuestionService',
    );
  }

  // QUESTIONS

  @Public()
  @Get('questions')
  getQuestions() {
    return this.questionService
      .getQuestions({})
      .then(({ questions }) => questions);
  }

  @Public()
  @Post('questions')
  addQuestion(@Body('question') question: QuestionDto) {
    return this.questionService.addQuestion(question);
  }

  @Public()
  @Delete('questions/:id')
  deleteQuestionWithId(@Param('id') id: string): Promise<string> {
    return this.questionService
      .deleteQuestionWithId({ id })
      .then(({ id }) => id);
  }

  @Public()
  @Get('questions/:id')
  getQuestionWithId(@Param('id') id: string) {
    return this.questionService.getQuestionWithId({ id });
  }

  // DIFFICULTIES

  @Public()
  @Get('difficulties')
  getDifficulties() {
    return this.questionService
      .getDifficulties({})
      .then(({ difficulties }) => difficulties);
  }

  @Public()
  @Post('difficulties')
  addDifficulty(@Body('difficulty') difficulty: DifficultyDto) {
    return this.questionService.addDifficulty(difficulty);
  }

  @Public()
  @Delete('difficulties/:id')
  deleteDifficultyWithId(@Param('id') id: string): Promise<string> {
    return this.questionService
      .deleteDifficultyWithId({ id })
      .then(({ id }) => id);
  }

  // CATEGORIES

  @Get('categories')
  getCategories() {
    return this.questionService
      .getCategories({})
      .then(({ categories }) => categories);
  }

  @Public()
  @Post('categories')
  addCategory(@Body('category') category: CategoryDto) {
    return this.questionService.addCategory(category);
  }

  @Public()
  @Delete('categories/:id')
  deleteCategoryWithId(@Param('id') id: string): Promise<string> {
    return this.questionService
      .deleteCategoryWithId({ id })
      .then(({ id }) => id);
  }
}
