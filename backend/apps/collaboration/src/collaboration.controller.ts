import { Controller } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateSessionInfo,
  GetSessionAndTicketInfo,
} from '@app/microservice/interservice-api/collaboration';

const CollaborationServiceGrpcMethod: MethodDecorator = GrpcMethod(
  'CollaborationService',
);

@Controller()
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @CollaborationServiceGrpcMethod
  createCollabSession(createSessionInfo: CreateSessionInfo) {
    return this.collaborationService.createCollabSession(createSessionInfo);
  }

  @CollaborationServiceGrpcMethod
  getSessionAndWsTicket(getSessionInfo: GetSessionAndTicketInfo) {
    return this.collaborationService.getSessionAndCreateWsTicket(
      getSessionInfo,
    );
  }

  @CollaborationServiceGrpcMethod
  getSessionIdFromTicket({ id }: { id: string }) {
    return this.collaborationService.getSessionIdFromTicket(id);
  }
}
