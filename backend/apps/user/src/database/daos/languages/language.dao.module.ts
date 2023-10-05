import { Global, Module } from '@nestjs/common';
import { LanguageDaoService } from './language.dao.service';

@Global()
@Module({
  providers: [LanguageDaoService],
  exports: [LanguageDaoService],
})
export class LanguageDaoModule {}
