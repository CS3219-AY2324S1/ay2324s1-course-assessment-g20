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
  SetSessionLanguageIdRequest,
} from '@app/microservice/interfaces/collaboration';
import { ID } from '@app/microservice/interfaces/common';
import { Language } from '@app/microservice/interfaces/user';

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

  async setSessionLanguageId(
    request: SetSessionLanguageIdRequest,
  ): Promise<void> {
    await this.collaborationService.setSessionLanguageId(request);
  }

  getLanguageIdFromSessionId(request: ID): Promise<Language> {
    return this.collaborationService.getLanguageIdFromSessionId(request.id);
  }

  // NOTE: Added async here to pass compiler typechecks
  async getSessionIdFromTicket({
    id,
  }: ID): Promise<GetSessionIdFromTicketResponse> {
    return this.collaborationService.getSessionIdFromTicket(id);
  }
}
