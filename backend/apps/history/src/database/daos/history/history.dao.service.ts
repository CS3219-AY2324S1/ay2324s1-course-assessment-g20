import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { HistoryModel } from '../../models/history.model';
@Injectable()
export class HistoryDaoService {
  constructor(
    @Inject('HistoryModel')
    private historyModel: ModelClass<HistoryModel>,
  ) {}

  async create(username: string) {
    return await this.historyModel.query().insert({
      username: username,
    });
  }

  async findByUsername(username: string) {
    return await this.historyModel.query().where('username', username).first();
  }
}
