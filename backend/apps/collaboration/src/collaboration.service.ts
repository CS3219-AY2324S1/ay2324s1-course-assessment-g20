import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { SessionDaoService } from './database/daos/session/session.dao.service';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateSessionInfo,
  GetSessionAndTicketInfo,
} from '@app/microservice/interservice-api/collaboration';
import { Service } from '@app/microservice/interservice-api/services';
import { SessionModel } from './database/models/session.model';
import { AuthController as UserAuthService } from 'apps/user/src/auth/auth.controller';
import { QuestionController as QuestionService } from 'apps/question/src/question.controller';
import { getPromisifiedGrpcService } from '@app/microservice/utils';

@Injectable()
export class CollaborationService implements OnModuleInit {
  private userAuthService: UserAuthService;
  private questionService: QuestionService;

  constructor(
    @Inject(Service.USER_SERVICE)
    private readonly userServiceClient: ClientGrpc,
    @Inject(Service.QUESTION_SERVICE)
    private readonly questionServiceClient: ClientGrpc,
    private readonly sessionDaoService: SessionDaoService,
  ) {}

  onModuleInit() {
    this.userAuthService = getPromisifiedGrpcService<UserAuthService>(
      this.userServiceClient,
      'UserAuthService',
    );
    this.questionService = getPromisifiedGrpcService<QuestionService>(
      this.questionServiceClient,
      'QuestionService',
    );
  }

  async createCollabSession(createSessionInfo: CreateSessionInfo) {
    this.validateNumUsers(createSessionInfo.userIds, 2);
    await this.validateUsersExist(createSessionInfo.userIds);

    const graphInfo = {
      ...createSessionInfo,
      userIds: createSessionInfo.userIds.map((userId) => ({ userId })),
    };

    return this.sessionDaoService.create(graphInfo);
  }

  async getSessionAndCreateWsTicket(getSessionInfo: GetSessionAndTicketInfo) {
    const session = await this.sessionDaoService.findById({
      sessionId: getSessionInfo.sessionId,
      withGraphFetched: true,
    });

    await this.validateUsersExist([getSessionInfo.userId]);
    this.validateUsersBelongInSession(session, [getSessionInfo.userId]);

    const question = await this.questionService.getQuestionWithId({
      id: session.questionId,
    });

    const ticket = await this.userAuthService.generateWebsocketTicket({
      userId: getSessionInfo.userId,
    });

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
    const validateBothUsers = await this.userAuthService
      .validateUsersExists({ ids: userIds })
      .then(({ value }) => value);

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
