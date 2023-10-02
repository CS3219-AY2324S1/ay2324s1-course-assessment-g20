import {
  AuthServiceApi,
  AUTH_SERVICE,
  CreateWebsocketTicketInfo,
  WebsocketTicket,
} from '@app/interservice-api/auth';
import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('matching')
export class MatchingController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authServiceClient: ClientProxy,
  ) {}

  @Get('ws-ticket')
  getWsTicket(@Req() req) {
    return firstValueFrom(
      this.authServiceClient.send<WebsocketTicket, CreateWebsocketTicketInfo>(
        AuthServiceApi.GENERATE_WEBSOCKET_TICKET,
        {
          userId: req.user.id,
        },
      ),
    );
  }
}
