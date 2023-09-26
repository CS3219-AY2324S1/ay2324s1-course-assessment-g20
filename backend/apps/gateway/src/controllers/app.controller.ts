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
import {
  QUESTION_SERVICE,
  QuestionServiceApi,
} from '@app/interservice-api/question';
import QuestionDto from '../dtos/question/question.dto';

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
    return this.questionServiceClient.send('get_questions', {});
  }

  @Public()
  @Post('questions')
  addQuestion(
    @Body('question') question: QuestionDto,
  ): Observable<QuestionDto> {
    return this.questionServiceClient.send('add_question', question);
  }

  @Public()
  @Get(':id')
  getQuestionWithId(@Param('id') questionId: string): Observable<QuestionDto> {
    return this.questionServiceClient.send('get_question_with_id', questionId);
  }

  @Public()
  @Delete(':id')
  deleteQuestionWithId(@Param('id') questionId: string): Observable<string> {
    return this.questionServiceClient.send(
      'delete_question_with_id',
      questionId,
    );
  }

  // DIFFICULTIES

  @Public()
  @Get('difficulties')
  getDifficulties(): Observable<string> {
    return this.questionServiceClient.send('get_difficulties', {});
  }

  // CATEGORIES

  @Get('categories')
  getCategories(): Observable<string> {
    return this.questionServiceClient.send('get_categories', {});
  }
}
