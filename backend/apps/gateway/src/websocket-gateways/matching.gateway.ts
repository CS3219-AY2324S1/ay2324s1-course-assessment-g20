import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from 'ws';
import { ClientProxy } from '@nestjs/microservices';
import { CollabSessionWsTicketModel } from 'apps/collaboration/src/database/models/collabSessionWsTicket.model';
import { catchError, firstValueFrom, of } from 'rxjs';
import {
  MatchingServiceApi,
  MATCHING_SERVICE,
} from '@app/interservice-api/matching';
import MatchingDto from '../dtos/auth/matching.dto';
import { WebsocketMemoryService } from '../services/websocketMemory.service';

const TICKET_KEY = 'ticket';

@WebSocketGateway({ path: '/matching' })
export class MatchingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(MATCHING_SERVICE)
    private readonly matchingServiceClient: ClientProxy,
    private readonly websocketMemoryService: WebsocketMemoryService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(connection: WebSocket, request: Request) {
    const url = new URL(request.url, 'http://placeholder.com');
    const ticketId = url.searchParams.get(TICKET_KEY);
    const ticket = await firstValueFrom(
      this.matchingServiceClient
        .send<CollabSessionWsTicketModel>(
          MatchingServiceApi.CONSUME_WS_TICKET,
          ticketId,
        )
        .pipe(catchError((e) => of(null))),
    );

    this.websocketMemoryService.addConnection(ticket.userId, connection);
    if (!ticket) {
      return connection.close();
    }
    return ticket.userId;
  }

  @WebSocketServer()
  @SubscribeMessage('get_match')
  async getMatch(
    @MessageBody() data: MatchingDto,
  ): Promise<WsResponse<string>> {
    console.log('get_match', data);
    firstValueFrom(
      await this.matchingServiceClient.emit(MatchingServiceApi.GET_MATCH, data),
    ).then(console.log);

    return { event: 'message', data: 'Hello World' };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleDisconnect(): void {}
}
