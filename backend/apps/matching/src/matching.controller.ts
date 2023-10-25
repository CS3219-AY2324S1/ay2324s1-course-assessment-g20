import { Controller } from '@nestjs/common';
import { MatchingService } from './matching.service';
import {
  MatchingEntry,
  MatchingServiceController,
  MatchingServiceControllerMethods,
} from '@app/microservice/interfaces/matching';
import { ID } from '@app/microservice/interfaces/common';

@Controller()
@MatchingServiceControllerMethods()
export class MatchingController implements MatchingServiceController {
  constructor(private readonly matchingService: MatchingService) {}

  async requestMatch(matchingEntry: MatchingEntry) {
    await this.matchingService.findMatch(matchingEntry);
  }

  async deleteMatchEntryByUserId({ id }: ID) {
    await this.matchingService.deleteEntry(id);
  }
}
