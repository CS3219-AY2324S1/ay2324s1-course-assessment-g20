import { BaseModel } from '@app/sql-database';
import { SessionModel } from './session.model';
import { Model } from 'objection';

export class SessionTicketModel extends BaseModel {
  static tableName = 'sessionTickets';

  readonly sessionId: string;
  readonly ticketId: string;

  readonly session: SessionModel;

  static relationMappings = () => ({
    session: {
      relation: Model.BelongsToOneRelation,
      modelClass: SessionModel,
      join: {
        from: 'sessionTickets.sessionId',
        to: 'sessions.id',
      },
    },
  });
}
