import { Injectable } from '@nestjs/common';
import { UserProfileDaoService } from '../database/daos/userProfiles/userProfile.dao.service';
import { UserProfileModel } from '../database/models/userProfile.model';
import { LanguageDaoService } from '../database/daos/languages/language.dao.service';
import { Language, UserProfile } from '@app/microservice/interfaces/user';
import { PEERPREP_EXCEPTION_TYPES } from '@app/types/exceptions';
import { PeerprepException } from '@app/utils/exceptionFilter/peerprep.exception';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userProfileDaoService: UserProfileDaoService,
    private readonly languageDaoService: LanguageDaoService,
  ) {}

  getUserProfileById(userId: string): Promise<UserProfile | undefined> {
    return this.userProfileDaoService
      .findByUserId({
        userId,
        withGraphFetched: true,
      })
      .then((profile) => ({
        name: profile.name,
        preferredLanguage: profile.preferredLanguage as unknown as Language,
        preferredLanguageId: profile.preferredLanguageId,
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
        username: profile.username,
      }));
  }

  private validateForeignKeys = async (
    userProfile: Partial<UserProfileModel>,
  ) => {
    // Validate all the fkeys before patching to add custom error messages
    const fkeyName = ['preferred language id', 'role id'];
    const fkeyValues = [userProfile.preferredLanguageId];
    const daoServices = [this.languageDaoService];
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
    return this.userProfileDaoService.updateByUserId(userId, userProfile);
  }
}
