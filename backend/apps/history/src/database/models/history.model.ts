import { BaseModelUUID } from '@app/sql-database';
import { Model } from 'objection';
import { AttemptModel } from './attempt.model';

export class HistoryModel extends BaseModelUUID {
  static tableName = 'history';

  readonly userId: string;
  readonly attempts: {
    attemptId: string;
    questionId: string;
    questionAttempt: string;
    dateTimeAttempted: Date;
  }[];

  static relationMappings = () => ({
    attempts: {
      relation: Model.HasManyRelation,
      modelClass: AttemptModel,
      filter: (query) => query.select('attemptId'),
      join: {
        from: 'history.id',
        to: 'attempts.historyId',
      },
    },
  });
}
