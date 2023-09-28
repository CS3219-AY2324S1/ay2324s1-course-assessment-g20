import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SqlDatabaseModule } from '@app/sql-database';
import { UserProfileModel } from '../database/models/userProfile.model';
import { PreferredLanguageModel } from '../database/models/preferredLanguage.model';
import { RoleModel } from '../database/models/role.model';
import { PreferredLanguageDaoModule } from '../database/daos/preferredLanguages/preferredLanguage.dao.module';
import { RoleDaoModule } from '../database/daos/roles/role.dao.module';
import { UserProfileDaoModule } from '../database/daos/userProfiles/userProfile.dao.module';

@Module({
  imports: [
    // Database and DAOs
    SqlDatabaseModule.factory([
      PreferredLanguageModel,
      RoleModel,
      UserProfileModel,
    ]),
    PreferredLanguageDaoModule,
    RoleDaoModule,
    UserProfileDaoModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
