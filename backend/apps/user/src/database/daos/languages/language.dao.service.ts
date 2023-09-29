import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { LanguageModel } from '../../models/language.model';

@Injectable()
export class LanguageDaoService {
  constructor(
    @Inject('LanguageModel')
    private languageModel: ModelClass<LanguageModel>,
  ) {}

  getAll() {
    return this.languageModel.query().select(['id', 'name']);
  }

  findById(id: number) {
    return this.languageModel.query().findById(id);
  }
}
