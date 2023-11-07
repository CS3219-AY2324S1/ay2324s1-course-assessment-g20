import {
  COLLABORATION_SERVICE_NAME,
  CollaborationServiceClient,
} from '@app/microservice/interfaces/collaboration';
import { Service } from '@app/microservice/services';
import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import SetLanguageForSessionDto from '../dtos/collaboration/setLanguageForSession.dto';

@Controller('collaboration')
export class CollaborationController implements OnModuleInit {
  private collaborationService: CollaborationServiceClient;

  constructor(
    @Inject(Service.COLLABORATION_SERVICE)
    private collaborationServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.collaborationService =
      this.collaborationServiceClient.getService<CollaborationServiceClient>(
        COLLABORATION_SERVICE_NAME,
      );
  }

  @Get('session/:sessionId')
  getSession(@Req() req, @Param('sessionId') sessionId) {
    return this.collaborationService.getSession({
      sessionId,
      userId: req.user.id,
    });
  }

  @Get('session/:sessionId/ticket')
  getSessionTicket(@Req() req, @Param('sessionId') sessionId) {
    return this.collaborationService.getSessionTicket({
      sessionId,
      userId: req.user.id,
    });
  }

  @Patch('session/:sessionId/language')
  setLanguageIdForSession(
    @Req() req,
    @Param('sessionId') sessionId,
    @Body() { languageId }: SetLanguageForSessionDto,
  ) {
    return this.collaborationService.setSessionLanguageId({
      sessionId,
      userId: req.user.id,
      languageId,
    });
  }
}
