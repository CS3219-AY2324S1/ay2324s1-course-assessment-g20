import { WebsocketServiceApi } from '@app/interservice-api/gateway';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Public } from '../jwt/jwtPublic.decorator';
import { WebsocketMemoryService } from '../services/websocketMemory.service';

@Controller()
@Public()
export class WebsocketController {
  constructor(
    private readonly websocketMemoryService: WebsocketMemoryService,
  ) {}

  @MessagePattern(WebsocketServiceApi.DISCONNECT_AND_DELETE_WEBSOCKET)
  deleteWebsocket(userId: string): void {
    this.websocketMemoryService.getConnection(userId).close();
    this.websocketMemoryService.removeConnection(userId);
  }

  @MessagePattern(WebsocketServiceApi.IS_CONNECTED)
  isConnected(userId: string): boolean {
    return this.websocketMemoryService.isConnected(userId);
  }

  @MessagePattern(WebsocketServiceApi.EMIT_TO_USER)
  emitToUser(data: { userId: string; event: string; payload: any }): void {
    this.websocketMemoryService.getConnection(data.userId).send(
      JSON.stringify({
        event: data.event,
        data: data.payload,
      }),
    );
  }
}
