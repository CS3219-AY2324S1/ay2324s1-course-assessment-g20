import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  MatchingServiceApi,
  MATCHING_SERVICE,
} from '@app/interservice-api/matching';
import MatchingDto from '../dtos/auth/matching.dto';
import { WebsocketMemoryService } from '../services/websocketMemory.service';
import { BaseWebsocketGateway } from '@app/websocket';
import { AUTH_SERVICE } from '@app/interservice-api/auth';

@WebSocketGateway({ path: '/matching' })
export class MatchingGateway extends BaseWebsocketGateway {
  constructor(
    @Inject(AUTH_SERVICE)
    authServiceClient: ClientProxy,
    @Inject(MATCHING_SERVICE)
    private readonly matchingServiceClient: ClientProxy,
    private readonly websocketMemoryService: WebsocketMemoryService,
  ) {
    super(authServiceClient);
  }

  async handleConnection(connection: WebSocket, request: Request) {
    return super.handleConnection(connection, request);
  }

  @WebSocketServer()
  @SubscribeMessage('get_match')
  async getMatch(
    @MessageBody() data: MatchingDto,
    @ConnectedSocket() connection: WebSocket,
  ) {
    const { userId } = await super.getTicketFromTicketId(data.ticket);
    this.websocketMemoryService.addConnection(userId, connection);
    firstValueFrom(
      await this.matchingServiceClient.emit(MatchingServiceApi.GET_MATCH, {
        userId,
        questionDifficulty: data.questionDifficulty,
      }),
    );
  }
}
