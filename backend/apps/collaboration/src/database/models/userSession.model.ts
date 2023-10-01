import { BaseModel } from '@app/sql-database';

export class UserSessionModel extends BaseModel {
  static tableName = 'userSessions';

  readonly sessionId: string;
  readonly userId: string;
}
