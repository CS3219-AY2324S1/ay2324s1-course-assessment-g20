import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateSessionInfo, CreateSessionTicketInfo } from './types';
import { SessionModel } from './database/models/session.model';
import { CollabSessionWsTicketDaoService } from './database/daos/collabSessionWsTicket/collabSessionWsTicket.dao.service';
import { SessionDaoService } from './database/daos/session/session.dao.service';
import { BaseModel } from '@app/sql-database';
import { ClientProxy } from '@nestjs/microservices';
import {
  QUESTION_SERVICE,
  QuestionServiceApi,
} from '@app/interservice-api/question';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CollaborationService {
  constructor(
    @Inject(QUESTION_SERVICE)
    private readonly questionServiceClient: ClientProxy,
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

  async getSessionAndCreateWsTicket(sessionInfo: CreateSessionTicketInfo) {
    const session = await this.sessionDaoService.findById(
      sessionInfo.sessionId,
    );
    const question = await firstValueFrom(
      this.questionServiceClient.send(
        QuestionServiceApi.GET_QUESTION_WITH_ID,
        session.questionId,
      ),
    );
    const ticket = await this.collabSessionWsTicketDaoService.create(
      sessionInfo,
    );
    return {
      question,
      ticket: ticket.id,
    };
  }

  async consumeWsTicket(ticketId: string) {
    const ticket = await this.collabSessionWsTicketDaoService.get(ticketId);
    if (!ticket) {
      throw new BadRequestException('Invalid ticket!');
    }
    return ticket;
  }
}
