import {
  HistoryServiceController,
  HistoryServiceControllerMethods,
} from '@app/microservice/interfaces/history';
import { Controller } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller()
@HistoryServiceControllerMethods()
export class HistoryController implements HistoryServiceController {
  constructor(private readonly historyService: HistoryService) {}

  createHistoryAttempt() {
    this.historyService.createHistoryAttempt();
  }
}
