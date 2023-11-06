import { CollaborationEvent } from '@app/microservice/events-api/collaboration';
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
import { Redis } from 'ioredis';
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
  getSessionAndWsTicket(@Req() req, @Param('sessionId') sessionId) {
    return this.collaborationService.getSessionAndWsTicket({
      sessionId,
      userId: req.user.id,
    });
  }

  @Get('session/:sessionId/language')
  getLanguageIdFromSessionId(@Param('sessionId') sessionId) {
    return this.collaborationService.getLanguageIdFromSessionId({
      id: sessionId,
    });
  }

  @Patch('session/:sessionId/language')
  setLanguageIdForSession(
    @Param('sessionId') sessionId,
    @Body() body: SetLanguageForSessionDto,
  ) {
    const { languageId } = body;
    Redis.createClient().publish(CollaborationEvent.LANGUAGE_CHANGE, sessionId);
    return this.collaborationService.setSessionLanguageId({
      sessionId,
      languageId,
    });
  }
}
