import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { HistoryModel } from '../../models/history.model';
import { AttemptModel } from '../../models/attempt.model';

@Injectable()
export class HistoryDaoService {
  constructor(
    @Inject('HistoryModel')
    private historyModel: ModelClass<HistoryModel>,
    @Inject('AttemptModel')
    private attemptModel: ModelClass<AttemptModel>,
  ) {}

  create(userId: string) {
    const test = this.historyModel.query().where('userId', userId).first();
    console.log('test', test);
    return null;
  }

  //   findById({
  //     sessionId,
  //     withGraphFetched = false,
  //   }: {
  //     sessionId: string;
  //     withGraphFetched: boolean;
  //   }) {
  //     const query = this.sessionModel.query().findById(sessionId);
  //     if (withGraphFetched) {
  //       query.withGraphFetched('[userIds]');
  //     }
  //     return query;
  //   }

  //   insertTicketForSession(sessionId: string, ticketId: string) {
  //     return this.sessionTicketModel.query().insert({
  //       ticketId,
  //       sessionId,
  //     });
  //   }

  //   getSessionIdFromTicket(ticketId: string) {
  //     return this.sessionTicketModel
  //       .query()
  //       .select('sessionId')
  //       .where('ticketId', ticketId)
  //       .first();
  //   }

  //   getQuestionIdFromSession(sessionId: string) {
  //     return this.sessionModel
  //       .query()
  //       .select('questionId')
  //       .where('id', sessionId)
  //       .first();
  //   }
}
