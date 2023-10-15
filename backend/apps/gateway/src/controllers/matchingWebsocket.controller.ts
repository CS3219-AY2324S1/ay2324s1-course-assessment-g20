import { WebsocketServiceApi } from '@app/microservice/events-api/websocket';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Public } from '../jwt/jwtPublic.decorator';
import { MatchingWebsocketService as MatchingWebsocketService } from '../services/matchingWebsocketService';

@Controller()
@Public()
export class MatchingWebsocketController {
  constructor(
    private readonly matchingWebsocketService: MatchingWebsocketService,
  ) {}

  @MessagePattern(WebsocketServiceApi.DISCONNECT_AND_DELETE_WEBSOCKET)
  deleteWebsocket(userId: string): void {
    this.matchingWebsocketService.getConnection(userId).close();
    this.matchingWebsocketService.removeConnection(userId);
  }

  @MessagePattern(WebsocketServiceApi.IS_CONNECTED)
  isConnected(userId: string): boolean {
    return this.matchingWebsocketService.isConnected(userId);
  }

  @MessagePattern(WebsocketServiceApi.EMIT_TO_USER)
  emitToUser(data: { userId: string; event: string; payload: any }): void {
    this.matchingWebsocketService.getConnection(data.userId).send(
      JSON.stringify({
        event: data.event,
        data: data.payload,
      }),
    );
  }
}
