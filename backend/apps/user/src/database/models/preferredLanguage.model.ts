import { BaseModel } from '@app/sql-database';

export class PreferredLanguageModel extends BaseModel {
  static tableName = 'preferredLanguages';

  readonly name: string;
}
