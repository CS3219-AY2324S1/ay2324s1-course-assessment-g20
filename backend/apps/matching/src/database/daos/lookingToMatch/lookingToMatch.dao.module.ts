import { Global, Module } from '@nestjs/common';
import { LookingToMatchDaoService } from './lookingToMatch.dao.service';

@Global()
@Module({
  providers: [LookingToMatchDaoService],
  exports: [LookingToMatchDaoService],
})
export class LookingToMatchDaoModule {}
