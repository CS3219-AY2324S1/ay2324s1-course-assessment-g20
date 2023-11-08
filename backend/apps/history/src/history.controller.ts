import {
  CreateHistoryAttemptRequest,
  HistoryServiceController,
  HistoryServiceControllerMethods,
} from '@app/microservice/interfaces/history';
import { Controller } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ID } from '@app/microservice/interfaces/common';

@Controller()
@HistoryServiceControllerMethods()
export class HistoryController implements HistoryServiceController {
  constructor(private readonly historyService: HistoryService) {}

  async createHistoryAttempt(
    createHistoryAttemptInfo: CreateHistoryAttemptRequest,
  ) {
    return await this.historyService.createHistoryAttempt(
      createHistoryAttemptInfo,
    );
  }

  async getAttemptsByUserId(request: ID) {
    return await this.historyService.getAttemptsByUserId(request);
  }
}
