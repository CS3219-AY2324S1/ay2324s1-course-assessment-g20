import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { PreferredLanguageModel } from '../../models/preferredLanguage.model';

@Injectable()
export class PreferredLanguageDaoService {
  constructor(
    @Inject('PreferredLanguageModel')
    private preferredLanguageModel: ModelClass<PreferredLanguageModel>,
  ) {}

  getAll() {
    return this.preferredLanguageModel.query().select(['id', 'name']);
  }

  findById(id: number) {
    return this.preferredLanguageModel.query().findById(id);
  }
}
