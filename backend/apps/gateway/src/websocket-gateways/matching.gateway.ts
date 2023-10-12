import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ClientProxy } from '@nestjs/microservices';
import { MatchingServiceApi } from '@app/microservice/interservice-api/matching';
import MatchingDto from '../dtos/auth/matching.dto';
import { WebsocketMemoryService } from '../services/websocketMemory.service';
import { AuthenticatedWebsocket, BaseWebsocketGateway } from '@app/websocket';
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

  @SubscribeMessage('get_match')
  async getMatch(
    @MessageBody() data: MatchingDto,
    @ConnectedSocket() connection: AuthenticatedWebsocket,
  ) {
    const { userId } = connection.ticket;
    this.websocketMemoryService.addConnection(userId, connection);
    this.matchingServiceClient.emit(MatchingServiceApi.GET_MATCH, {
      userId,
      questionDifficulty: data.questionDifficulty,
    });
  }
}
