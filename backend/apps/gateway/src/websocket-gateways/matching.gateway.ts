import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ClientGrpc } from '@nestjs/microservices';
import MatchingDto from '../dtos/auth/matching.dto';
import { MatchingWebsocketService } from '../services/matchingWebsocketService';
import { AuthenticatedWebsocket, BaseWebsocketGateway } from '@app/websocket';
import {
  MatchingServiceClient,
  MATCHING_SERVICE_NAME,
} from '@app/microservice/interfaces/matching';
import { Service } from '@app/microservice/services';
import { lastValueFrom } from 'rxjs';

@WebSocketGateway({ path: '/matching' })
export class MatchingGateway extends BaseWebsocketGateway {
  private matchingService: MatchingServiceClient;

  constructor(
    @Inject(Service.USER_SERVICE) userServiceClient: ClientGrpc,
    @Inject(Service.MATCHING_SERVICE)
    private readonly matchingServiceClient: ClientGrpc,
    private readonly websocketMemoryService: MatchingWebsocketService,
  ) {
    super(userServiceClient);
  }

  onModuleInit() {
    super.onModuleInit();
    this.matchingService =
      this.matchingServiceClient.getService<MatchingServiceClient>(
        MATCHING_SERVICE_NAME,
      );
  }

  @SubscribeMessage('get_match')
  async getMatch(
    @MessageBody() data: MatchingDto,
    @ConnectedSocket() connection: AuthenticatedWebsocket,
  ) {
    const { userId } = connection.ticket;
    this.websocketMemoryService.addConnection(userId, connection);
    await lastValueFrom(
      this.matchingService.requestMatch({
        userId,
        questionDifficulty: data.questionDifficulty,
      }),
    );
  }
}
