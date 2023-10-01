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

  @Get('session/:sessionId')
  getSessionAndWsTicket(@Req() req, @Param('sessionId') sessionId) {
    return this.collaborationServiceClient.send(
      CollaborationServiceApi.GET_SESSION_AND_WS_TICKET,
      { sessionId, userId: req.user.id },
    );
  }
}
