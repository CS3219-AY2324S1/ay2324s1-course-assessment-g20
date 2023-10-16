import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import { LookingToMatchModel } from './database/models/lookingToMatch.model';
import { firstValueFrom } from 'rxjs';
import { LookingToMatchDaoService } from './database/daos/lookingToMatch/lookingToMatch.dao.service';
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
    private readonly lookingToMatchDaoService: LookingToMatchDaoService,
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
    this.lookingToMatchDaoService.deleteMatchingEntry({
      userId: userId,
    });
  }

  async findMatch(matchingEntry: Partial<LookingToMatchModel>) {
    this.lookingToMatchDaoService.updateMatchingEntryIfExist({
      ...matchingEntry,
      isConnected: true,
    });
    const possibleMatch = await this.lookingToMatchDaoService.findMatchingEntry(
      matchingEntry,
    );

    if (!possibleMatch) {
      this.lookingToMatchDaoService.createOrUpdateMatchingEntry({
        ...matchingEntry,
        isConnected: true,
      });
      return;
    }

    this.lookingToMatchDaoService.deleteMatchingEntry(possibleMatch);
    this.lookingToMatchDaoService.deleteMatchingEntry(matchingEntry);

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
