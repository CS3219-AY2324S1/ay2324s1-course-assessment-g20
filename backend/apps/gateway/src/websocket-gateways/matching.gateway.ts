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
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ path: '/matching' })
export class MatchingGateway extends BaseWebsocketGateway {
  private matchingService: MatchingServiceClient;

  constructor(
    private readonly configService: ConfigService,
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

  async handleDisconnect(connection: AuthenticatedWebsocket): Promise<void> {
    this.websocketMemoryService.removeConnection(connection.ticket.userId);
    await firstValueFrom(
      this.matchingService.deleteMatchEntryByUserId({
        id: connection.ticket.userId,
      }),
    );
  }

  async handleConnection(
    connection: AuthenticatedWebsocket,
    request: Request,
  ): Promise<boolean> {
    if (await super.handleConnection(connection, request)) {
      setTimeout(() => {
        connection.close();
      }, this.configService.get('connectionTimeout'));

      return true;
    }
    return false;
  }

  @SubscribeMessage('get_match')
  async getMatch(
    @MessageBody() data: MatchingDto,
    @ConnectedSocket() connection: AuthenticatedWebsocket,
  ) {
    // wait for ticket to be set, or connection to close
    while (
      connection.ticket === undefined &&
      connection.readyState !== connection.CLOSED
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (connection.readyState === connection.CLOSED) {
      return;
    }

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
