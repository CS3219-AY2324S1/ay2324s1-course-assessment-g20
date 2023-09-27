import { Global, Module } from '@nestjs/common';
import { SessionDaoService } from './session.dao.service';

@Global()
@Module({
  providers: [SessionDaoService],
  exports: [SessionDaoService],
})
export class SessionDaoModule {}
