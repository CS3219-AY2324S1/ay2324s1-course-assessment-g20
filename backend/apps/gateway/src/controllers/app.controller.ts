import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Public } from '../jwt/jwtPublic.decorator';
import QuestionDto from '../dtos/question/question.dto';
import DifficultyDto from '../dtos/question/difficulty.dto';
import CategoryDto from '../dtos/question/category.dto';
import { Service } from '@app/microservice/interservice-api/services';
import { QuestionServiceApi } from '@app/microservice/interservice-api/question';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@app/types/roles';

@Controller('question')
export class AppController {
  constructor(
    @Inject(Service.QUESTION_SERVICE)
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

  @Post('questions')
  @Roles(Role.MAINTAINER)
  addQuestion(
    @Body('question') question: QuestionDto,
  ): Observable<QuestionDto> {
    return this.questionServiceClient.send(
      QuestionServiceApi.ADD_QUESTION,
      question,
    );
  }

  @Delete('questions/:id')
  @Roles(Role.MAINTAINER)
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

  @Post('difficulties')
  @Roles(Role.MAINTAINER)
  addDifficulty(
    @Body('difficulty') difficulty: DifficultyDto,
  ): Observable<DifficultyDto> {
    return this.questionServiceClient.send(
      QuestionServiceApi.ADD_DIFFICULTY,
      difficulty,
    );
  }

  @Delete('difficulties/:id')
  @Roles(Role.MAINTAINER)
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

  @Post('categories')
  @Roles(Role.MAINTAINER)
  addCategory(
    @Body('category') category: CategoryDto,
  ): Observable<CategoryDto> {
    return this.questionServiceClient.send(
      QuestionServiceApi.ADD_CATEGORY,
      category,
    );
  }

  @Delete('categories/:id')
  @Roles(Role.MAINTAINER)
  deleteCategoryWithId(@Param('id') categoryId: string): Observable<string> {
    return this.questionServiceClient.send(
      QuestionServiceApi.DELETE_CATEGORY_WITH_ID,
      categoryId,
    );
  }
}
