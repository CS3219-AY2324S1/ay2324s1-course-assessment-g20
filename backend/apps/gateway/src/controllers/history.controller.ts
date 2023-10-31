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

  @Get('create')
  createHistoryAttempt() {
    return this.historyService.createHistoryAttempt();
  }
}
