import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { SessionModel } from '../../models/session.model';
import { BaseModel } from '@app/sql-database';
import { SessionTicketModel } from '../../models/sessionTicket.model';

@Injectable()
export class SessionDaoService {
  constructor(
    @Inject('SessionModel')
    private sessionModel: ModelClass<SessionModel>,
    @Inject('SessionTicketModel')
    private sessionTicketModel: ModelClass<SessionTicketModel>,
  ) {}

  create(
    createSessionInfo: Omit<SessionModel, keyof BaseModel | 'sessionTickets'>,
  ) {
    return this.sessionModel.query().insertGraph(createSessionInfo);
  }

  findById({
    sessionId,
    withGraphFetched = false,
  }: {
    sessionId: string;
    withGraphFetched: boolean;
  }) {
    const query = this.sessionModel.query().findById(sessionId);
    if (withGraphFetched) {
      query.withGraphFetched('[userIds]');
    }
    return query;
  }

  insertTicketForSession(sessionId: string, ticketId: string) {
    return this.sessionTicketModel.query().insert({
      ticketId,
      sessionId,
    });
  }

  getSessionIdFromTicket(ticketId: string) {
    return this.sessionTicketModel
      .query()
      .select('sessionId')
      .where('ticketId', ticketId)
      .first();
  }
}
