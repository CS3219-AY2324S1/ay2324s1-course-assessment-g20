import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { MatchingWsTicketModel } from '../../models/matchingWsTicket.model';
import { CreateTicketInfo } from 'apps/matching/types';

@Injectable()
export class MatchingWsTicketDaoService {
  constructor(
    @Inject('MatchingWsTicketModel')
    private matchingWsTicketModel: ModelClass<MatchingWsTicketModel>,
  ) {}

  private static getTicketExpiryTime() {
    const SIXTY_SECONDS = 1000 * 60;
    const time = new Date();
    time.setTime(time.getTime() + SIXTY_SECONDS);
    return time;
  }

  create(sessionInfo: CreateTicketInfo) {
    return this.matchingWsTicketModel.query().insert({
      userId: sessionInfo.userId,
      expiry: MatchingWsTicketDaoService.getTicketExpiryTime(),
    });
  }

  get(ticketId: string) {
    return this.matchingWsTicketModel.query().findById(ticketId);
  }

  delete(ticketId: string) {
    return this.matchingWsTicketModel.query().deleteById(ticketId);
  }
}
