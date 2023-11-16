import { Global, Module } from '@nestjs/common';
import { WebsocketTicketDaoService } from './websocketTicket.dao.service';

@Global()
@Module({
  providers: [WebsocketTicketDaoService],
  exports: [WebsocketTicketDaoService],
})
export class WebsocketTicketDaoModule {}
