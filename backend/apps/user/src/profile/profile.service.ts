import { HttpException, Injectable } from '@nestjs/common';
import { UserProfileDaoService } from '../database/daos/userProfiles/userProfile.dao.service';
import { UserProfileModel } from '../database/models/userProfile.model';
import { LanguageDaoService } from '../database/daos/languages/language.dao.service';
import { RoleDaoService } from '../database/daos/roles/role.dao.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userProfileDaoService: UserProfileDaoService,
    private readonly languageDaoService: LanguageDaoService,
    private readonly roleDaoService: RoleDaoService,
  ) {}

  getUserProfile(
    userId: string,
  ): Promise<Partial<UserProfileModel> | undefined> {
    const result = this.userProfileDaoService.findByUserId({
      userId,
      withGraphFetched: true,
    });
    return result;
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
          throw new HttpException(`Invalid ${fkeyName[idx]}`, 400);
        }
      }),
    );
  };

  async updateUserProfile(
    userId: string,
    userProfile: Partial<UserProfileModel>,
  ): Promise<UserProfileModel> {
    await this.validateForeignKeys(userProfile);
    return this.userProfileDaoService.updateByUserId(userId, userProfile);
  }
}