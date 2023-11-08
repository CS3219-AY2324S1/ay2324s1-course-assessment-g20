import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SessionDaoService } from './database/daos/session/session.dao.service';
import { ClientGrpc } from '@nestjs/microservices';
import { Service } from '@app/microservice/services';
import { SessionModel } from './database/models/session.model';
import {
  CreateCollabSessionRequest,
  GetAttemptTextFromSessionIdResponse,
  GetQuestionIdFromSessionIdResponse,
  GetSessionOrTicketRequest,
  GetUserIdsFromSessionIdResponse,
  SetSessionLanguageIdRequest,
} from '@app/microservice/interfaces/collaboration';
import {
  USER_AUTH_SERVICE_NAME,
  UserAuthServiceClient,
  USER_PROFILE_SERVICE_NAME,
  UserProfileServiceClient,
  UserLanguageServiceClient,
  USER_LANGUAGE_SERVICE_NAME,
} from '@app/microservice/interfaces/user';
import {
  QUESTION_SERVICE_NAME,
  QuestionServiceClient,
} from '@app/microservice/interfaces/question';
import { firstValueFrom } from 'rxjs';
import { ID } from '@app/microservice/interfaces/common';
import { PEERPREP_EXCEPTION_TYPES } from '@app/types/exceptions';
import { PeerprepException } from '@app/utils/exceptionFilter/peerprep.exception';
import { Redis } from 'ioredis';
import { CollaborationEvent } from '@app/microservice/events-api/collaboration';
import { ConfigService } from '@nestjs/config';
import { MongodbPersistence } from 'y-mongodb-provider';

@Injectable()
export class CollaborationService implements OnModuleInit {
  private userAuthService: UserAuthServiceClient;
  private questionService: QuestionServiceClient;
  private userProfileService: UserProfileServiceClient;
  private languageService: UserLanguageServiceClient;
  private mdb: MongodbPersistence;

  constructor(
    @Inject(Service.USER_SERVICE)
    private readonly userServiceClient: ClientGrpc,
    @Inject(Service.QUESTION_SERVICE)
    private readonly questionServiceClient: ClientGrpc,
    private readonly sessionDaoService: SessionDaoService,
    private readonly configService: ConfigService,
  ) {
    const mongoUri = configService.getOrThrow('mongoUri');
    this.mdb = new MongodbPersistence(mongoUri, {
      flushSize: 100,
      multipleCollections: true,
    });
  }

  onModuleInit() {
    this.userAuthService =
      this.userServiceClient.getService<UserAuthServiceClient>(
        USER_AUTH_SERVICE_NAME,
      );
    this.userProfileService =
      this.userServiceClient.getService<UserProfileServiceClient>(
        USER_PROFILE_SERVICE_NAME,
      );
    this.questionService =
      this.questionServiceClient.getService<QuestionServiceClient>(
        QUESTION_SERVICE_NAME,
      );
    this.languageService =
      this.userServiceClient.getService<UserLanguageServiceClient>(
        USER_LANGUAGE_SERVICE_NAME,
      );
  }

  async createCollabSession(createSessionInfo: CreateCollabSessionRequest) {
    this.validateNumUsers(createSessionInfo.userIds, 2);
    await this.validateUsersExist(createSessionInfo.userIds);

    const userOneLanguage = (
      await firstValueFrom(
        this.userProfileService.getUserProfileById({
          id: createSessionInfo.userIds[0],
        }),
      )
    ).preferredLanguageId;
    const userTwoLanguage = (
      await firstValueFrom(
        this.userProfileService.getUserProfileById({
          id: createSessionInfo.userIds[1],
        }),
      )
    ).preferredLanguageId;

    let languageId: number;
    // if not same language, randomly pick one
    if (userOneLanguage !== userTwoLanguage) {
      const random = Math.random();
      if (random < 0.5) {
        languageId = userTwoLanguage;
      } else {
        languageId = userOneLanguage;
      }
    } else {
      languageId = userOneLanguage;
    }

    const graphInfo = {
      ...createSessionInfo,
      userIds: createSessionInfo.userIds.map((userId) => ({ userId })),
      languageId,
    };

    return this.sessionDaoService.create(graphInfo);
  }

  async setSessionLanguageId(request: SetSessionLanguageIdRequest) {
    await this.validatedUserInExistingSession(request);

    await this.sessionDaoService.setSessionLanguageId(request);

    // Initiate client reconnection, which reads updated session language
    Redis.createClient().publish(
      CollaborationEvent.LANGUAGE_CHANGE,
      request.sessionId,
    );
  }

  async getLanguageIdFromSessionId(sessionId: string) {
    const session = await this.sessionDaoService.findById({
      sessionId,
      withGraphFetched: false,
    });

    if (!session) {
      throw new PeerprepException(
        'Invalid session!',
        PEERPREP_EXCEPTION_TYPES.BAD_REQUEST,
      );
    }

    return firstValueFrom(
      this.languageService.getLanguageById({ id: session.languageId }),
    );
  }

  async getQuestionIdFromSessionId(
    request: ID,
  ): Promise<GetQuestionIdFromSessionIdResponse> {
    return this.sessionDaoService.getQuestionIdFromSession(request.id);
  }

  async getSession(getSessionInfo: GetSessionOrTicketRequest) {
    const { session } = await this.validatedUserInExistingSession(
      getSessionInfo,
    );

    const question = await firstValueFrom(
      this.questionService.getQuestionWithId({
        id: session.questionId,
      }),
    );

    return {
      question,
    };
  }

  async createSessionTicket(getSessionTicketInfo: GetSessionOrTicketRequest) {
    await this.validatedUserInExistingSession(getSessionTicketInfo);

    const ticket = await firstValueFrom(
      this.userAuthService.generateWebsocketTicket({
        userId: getSessionTicketInfo.userId,
      }),
    );

    // Link ticket to session
    await this.sessionDaoService.insertTicketForSession(
      getSessionTicketInfo.sessionId,
      ticket.id,
    );

    return {
      ticket: ticket.id,
    };
  }

  getSessionIdFromTicket(ticketId: string) {
    return this.sessionDaoService.getSessionIdFromTicket(ticketId);
  }

  private async validatedUserInExistingSession(userAndSession: {
    userId: string;
    sessionId: string;
  }) {
    const session = await this.getAndValidateSessionExists(
      userAndSession.sessionId,
    );
    await this.validateUsersExist([userAndSession.userId]);
    this.validateUsersBelongInSession(session, [userAndSession.userId]);

    return { session };
  }

  private async getAndValidateSessionExists(sessionId: string) {
    const session = await this.sessionDaoService.findById({
      sessionId,
      withGraphFetched: true,
    });

    if (!session) {
      throw new PeerprepException(
        'Invalid session!',
        PEERPREP_EXCEPTION_TYPES.BAD_REQUEST,
      );
    }

    return session;
  }

  private validateNumUsers(userIds: string[], expectedNumber: number) {
    if (userIds.length !== expectedNumber) {
      throw new PeerprepException(
        `You must provide exactly ${expectedNumber} userIds to start a session for!`,
        PEERPREP_EXCEPTION_TYPES.BAD_REQUEST,
      );
    }
  }

  private async validateUsersExist(userIds: string[]) {
    const validateBothUsers = await firstValueFrom(
      this.userAuthService.validateUsersExists({ ids: userIds }),
    ).then(({ value }) => value);

    if (!validateBothUsers) {
      throw new PeerprepException(
        'Invalid userId(s) provided!',
        PEERPREP_EXCEPTION_TYPES.BAD_REQUEST,
      );
    }
  }

  private validateUsersBelongInSession(
    session: SessionModel,
    userIds: string[],
  ) {
    const sessionUsers = session.userIds.map((u) => u.userId);
    const validateUsersBelongInSession = userIds.every((userId) =>
      sessionUsers.includes(userId),
    );

    if (!validateUsersBelongInSession) {
      throw new PeerprepException(
        'User does not belong to this session!',
        PEERPREP_EXCEPTION_TYPES.FORBIDDEN,
      );
    }
  }

  getUserIdsFromSessionId(
    request: ID,
  ): Promise<GetUserIdsFromSessionIdResponse> {
    return this.sessionDaoService
      .getUserIdsFromSession(request.id)
      .then((userIds: { userId: string }[] | void) => {
        if (!userIds)
          throw new PeerprepException(
            'Invalid sessionId provided!',
            PEERPREP_EXCEPTION_TYPES.BAD_REQUEST,
          );

        return { userIds: userIds.map((u) => ({ userId: u.userId })) };
      });
  }

  getAttemptTextFromSessionId(
    request: ID,
  ): Promise<GetAttemptTextFromSessionIdResponse> {
    return this.mdb
      .getYDoc(request.id)
      .then((ydoc) => ({ attemptText: ydoc.getText('monaco').toString() }));
  }
}
