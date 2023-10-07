import { WebsocketServiceApi } from '@app/microservice/interservice-api/websocket';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Public } from '../jwt/jwtPublic.decorator';
import { WebsocketMemoryService as MatchingWebsocketService } from '../services/websocketMemory.service';

@Controller()
@Public()
export class MatchingWebsocketController {
  constructor(
    private readonly MatchingWebsocketService: MatchingWebsocketService,
  ) {}

  @MessagePattern(WebsocketServiceApi.DISCONNECT_AND_DELETE_WEBSOCKET)
  deleteWebsocket(userId: string): void {
    this.MatchingWebsocketService.getConnection(userId).close();
    this.MatchingWebsocketService.removeConnection(userId);
  }

  @MessagePattern(WebsocketServiceApi.IS_CONNECTED)
  isConnected(userId: string): boolean {
    return this.MatchingWebsocketService.isConnected(userId);
  }

  @MessagePattern(WebsocketServiceApi.EMIT_TO_USER)
  emitToUser(data: { userId: string; event: string; payload: any }): void {
    this.MatchingWebsocketService.getConnection(data.userId).send(
      JSON.stringify({
        event: data.event,
        data: data.payload,
      }),
    );
  }
}
