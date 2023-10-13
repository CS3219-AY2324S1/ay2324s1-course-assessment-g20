import { BaseModel } from '@app/sql-database';
import { AuthProvider } from '@app/types/authProvider';
import { Model } from 'objection';
import { UserProfileModel } from './userProfile.model';

export class UserModel extends BaseModel {
  static tableName = 'users';

  readonly authProvider: AuthProvider;
  readonly authProviderId: string;
  readonly oauthName: string;
  readonly email: string;
  readonly userProfile: Partial<UserProfileModel>;

  static relationMappings = () => ({
    userProfile: {
      relation: Model.HasOneRelation,
      modelClass: UserProfileModel,
      join: {
        from: 'users.id',
        to: 'userProfiles.userId',
      },
    },
  });
}
