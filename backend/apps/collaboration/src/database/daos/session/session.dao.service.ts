import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { SessionModel } from '../../models/session.model';
import { BaseModel } from '@app/sql-database';

@Injectable()
export class SessionDaoService {
  constructor(
    @Inject('SessionModel')
    private sessionModel: ModelClass<SessionModel>,
  ) {}

  create(createSessionInfo: Omit<SessionModel, keyof BaseModel>) {
    return this.sessionModel.query().insertGraph(createSessionInfo);
  }
}
