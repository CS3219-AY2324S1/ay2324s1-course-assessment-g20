import {
  COLLABORATION_SERVICE,
  CollaborationServiceApi,
} from '@app/interservice-api/collaboration';
import { Controller, Get, Inject, Param, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('collaboration')
export class CollaborationController {
  constructor(
    @Inject(COLLABORATION_SERVICE)
    private readonly collaborationServiceClient: ClientProxy,
  ) {}

  @Get('ticket/:sessionId')
  getCollabSessionWsTicket(@Req() req, @Param() params) {
    return this.collaborationServiceClient.send(
      CollaborationServiceApi.GET_COLLAB_SESSION_WS_TICKET,
      { sessionId: params.sessionId, userId: req.user.id },
    );
  }
}
