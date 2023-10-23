import { Injectable } from '@nestjs/common';
import { UserProfileDaoService } from '../database/daos/userProfiles/userProfile.dao.service';
import { UserProfileModel } from '../database/models/userProfile.model';
import { LanguageDaoService } from '../database/daos/languages/language.dao.service';
import { RoleDaoService } from '../database/daos/roles/role.dao.service';
import { Role } from '@app/types/roles';
import {
  Language,
  UserProfile,
  Role as RoleObj,
} from '@app/microservice/interfaces/user';
import { PeerprepException } from 'libs/exception-filter/peerprep.exception';
import { PEERPREP_EXCEPTION_TYPES } from 'libs/exception-filter/constants';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userProfileDaoService: UserProfileDaoService,
    private readonly languageDaoService: LanguageDaoService,
    private readonly roleDaoService: RoleDaoService,
  ) {}

  getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return this.userProfileDaoService
      .findByUserId({
        userId,
        withGraphFetched: true,
      })
      .then((profile) => ({
        name: profile.name,
        preferredLanguage: profile.preferredLanguage as unknown as Language,
        preferredLanguageId: profile.preferredLanguageId,
        role: profile.role as unknown as RoleObj,
        roleId: profile.roleId,
        username: profile.username,
      }));
  }

  getUserProfileByUsername(username: string): Promise<UserProfile | undefined> {
    return this.userProfileDaoService
      .findByUsername({
        username,
        withGraphFetched: true,
      })
      .then((profile) => ({
        name: profile.name,
        preferredLanguage: profile.preferredLanguage as unknown as Language,
        preferredLanguageId: profile.preferredLanguageId,
        role: profile.role as unknown as RoleObj,
        roleId: profile.roleId,
        username: profile.username,
      }));
  }

  private validateForeignKeys = async (
    userProfile: Partial<UserProfileModel>,
  ) => {
    // Validate all the fkeys before patching to add custom error messages
    const fkeyName = ['preferred language id', 'role id'];
    const fkeyValues = [userProfile.preferredLanguageId, userProfile.roleId];
    const daoServices = [this.languageDaoService, this.roleDaoService];
    await Promise.all(
      fkeyValues.map(async (fkeyValue, idx) => {
        if (fkeyValue && !(await daoServices[idx].findById(fkeyValue))) {
          throw new PeerprepException(
            `Invalid ${fkeyName[idx]}`,
            PEERPREP_EXCEPTION_TYPES.BAD_REQUEST,
          );
        }
      }),
    );
  };

  async updateUserProfile(
    data: Partial<UserProfileModel>,
  ): Promise<UserProfileModel> {
    const { userId } = data;
    const userProfile = { ...data };
    delete userProfile.userId;

    await this.validateForeignKeys(userProfile);
    const currentProfile = await this.getUserProfile(userId);
    if (
      currentProfile.roleId === Role.REGULAR &&
      userProfile.roleId === Role.MAINTAINER
    ) {
      throw new PeerprepException(
        `Unauthorized operation: cannot upgrade status to maintainer`,
        PEERPREP_EXCEPTION_TYPES.UNAUTHORIZED,
      );
    }
    return this.userProfileDaoService.updateByUserId(userId, userProfile);
  }
}
