import { Controller } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import {
  CollaborationServiceController,
  CollaborationServiceControllerMethods,
  CreateCollabSessionRequest,
  GetQuestionIdFromSessionIdResponse,
  GetSessionAndWsTicketRequest,
  GetSessionAndWsTicketResponse,
  GetSessionIdFromTicketResponse,
} from '@app/microservice/interfaces/collaboration';
import { ID } from '@app/microservice/interfaces/common';

@Controller()
@CollaborationServiceControllerMethods()
export class CollaborationController implements CollaborationServiceController {
  constructor(private readonly collaborationService: CollaborationService) {}

  createCollabSession(createSessionInfo: CreateCollabSessionRequest) {
    return this.collaborationService.createCollabSession(createSessionInfo);
  }

  getQuestionIdFromSessionId(
    request: ID,
  ): Promise<GetQuestionIdFromSessionIdResponse> {
    return this.collaborationService.getQuestionIdFromSessionId(request);
  }

  getSessionAndWsTicket(
    getSessionInfo: GetSessionAndWsTicketRequest,
  ): Promise<GetSessionAndWsTicketResponse> {
    return this.collaborationService.getSessionAndCreateWsTicket(
      getSessionInfo,
    );
  }

  // NOTE: Added async here to pass compiler typechecks
  async getSessionIdFromTicket({
    id,
  }: ID): Promise<GetSessionIdFromTicketResponse> {
    return this.collaborationService.getSessionIdFromTicket(id);
  }
}
