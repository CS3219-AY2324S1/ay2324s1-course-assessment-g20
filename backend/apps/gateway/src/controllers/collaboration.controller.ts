import {
  COLLABORATION_SERVICE_NAME,
  CollaborationServiceClient,
} from '@app/microservice/interfaces/collaboration';
import { Service } from '@app/microservice/services';
import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

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
}