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
import { Service } from '@app/microservice/services';
import {
  QUESTION_SERVICE_NAME,
  QuestionServiceClient,
} from '@app/microservice/interfaces/question';
import { map } from 'rxjs';

@Controller('question')
export class AppController implements OnModuleInit {
  private questionService: QuestionServiceClient;

  constructor(
    @Inject(Service.QUESTION_SERVICE) private questionServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.questionService =
      this.questionServiceClient.getService<QuestionServiceClient>(
        QUESTION_SERVICE_NAME,
      );
  }

  // QUESTIONS

  @Public()
  @Get('questions')
  getQuestions() {
    return this.questionService
      .getQuestions({})
      .pipe(map(({ questions }) => questions));
  }

  @Public()
  @Post('questions')
  addQuestion(@Body('question') question: QuestionDto) {
    return this.questionService.addQuestion(question);
  }

  @Public()
  @Delete('questions/:id')
  deleteQuestionWithId(@Param('id') id: string) {
    return this.questionService
      .deleteQuestionWithId({ id })
      .pipe(map(({ id }) => id));
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
      .pipe(map(({ difficulties }) => difficulties));
  }

  @Public()
  @Post('difficulties')
  addDifficulty(@Body('difficulty') difficulty: DifficultyDto) {
    return this.questionService.addDifficulty(difficulty);
  }

  @Public()
  @Delete('difficulties/:id')
  deleteDifficultyWithId(@Param('id') id: string) {
    return this.questionService
      .deleteDifficultyWithId({ id })
      .pipe(map(({ id }) => id));
  }

  // CATEGORIES

  @Get('categories')
  getCategories() {
    return this.questionService
      .getCategories({})
      .pipe(map(({ categories }) => categories));
  }

  @Public()
  @Post('categories')
  addCategory(@Body('category') category: CategoryDto) {
    return this.questionService.addCategory(category);
  }

  @Public()
  @Delete('categories/:id')
  deleteCategoryWithId(@Param('id') id: string) {
    return this.questionService
      .deleteCategoryWithId({ id })
      .pipe(map(({ id }) => id));
  }
}
