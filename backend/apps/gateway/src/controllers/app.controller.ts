import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Public } from '../jwt/jwtPublic.decorator';
import {
  QUESTION_SERVICE,
  QuestionServiceApi,
} from '@app/interservice-api/question';
import QuestionDto from '../dtos/question/question.dto';
import DifficultyDto from '../dtos/question/difficulty.dto';
import CategoryDto from '../dtos/question/category.dto';

@Controller('question')
export class AppController {
  constructor(
    @Inject(QUESTION_SERVICE)
    private readonly questionServiceClient: ClientProxy,
  ) {}

  // QUESTIONS

  @Public()
  @Get('questions')
  getQuestions(): Observable<QuestionDto[]> {
    return this.questionServiceClient.send(
      QuestionServiceApi.GET_QUESTIONS,
      {},
    );
  }

  @Public()
  @Post('questions')
  addQuestion(
    @Body('question') question: QuestionDto,
  ): Observable<QuestionDto> {
    return this.questionServiceClient.send(
      QuestionServiceApi.ADD_QUESTION,
      question,
    );
  }

  @Public()
  @Delete('questions/:id')
  deleteQuestionWithId(@Param('id') questionId: string): Observable<string> {
    return this.questionServiceClient.send(
      QuestionServiceApi.DELETE_QUESTION_WITH_ID,
      questionId,
    );
  }

  @Public()
  @Get('questions/:id')
  getQuestionWithId(@Param('id') questionId: string): Observable<QuestionDto> {
    return this.questionServiceClient.send(
      QuestionServiceApi.GET_QUESTION_WITH_ID,
      questionId,
    );
  }

  // DIFFICULTIES

  @Public()
  @Get('difficulties')
  getDifficulties(): Observable<DifficultyDto[]> {
    return this.questionServiceClient.send(
      QuestionServiceApi.GET_DIFFICULTIES,
      {},
    );
  }

  @Public()
  @Post('difficulties')
  addDifficulty(
    @Body('difficulty') difficulty: DifficultyDto,
  ): Observable<DifficultyDto> {
    return this.questionServiceClient.send(
      QuestionServiceApi.ADD_DIFFICULTY,
      difficulty,
    );
  }

  @Public()
  @Delete('difficulties/:id')
  deleteDifficultyWithId(
    @Param('id') difficultyId: string,
  ): Observable<string> {
    return this.questionServiceClient.send(
      QuestionServiceApi.DELETE_DIFFICULTY_WITH_ID,
      difficultyId,
    );
  }

  // CATEGORIES

  @Get('categories')
  getCategories(): Observable<CategoryDto[]> {
    return this.questionServiceClient.send(
      QuestionServiceApi.GET_CATEGORIES,
      {},
    );
  }

  @Public()
  @Post('categories')
  addCategory(
    @Body('category') category: CategoryDto,
  ): Observable<CategoryDto> {
    return this.questionServiceClient.send(
      QuestionServiceApi.ADD_CATEGORY,
      category,
    );
  }

  @Public()
  @Delete('categories/:id')
  deleteCategoryWithId(@Param('id') categoryId: string): Observable<string> {
    return this.questionServiceClient.send(
      QuestionServiceApi.DELETE_CATEGORY_WITH_ID,
      categoryId,
    );
  }
}
