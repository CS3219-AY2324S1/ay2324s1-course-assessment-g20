import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Service } from '@app/microservice/services';
import { WebsocketServiceApi } from '@app/microservice/events-api/websocket';
import {
  QuestionServiceClient,
  QUESTION_SERVICE_NAME,
} from '@app/microservice/interfaces/question';
import {
  CollaborationServiceClient,
  COLLABORATION_SERVICE_NAME,
} from '@app/microservice/interfaces/collaboration';
import { RedisStoreService } from '../store/redisStore.service';
import { LookingToMatchModel } from '../store/models';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

@Injectable()
export class MatchingService implements OnModuleInit {
  private questionService: QuestionServiceClient;
  private collaborationService: CollaborationServiceClient;

  constructor(
    @Inject(Service.WEBSOCKET_SERVICE)
    private readonly webSocketClient: ClientKafka,
    @Inject(Service.QUESTION_SERVICE)
    private readonly questionClient: ClientGrpc,
    @Inject(Service.COLLABORATION_SERVICE)
    private readonly collaborationClient: ClientGrpc,
    private readonly redisStoreService: RedisStoreService,
  ) {}

  onModuleInit() {
    this.collaborationService =
      this.collaborationClient.getService<CollaborationServiceClient>(
        COLLABORATION_SERVICE_NAME,
      );
    this.questionService =
      this.questionClient.getService<QuestionServiceClient>(
        QUESTION_SERVICE_NAME,
      );

    const patterns = [WebsocketServiceApi.EMIT_TO_USER_AND_DELETE_WEBSOCKET];

    patterns.forEach((pattern) => {
      this.webSocketClient.subscribeToResponseOf(pattern);
    });
  }

  async deleteEntry(userId: string) {
    const release = await mutex.acquire();
    this.redisStoreService.deleteEntryByUserId(userId);
    release();
  }

  async findMatch(matchingEntry: LookingToMatchModel) {
    const release = await mutex.acquire();
    this.findMatchHelper(matchingEntry);
    release();
  }

  private async findMatchHelper(matchingEntry: LookingToMatchModel) {
    await this.redisStoreService.updateMatchingEntryIfExist(matchingEntry);

    const possibleMatch = await this.redisStoreService.findMatchingEntry(
      matchingEntry,
    );

    if (!possibleMatch) {
      await this.redisStoreService.createOrUpdateMatchingEntry(matchingEntry);
      return;
    }

    this.redisStoreService.deleteMatchingEntry(possibleMatch);
    this.redisStoreService.deleteMatchingEntry(matchingEntry);

    // get random question

    const questions = (
      await firstValueFrom(
        this.questionService.getQuestionsOfDifficultyId({
          id: matchingEntry.questionDifficulty,
        }),
      )
    ).questions;

    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    if (!randomQuestion) {
      throw new Error('No question found');
    }

    const session = await firstValueFrom(
      this.collaborationService.createCollabSession({
        userIds: [possibleMatch.userId, matchingEntry.userId],
        questionId: randomQuestion._id,
      }),
    );

    const collabSessionId = session.id;

    this.webSocketClient.emit(
      WebsocketServiceApi.EMIT_TO_USER_AND_DELETE_WEBSOCKET,
      {
        userId: matchingEntry.userId,
        event: 'match',
        payload: { sessionId: collabSessionId },
      },
    );
    this.webSocketClient.emit(
      WebsocketServiceApi.EMIT_TO_USER_AND_DELETE_WEBSOCKET,
      {
        userId: possibleMatch.userId,
        event: 'match',
        payload: { sessionId: collabSessionId },
      },
    );
  }
}
