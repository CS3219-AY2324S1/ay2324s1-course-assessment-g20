import {
  HISTORY_SERVICE_NAME,
  HistoryServiceClient,
} from '@app/microservice/interfaces/history';
import { Service } from '@app/microservice/services';
import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

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

  @Get('')
  createHistoryAttempt() {
    return this.historyService.createHistoryAttempt({
      sessionId: 'a4f7aa88-72d6-40cd-9bf8-ae77d646dabf',
      questionAttempt: 'test',
    });
  }
}
