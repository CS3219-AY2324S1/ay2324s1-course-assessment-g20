import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SqlDatabaseModule } from '@app/sql-database';
import { UserProfileModel } from '../database/models/userProfile.model';
import { LanguageModel } from '../database/models/language.model';
import { RoleModel } from '../database/models/role.model';
import { LanguageDaoModule } from '../database/daos/languages/language.dao.module';
import { RoleDaoModule } from '../database/daos/roles/role.dao.module';
import { UserProfileDaoModule } from '../database/daos/userProfiles/userProfile.dao.module';
import { Service } from '@app/microservice/services';
import { registerGrpcClients } from '@app/microservice/utils';

@Module({
  imports: [
    registerGrpcClients([Service.COLLABORATION_SERVICE]),
    // Database and DAOs
    SqlDatabaseModule.factory([LanguageModel, RoleModel, UserProfileModel]),
    LanguageDaoModule,
    RoleDaoModule,
    UserProfileDaoModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
