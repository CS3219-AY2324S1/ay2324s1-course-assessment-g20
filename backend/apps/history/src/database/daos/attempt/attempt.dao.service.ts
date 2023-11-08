import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { AttemptModel } from '../../models/attempt.model';

@Injectable()
export class AttemptDaoService {
  constructor(
    @Inject('AttemptModel')
    private attemptModel: ModelClass<AttemptModel>,
  ) {}

  async createAttempt(attempt: {
    historyId: string;
    sessionId: string;
    questionId: string;
  }) {
    return await this.attemptModel
      .query()
      .insert({ ...attempt, dateTimeAttempted: new Date() });
  }

  async findByHistoryId(historyId: string) {
    return await this.attemptModel
      .query()
      .select('sessionId', 'questionId', 'dateTimeAttempted')
      .where('historyId', historyId)
      .orderBy('dateTimeAttempted', 'desc');
  }

  async existsByHistoryIdAndSessionId(historyId: string, sessionId: string) {
    const [countResult] = await this.attemptModel
      .query()
      .where('sessionId', sessionId)
      .where('historyId', historyId)
      .count();

    const count = Number(countResult['count']);

    return count > 0;
  }
}
