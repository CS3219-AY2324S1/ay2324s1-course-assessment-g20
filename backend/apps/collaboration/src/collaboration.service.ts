import { Inject, Injectable } from '@nestjs/common';
import { SessionDaoService } from './database/daos/session/session.dao.service';
import { ClientProxy } from '@nestjs/microservices';
import { QuestionServiceApi } from '@app/interservice-api/question';
import { firstValueFrom } from 'rxjs';
import {
  CreateSessionInfo,
  GetSessionAndTicketInfo,
} from '@app/interservice-api/collaboration';
import { Service } from '@app/interservice-api/services';
import {
  CreateWebsocketTicketInfo,
  UserServiceApi,
  WebsocketTicket,
} from '@app/interservice-api/user';

@Injectable()
export class CollaborationService {
  constructor(
    @Inject(Service.USER_SERVICE)
    private readonly userServiceClient: ClientProxy,
    @Inject(Service.QUESTION_SERVICE)
    private readonly questionServiceClient: ClientProxy,
    private readonly sessionDaoService: SessionDaoService,
  ) {}

  createCollabSession(createSessionInfo: CreateSessionInfo) {
    const graphInfo = {
      ...createSessionInfo,
      userIds: createSessionInfo.userIds.map((userId) => ({ userId })),
    };
    return this.sessionDaoService.create(graphInfo);
  }

  async getSessionAndCreateWsTicket(getSessionInfo: GetSessionAndTicketInfo) {
    const session = await this.sessionDaoService.findById(
      getSessionInfo.sessionId,
    );
    const question = await firstValueFrom(
      this.questionServiceClient.send(
        QuestionServiceApi.GET_QUESTION_WITH_ID,
        session.questionId,
      ),
    );

    const ticket = await firstValueFrom(
      this.userServiceClient.send<WebsocketTicket, CreateWebsocketTicketInfo>(
        UserServiceApi.GENERATE_WEBSOCKET_TICKET,
        {
          userId: getSessionInfo.userId,
        },
      ),
    );

    // Link ticket to session
    await this.sessionDaoService.insertTicketForSession(
      getSessionInfo.sessionId,
      ticket.id,
    );

    return {
      question,
      ticket: ticket.id,
    };
  }

  getSessionIdFromTicket(ticketId: string) {
    return this.sessionDaoService.getSessionIdFromTicket(ticketId);
  }
}
