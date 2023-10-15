import { BaseModel } from '@app/sql-database';

export class LookingToMatchModel extends BaseModel {
  static get idColumn() {
    return 'user_id';
  }
  static tableName = 'lookingToMatch';
  readonly userId: string;
  readonly questionDifficulty: string;
  readonly isConnected: boolean;
}
