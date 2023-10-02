import {
  WEBSOCKET_SERVICE,
  WebsocketServiceApi,
} from '@app/interservice-api/gateway';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LookingToMatchModel } from './database/models/lookingToMatch.model';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CreateTicketInfo } from '../types';
import { LookingToMatchDaoService } from './database/daos/lookingToMatch/lookingToMatch.dao.service';
import { MatchingWsTicketDaoService } from './database/daos/matchingWsTicket/matchingWsTicket.dao.service';

@Injectable()
export class MatchingService {
  constructor(
    @Inject(WEBSOCKET_SERVICE) private readonly webSocketClient: ClientProxy,
    private readonly lookingToMatchDaoService: LookingToMatchDaoService,
    private readonly matchingWsTicketDaoService: MatchingWsTicketDaoService,
  ) {}

  async createWsTicket(sessionInfo: CreateTicketInfo) {
    const ticket = await this.matchingWsTicketDaoService.create(sessionInfo);

    return {
      ticket: ticket.id,
    };
  }

  async consumeWsTicket(ticketId: string) {
    const ticket = await this.matchingWsTicketDaoService.get(ticketId);
    if (!ticket) {
      throw new BadRequestException('Invalid ticket!');
    }
    return ticket;
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

    const collabSessionId = possibleMatch.userId + matchingEntry.userId;

    this.webSocketClient.emit(WebsocketServiceApi.EMIT_TO_USER, {
      userId: matchingEntry.userId,
      event: 'match',
      payload: { collabSessionId, possibleMatch },
    });
    this.webSocketClient.emit(WebsocketServiceApi.EMIT_TO_USER, {
      userId: possibleMatch.userId,
      event: 'match',
      payload: { collabSessionId, possibleMatch },
    });
    this.webSocketClient.emit(
      WebsocketServiceApi.DISCONNECT_AND_DELETE_WEBSOCKET,
      matchingEntry.userId,
    );
    this.webSocketClient.emit(
      WebsocketServiceApi.DISCONNECT_AND_DELETE_WEBSOCKET,
      possibleMatch.userId,
    );

    console.log('emitted');
  }
}
