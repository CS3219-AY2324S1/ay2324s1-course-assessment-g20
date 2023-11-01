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
    questionId: string;
    questionAttempt: string;
  }) {
    return await this.attemptModel
      .query()
      .insert({ ...attempt, dateTimeAttempted: new Date() });
  }

  async findByHistoryId(historyId: string) {
    return await this.attemptModel
      .query()
      .select('questionId', 'questionAttempt', 'dateTimeAttempted')
      .where('historyId', historyId)
      .orderBy('dateTimeAttempted', 'desc');
  }
}
