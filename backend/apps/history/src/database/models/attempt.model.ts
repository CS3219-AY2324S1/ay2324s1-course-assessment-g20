import { BaseModelUUID } from '@app/sql-database';

export class AttemptModel extends BaseModelUUID {
  static tableName = 'attempts';

  readonly historyId: string;
  readonly questionId: string;
  readonly questionAttempt: string;
  dateTimeAttempted: Date;

  $beforeInsert() {
    this.dateTimeAttempted = new Date();
  }
}
