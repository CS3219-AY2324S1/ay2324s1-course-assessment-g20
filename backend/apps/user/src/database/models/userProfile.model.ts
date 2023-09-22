import { Model } from 'objection';
import { BaseModel } from '@app/sql-database';
import { PreferredLanguageModel } from './preferredLanguage.model';
import { RoleModel } from './role.model';

export class UserProfileModel extends BaseModel {
  static tableName = 'userProfiles';

  readonly userId: string;
  readonly name: string;
  readonly preferredLanguageId: number;
  readonly roleId: number;

  static relationMappings = () => ({
    preferredLanguage: {
      relation: Model.BelongsToOneRelation,
      modelClass: PreferredLanguageModel,
      filter: (query) => query.select('id', 'name'),
      join: {
        from: 'userProfiles.preferredLanguageId',
        to: 'preferredLanguages.id',
      },
    },
    role: {
      relation: Model.BelongsToOneRelation,
      modelClass: RoleModel,
      filter: (query) => query.select('id', 'name'),
      join: {
        from: 'userProfiles.roleId',
        to: 'roles.id',
      },
    },
  });
}
