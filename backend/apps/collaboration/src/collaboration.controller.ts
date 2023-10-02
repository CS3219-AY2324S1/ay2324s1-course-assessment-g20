import { Controller } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  CollaborationServiceApi,
  CreateSessionInfo,
  GetSessionAndTicketInfo,
} from '@app/interservice-api/collaboration';

@Controller()
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @MessagePattern(CollaborationServiceApi.CREATE_COLLAB_SESSION)
  createCollabSession(createSessionInfo: CreateSessionInfo) {
    return this.collaborationService.createCollabSession(createSessionInfo);
  }

  @MessagePattern(CollaborationServiceApi.GET_SESSION_AND_WS_TICKET)
  getSessionAndWsTicket(getSessionInfo: GetSessionAndTicketInfo) {
    return this.collaborationService.getSessionAndCreateWsTicket(
      getSessionInfo,
    );
  }

  @MessagePattern(CollaborationServiceApi.GET_SESSION_ID_FROM_TICKET)
  getSessionIdFromTicket(ticketId: string) {
    return this.collaborationService.getSessionIdFromTicket(ticketId);
  }
}
