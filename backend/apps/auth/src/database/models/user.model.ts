import { BaseModel } from '@app/sql-database';
import { AuthProvider } from '@app/types/authProvider';

export class UserModel extends BaseModel {
  static tableName = 'users';

  readonly authProvider: AuthProvider;
  readonly authProviderId: string;
  readonly oauthName: string;
  readonly email: string;

  // TODO: Need to ensure this relation via async messaging queue whenever there is create or update or delete
  // readonly userProfile: UserProfileModel;

  // static relationMappings = () => ({
  //   userProfile: {
  //     relation: Model.HasOneRelation,
  //     modelClass: UserProfileModel,
  //     join: {
  //       from: 'users.id',
  //       to: 'userProfiles.userId',
  //     },
  //   },
  // });
}
