import { Global, Module } from '@nestjs/common';
import { PreferredLanguageDaoService } from './preferredLanguage.dao.service';

@Global()
@Module({
  providers: [PreferredLanguageDaoService],
  exports: [PreferredLanguageDaoService],
})
export class PreferredLanguageDaoModule {}
