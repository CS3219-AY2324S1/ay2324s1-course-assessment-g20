import { Global, Module } from '@nestjs/common';
import { HistoryDaoService } from './history.dao.service';

@Global()
@Module({
  providers: [HistoryDaoService],
  exports: [HistoryDaoService],
})
export class HistoryDaoModule {}
