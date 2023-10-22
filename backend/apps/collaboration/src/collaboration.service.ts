import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { SessionDaoService } from './database/daos/session/session.dao.service';
import { ClientGrpc } from '@nestjs/microservices';
import { Service } from '@app/microservice/services';
import { SessionModel } from './database/models/session.model';
import {
  CreateCollabSessionRequest,
  GetQuestionIdFromSessionIdResponse,
  GetSessionAndWsTicketRequest,
} from '@app/microservice/interfaces/collaboration';
import {
  USER_AUTH_SERVICE_NAME,
  UserAuthServiceClient,
} from '@app/microservice/interfaces/user';
import {
  QUESTION_SERVICE_NAME,
  QuestionServiceClient,
} from '@app/microservice/interfaces/question';
import { firstValueFrom } from 'rxjs';
import { ID } from '@app/microservice/interfaces/common';

@Injectable()
export class CollaborationService implements OnModuleInit {
  private userAuthService: UserAuthServiceClient;
  private questionService: QuestionServiceClient;

  constructor(
    @Inject(Service.USER_SERVICE)
    private readonly userServiceClient: ClientGrpc,
    @Inject(Service.QUESTION_SERVICE)
    private readonly questionServiceClient: ClientGrpc,
    private readonly sessionDaoService: SessionDaoService,
  ) { }

  onModuleInit() {
    this.userAuthService =
      this.userServiceClient.getService<UserAuthServiceClient>(
        USER_AUTH_SERVICE_NAME,
      );
    this.questionService =
      this.questionServiceClient.getService<QuestionServiceClient>(
        QUESTION_SERVICE_NAME,
      );
  }

  async createCollabSession(createSessionInfo: CreateCollabSessionRequest) {
    this.validateNumUsers(createSessionInfo.userIds, 2);
    await this.validateUsersExist(createSessionInfo.userIds);

    const graphInfo = {
      ...createSessionInfo,
      userIds: createSessionInfo.userIds.map((userId) => ({ userId })),
    };

    return this.sessionDaoService.create(graphInfo);
  }

  async getQuestionIdFromSessionId(request: ID): Promise<GetQuestionIdFromSessionIdResponse> {
    return this.sessionDaoService.getQuestionIdFromSession(request.id)
  }

  async getSessionAndCreateWsTicket(
    getSessionInfo: GetSessionAndWsTicketRequest,
  ) {
    const session = await this.sessionDaoService.findById({
      sessionId: getSessionInfo.sessionId,
      withGraphFetched: true,
    });

    if (!session) {
      throw new BadRequestException('Invalid session!');
    }

    await this.validateUsersExist([getSessionInfo.userId]);
    this.validateUsersBelongInSession(session, [getSessionInfo.userId]);

    const question = await firstValueFrom(
      this.questionService.getQuestionWithId({
        id: session.questionId,
      }),
    );

    const ticket = await firstValueFrom(
      this.userAuthService.generateWebsocketTicket({
        userId: getSessionInfo.userId,
      }),
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

  private validateNumUsers(userIds: string[], expectedNumber: number) {
    if (userIds.length !== expectedNumber) {
      throw new BadRequestException(
        `You must provide exactly ${expectedNumber} userIds to start a session for!`,
      );
    }
  }

  private async validateUsersExist(userIds: string[]) {
    const validateBothUsers = await firstValueFrom(
      this.userAuthService.validateUsersExists({ ids: userIds }),
    ).then(({ value }) => value);

    if (!validateBothUsers) {
      throw new BadRequestException('Invalid userId(s) provided!');
    }
  }

  private validateUsersBelongInSession(
    session: SessionModel,
    userIds: string[],
  ) {
    const sessionUsers = session.userIds.map((u) => u.userId);
    return userIds.every((userId) => sessionUsers.includes(userId));
  }
}
