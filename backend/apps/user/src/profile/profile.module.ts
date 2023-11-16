import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SqlDatabaseModule } from '@app/sql-database';
import { UserProfileModel } from '../database/models/userProfile.model';
import { LanguageModel } from '../database/models/language.model';
import { LanguageDaoModule } from '../database/daos/languages/language.dao.module';
import { UserProfileDaoModule } from '../database/daos/userProfiles/userProfile.dao.module';

@Module({
  imports: [
    // Database and DAOs
    SqlDatabaseModule.factory([LanguageModel, UserProfileModel]),
    LanguageDaoModule,
    UserProfileDaoModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
