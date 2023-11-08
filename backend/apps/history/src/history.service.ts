import {
  COLLABORATION_SERVICE_NAME,
  CollaborationServiceClient,
} from '@app/microservice/interfaces/collaboration';
import { Service } from '@app/microservice/services';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { HistoryDaoService } from './database/daos/history/history.dao.service';
import { CreateHistoryAttemptRequest } from '@app/microservice/interfaces/history';
import { firstValueFrom } from 'rxjs';
import { AttemptDaoService } from './database/daos/attempt/attempt.dao.service';
import { UserProfileServiceClient } from '@app/microservice/interfaces/user';
import { USER_PROFILE_SERVICE_NAME } from '../../../libs/microservice/src/interfaces/user';
import { PeerprepException } from '@app/utils';
import { PEERPREP_EXCEPTION_TYPES } from '@app/types/exceptions';
import { ID } from '@app/microservice/interfaces/common';

@Injectable()
export class HistoryService implements OnModuleInit {
  private userProfileService: UserProfileServiceClient;
  private collabService: CollaborationServiceClient;

  constructor(
    @Inject(Service.USER_SERVICE)
    private readonly userProfileServiceClient: ClientGrpc,
    @Inject(Service.COLLABORATION_SERVICE)
    private readonly collabServiceClient: ClientGrpc,
    private readonly historyDaoService: HistoryDaoService,
    private readonly attemptDaoService: AttemptDaoService,
  ) {}

  onModuleInit() {
    this.userProfileService =
      this.userProfileServiceClient.getService<UserProfileServiceClient>(
        USER_PROFILE_SERVICE_NAME,
      );
    this.collabService =
      this.collabServiceClient.getService<CollaborationServiceClient>(
        COLLABORATION_SERVICE_NAME,
      );
  }

  async createHistoryAttempt(
    createHistoryAttemptInfo: CreateHistoryAttemptRequest,
  ) {
    const { sessionId } = createHistoryAttemptInfo;

    // Get questionId
    const questionId = await this.validateSessionIdAndGetQuestionId(sessionId);

    // Get userIds
    const userIds = await this.getUserIdsFromSessionId(sessionId);

    // Create history for each user
    return await Promise.all(
      userIds.map((userId) =>
        this.createHistoryForUser(userId, sessionId, questionId),
      ),
    ).then((historiesCreated) => {
      return { histories: historiesCreated };
    });
  }

  private async validateSessionIdAndGetQuestionId(sessionId: string) {
    const questionId = await firstValueFrom(
      this.collabService.getQuestionIdFromSessionId({
        id: sessionId,
      }),
    ).then(({ questionId }) => questionId);

    if (!questionId) {
      throw new PeerprepException(
        'Invalid sessionId provided!',
        PEERPREP_EXCEPTION_TYPES.BAD_REQUEST,
      );
    }

    return questionId;
  }

  private async getUserIdsFromSessionId(sessionId: string) {
    return firstValueFrom(
      this.collabService.getUserIdsFromSessionId({ id: sessionId }),
    ).then(({ userIds }) => userIds.map(({ userId }) => userId));
  }

  private async createHistoryForUser(
    userId: string,
    sessionId: string,
    questionId: string,
  ) {
    let history = await this.historyDaoService.findByUserId(userId);

    if (!history) {
      history = await this.historyDaoService.create(userId);
    }

    if (
      !(await this.attemptDaoService.existsByHistoryIdAndSessionId(
        history.id,
        sessionId,
      ))
    ) {
      await this.attemptDaoService.createAttempt({
        historyId: history.id,
        sessionId,
        questionId,
      });
    }

    return history;
  }

  async getAttemptsByUserId(request: ID) {
    const history = await this.historyDaoService.findByUserId(request.id);

    if (!history) {
      throw new PeerprepException(
        'Invalid userId provided!',
        PEERPREP_EXCEPTION_TYPES.BAD_REQUEST,
      );
    }

    return await this.attemptDaoService
      .findByHistoryId(history.id)
      .then((attempts) => ({ attempts }));
  }
}
