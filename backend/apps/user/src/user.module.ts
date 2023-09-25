import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import userConfiguration from './config/configuration';
import { ConfigModule } from '@app/config';
import { SqlDatabaseModule } from '@app/sql-database';
import { UserProfileModel } from './database/models/userProfile.model';
import { PreferredLanguageModel } from './database/models/preferredLanguage.model';
import { RoleModel } from './database/models/role.model';
import { PreferredLanguageDaoModule } from './database/daos/preferredLanguages/preferredLanguage.dao.module';
import { RoleDaoModule } from './database/daos/roles/role.dao.module';
import { UserProfileDaoModule } from './database/daos/userProfiles/userProfile.dao.module';

@Module({
  imports: [
    ConfigModule.loadConfiguration(userConfiguration),
    SqlDatabaseModule.factory([]),

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
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
