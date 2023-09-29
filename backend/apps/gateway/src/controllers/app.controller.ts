import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Public } from '../jwt/jwtPublic.decorator';
import { QuestionServiceApi } from '@app/interservice-api/question';
import { Service } from '@app/interservice-api/services';

@Controller()
export class AppController {
  constructor(
    @Inject(Service.QUESTION_SERVICE)
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
