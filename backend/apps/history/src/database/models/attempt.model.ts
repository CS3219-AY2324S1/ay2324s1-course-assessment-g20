import { BaseModelUUID } from '@app/sql-database';

export class AttemptModel extends BaseModelUUID {
  static tableName = 'attempts';

  readonly historyId: string;
  readonly sessionId: string;
  readonly questionId: string;
  dateTimeAttempted: Date;

  $beforeInsert() {
    this.dateTimeAttempted = new Date();
  }
}
