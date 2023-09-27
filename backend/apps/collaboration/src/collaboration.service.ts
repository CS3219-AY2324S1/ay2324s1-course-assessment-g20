import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSessionInfo, CreateSessionTicketInfo } from './types';
import { SessionModel } from './database/models/session.model';
import { CollabSessionWsTicketDaoService } from './database/daos/collabSessionWsTicket/collabSessionWsTicket.dao.service';
import { SessionDaoService } from './database/daos/session/session.dao.service';
import { BaseModel } from '@app/sql-database';

@Injectable()
export class CollaborationService {
  constructor(
    private readonly collabSessionWsTicketDaoService: CollabSessionWsTicketDaoService,
    private readonly sessionDaoService: SessionDaoService,
  ) {}

  createCollabSession(createSessionInfo: CreateSessionInfo) {
    const graphInfo: Omit<SessionModel, keyof BaseModel> = {
      ...createSessionInfo,
      userIds: createSessionInfo.userIds.map((userId) => ({ userId })),
    };
    return this.sessionDaoService.create(graphInfo);
  }

  getCollabSessionWsTicket(sessionInfo: CreateSessionTicketInfo) {
    return this.collabSessionWsTicketDaoService.create(sessionInfo);
  }

  async consumeWsTicket(ticketId: string) {
    const ticket = await this.collabSessionWsTicketDaoService.get(ticketId);
    if (!ticket) {
      throw new BadRequestException('Invalid ticket!');
    }
    return ticket;
  }
}
