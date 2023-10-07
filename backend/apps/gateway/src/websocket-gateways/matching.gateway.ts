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
import { MatchingServiceApi } from '@app/microservice/interservice-api/matching';
import MatchingDto from '../dtos/auth/matching.dto';
import { WebsocketMemoryService } from '../services/websocketMemory.service';
import { BaseWebsocketGateway } from '@app/websocket';
import { Service } from '@app/microservice/interservice-api/services';

@WebSocketGateway({ path: '/matching' })
export class MatchingGateway extends BaseWebsocketGateway {
  constructor(
    @Inject(Service.USER_SERVICE)
    authServiceClient: ClientProxy,
    @Inject(Service.MATCHING_SERVICE)
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
