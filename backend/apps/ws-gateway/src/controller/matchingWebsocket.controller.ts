import { WebsocketServiceApi } from '@app/microservice/events-api/websocket';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MatchingWebsocketService as MatchingWebsocketService } from '../services/matchingWebsocketService';

@Controller()
export class MatchingWebsocketController {
  constructor(
    private readonly matchingWebsocketService: MatchingWebsocketService,
  ) {}

  @MessagePattern(WebsocketServiceApi.EMIT_TO_USER_AND_DELETE_WEBSOCKET)
  emitToUser(
    @Payload() data: { userId: string; event: string; payload: any },
  ): boolean {
    const connection = this.matchingWebsocketService.getConnection(data.userId);
    if (!connection) {
      return false;
    }

    connection.send(
      JSON.stringify({
        event: data.event,
        data: data.payload,
      }),
    );
    connection.close();
    this.matchingWebsocketService.removeConnection(data.userId);
    return true;
  }
}
