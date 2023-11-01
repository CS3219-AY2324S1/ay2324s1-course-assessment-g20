import {
  HISTORY_SERVICE_NAME,
  HistoryServiceClient,
} from '@app/microservice/interfaces/history';
import { Service } from '@app/microservice/services';
import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { map } from 'rxjs';
import HistoryAttemptDto from '../dtos/history/historyAttempt.dto';

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

  @Post('attempts')
  createHistoryAttempt(@Body('attempt') attempt: HistoryAttemptDto) {
    return this.historyService.createHistoryAttempt(attempt);
  }

  @Get('attempts/:username')
  GetAttemptsByUsername(@Param('username') username: string) {
    return this.historyService
      .getAttemptsByUsername({
        username: username,
      })
      .pipe(map(({ attempts }) => attempts || []));
  }
}
