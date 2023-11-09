import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { SessionModel } from '../../models/session.model';
import { BaseModel } from '@app/sql-database';
import { SessionTicketModel } from '../../models/sessionTicket.model';
import { SetSessionLanguageIdRequest } from '@app/microservice/interfaces/collaboration';
import { UserSessionModel } from '../../models/userSession.model';

@Injectable()
export class SessionDaoService {
  constructor(
    @Inject('SessionModel')
    private sessionModel: ModelClass<SessionModel>,
    @Inject('SessionTicketModel')
    private sessionTicketModel: ModelClass<SessionTicketModel>,
    @Inject('UserSessionModel')
    private userSessionModel: ModelClass<UserSessionModel>,
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

  setSessionLanguageId(request: SetSessionLanguageIdRequest) {
    return this.sessionModel.query().patchAndFetchById(request.sessionId, {
      languageId: request.languageId,
    });
  }

  insertTicketForSession(sessionId: string, ticketId: string) {
    return this.sessionTicketModel.query().insert({
      ticketId,
      sessionId,
    });
  }

  getSessionFromTicket(ticketId: string) {
    return this.sessionTicketModel
      .query()
      .select('sessionId')
      .where('ticketId', ticketId)
      .withGraphFetched('session')
      .first();
  }

  getQuestionIdFromSession(sessionId: string) {
    return this.sessionModel
      .query()
      .select('questionId')
      .where('id', sessionId)
      .first();
  }

  async getSessionsFromUserId(userId: string) {
    const userSessions = await this.userSessionModel
      .query()
      .where('userId', userId);
    const query = this.sessionModel
      .query()
      .findByIds(userSessions.map((userSession) => userSession.sessionId))
      .orderBy('updatedAt', 'desc');
    return query;
  }

  closeSession(sessionId: string) {
    return this.sessionModel
      .query()
      .patch({ isClosed: true })
      .where('id', sessionId);
  }
}
