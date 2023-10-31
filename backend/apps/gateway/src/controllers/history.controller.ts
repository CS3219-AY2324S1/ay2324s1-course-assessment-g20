import {
  HISTORY_SERVICE_NAME,
  HistoryServiceClient,
} from '@app/microservice/interfaces/history';
import { Service } from '@app/microservice/services';
import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { map } from 'rxjs';

@Controller('history')
export class HistoryController implements OnModuleInit {
  private historyService: HistoryServiceClient;

  constructor(
    @Inject(Service.HISTORY_SERVICE)
    private historyServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.historyService =
      this.historyServiceClient.getService<HistoryServiceClient>(
        HISTORY_SERVICE_NAME,
      );
  }

  @Get('create')
  createHistoryAttempt() {
    return this.historyService.createHistoryAttempt({
      sessionId: 'fb72fb0b-4131-4f52-87d5-180f5d6a21df',
      questionAttempt: 'test',
    });
  }

  @Get('attempts')
  GetAttemptsByUsername() {
    return this.historyService
      .getAttemptsByUsername({
        username: 'bryann',
      })
      .pipe(map(({ attempts }) => attempts || []));
  }
}
