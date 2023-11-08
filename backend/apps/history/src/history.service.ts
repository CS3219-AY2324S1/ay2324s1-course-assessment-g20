import {
  COLLABORATION_SERVICE_NAME,
  CollaborationServiceClient,
} from '@app/microservice/interfaces/collaboration';
import { Service } from '@app/microservice/services';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { HistoryDaoService } from './database/daos/history/history.dao.service';
import {
  CreateHistoryAttemptRequest,
  GetAttemptsByUsernameRequest,
} from '@app/microservice/interfaces/history';
import { firstValueFrom } from 'rxjs';
import { AttemptDaoService } from './database/daos/attempt/attempt.dao.service';
import { UserProfileServiceClient } from '@app/microservice/interfaces/user';
import { USER_PROFILE_SERVICE_NAME } from '../../../libs/microservice/src/interfaces/user';
import { PeerprepException } from '@app/utils';
import { PEERPREP_EXCEPTION_TYPES } from '@app/types/exceptions';

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
    const { sessionId, questionAttempt } = createHistoryAttemptInfo;

    // Get questionId
    const questionId = await this.validateSessionIdAndGetQuestionId(sessionId);

    // Get usernames
    const usernames = await this.getUsernamesFromSessionId(sessionId);

    // Get language
    const languageId = await firstValueFrom(
      this.collabService.getLanguageIdFromSessionId({
        id: sessionId,
      }),
    ).then(({ id }) => id);

    // Create history for each user
    return await Promise.all(
      usernames.map((username) =>
        this.createHistoryForUser(
          username,
          languageId,
          questionId,
          questionAttempt,
        ),
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

  private async getUsernamesFromSessionId(sessionId: string) {
    const userIds = await firstValueFrom(
      this.collabService.getUserIdsFromSessionId({ id: sessionId }),
    ).then(({ userIds }) => userIds.map(({ userId }) => userId));

    return await Promise.all(
      userIds.map(async (userId) => {
        return firstValueFrom(
          this.userProfileService.getUserProfileById({ id: userId }),
        ).then(({ username }) => username);
      }),
    );
  }

  private async createHistoryForUser(
    username: string,
    languageId: number,
    questionId: string,
    questionAttempt: string,
  ) {
    let history = await this.historyDaoService.findByUsername(username);

    if (!history) {
      history = await this.historyDaoService.create(username);
    }

    await this.attemptDaoService.createAttempt({
      historyId: history.id,
      languageId,
      questionId,
      questionAttempt,
    });

    return history;
  }

  async getAttemptsByUsername(request: GetAttemptsByUsernameRequest) {
    console.log('getAttemptsByUsername');
    const history = await this.historyDaoService.findByUsername(
      request.username,
    );

    if (!history) {
      throw new PeerprepException(
        'Invalid username provided!',
        PEERPREP_EXCEPTION_TYPES.BAD_REQUEST,
      );
    }

    return await this.attemptDaoService
      .findByHistoryId(history.id)
      .then((attempts) => ({ attempts }));
  }
}
