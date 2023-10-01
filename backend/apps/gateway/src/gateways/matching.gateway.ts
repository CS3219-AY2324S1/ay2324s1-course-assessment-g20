import {
  MatchingServiceApi,
  MATCHING_SERVICE,
} from '@app/interservice-api/matching';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Socket } from 'socket.io';
import MatchingDto from '../dtos/auth/matching.dto';
import { WebsocketMemoryService } from '../services/websocketMemory.service';

@WebSocketGateway({
  cors: {
    origin: '*', // TODO: change this value to your frontend url.
  },
})
export class MatchingGateway {
  constructor(
    @Inject(MATCHING_SERVICE)
    private readonly matchingServiceClient: ClientProxy,
    private readonly websocketMemoryService: WebsocketMemoryService,
  ) {}

  @WebSocketServer()
  @SubscribeMessage('get_match')
  async getMatch(
    @MessageBody() data: MatchingDto,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<string>> {
    this.websocketMemoryService.addConnection(data.userId, client);
    console.log('get_match', data);
    firstValueFrom(
      await this.matchingServiceClient.send(MatchingServiceApi.GET_MATCH, data),
    ).then(console.log);

    return { event: 'message', data: 'Hello World' };
  }
}
