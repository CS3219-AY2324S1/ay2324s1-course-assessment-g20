import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { HistoryModel } from '../../models/history.model';
@Injectable()
export class HistoryDaoService {
  constructor(
    @Inject('HistoryModel')
    private historyModel: ModelClass<HistoryModel>,
  ) {}

  async create(userId: string) {
    return await this.historyModel.query().insert({
      userId: userId,
    });
  }

  async findByUserId(userId: string) {
    return await this.historyModel.query().where('userId', userId).first();
  }
}
