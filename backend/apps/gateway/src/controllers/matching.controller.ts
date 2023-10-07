import {
  UserServiceApi,
  CreateWebsocketTicketInfo,
  WebsocketTicket,
} from '@app/microservice/interservice-api/user';
import { Service } from '@app/microservice/interservice-api/services';
import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('matching')
export class MatchingController {
  constructor(
    @Inject(Service.USER_SERVICE)
    private readonly authServiceClient: ClientProxy,
  ) {}

  @Get('ticket')
  async getWsTicket(@Req() req) {
    const ticket = await firstValueFrom(
      this.authServiceClient.send<WebsocketTicket, CreateWebsocketTicketInfo>(
        UserServiceApi.GENERATE_WEBSOCKET_TICKET,
        {
          userId: req.user.id,
        },
      ),
    );

    return { id: ticket.id };
  }
}
