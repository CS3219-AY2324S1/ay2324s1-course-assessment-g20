import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LookingToMatchModel } from './database/models/lookingToMatch.model';
import { firstValueFrom } from 'rxjs';

import { LookingToMatchDaoService } from './database/daos/lookingToMatch/lookingToMatch.dao.service';
import { Service } from '@app/microservice/interservice-api/services';
import { WebsocketServiceApi } from '@app/microservice/interservice-api/websocket';
import { QuestionServiceApi } from '@app/microservice/interservice-api/question';
import { CollaborationServiceApi } from '@app/microservice/interservice-api/collaboration';

@Injectable()
export class MatchingService {
  constructor(
    @Inject(Service.WEBSOCKET_SERVICE)
    private readonly webSocketClient: ClientProxy,
    @Inject(Service.QUESTION_SERVICE)
    private readonly questionClient: ClientProxy,
    @Inject(Service.COLLABORATION_SERVICE)
    private readonly collaborationClient: ClientProxy,
    private readonly lookingToMatchDaoService: LookingToMatchDaoService,
  ) {}

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
    const questions = await firstValueFrom(
      this.questionClient.send(
        QuestionServiceApi.GET_QUESTIONS_OF_DIFFICULTY,
        matchingEntry.questionDifficulty,
      ),
    );
    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    if (!randomQuestion) {
      throw new Error('No question found');
    }

    const session = await firstValueFrom(
      this.collaborationClient.send(
        CollaborationServiceApi.CREATE_COLLAB_SESSION,
        {
          userIds: [possibleMatch.userId, matchingEntry.userId],
          questionId: randomQuestion._id,
        },
      ),
    );

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
