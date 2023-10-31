import {
  CreateHistoryAttemptRequest,
  CreateHistoryAttemptResponse,
  GetAttemptsByUsernameRequest,
  GetAttemptsByUsernameResponse,
  HistoryServiceController,
  HistoryServiceControllerMethods,
} from '@app/microservice/interfaces/history';
import { Controller } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller()
@HistoryServiceControllerMethods()
export class HistoryController implements HistoryServiceController {
  constructor(private readonly historyService: HistoryService) {}

  async createHistoryAttempt(
    createHistoryAttemptInfo: CreateHistoryAttemptRequest,
  ): Promise<CreateHistoryAttemptResponse> {
    return await this.historyService.createHistoryAttempt(
      createHistoryAttemptInfo,
    );
  }

  async getAttemptsByUsername(
    request: GetAttemptsByUsernameRequest,
  ): Promise<GetAttemptsByUsernameResponse> {
    return await this.historyService.GetAttemptsByUsername(request);
  }
}
