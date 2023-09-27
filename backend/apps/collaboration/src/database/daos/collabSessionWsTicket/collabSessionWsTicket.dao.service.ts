import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CollabSessionWsTicketModel } from '../../models/collabSessionWsTicket.model';
import { CreateSessionTicketInfo } from 'apps/collaboration/src/types';

@Injectable()
export class CollabSessionWsTicketDaoService {
  constructor(
    @Inject('CollabSessionWsTicketModel')
    private collabSessionWsTicketModel: ModelClass<CollabSessionWsTicketModel>,
  ) {}

  private static getTicketExpiryTime() {
    const SIXTY_SECONDS = 1000 * 60;
    const time = new Date();
    time.setTime(time.getTime() + SIXTY_SECONDS);
    return time;
  }

  create(sessionInfo: CreateSessionTicketInfo) {
    return this.collabSessionWsTicketModel.query().insert({
      userId: sessionInfo.userId,
      sessionId: sessionInfo.sessionId,
      expiry: CollabSessionWsTicketDaoService.getTicketExpiryTime(),
    });
  }

  get(ticketId: string) {
    return this.collabSessionWsTicketModel.query().findById(ticketId);
  }

  delete(ticketId: string) {
    return this.collabSessionWsTicketModel.query().deleteById(ticketId);
  }
}
