import { BaseModelUUID } from '@app/sql-database';

export class AttemptModel extends BaseModelUUID {
  static tableName = 'attempts';

  readonly historyId: string;
  readonly questionId: string;
  readonly attempt: string;
  dateTimeAttemped: Date;

  $beforeInsert() {
    this.dateTimeAttemped = new Date();
  }
}
