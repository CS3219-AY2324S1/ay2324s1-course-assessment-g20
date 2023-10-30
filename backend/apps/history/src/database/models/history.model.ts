import { BaseModelUUID } from '@app/sql-database';
import { Model } from 'objection';
import { AttemptModel } from './attempt.model';

export class HistoryModel extends BaseModelUUID {
  static tableName = 'history';

  readonly userId: string;
  readonly attemptIds: { attemptId: string }[];

  static relationMappings = () => ({
    attemptIds: {
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
