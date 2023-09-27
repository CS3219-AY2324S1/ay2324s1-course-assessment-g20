import { Global, Module } from '@nestjs/common';
import { CollabSessionWsTicketDaoService } from './collabSessionWsTicket.dao.service';

@Global()
@Module({
  providers: [CollabSessionWsTicketDaoService],
  exports: [CollabSessionWsTicketDaoService],
})
export class CollabSessionWsTicketDaoModule {}
