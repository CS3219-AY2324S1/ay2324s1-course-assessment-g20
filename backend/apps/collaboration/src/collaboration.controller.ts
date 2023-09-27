import { Controller } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { MessagePattern } from '@nestjs/microservices';
import { CollaborationServiceApi } from '@app/interservice-api/collaboration';
import { CreateSessionInfo, CreateSessionTicketInfo } from './types';

@Controller()
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @MessagePattern(CollaborationServiceApi.CREATE_COLLAB_SESSION)
  createCollabSession(createSessionInfo: CreateSessionInfo) {
    return this.collaborationService.createCollabSession(createSessionInfo);
  }

  @MessagePattern(CollaborationServiceApi.GET_COLLAB_SESSION_WS_TICKET)
  getCollabSessionWsTicket(sessionInfo: CreateSessionTicketInfo) {
    return this.collaborationService.getCollabSessionWsTicket(sessionInfo);
  }

  @MessagePattern(CollaborationServiceApi.CONSUME_WS_TICKET)
  consumeWsTicket(ticketId: string) {
    return this.collaborationService.consumeWsTicket(ticketId);
  }
}
