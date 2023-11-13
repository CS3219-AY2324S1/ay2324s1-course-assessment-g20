import { BaseModelUUID } from '@app/sql-database';
import { Model } from 'objection';
import { UserSessionModel } from './userSession.model';
import { SessionTicketModel } from './sessionTicket.model';

export class SessionModel extends BaseModelUUID {
  static tableName = 'sessions';

  readonly questionId: string;
  readonly languageId: number;
  readonly isClosed: boolean;

  readonly userIds: { userId: string }[];
  readonly sessionTickets: { ticketId: string }[];

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
    sessionTickets: {
      relation: Model.HasManyRelation,
      modelClass: SessionTicketModel,
      filter: (query) => query.select('ticketId'),
      join: {
        from: 'sessions.id',
        to: 'sessionTickets.sessionId',
      },
    },
  });
}
