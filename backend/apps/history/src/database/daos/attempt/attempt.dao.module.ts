import { Global, Module } from '@nestjs/common';
import { AttemptDaoService } from './attempt.dao.service';

@Global()
@Module({
  providers: [AttemptDaoService],
  exports: [AttemptDaoService],
})
export class AttemptDaoModule {}
