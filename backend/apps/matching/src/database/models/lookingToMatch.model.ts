import { BaseModel } from '@app/sql-database';

export class LookingToMatchModel extends BaseModel {
  static get idColumn() {
    return 'user_id';
  }
  static tableName = 'lookingToMatch';
  readonly userId: number;
  readonly questionDifficulty: number;
  readonly isConnected: boolean;
}
