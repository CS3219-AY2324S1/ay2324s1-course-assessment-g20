import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { WebsocketTicketModel } from '../../models/websocketTicket.model';
import { CreateWebsocketTicketInfo } from '@app/microservice/interservice-api/user';

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

  create(createTicketInfo: CreateWebsocketTicketInfo) {
    return this.websocketsTicketModel
      .query()
      .insert({
        userId: createTicketInfo.userId,
        expiry: WebsocketTicketDaoService.getTicketExpiryTime(),
      })
      .then((ws) => ({
        id: ws.id,
        expiry: ws.expiry.toISOString(),
      }));
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
