import { BaseModel } from '@app/sql-database';

export class LanguageModel extends BaseModel {
  static tableName = 'languages';

  readonly name: string;
}
