import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Public } from '../jwt/jwtPublic.decorator';
import {
  QUESTION_SERVICE,
  QuestionServiceApi,
} from '@app/interservice-api/question';

@Controller()
export class AppController {
  constructor(
    @Inject(QUESTION_SERVICE)
    private readonly questionServiceClient: ClientProxy,
  ) {}

  @Public()
  @Get()
  getHello(): Observable<string> {
    return this.questionServiceClient.send(QuestionServiceApi.GET_HELLO, {});
  }

  @Get('ping-auth')
  pingAuth(): Observable<string> {
    return this.questionServiceClient.send(QuestionServiceApi.GET_HELLO, {});
  }
}
