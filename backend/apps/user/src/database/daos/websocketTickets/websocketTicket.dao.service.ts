import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { WebsocketTicketModel } from '../../models/websocketTicket.model';
import { CreateWebsocketTicketInfoRequest } from '@app/microservice/interfaces/user';

@Injectable()
export class WebsocketTicketDaoService {
  constructor(
    @Inject('WebsocketTicketModel')
    private websocketsTicketModel: ModelClass<WebsocketTicketModel>,
  ) {}

  private static getTicketExpiryTime() {
    const SIXTY_SECONDS = 1000 * 60;
    const time = new Date();
    time.setTime(time.getTime() + SIXTY_SECONDS);
    return time;
  }

  create(createTicketInfo: CreateWebsocketTicketInfoRequest) {
    return this.websocketsTicketModel.query().insert({
      userId: createTicketInfo.userId,
      expiry: WebsocketTicketDaoService.getTicketExpiryTime(),
    });
  }

  get(ticketId: string) {
    return this.websocketsTicketModel.query().findById(ticketId);
  }

  updateUsed(ticketId: string) {
    return this.websocketsTicketModel.query().updateAndFetchById(ticketId, {
      isUsed: true,
    });
  }
}
