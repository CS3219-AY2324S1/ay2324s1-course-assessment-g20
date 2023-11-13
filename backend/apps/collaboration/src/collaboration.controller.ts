import { Controller } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import {
  CollaborationServiceController,
  CollaborationServiceControllerMethods,
  CreateCollabSessionRequest,
  GetAttemptsFromUserIdResponse,
  GetQuestionIdFromSessionIdResponse,
  GetSessionFromTicketResponse,
  GetSessionOrTicketRequest,
  GetSessionResponse,
  GetSessionTicketResponse,
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

  getSession(
    getSessionInfo: GetSessionOrTicketRequest,
  ): Promise<GetSessionResponse> {
    return this.collaborationService.getSession(getSessionInfo);
  }

  getSessionTicket(
    getSessionTicketInfo: GetSessionOrTicketRequest,
  ): Promise<GetSessionTicketResponse> {
    return this.collaborationService.createSessionTicket(getSessionTicketInfo);
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
  async getSessionFromTicket({
    id,
  }: ID): Promise<GetSessionFromTicketResponse> {
    return this.collaborationService.getSessionFromTicket(id);
  }

  closeSession({ id }) {
    return this.collaborationService.closeSession(id);
  }

  getAttemptsFromUserId(request: ID): Promise<GetAttemptsFromUserIdResponse> {
    return this.collaborationService.getAttemptsFromUserId(request);
  }

  getSessionAttempt(getSessionAttemptInfo: GetSessionOrTicketRequest) {
    return this.collaborationService.getSessionAttempt(getSessionAttemptInfo);
  }
}
