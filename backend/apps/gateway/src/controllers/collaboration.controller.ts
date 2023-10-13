import { Service } from '@app/microservice/interservice-api/services';
import { getPromisifiedGrpcService } from '@app/microservice/utils';
import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CollaborationController as CollaborationService } from 'apps/collaboration/src/collaboration.controller';

@Controller('collaboration')
export class CollaborationController implements OnModuleInit {
  private collaborationService: CollaborationService;

  constructor(
    @Inject(Service.COLLABORATION_SERVICE)
    private collaborationServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.collaborationService = getPromisifiedGrpcService<CollaborationService>(
      this.collaborationServiceClient,
      'CollaborationService',
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
