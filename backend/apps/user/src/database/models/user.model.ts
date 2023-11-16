import { BaseModelUUID } from '@app/sql-database';
import { Model } from 'objection';
import { UserProfileModel } from './userProfile.model';

export class UserModel extends BaseModelUUID {
  static tableName = 'users';

  readonly userProfile: UserProfileModel;

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
