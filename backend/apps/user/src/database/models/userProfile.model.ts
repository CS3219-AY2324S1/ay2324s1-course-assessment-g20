import { Model } from 'objection';
import { BaseModel } from '@app/sql-database';
import { LanguageModel } from './language.model';

export class UserProfileModel extends BaseModel {
  static tableName = 'userProfiles';

  readonly userId: string;
  readonly username: string;
  readonly name: string;
  readonly preferredLanguageId: number;

  readonly preferredLanguage: Omit<LanguageModel, keyof Omit<BaseModel, 'id'>>;

  static relationMappings = () => ({
    preferredLanguage: {
      relation: Model.BelongsToOneRelation,
      modelClass: LanguageModel,
      filter: (query) => query.select('id', 'name'),
      join: {
        from: 'userProfiles.preferredLanguageId',
        to: 'languages.id',
      },
    },
  });
}
