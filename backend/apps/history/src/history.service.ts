import {
  COLLABORATION_SERVICE_NAME,
  CollaborationServiceClient,
} from '@app/microservice/interfaces/collaboration';
import {
  QUESTION_SERVICE_NAME,
  QuestionServiceClient,
} from '@app/microservice/interfaces/question';
import { Service } from '@app/microservice/services';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { HistoryDaoService } from './database/daos/history/history.dao.service';
import { CreateHistoryAttemptRequest } from '@app/microservice/interfaces/history';
import { firstValueFrom } from 'rxjs';
import { AttemptDaoService } from './database/daos/attempt/attempt.dao.service';
import { PEERPREP_EXCEPTION_TYPES } from 'libs/exception-filter/constants';
import { PeerprepException } from 'libs/exception-filter/peerprep.exception';
import { ID } from '@app/microservice/interfaces/common';

@Injectable()
export class HistoryService implements OnModuleInit {
  private questionService: QuestionServiceClient;
  private collabService: CollaborationServiceClient;

  constructor(
    @Inject(Service.QUESTION_SERVICE)
    private readonly questionServiceClient: ClientGrpc,
    @Inject(Service.COLLABORATION_SERVICE)
    private readonly collabServiceClient: ClientGrpc,
    private readonly historyDaoService: HistoryDaoService,
    private readonly attemptDaoService: AttemptDaoService,
  ) {}

  onModuleInit() {
    this.questionService =
      this.questionServiceClient.getService<QuestionServiceClient>(
        QUESTION_SERVICE_NAME,
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

    // Get userIds
    const userIds = await firstValueFrom(
      this.collabService.getUserIdsFromSessionId({ id: sessionId }),
    ).then(({ userIds }) => userIds.map(({ userId }) => userId));

    // Create history for each user
    return await Promise.all(
      userIds.map((userId) =>
        this.createHistoryForUser(userId, questionId, questionAttempt),
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

  private async createHistoryForUser(
    userId: string,
    questionId: string,
    questionAttempt: string,
  ) {
    let history = await this.historyDaoService.findByUserId(userId);

    if (!history) {
      history = await this.historyDaoService.create(userId);
    }

    await this.attemptDaoService.createAttempt({
      historyId: history.id,
      questionId,
      questionAttempt,
    });

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
