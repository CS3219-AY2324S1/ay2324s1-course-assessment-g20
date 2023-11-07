import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
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
    @Inject(Service.WEBSOCKET_GATEWAY)
    private readonly webSocketClient: ClientProxy,
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
  }

  async deleteEntry(userId: string) {
    const release = await mutex.acquire();
    this.redisStoreService.deleteEntryByUserId(userId);
    release();
  }

  async findMatch(matchingEntry: LookingToMatchModel) {
    const release = await mutex.acquire();
    await this.findMatchHelper(matchingEntry);
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

    this.redisStoreService.deleteMatchingEntryIfExists(possibleMatch);
    this.redisStoreService.deleteMatchingEntryIfExists(matchingEntry);

    const randomQuestion = await this.getRandomQuestion(
      matchingEntry.questionDifficulty,
    );

    const session = await firstValueFrom(
      this.collaborationService.createCollabSession({
        userIds: [possibleMatch.userId, matchingEntry.userId],
        questionId: randomQuestion._id,
      }),
    );

    const collabSessionId = session.id;

    [matchingEntry, possibleMatch].forEach((entry) => {
      this.webSocketClient.emit(
        WebsocketServiceApi.EMIT_TO_USER_AND_DELETE_WEBSOCKET,
        {
          userId: entry.userId,
          event: 'match',
          payload: { sessionId: collabSessionId },
        },
      );
    });
  }

  private async getRandomQuestion(difficultyId: string) {
    const questions = (
      await firstValueFrom(
        this.questionService.getQuestionsByDifficultyId({
          id: difficultyId,
        }),
      )
    ).questions;

    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];

    if (!randomQuestion) {
      throw new Error('No question found');
    }

    return randomQuestion;
  }
}
