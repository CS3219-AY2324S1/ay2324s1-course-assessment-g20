import { Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { SqlDatabaseModule } from '@app/sql-database';
import { LanguageModel } from '../database/models/language.model';
import { LanguageDaoModule } from '../database/daos/languages/language.dao.module';

@Module({
  imports: [
    // Database and DAOs
    SqlDatabaseModule.factory([LanguageModel]),
    LanguageDaoModule,
  ],
  controllers: [LanguageController],
  providers: [LanguageService],
})
export class LanguageModule {}
