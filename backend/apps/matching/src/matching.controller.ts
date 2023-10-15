import { Controller } from '@nestjs/common';
import { Mutex } from 'async-mutex';
import { MatchingService } from './matching.service';
import {
  MatchingEntry,
  MatchingServiceController,
  MatchingServiceControllerMethods,
} from '@app/microservice/interfaces/matching';

@Controller()
@MatchingServiceControllerMethods()
export class MatchingController implements MatchingServiceController {
  private mutex = new Mutex();

  constructor(private readonly matchingService: MatchingService) {}

  async requestMatch(matchingEntry: MatchingEntry) {
    const release = await this.mutex.acquire();
    await this.matchingService.findMatch(matchingEntry);
    release();
  }
}
