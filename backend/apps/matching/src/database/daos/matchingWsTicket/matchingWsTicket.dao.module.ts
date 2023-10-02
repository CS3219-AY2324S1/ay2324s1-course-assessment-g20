import { Global, Module } from '@nestjs/common';
import { MatchingWsTicketDaoService } from './matchingWsTicket.dao.service';

@Global()
@Module({
  providers: [MatchingWsTicketDaoService],
  exports: [MatchingWsTicketDaoService],
})
export class MatchingWsTicketDaoModule {}
