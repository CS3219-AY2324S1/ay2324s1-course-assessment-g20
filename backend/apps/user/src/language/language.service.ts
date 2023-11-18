import { Injectable } from '@nestjs/common';
import { LanguageDaoService } from '../database/daos/languages/language.dao.service';

@Injectable()
export class LanguageService {
  constructor(private readonly languageDaoService: LanguageDaoService) {}

  async getAllLanguages() {
    return await this.languageDaoService.getAll();
  }

  async getLanguageById(id: number) {
    return await this.languageDaoService.findById(id);
  }
}
