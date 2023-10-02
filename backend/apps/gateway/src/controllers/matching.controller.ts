import {
  MatchingServiceApi,
  MATCHING_SERVICE,
} from '@app/interservice-api/matching';
import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('matching')
export class MatchingController {
  constructor(
    @Inject(MATCHING_SERVICE)
    private readonly collaborationServiceClient: ClientProxy,
  ) {}

  @Get('ws-ticket')
  getWsTicket(@Req() req) {
    return this.collaborationServiceClient.send(
      MatchingServiceApi.GET_WS_TICKET,
      { userId: req.user.id },
    );
  }
}
