import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LookingToMatchModel } from './database/models/lookingToMatch.model';
import { Mutex } from 'async-mutex';
import { MatchingService } from './matching.service';
import { MatchingServiceApi } from '@app/microservice/interservice-api/matching';

@Controller()
export class MatchingController {
  private mutex = new Mutex();

  constructor(private readonly matchingService: MatchingService) {}

  @MessagePattern(MatchingServiceApi.GET_MATCH)
  async getMatch(lookingToMatchEntry: Partial<LookingToMatchModel>) {
    const release = await this.mutex.acquire();
    await this.matchingService.findMatch(lookingToMatchEntry);
    release();
  }
}
