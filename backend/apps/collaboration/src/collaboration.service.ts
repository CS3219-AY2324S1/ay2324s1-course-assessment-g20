import { Inject, Injectable } from '@nestjs/common';
import { SessionDaoService } from './database/daos/session/session.dao.service';
import { ClientProxy } from '@nestjs/microservices';
import {
  QUESTION_SERVICE,
  QuestionServiceApi,
} from '@app/interservice-api/question';
import { firstValueFrom } from 'rxjs';
import {
  AUTH_SERVICE,
  AuthServiceApi,
  CreateWebsocketTicketInfo,
  WebsocketTicket,
} from '@app/interservice-api/auth';
import {
  CreateSessionInfo,
  GetSessionAndTicketInfo,
} from '@app/interservice-api/collaboration';

@Injectable()
export class CollaborationService {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authServiceClient: ClientProxy,
    @Inject(QUESTION_SERVICE)
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
      this.authServiceClient.send<WebsocketTicket, CreateWebsocketTicketInfo>(
        AuthServiceApi.GENERATE_WEBSOCKET_TICKET,
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
