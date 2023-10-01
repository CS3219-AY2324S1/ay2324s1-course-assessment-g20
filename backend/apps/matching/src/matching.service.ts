import {
  WEBSOCKET_SERVICE,
  WebsocketServiceApi,
} from '@app/interservice-api/gateway';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LookingToMatchDaoService } from './database/daos/lookingToMatch.dao.service';
import { LookingToMatchModel } from './database/models/lookingToMatch.model';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MatchingService {
  constructor(
    @Inject(WEBSOCKET_SERVICE) private readonly webSocketCLient: ClientProxy,
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
        this.webSocketCLient.emit(
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

    const collabSessionId = possibleMatch.userId + matchingEntry.userId;

    this.webSocketCLient.emit(WebsocketServiceApi.EMIT_TO_USER, {
      userId: matchingEntry.userId,
      event: 'match',
      payload: { collabSessionId, possibleMatch },
    });
    this.webSocketCLient.emit(WebsocketServiceApi.EMIT_TO_USER, {
      userId: possibleMatch.userId,
      event: 'match',
      payload: { collabSessionId, possibleMatch },
    });
    this.webSocketCLient.emit(
      WebsocketServiceApi.DISCONNECT_AND_DELETE_WEBSOCKET,
      matchingEntry.userId,
    );
    this.webSocketCLient.emit(
      WebsocketServiceApi.DISCONNECT_AND_DELETE_WEBSOCKET,
      possibleMatch.userId,
    );
  }
}
