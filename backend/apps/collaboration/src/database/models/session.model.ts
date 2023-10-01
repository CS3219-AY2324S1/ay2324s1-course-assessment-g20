import { BaseModel } from '@app/sql-database';
import { Model } from 'objection';
import { UserSessionModel } from './userSession.model';

export class SessionModel extends BaseModel {
  static tableName = 'sessions';

  readonly questionId: string;

  readonly userIds: { userId: string }[];

  static relationMappings = () => ({
    userIds: {
      relation: Model.HasManyRelation,
      modelClass: UserSessionModel,
      filter: (query) => query.select('userId'),
      join: {
        from: 'sessions.id',
        to: 'userSessions.sessionId',
      },
    },
  });
}
