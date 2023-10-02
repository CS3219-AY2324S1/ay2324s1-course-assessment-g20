import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MatchingServiceApi } from '@app/interservice-api/matching';
import { LookingToMatchModel } from './database/models/lookingToMatch.model';
import { Mutex } from 'async-mutex';
import { MatchingService } from './matching.service';
import { CreateTicketInfo } from '../types';

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

  @MessagePattern(MatchingServiceApi.GET_WS_TICKET)
  getWsTicket(sessionInfo: CreateTicketInfo) {
    return this.matchingService.createWsTicket(sessionInfo);
  }

  @MessagePattern(MatchingServiceApi.CONSUME_WS_TICKET)
  consumeWsTicket(ticketId: string) {
    return this.matchingService.consumeWsTicket(ticketId);
  }
}
