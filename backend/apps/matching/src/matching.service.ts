import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { LookingToMatchModel } from './database/models/lookingToMatch.model';
import { firstValueFrom, lastValueFrom } from 'rxjs';
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
    private readonly webSocketClient: ClientProxy,
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

    if (
      !firstValueFrom(
        this.webSocketClient.emit(
          WebsocketServiceApi.IS_CONNECTED,
          possibleMatch.userId,
        ),
      )
    ) {
      this.lookingToMatchDaoService.deleteMatchingEntry(possibleMatch);
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
      await lastValueFrom(
        this.questionService.getQuestionsOfDifficultyId({
          id: matchingEntry.questionDifficulty,
        }),
      )
    ).questions;

    console.log(questions);
    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    if (!randomQuestion) {
      throw new Error('No question found');
    }

    const session = await lastValueFrom(
      this.collaborationService.createCollabSession({
        userIds: [possibleMatch.userId, matchingEntry.userId],
        questionId: randomQuestion._id,
      }),
    );

    console.log(session);

    const collabSessionId = session.id;

    this.webSocketClient.emit(WebsocketServiceApi.EMIT_TO_USER, {
      userId: matchingEntry.userId,
      event: 'match',
      payload: { sessionId: collabSessionId },
    });
    this.webSocketClient.emit(WebsocketServiceApi.EMIT_TO_USER, {
      userId: possibleMatch.userId,
      event: 'match',
      payload: { sessionId: collabSessionId },
    });
    this.webSocketClient.emit(
      WebsocketServiceApi.DISCONNECT_AND_DELETE_WEBSOCKET,
      matchingEntry.userId,
    );
    this.webSocketClient.emit(
      WebsocketServiceApi.DISCONNECT_AND_DELETE_WEBSOCKET,
      possibleMatch.userId,
    );
  }
}
