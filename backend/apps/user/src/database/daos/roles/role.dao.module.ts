import { Global, Module } from '@nestjs/common';
import { RoleDaoService } from './role.dao.service';

@Global()
@Module({
  providers: [RoleDaoService],
  exports: [RoleDaoService],
})
export class RoleDaoModule {}
